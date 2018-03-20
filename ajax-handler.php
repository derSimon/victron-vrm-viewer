<?php
/**
 * Created by PhpStorm.
 * User: root
 * Date: 16.03.18
 * Time: 16:49
 */

require_once VRM_VIEWER_PLUGIN_DIR . '/includes/vrm-viewer-functions.php';

add_action('wp_ajax_nopriv_vrm_ajax', 'vrm_ajax');
add_action('wp_ajax_vrm_ajax', 'vrm_ajax');

function vrm_ajax(){

   // $parameter = htmlspecialchars($_POST["name"]) ;

    $id = $_REQUEST['id'];
    $data = get_vrm_installation_data($id);

    wp_send_json($data);

    die();
}
