<?php

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

if (!defined('MAXIBLOCKS_GO_PREFIX')) {
    define('MAXIBLOCKS_GO_PREFIX', 'maxiblocks-go-');
}

if (!defined('MAXIBLOCKS_GO_PATH')) { // path to the root theme folder
    define('MAXIBLOCKS_GO_PATH', get_template_directory());
}

if (!defined('MAXIBLOCKS_GO_MAXI_TEMPLATES_PLUGIN_PATH')) { // path to the templates folder in plugin
    define('MAXIBLOCKS_GO_MAXI_TEMPLATES_PLUGIN_PATH', plugin_dir_path(__FILE__) . 'templates/');
}

if (!defined('MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_PATH')) { // path to the patterns folder in plugin
    define('MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_PATH', plugin_dir_path(__FILE__) . 'patterns/');
}

if (!defined('MAXIBLOCKS_GO_MAXI_PARTS_PLUGIN_PATH')) { // path to the parts folder in plugin
    define('MAXIBLOCKS_GO_MAXI_PARTS_PLUGIN_PATH', plugin_dir_path(__FILE__) . 'parts/');
}

if (!defined('MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_URL')) { // url to the patterns folder in plugin
    define('MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_URL', plugin_dir_url(__FILE__) . 'patterns/');
}

if (!defined('MAXIBLOCKS_GO_FSE_JS')) {
    define('MAXIBLOCKS_GO_FSE_JS', MAXIBLOCKS_GO_PREFIX . 'fse');
}


include_once plugin_dir_path(__FILE__) . 'php/add-maxi-templates.php';
/**
 * Registers custom block pattern categories for MaxiBlocks Go.
 *
 * @since MaxiBlocks Go theme 1.0.1
 */
function plugin_maxiblocks_go_register_maxi_block_categories()
{
    // Define block pattern categories with labels.
    $block_pattern_categories = array(
        'maxiblocks-go-author-bio' => array('label' => __('MaxiBlocks author bio', 'maxiblocks-go')),
        'maxiblocks-go-post-single' => array('label' => __('MaxiBlocks post single', 'maxiblocks-go')),
        'maxiblocks-go-homepage' => array('label' => __('MaxiBlocks homepage', 'maxiblocks-go')),
        'maxiblocks-go-footer' => array('label' => __('MaxiBlocks footer', 'maxiblocks-go')),
        'maxiblocks-go-header-navigation' => array('label' => __('MaxiBlocks header navigation', 'maxiblocks-go')),
        'maxiblocks-go-blog-index' => array('label' => __('MaxiBlocks blog index', 'maxiblocks-go')),
        'maxiblocks-go-not-found-404' => array('label' => __('MaxiBlocks not found 404', 'maxiblocks-go')),
        'maxiblocks-go-all-archives' => array('label' => __('MaxiBlocks all archives', 'maxiblocks-go')),
        'maxiblocks-go-search-results' => array('label' => __('MaxiBlocks search results', 'maxiblocks-go')),
    );

    // Allow filtering the block pattern categories.
    $block_pattern_categories = apply_filters('plugin_maxiblocks_go_block_pattern_categories', $block_pattern_categories);

    // Register each block pattern category.
    foreach ($block_pattern_categories as $name => $properties) {
        register_block_pattern_category($name, $properties);
    }
}

// Hook the function to the init action.
add_action('init', 'plugin_maxiblocks_go_register_maxi_block_categories', 100);

/**
 * Check and update templates if necessary
 */
function plugin_maxiblocks_go_check_and_update_templates()
{
    $templates_imported = get_option('maxiblocks_go_templates_imported', false);

    if ($templates_imported) {
        $current_version = get_option('maxiblocks_go_templates_version', '0');
        $theme_version = wp_get_theme('maxiblocks-go')->get('Version');

        if (version_compare($current_version, $theme_version, '<>')) {
            plugin_maxiblocks_go_import_templates();
            update_option('maxiblocks_go_templates_version', $theme_version);
        }
    }
}
add_action('init', 'plugin_maxiblocks_go_check_and_update_templates', 1);


/**
 * Import templates
 */
function plugin_maxiblocks_go_import_templates()
{
    // Copy templates
    plugin_maxiblocks_go_copy_directory(MAXIBLOCKS_GO_MAXI_TEMPLATES_PLUGIN_PATH, MAXIBLOCKS_GO_PATH . '/templates');

    // Copy patterns
    plugin_maxiblocks_go_copy_directory(MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_PATH, MAXIBLOCKS_GO_PATH . '/patterns');

    // Copy parts
    plugin_maxiblocks_go_copy_directory(MAXIBLOCKS_GO_MAXI_PARTS_PLUGIN_PATH, MAXIBLOCKS_GO_PATH . '/parts');

    plugin_maxiblocks_go_add_styles_meta_fonts_to_db();
}

// Previews for patterns

function plugin_maxiblocks_go_get_maxi_patterns()
{
    return glob(MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_PATH . '*', GLOB_ONLYDIR);
}

function plugin_maxiblocks_go_fse_admin_script()
{
    $fse_js_url = MAXI_PLUGIN_URL_PATH . 'core/maxiblocks-go/js/fse.js';

    wp_enqueue_script(
        MAXIBLOCKS_GO_FSE_JS,
        $fse_js_url,
        [],
        MAXI_PLUGIN_VERSION,
        true
    );


    $vars = array(
        'url'         => MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_URL,
        'directories' => plugin_maxiblocks_go_get_maxi_patterns(),
    );

    wp_localize_script(MAXIBLOCKS_GO_FSE_JS, 'maxiblocks', $vars);


}
add_action('admin_enqueue_scripts', 'plugin_maxiblocks_go_fse_admin_script');
