<?php
/**
 * Created by PhpStorm.
 * User: smn
 * Date: 10.03.18
 * Time: 16:15
 */

define( 'TOKEN_STRING','Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6InRoaXMtXCJzZWNyZXRcIi12YWx1ZS1zaG91bGQtYmUtcmVtb3ZlZCJ9.eyJpc3MiOiJ2cm1hcGkudmljdHJvbmVuZXJneS5jb20iLCJhdWQiOiJodHRwczpcL1wvdnJtYXBpLnZpY3Ryb25lbmVyZ3kuY29tXC8iLCJqdGkiOiJ0aGlzLVwic2VjcmV0XCItdmFsdWUtc2hvdWxkLWJlLXJlbW92ZWQiLCJpYXQiOjE1MjE4OTAwMzUsImV4cCI6MTUyMTk3NjQzNSwidWlkIjoiMjIiLCJ0b2tlbl90eXBlIjoiZGVmYXVsdCJ9.WwpB2ky57-_WhMr7aXRiBsS5qcQYVG-HHyddzxtf-iz5h90-ciL-zNL1MvjcSKhqf1bMETc9FpE5d5UEMRpMlJowCpdXylhPB4MGw2o7_0CmFsO6bJWUNSbU4g5migtRHkLi7dZm97TS-rG381cPDsoYLzSIs2D2hyY2QPksw4Wfcuv7_DdxeAm2RJChaPqWhTkTJcJ-uJLqGcIianKKBmQjdHyx769IlJ0lHYSL_fL0GWLsGsG9wLIdVWIJyiAio9lVFeWgWrAWkRsDomJ4qir0UzEelJoBMOVLdqv1f860GiW7TmS9t7SM-WuEefY8i8slM0l745YPfSsya1IRaQ');

function vrm_viewer_diagram_func($atts = [], $content = null, $tag = ''){
    /* TESTING ONLY DELEEEEEETE MEEEEEE!!!!!!!!!!!!!!
    $installation_records = vrm_get_installations();
    $installation_ids = array();
    foreach($installation_records as $r)
        array_push($installation_ids, $r->idSite);

    print_r(get_option('vrm_installation_ids'));
*/


    // normalize attribute keys, lowercase
    $atts = array_change_key_case((array)$atts, CASE_LOWER);

    // override default attributes with user attributes
    $shortcode_atts = shortcode_atts([
        'id' => '0',
    ], $atts, $tag);
/* TESTING ONLY DELEEEEEETE MEEEEEE!!!!!!!!!!!!!!
    $vrm_installation_ids = str_split(get_option('vrm_installation_ids'));

    if(in_array($shortcode_atts['id'], $vrm_installation_ids)){
        print_r($shortcode_atts['id']);
    }else{
        print_r('no existing installation with given id');
    }
*/

    //echo '<pre>',print_r(get_vrm_installation_data(1039)),'</pre>';

    echo "<div id='vrm-viewer' data-id='".$shortcode_atts['id']."'></div>";

    //todo: irgendein container für den graphen mit data field=installationId

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
    $token = $tokenAndUid->token;
    $uid = $tokenAndUid->idUser;

    //test -------------------------------------------------------------------------------------------
    $uid = (string)22;
    $token = array('X-Authorization' => TOKEN_STRING);
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

    $base_url = 'https://vrmapi.victronenergy.com/v2/installations';
    $endpoint = '/stats?';
    $get_parameters = array(
        'start' => strtotime($start),
        'end'   => strtotime($end),
        'interval' => $interval,
        'type'  => $type
    );
    $query = http_build_query($get_parameters);


    $url = $base_url . $installation_id . $endpoint . $query;
    $tokenAndUid = vrm_authenticate();
    $token = $tokenAndUid->token;

    //test ------------------------------------------------------------------------------------
    $token = array('X-Authorization' => TOKEN_STRING);
    $url = 'https://vrmapi.victronenergy.com/v2/installations/1039/stats?end=1521900000&interval=hours&start=1521813600&type=live_feed';

    //test end --------------------------------------------------------------------------------

    $args = array( 'method' => 'POST', 'headers' => $token);
    $request = new WP_Http_Curl();
    $response = $request->request($url, $args);


    return json_decode($response['body'], true);
}