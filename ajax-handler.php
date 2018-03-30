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

    //todo: validations
    $id = $_REQUEST['id'];
    $start = $_REQUEST['start'];
    $end = $_REQUEST['end'];
    $type = $_REQUEST['type'];
    $interval = $_REQUEST['interval'];

    $data = get_vrm_installation_data($id, $start, $end ,$interval , $type);

    wp_send_json($data);

    die();
}
