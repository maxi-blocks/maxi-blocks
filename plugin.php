<?php

/**
 * Plugin Name: MaxiBlocks
 * Plugin URI: https://maxiblocks.com/
 * Description: A powerful page builder for WordPress Gutenberg with a vast library of free web templates, icons & patterns. Open source and free to build. Anything you create with MaxiBlocks is yours to keep. There's no lock-in, no domain restrictions or license keys to keep track of. All blocks and features are free to use. Save time, get advanced designs & more with the Pro template library upgrade.
 * Author: MaxiBlocks
 * Author URI: https://maxiblocks.com/go/plugin-author
 * Version: 1.5.8
 * Requires at least: 6.2.2
 * Requires PHP: 8.0
 * License: GPL v2 or later
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain: maxi-blocks
 * Domain Path: /languages
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

define('MAXI_PLUGIN_DIR_PATH', plugin_dir_path(__FILE__));
define('MAXI_PLUGIN_DIR_FILE', __FILE__);
define('MAXI_PLUGIN_URL_PATH', plugin_dir_url(__FILE__));
define('MAXI_PLUGIN_VERSION', get_file_data(__FILE__, array('Version' => 'Version'), false)['Version']);
// Define the required MySQL version.
define('REQUIRED_MYSQL_VERSION', '8.0');
define('REQUIRED_MARIADB_VERSION', '10.4');

//======================================================================
// Translations
//======================================================================
add_action('init', 'maxi_load_textdomain');

function maxi_load_textdomain()
{
    load_plugin_textdomain('maxi-blocks', false, dirname(plugin_basename(__FILE__)) . '/languages');
}

function maxi_load_translations($mofile, $domain)
{
    if ('maxi-blocks' === $domain) {
        $locale = apply_filters('plugin_locale', determine_locale(), $domain);

        $mofile_new = WP_PLUGIN_DIR . '/' . dirname(plugin_basename(__FILE__)) . '/languages/' . $domain . '-' . $locale . '.mo';

        // Check if the new MO file exists
        if (file_exists($mofile_new)) {
            return $mofile_new;
        }
    }
    return $mofile;
}
add_filter('load_textdomain_mofile', 'maxi_load_translations', 10, 2);

//======================================================================
// Database version check
//======================================================================
// Hook for checking the database version in the admin area
add_action('admin_init', 'maxi_check_database_version');

/**
 * Check the required database version during admin initialization
 */
function maxi_check_database_version()
{
    global $wpdb;

    // Check if the database is MariaDB
    $isMariaDB = strpos(strtolower($wpdb->db_server_info()), 'maria') !== false;
    $requiredVersion = $isMariaDB ? REQUIRED_MARIADB_VERSION : REQUIRED_MYSQL_VERSION;

    // Compare the current database version with the required version
    if (version_compare($wpdb->db_version(), $requiredVersion, '<')) {
        $plugin_file = plugin_basename(__FILE__);
        add_action("after_plugin_row_{$plugin_file}", 'maxi_show_database_version_notice', 10, 3);
        add_action('admin_enqueue_scripts', 'maxi_blocks_enqueue_notice_scripts');
    }
}

/**
 * Enqueue JavaScript for the admin notice
 */
function maxi_blocks_enqueue_notice_scripts()
{
    wp_enqueue_script('maxi-blocks-admin-notice', plugins_url('/core/admin/notices.js', __FILE__), [], MAXI_PLUGIN_VERSION, true);

    // Localize script with REST API URL and nonce
    wp_localize_script('maxi-blocks-admin-notice', 'maxiBlocks', [
        'rest_url' => rest_url('maxi-blocks/v1/dismiss-notice'),
        'nonce' => wp_create_nonce('wp_rest')
    ]);
}

/**
 * Show an admin notice under the plugin's name if the required database version is not met
 */
function maxi_show_database_version_notice()
{
    if (get_option('maxi_blocks_db_notice_dismissed') === 'yes') {
        return;
    }

    global $wpdb;
    $isMariaDB = strpos(strtolower($wpdb->db_server_info()), 'maria') !== false;
    $requiredVersion = $isMariaDB ? REQUIRED_MARIADB_VERSION : REQUIRED_MYSQL_VERSION;
    $databaseType = $isMariaDB ? 'MariaDB' : 'MySQL';
    $message = __('Highly recommend to update to', 'maxi-blocks') . ' ' . $databaseType . ' ' . $requiredVersion . '+ ' . __('for enhanced security, better performance, and full feature compatibility.', 'maxi-blocks') . ' <a href="https://maxiblocks.com/go/database-version-requirements" target="_blank">' . __('Learn more', 'maxi-blocks') . '</a>';

    echo '<tr class="plugin-update-tr active maxi-blocks-db-notice" data-slug="maxi-blocks" data-plugin="maxi-blocks/plugin.php">';
    echo '<td colspan="4" class="plugin-update colspanchange">';
    echo '<div class="update-message notice inline notice-warning notice-alt is-dismissible"><p>';
    echo $message;
    echo '</p></div></td></tr>';
}

/**
 * Register REST API endpoint for dismissing the notice
 */
function maxi_blocks_register_rest_route()
{
    register_rest_route('maxi-blocks/v1', '/dismiss-notice', [
        'methods' => 'POST',
        'callback' => 'maxi_blocks_dismiss_notice',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ]);
}
add_action('rest_api_init', 'maxi_blocks_register_rest_route');

/**
 * Dismiss the notice and update the option in the database
 */
function maxi_blocks_dismiss_notice()
{
    update_option('maxi_blocks_db_notice_dismissed', 'yes');
    return new WP_REST_Response(null, 204);
}

function maxi_blocks_after_update($upgrader_object, $options)
{
    // Check if it's an update of plugins
    if ($options['action'] == 'update' && $options['type'] == 'plugin') {
        // Check if YOUR plugin is in the list of updated plugins
        foreach ($options['plugins'] as $plugin) {
            if ($plugin == plugin_basename(__FILE__)) {
                // Reset the dismissal option
                update_option('maxi_blocks_db_notice_dismissed', 'no');
                break;
            }
        }
    }
}
add_action('upgrader_process_complete', 'maxi_blocks_after_update', 10, 2);

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
