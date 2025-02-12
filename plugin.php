<?php

/**
 * Plugin Name: MaxiBlocks
 * Plugin URI: https://maxiblocks.com/
 * Description: A powerful page builder for WordPress Gutenberg with a vast library of free web templates, icons & patterns. Open source and free to build. Anything you create with MaxiBlocks is yours to keep. There's no lock-in, no domain restrictions or license keys to keep track of. All blocks and features are free to use. Save time, get advanced designs & more with the Pro template library upgrade.
 * Author: MaxiBlocks
 * Author URI: https://maxiblocks.com/go/plugin-author
 * Version: 2.0.7
 * Requires at least: 6.2.2
 * Requires PHP: 8.0
 * License: GPLv3 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
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
    $message = sprintf(
        /* translators: %1$s: database type, %2$s: required version, %3$s: link URL */
        esc_html__('Highly recommend to update to %1$s %2$s+ for enhanced security, better performance, and full feature compatibility.', 'maxi-blocks'),
        esc_html($databaseType),
        esc_html($requiredVersion)
    ) . ' <a href="' . esc_url('https://maxiblocks.com/go/database-version-requirements') . '" target="_blank">' . esc_html__('Learn more', 'maxi-blocks') . '</a>';

    echo '<tr class="plugin-update-tr active maxi-blocks-db-notice" data-slug="maxi-blocks" data-plugin="maxi-blocks/plugin.php">';
    echo '<td colspan="4" class="plugin-update colspanchange">';
    echo '<div class="update-message notice inline notice-warning notice-alt is-dismissible"><p>';
    echo wp_kses_post($message);
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
    // Check if required keys exist in the options array
    if (!isset($options['action']) || !isset($options['type']) || !isset($options['plugins'])) {
        return;
    }
    // Check if it's an update of plugins
    if ($options['action'] == 'update' && $options['type'] == 'plugin') {
        // Check if YOUR plugin is in the list of updated plugins
        foreach ($options['plugins'] as $plugin) {
            if ($plugin == plugin_basename(__FILE__)) {
                // Reset the dismissal option
                update_option('maxi_blocks_db_notice_dismissed', 'no');
                update_option('maxi_plugin_update_notice_dismissed', 'no');
                break;
            }
        }
    }
}
add_action('upgrader_process_complete', 'maxi_blocks_after_update', 10, 2);

//======================================================================
// Clear cache notice after plugin update
//======================================================================

add_action('admin_init', 'maxi_check_plugin_version_update');

function maxi_check_plugin_version_update()
{
    $current_version = MAXI_PLUGIN_VERSION;
    $stored_version = get_option('maxi_plugin_version', '0');

    if (version_compare($current_version, $stored_version, '!=')) {
        add_action('admin_notices', 'maxi_plugin_update_notice');
        update_option('maxi_plugin_update_notice_dismissed', 'no');
    }
}

function maxi_plugin_update_notice()
{
    if (get_option('maxi_plugin_update_notice_dismissed') === 'yes') {
        return;
    }

    echo '<div class="notice notice-warning is-dismissible" id="maxi-plugin-update-notice">';
    echo '<p>MaxiBlocks plugin has been updated. Please clear your browser and plugin caches to ensure the best performance. <a href="https://maxiblocks.com/go/clearing-caches" target="_blank">Learn more</a></p>';
    echo '</div>';

    add_action('admin_footer', 'maxi_blocks_enqueue_notice_scripts'); // Reuse the existing function to enqueue scripts
}

function maxi_blocks_register_plugin_update_notice_route()
{
    register_rest_route('maxi-blocks/v1', '/dismiss-plugin-update-notice', [
        'methods' => 'POST',
        'callback' => 'maxi_blocks_dismiss_plugin_update_notice',
        'permission_callback' => function () {
            return current_user_can('manage_options');
        }
    ]);
}
add_action('rest_api_init', 'maxi_blocks_register_plugin_update_notice_route');

function maxi_blocks_dismiss_plugin_update_notice()
{
    update_option('maxi_plugin_update_notice_dismissed', 'yes');
    // Update the stored plugin version to the current version to prevent the notice from showing again until the next update
    update_option('maxi_plugin_version', MAXI_PLUGIN_VERSION);
    return new WP_REST_Response(null, 204);
}


//======================================================================
// Init
//======================================================================

require_once(MAXI_PLUGIN_DIR_PATH . 'core/admin/maxi-allowed-html-tags.php');

// remove noopener noreferrer from gutenberg links
function maxi_links_control($rel, $link)
{
    return false;
}
add_filter('wp_targeted_link_rel', 'maxi_links_control', 10, 2);
add_action('wp_ajax_maxi_get_option', 'maxi_get_option', 9, 1);


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
MaxiBlocks_API::register();
if (class_exists('MaxiBlocks_API')) {
    add_action('plugins_loaded', array('MaxiBlocks_API', 'register'));
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

//======================================================================
// MaxiBlocks Go
//======================================================================
if (get_template() === 'maxiblocks-go') {
    $theme_version = wp_get_theme('maxiblocks-go')->get('Version');

    if (version_compare($theme_version, '1.2.1', '>=')) {
        require_once MAXI_PLUGIN_DIR_PATH . 'core/maxiblocks-go/maxiblocks-go.php';
    }

}

//======================================================================
// MaxiBlocks Onboarding
//======================================================================

// Check if we're in a test environment
$is_test_environment = (
    !empty(getenv('GITHUB_ACTIONS')) ||
    !empty(getenv('CI')) ||
    !empty(getenv('E2E_TESTING')) ||
    defined('RUNNING_TESTS') ||
    !empty(getenv('PUPPETEER_EXECUTABLE_PATH'))
);

if (!$is_test_environment) {
    require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-quick-start-register.php';

    if (class_exists('MaxiBlocks_QuickStart_Register')) {
        MaxiBlocks_QuickStart_Register::register();

        // Register activation hook
        register_activation_hook(__FILE__, ['MaxiBlocks_QuickStart_Register', 'activate']);

        // Handle redirect after activation
        add_action('admin_init', function () {
            if (get_transient('maxi_blocks_activation_redirect')) {
                delete_transient('maxi_blocks_activation_redirect');
                if (!isset($_GET['activate-multi'])) {
                    wp_safe_redirect(admin_url('admin.php?page=maxi-blocks-quick-start'));
                    exit;
                }
            }
        });
    }
} else {
    // Set quick start as completed for test environments
    update_option('maxi_blocks_quick_start_completed', true);
}
