<?php

/**
 * Plugin Name: Maxi Blocks - Last Github version
 * Plugin URI:
 * Description: MaxiBlocks — Last update: some moment of 2022 lol
 * Author: Gutenberg Den
 * Author URI:
 * Version: 0.1
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

define('MAXI_PLUGIN_DIR_PATH', plugin_dir_path(__FILE__));
define('MAXI_PLUGIN_DIR_FILE', __FILE__);

//======================================================================
// MaxiBlocks Core
//======================================================================
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-core.php';
if (class_exists('MaxiBlocks_Core')) {
    MaxiBlocks_Core::register();
}

//======================================================================
// MaxiBlocks DB
//======================================================================
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-db.php';
if (class_exists('MaxiBlocks_DB')) {
    MaxiBlocks_DB::register();
}

//======================================================================
// MaxiBlocks Blocks
//======================================================================
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-blocks.php';
if (class_exists('MaxiBlocks_Blocks')) {
    MaxiBlocks_Blocks::register();
}

//======================================================================
// MaxiBlocks Styles
//======================================================================
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-styles.php';
if (class_exists('MaxiBlocks_Styles')) {
    MaxiBlocks_Styles::register();
}

//======================================================================
// MaxiBlocks Style Cards
//======================================================================
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-style-cards.php';
if (class_exists('MaxiBlocks_StyleCards')) {
    MaxiBlocks_StyleCards::register();
}

//======================================================================
// MaxiBlocks Image Crop
//======================================================================
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-image-crop.php';
if (class_exists('MaxiBlocks_ImageCrop')) {
    MaxiBlocks_ImageCrop::register();
}

//======================================================================
// MaxiBlocks API
//======================================================================
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-api.php';
if (class_exists('MaxiBlocks_API')) {
    MaxiBlocks_API::register();
}

//======================================================================
// MaxiBlocks Page Template
//======================================================================
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-page-template.php';
if (class_exists('MaxiBlocks_PageTemplate')) {
    add_action('plugins_loaded', array( 'MaxiBlocks_PageTemplate', 'register' ));
}

//======================================================================
// MaxiBlocks Image Upload
//======================================================================
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-image-upload.php';
if (class_exists('MaxiBlocks_ImageUpload')) {
    MaxiBlocks_ImageUpload::register();
}


/**
 * TODO: Old init.php file. Please, delete these lines of comment and require onces this file has been removed
 */
require_once plugin_dir_path(__FILE__) . 'src/init.php';
/**
 * TODO: After creating dashboard plugin we should remove this file
 */
require_once MAXI_PLUGIN_DIR_PATH . 'src/options.php';


//======================================================================
// MaxiBlocks clean on deactivation
//======================================================================

//register_deactivation_hook(__FILE__, 'maxi_blocks_deactivate');

function maxi_blocks_deactivate()
{
    global $wpdb;
    $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}maxi_blocks_general");
    $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}maxi_blocks_custom_data");
    $wpdb->query("DROP TABLE IF EXISTS {$wpdb->prefix}maxi_blocks_styles");
}