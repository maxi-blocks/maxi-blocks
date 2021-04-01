<?php

/**
 * Plugin Name: Maxi Blocks - Last Github version
 * Plugin URI:
 * Description: MaxiBlocks — Last update: 20/01/21
 * Author: Gutenberg Den
 * Author URI:
 * Version: 0.1
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit;
}

function create_block_test_maxi_blocks_block_init() {
	$dir = dirname(__FILE__);

	$script_asset_path = "$dir/build/index.asset.php";
	if (!file_exists($script_asset_path)) {
		throw new Error(
			'You need to run `npm start` or `npm run build` for the "create-block/test-maxi-blocks" block first.'
		);
	}
	$index_js     = 'build/index.js';
	$script_asset = require($script_asset_path);
	wp_register_script(
		'create-block-test-maxi-blocks-block-editor',
		plugins_url($index_js, __FILE__),
		$script_asset['dependencies'],
		$script_asset['version']
	);

	$editor_css = 'build/index.css';
	wp_register_style(
		'create-block-test-maxi-blocks-block-editor',
		plugins_url($editor_css, __FILE__),
		array(),
		filemtime("$dir/$editor_css")
	);

	$style_css = 'build/style-index.css';
	wp_register_style(
		'create-block-test-maxi-blocks-block',
		plugins_url($style_css, __FILE__),
		array(),
		filemtime("$dir/$style_css")
	);

	register_block_type('create-block/test-maxi-blocks', array(
		'editor_script' => 'create-block-test-maxi-blocks-block-editor',
		'editor_style'  => 'create-block-test-maxi-blocks-block-editor',
		'style'         => 'create-block-test-maxi-blocks-block',
	));
}
add_action('init', 'create_block_test_maxi_blocks_block_init');

function maxi_blocks_add_db_table() {
	global $wpdb;
	$db_table_name = $wpdb->prefix . 'maxi_blocks_general';  // table name
	$charset_collate = $wpdb->get_charset_collate();

	//Check to see if the table exists already, if not, then create it
	if ($wpdb->get_var("show tables like '$db_table_name'") != $db_table_name) {
		$sql = "CREATE TABLE $db_table_name (
                id varchar(128) NOT NULL,
                object longtext NOT NULL,
                UNIQUE (id)
        ) $charset_collate;";

		require_once(ABSPATH . 'wp-admin/includes/upgrade.php');
		dbDelta($sql);
	}
}


register_activation_hook(__FILE__, 'maxi_blocks_add_db_table');

/**
 * Block Initializer.
 */
require_once plugin_dir_path(__FILE__) . 'src/init.php';


//======================================================================
// SETUP PAGE CONTENT DEPENDING ON CUSTOMIZER
//======================================================================

require_once plugin_dir_path(__FILE__) . 'page-content-setting/dynamic_content.php';

//======================================================================
// STYLING API
//======================================================================
require_once plugin_dir_path(__FILE__) . 'API/class-maxi-blocks-api.php';
