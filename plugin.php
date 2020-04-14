<?php
/**
 * Plugin Name: GutenbergExtra
 * Plugin URI:
 * Description: joshua main.
 * Author: Gutenberg Den
 * Author URI:
 * Version: 1.0.9
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 */

// Exit if accessed directly.
if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * Block Initializer.
 */
require_once plugin_dir_path( __FILE__ ) . 'src/init.php';


//======================================================================
// AUTOUPDATE
//======================================================================

// require plugin_dir_path( __FILE__ ) .'gx-plugin-update-checker/plugin-update-checker.php';
// $gxUpdateChecker = Puc_v4_Factory::buildUpdateChecker('https://s3-eu-west-1.amazonaws.com/gutenberg-extra/gutenberg-extra-free/gutenberg-extra-update/gutenberg-extra-plugin-update.json', __FILE__, 'gutenberg-extra');


//======================================================================
// CUSTOMIZER
//======================================================================

require_once plugin_dir_path( __FILE__ ) . 'customizer/customizer.php';


//======================================================================
// SETUP PAGE CONTENT DEPENDING ON CUSTOMIZER
//======================================================================

require_once plugin_dir_path(__FILE__ ) . 'page-content-setting/dynamic_content.php';