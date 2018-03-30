<?php
/**
 * Created by PhpStorm.
 * User: smn
 * Date: 10.03.18
 * Time: 16:15
 */

define( 'TOKEN_STRING','Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6InRoaXMtXCJzZWNyZXRcIi12YWx1ZS1zaG91bGQtYmUtcmVtb3ZlZCJ9.eyJpc3MiOiJ2cm1hcGkudmljdHJvbmVuZXJneS5jb20iLCJhdWQiOiJodHRwczpcL1wvdnJtYXBpLnZpY3Ryb25lbmVyZ3kuY29tXC8iLCJqdGkiOiJ0aGlzLVwic2VjcmV0XCItdmFsdWUtc2hvdWxkLWJlLXJlbW92ZWQiLCJpYXQiOjE1MjIwMTQzNDYsImV4cCI6MTUyMjEwMDc0NiwidWlkIjoiMjIiLCJ0b2tlbl90eXBlIjoiZGVmYXVsdCJ9.SQ6Zxhi4muqhVmtlcCbXX0XA0-QvmAi03K_LpYwGC918PRHwiHhsoAxflVUcMgE2axYF-djLsfx7uvAf7d9KaPoV0KmvrWWvHrd33Ux1HXiYT9X1mIPicMCHRxqCYCRyS69dg1k9f59zCoXi-0pslobZAQRGbnK70W7xe3ZDtWa1-uI82Av2oZ6Lz3P05LuDuJf89ZhjuFmcM3Yj3rHheDOQcRiS4JrE8Zt8kpLSRrMo0lZrFj6kffjO5mjuM73_SIH1di3-30e4Im9APnY9x5Tbayxp7oq643ndA62uJDsqWBQgO-A4c6MwhMkjmx-UzHxOG3VSHUrUz8IXPu1Mjw');

function vrm_viewer_diagram_func($atts = [], $content = null, $tag = ''){

    // normalize attribute keys, lowercase
    $atts = array_change_key_case((array)$atts, CASE_LOWER);

    // override default attributes with user attributes
    $shortcode_atts = shortcode_atts([
        'id' => '0',
        'start' => time() - (24 * 60 * 60),
        'end'   => time(),
        'interval' => 'hours',
        'type'  => 'live_feed'
    ], $atts, $tag);


    if(in_array($shortcode_atts['id'], json_decode(get_option('vrm_installation_ids')))){

        echo "<div 
        class='vrm-viewer'
        id='vrm-viewer-".$shortcode_atts['id']."' 
        data-id='".$shortcode_atts['id']."' 
        data-start='".$shortcode_atts['start']."'
        data-end='".$shortcode_atts['end']."'
        data-interval='".$shortcode_atts['interval']."'
        data-charttype='".$shortcode_atts['type']."'
        ></div>";

    }else{
        print_r('no existing installation with given id');
    }
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

    return json_decode($response['body']); // token and userId
}


/**
 * @return mixed body with array if victron installations objects
 *
 */
function vrm_get_installations(){
    $tokenAndUid = vrm_authenticate();
    $token = array('X-Authorization' => 'Bearer '.$tokenAndUid->token);
    $uid = (string) $tokenAndUid->idUser;

    //test -------------------------------------------------------------------------------------------
    //$uid = (string)22;
    //$token = array('X-Authorization' => TOKEN_STRING);
    //test end ---------------------------------------------------------------------------------------

    $url = esc_url_raw('https://vrmapi.victronenergy.com/v2/users/'. $uid .'/installations');
    $args = array( 'method' => 'POST', 'headers' => $token);

    $request = new WP_Http_Curl();
    $response = $request->request($url, $args);

    $records = json_decode($response['body'])->records;

    return $records;
}

function vrm_viewer_is_auth_valid(){
    $response = vrm_authenticate();

    if(property_exists($response, 'token') && property_exists($response, 'idUser')){
        return '<div style="color:green">Authentication Successful</div>';
    }else if(get_option('vrm_password') == '' || get_option('vrm_password') == '' ){
        return '<div>Missing username and password</div>';
    }
    else{
        return '<div style="color:red">Authentication Failed</div>';
    };
}


/**
 * gets data for corresponding installation
 * @param string $installation_id
 * @param string $start - timeframe start
 * @param string $end - timeframe end
 * @param string $interval - interval size (hours, minutes)
 * @param string $type - see victron vrm v2 documentation
 * @return mixed
 */
function get_vrm_installation_data ($installation_id, $start=null, $end=null, $interval='hours', $type='live_feed') {

    $base_url = 'https://vrmapi.victronenergy.com/v2/installations/';
    $endpoint = '/stats?';
    $get_parameters = array(
        'start' => $start,
        'end'   => $end,
        'interval' => $interval,
        'type'  => $type
    );
    $query = http_build_query($get_parameters);


    $url = $base_url . $installation_id . $endpoint . $query;
    $tokenAndUid = vrm_authenticate();
    $token = array('X-Authorization' => 'Bearer '.$tokenAndUid->token);

    //test ------------------------------------------------------------------------------------
    //$token = array('X-Authorization' => TOKEN_STRING);
    //$url = 'https://vrmapi.victronenergy.com/v2/installations/1039/stats?end='.$end.
    //    '&interval='.$interval.
    //    '&start='.$start.
    //    '&type='.$type;
    //

    $args = array( 'method' => 'POST', 'headers' => $token);
    $request = new WP_Http_Curl();
    $response = $request->request($url, $args);


    return json_decode($response['body'], true);
}