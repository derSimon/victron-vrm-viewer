<?php
/**
 * @package Victron_VRM
 * @version 0.1
 */
/*
Plugin Name: Victron VRM
Plugin URI: https://wordpress.org/plugins/victron-vrm-plugin/
Description:
Author: Simon Kraemer
Version: 0.1
Author URI: http://simonkraemer.de/
Text Domain:
*/
define( 'VRM_VIEWER_PLUGIN', __FILE__ );
define( 'VRM_VIEWER_PLUGIN_DIR', untrailingslashit(dirname(VRM_VIEWER_PLUGIN)));


require_once VRM_VIEWER_PLUGIN_DIR . '/settings.php';
require_once VRM_VIEWER_PLUGIN_DIR . '/ajax-handler.php';

add_action( 'wp_enqueue_scripts', 'vrm_adding_scripts');

function vrm_adding_scripts() {
    wp_register_script('HighCharts', 'https://code.highcharts.com/highcharts.src.js', null, null, true);
    wp_enqueue_script('HighCharts');

    wp_register_script('HighChartsMore', 'https://code.highcharts.com/highcharts-more.js', array('HighCharts'), null, true);
    wp_enqueue_script('HighChartsMore');

    wp_enqueue_script('jquery');

    wp_register_script('VictronViewerValues', plugins_url('includes/js/locale.js', __FILE__), array('jquery'));
    wp_enqueue_script('VictronViewerValues');

    wp_register_script('VictronViewer', plugins_url('includes/js/victron-viewer.js', __FILE__), array('jquery'));
    wp_enqueue_script('VictronViewer');
    //wp_localize_script('VictronViewer', 'victron_viewer', array('ajaxurl'=> admin_url('admin-ajax.php')));
}