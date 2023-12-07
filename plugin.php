<?php

/**
 * Plugin Name: MaxiBlocks
 * Plugin URI: https://maxiblocks.com/
 * Description: A powerful page builder for WordPress Gutenberg with a vast library of free web templates, icons & patterns. Open source and free to build. Anything you create with MaxiBlocks is yours to keep. There's no lock-in, no domain restrictions or license keys to keep track of. All blocks and features are free to use. Save time, get advanced designs & more with the Pro template library upgrade.
 * Author: MaxiBlocks
 * Author URI: https://maxiblocks.com/go/plugin-author
 * Version: 1.5.6
 * Requires at least: 6.2.2
 * Requires PHP: 8.0
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

define('REQUIRED_MYSQL_VERSION', '8.0');
define('REQUIRED_MARIADB_VERSION', '10.4');

// Hook for checking the database version in the admin area.
add_action('admin_init', 'check_database_version');

/**
 * Check the required database version during admin initialization.
 */
function check_database_version()
{
    global $wpdb;

    // Check if the database is MariaDB.
    $isMariaDB = strpos(strtolower($wpdb->db_version()), 'mariadb') !== false;

    // Determine the required version based on the database type.
    $requiredVersion = $isMariaDB ? REQUIRED_MARIADB_VERSION : REQUIRED_MYSQL_VERSION;

    // Compare the current database version with the required version.
    if (version_compare($wpdb->db_version(), $requiredVersion, '<')) {
        $plugin_file = plugin_basename(__FILE__);
        add_action("after_plugin_row_{$plugin_file}", 'show_database_version_notice', 10, 3);
    }
}

/**
 * Show an admin notice under the plugin's name if the required database version is not met.
 */
function show_database_version_notice()
{
    global $wpdb;
    $isMariaDB = strpos(strtolower($wpdb->db_version()), 'mariadb') !== false;
    $requiredVersion = $isMariaDB ? REQUIRED_MARIADB_VERSION : REQUIRED_MYSQL_VERSION;
    $databaseType = $isMariaDB ? 'MariaDB' : 'MySQL';

    $message = 'This plugin is optimized for ' . $databaseType . ' version ' . $requiredVersion . ' or higher. Please update your ' . $databaseType . ' version or contact your hosting provider for the best experience.';

    echo '<tr class="plugin-update-tr active">';
    echo '<td colspan="4" class="plugin-update colspanchange">';
    echo '<div class="update-message notice inline notice-warning notice-alt is-dismissible"><p>';
    echo esc_html($message);
    echo '</p></div></td></tr>';
}


define('MAXI_PLUGIN_DIR_PATH', plugin_dir_path(__FILE__));
define('MAXI_PLUGIN_DIR_FILE', __FILE__);
define('MAXI_PLUGIN_URL_PATH', plugin_dir_url(__FILE__));
define('MAXI_PLUGIN_VERSION', get_file_data(__FILE__, array('Version' => 'Version'), false)['Version']);


//======================================================================
// Init
//======================================================================

require_once(MAXI_PLUGIN_DIR_PATH . 'core/admin/maxi-allowed-html-tags.php');

// Temporally removing patterns download
add_filter('should_load_remote_block_patterns', '__return_false');

/* Enabled option */

if (!get_option('maxi_enable')) {
    add_option('maxi_enable', 'enabled');
}

function maxi_get_option()
{
    echo esc_attr(get_option('maxi_enable'));
    die();
}

function maxi_insert_block()
{
    if (isset($_POST['maxi_title']) && isset($_POST['maxi_content'])) {//phpcs:ignore
        $this_title =  sanitize_title($_POST['maxi_title']);//phpcs:ignore
        $this_content = sanitize_text_field($_POST['maxi_content']);//phpcs:ignore

        if ($this_content && $this_title) {
            // 	$has_reusable_block = get_posts( array(
            // 	'name'           => $_POST['maxi_title'],
            // 	'post_type'      => 'wp_block',
            // 	'posts_per_page' => 1
            // ) );

            // if ( ! $has_reusable_block ) {
            // No reusable block like ours detected.
            wp_insert_post([
            'post_content' =>  $this_content,
            'post_title' => $this_title,
            'post_type' => 'wp_block',
            'post_status' => 'publish',
            'comment_status' => 'closed',
            'ping_status' => 'closed',
            'guid' => sprintf(
                '%s/wp_block/%s',
                site_url(),
                sanitize_title($this_title)
            ),
        ]);
            echo 'success';
        //} //if ( ! $has_reusable_block )
        //else {echo 'You already have Block with the same name';}
        } else {
            echo 'JSON Error';
        }
    }
    wp_die();
} //function maxi_insert_block()

// remove noopener noreferrer from gutenberg links
function maxi_links_control($rel, $link)
{
    return false;
}
add_filter('wp_targeted_link_rel', 'maxi_links_control', 10, 2);

add_action('wp_ajax_maxi_get_option', 'maxi_get_option', 9, 1);
add_action('wp_ajax_maxi_insert_block', 'maxi_insert_block', 10, 2);


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
