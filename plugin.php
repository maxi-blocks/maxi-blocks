<?php

/**
 * Plugin Name: Maxi Blocks
 * Plugin URI: https://maxiblocks.com/
 * Description: A powerful page builder for WordPress Gutenberg with a vast library of free web templates, icons & patterns. Open source and free to build. Anything you create with Maxi Blocks is yours to keep. There's no lock-in, no domain restrictions or license keys to keep track of. All blocks and features are free to use. Save time, get advanced designs & more with the Pro template library upgrade.
 * Author: Maxi Blocks
 * Author URI: https://maxiblocks.com/
 * Version: 2.0.0
 * Requires at least: 6.2
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

define('MAXI_PLUGIN_DIR_PATH', plugin_dir_path(__FILE__));
define('MAXI_PLUGIN_DIR_FILE', __FILE__);
define('MAXI_PLUGIN_URL_PATH', plugin_dir_url(__FILE__));
define('MAXI_PLUGIN_VERSION', get_file_data(__FILE__, array('Version' => 'Version'), false)['Version']);


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
// MaxiBlocks Dashboard
//======================================================================
require_once MAXI_PLUGIN_DIR_PATH . 'core/admin/class-maxi-dashboard.php';
if (class_exists('MaxiBlocks_Dashboard')) {
    MaxiBlocks_Dashboard::register();
}

//======================================================================
// MaxiBlocks Dynamic Content
//======================================================================
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-dynamic-content.php';
if (class_exists('MaxiBlocks_DynamicContent')) {
    MaxiBlocks_DynamicContent::register();
}

/**
 * TODO: Old init.php file. Please, delete these lines of comment and require onces this file has been removed
 */
require_once plugin_dir_path(__FILE__) . 'src/init.php';
