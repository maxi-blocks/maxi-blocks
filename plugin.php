<?php
/**
 * Plugin Name: Gutenberg Extra
 * Plugin URI:
 * Description: gutenberg-extra — is a Gutenberg plugin created via create-guten-block.
 * Author: Gutenberg Den
 * Author URI:
 * Version: 1.0.0
 * Text Domain: gutenberg-extra
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 *
 * @package CGB
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

require plugin_dir_path( __FILE__ ) .'gx-plugin-update-checker/plugin-update-checker.php';
$gxUpdateChecker = Puc_v4_Factory::buildUpdateChecker('https://s3-eu-west-1.amazonaws.com/gx/gxfree/gx-update/gx-plugin-update.json', __FILE__, 'gxfree');


//======================================================================
// CUSTOMIZER
//======================================================================

require_once plugin_dir_path( __FILE__ ) . 'customizer/customizer.php';


//======================================================================
// SETUP PAGE CONTENT DEPENDING ON CUSTOMIZER
//======================================================================

require_once plugin_dir_path(__FILE__ ) . 'page-content-setting/dynamic_content.php';