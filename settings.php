<?php
/**
 * Created by PhpStorm.
 * User: smn
 * Date: 10.03.18
 * Time: 13:37
 */

require_once VRM_VIEWER_PLUGIN_DIR . '/includes/vrm-viewer-functions.php';


add_action('admin_init', 'add_section_settings');


add_action("admin_menu", "add_new_menu_items");
function add_new_menu_items()
{

    add_menu_page(
        "VRM Viewer",
        "VRM Viewer",
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

        <?php
            $active_tab = active_tab();
        ?>

        <h2 class="nav-tab-wrapper">
            <!-- when tab buttons are clicked we jump back to the same page but with a new parameter that represents the clicked tab. accordingly we make it active -->
            <a href="?page=vrm-options&tab=vrm-login-options" class="nav-tab
            <?php
                if($active_tab == 'vrm-login-options'){
                    echo 'nav-tab-active';
                } ?> "><?php _e('Authentication', 'sandbox'); ?></a>

            <a href="?page=vrm-options&tab=vrm-installation-options" class="nav-tab
            <?php
                if($active_tab == 'vrm-installation-options'){
                    echo 'nav-tab-active';
                } ?>"><?php _e('Installations', 'sandbox'); ?></a>
        </h2>

        <?php
            if($active_tab == 'vrm-login-options') {
                display_vrm_login_settings();
            }else{
                display_vrm_installations_settings();
            }
        ?>

    </div>
    <?php
}




function add_section_settings()
{

    //here we display the sections and options in the settings page based on the active tab
    if(isset($_GET["tab"]))
    {
        if($_GET["tab"] == "vrm-login-options")
        {
            add_vrm_login_settings();
        }
        else
        {
            add_vrm_installations_settings();
        }
    }
    else
    {
        echo 'tab is unknown';
    }

}

function add_vrm_login_settings(){
    //add_settings_section( $id, $title, $callback, $page )
    add_settings_section("header_section", "Header Options", "display_header_options_content", "vrm-options");

    //add_settings_field($id, $title, $callback, $page, $section, $args)
    add_settings_field("vrm_username", "Username", "display_usr_form_element", "vrm-options", "header_section");
    add_settings_field("vrm_password", "Password", "display_pw_form_element", "vrm-options", "header_section");

    //register_setting( string $option_group, string $option_name, array $args
    register_setting("header_section", "vrm_username");
    register_setting("header_section", "vrm_password");


}

function add_vrm_installations_settings(){

}

function display_vrm_login_settings(){
    ?>
    <form method="post" action="options.php">
            <?php

            //add_settings_section callback is displayed here. For every new section we need to call settings_fields.
            settings_fields("header_section");

            do_settings_sections("vrm-options");
            echo vrm_viewer_is_auth_valid();

            submit_button();

            ?>
    </form>
    <?php
}

function display_vrm_installations_settings(){
    ?>
    <table class="wp-list-table widefat fixed posts">
        <thead>
        <tr>
            <th><?php _e('Column Name 1', 'pippinw'); ?></th>
            <th><?php _e('Column Name 2', 'pippinw'); ?></th>
            <th><?php _e('Column Name 3', 'pippinw'); ?></th>
            <th><?php _e('Column Name 4', 'pippinw'); ?></th>
        </tr>
        </thead>
        <tbody>
        <tr>
            <td><?php _e('Column Data', 'pippinw'); ?></td>
            <td><?php _e('Column Data', 'pippinw'); ?></td>
            <td><?php _e('Column Data', 'pippinw'); ?></td>
            <td><?php _e('Column Data', 'pippinw'); ?></td>
        </tr>
        <tr>
            <td><?php _e('Column Data', 'pippinw'); ?></td>
            <td><?php _e('Column Data', 'pippinw'); ?></td>
            <td><?php _e('Column Data', 'pippinw'); ?></td>
            <td><?php _e('Column Data', 'pippinw'); ?></td>
        </tr>
        <tr>
            <td><?php _e('Column Data', 'pippinw'); ?></td>
            <td><?php _e('Column Data', 'pippinw'); ?></td>
            <td><?php _e('Column Data', 'pippinw'); ?></td>
            <td><?php _e('Column Data', 'pippinw'); ?></td>
        </tr>
        </tbody>
    </table>
    <?php
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


function active_tab(){
    //we check if the page is visited by click on the tabs or on the menu button.
    //then we get the active tab.
    $active_tab = "vrm-login-options";
    if(isset($_GET["tab"]))
    {
        if($_GET["tab"] == "vrm-login-options")
        {
            $active_tab = "vrm-login-options";
        }
        else
        {
            $active_tab = "vrm-installation-options";
        }
    }
    return $active_tab;
}


add_action('plugins_loaded', 'on_plugins_loaded');

function on_plugins_loaded()
{
    //shortcodes
    add_shortcode('vrm-viewer', 'vrm_viewer_diagram_func');
}

