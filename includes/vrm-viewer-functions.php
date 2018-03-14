<?php
/**
 * Created by PhpStorm.
 * User: smn
 * Date: 10.03.18
 * Time: 16:15
 */

function vrm_viewer_diagram_func(){

    print_r(vrm_authenticate());
}

/**
 * Authenticates with username and password
 *
 * @return stdClass Object with token and userId
 */
function vrm_authenticate(){
    $url = esc_url_raw( 'https://vrmapi.victronenergy.com/v2/auth/login');

    $args_body = array('username' => get_option('vrm_username'), 'password' => get_option('vrm_password'), 'sms_token' => null, 'remember_me' => false);
    $args = array( 'method' => 'POST', 'body' => json_encode($args_body));

    $request = new WP_Http_Curl();
    $response = $request->request($url, $args);

    return json_decode($response['body']);
}

function get_installations(){
    $url = esc_url_raw('https://vrmapi.victronenergy.com/v2/users');
    //header : X-Authorization: Bearer {token}
}

function vrm_viewer_is_auth_valid(){
    $response = vrm_authenticate();

    if(property_exists($response, 'token')  && property_exists($response, 'idUser')){
        return '<div style="color:green">Authentication Successful</div>';
    }else{
        return '<div style="color:red">Authentication Failed</div>';
    };
}