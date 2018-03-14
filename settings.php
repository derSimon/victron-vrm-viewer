<?php
/**
 * Created by PhpStorm.
 * User: smn
 * Date: 10.03.18
 * Time: 13:37
 */

require_once VRM_VIEWER_PLUGIN_DIR . '/includes/vrm-viewer-functions.php';



add_action('admin_init', 'display_options');

function add_new_menu_items()
{

    add_menu_page(
        "VRM Options",
        "VRM Options",
        "manage_options",
        "vrm-options",
        "vrm_options_page",
        "",
        100
    );

}



function vrm_options_page()
{
    ?>
    <div class="wrap">
        <div id="icon-options-general" class="icon32"></div>
        <h1>VRM Viewer Options</h1>
        <p>Use Shortcode [vrm-viewer] to paste graph</p>
        <form method="post" action="options.php">
            <?php

            //add_settings_section callback is displayed here. For every new section we need to call settings_fields.
            settings_fields("header_section");
            do_settings_sections("vrm-options");
            echo vrm_viewer_is_auth_valid();
            submit_button();

            ?>
        </form>
    </div>
    <?php
}


add_action("admin_menu", "add_new_menu_items");

function display_options()
{
    //add_settings_section( $id, $title, $callback, $page )
    add_settings_section("header_section", "Header Options", "display_header_options_content", "vrm-options");

    //add_settings_field($id, $title, $callback, $page, $section, $args)
    add_settings_field("vrm_username", "Username", "display_usr_form_element", "vrm-options", "header_section");
    add_settings_field("vrm_password", "Password", "display_pw_form_element", "vrm-options", "header_section");

    //register_setting( string $option_group, string $option_name, array $args
    register_setting("header_section", "vrm_username");
    register_setting("header_section", "vrm_password");
}



function display_header_options_content(){
    echo "Authentication for Victron VRM Portal";
}


function display_usr_form_element()
{
    //id and name of form = setting name.
    ?>
    <input type="text" name="vrm_username" id="vrm_username" value="<?php echo get_option('vrm_username'); ?>" />
    <?php
}
function display_pw_form_element()
{
    //id and name of form = setting name.
    ?>
    <input type="password" name="vrm_password" id="vrm_password" value="<?php echo get_option('vrm_password'); ?>" />
    <?php
}


add_action('plugins_loaded', 'on_plugins_loaded');

function on_plugins_loaded(){

    //shortcodes
    add_shortcode('vrm-viewer', 'vrm_viewer_diagram_func');

}

