<?php

if (! defined('ABSPATH')) {
    exit; // Exit if accessed directly.
}

if (!defined('MAXIBLOCKS_GO_PATH')) { // path to the root theme folder
    define('MAXIBLOCKS_GO_PATH', get_template_directory());
}

if (!defined('MAXIBLOCKS_GO_MAXI_TEMPLATES_PATH')) { // path to the maxi/templates folder
    define('MAXIBLOCKS_GO_MAXI_TEMPLATES_PATH', plugin_dir_path(__FILE__) . 'templates/');
}

if (!defined('MAXIBLOCKS_GO_MAXI_PATTERNS_PATH')) { // path to the patterns folder in plugin
    define('MAXIBLOCKS_GO_MAXI_PATTERNS_PATH', plugin_dir_path(__FILE__) . 'patterns/');
}

if (!defined('MAXIBLOCKS_GO_MAXI_PARTS_PATH')) { // path to the parts folder in plugin
    define('MAXIBLOCKS_GO_MAXI_PARTS_PATH', plugin_dir_path(__FILE__) . 'parts/');
}

if (!defined('MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_URL')) { // url to the patterns folder in plugin
    define('MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_URL', plugin_dir_url(__FILE__) . 'patterns/');
}

include_once plugin_dir_path(__FILE__) . 'php/add-maxi-templates.php';
/**
 * Registers custom block pattern categories for MaxiBlocks Go.
 *
 * @since MaxiBlocks Go theme 1.0.1
 */
function maxiblocks_go_register_maxi_block_categories()
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
    $block_pattern_categories = apply_filters('maxiblocks_go_block_pattern_categories', $block_pattern_categories);

    // Register each block pattern category.
    foreach ($block_pattern_categories as $name => $properties) {
        register_block_pattern_category($name, $properties);
    }
}

// Hook the function to the init action.
add_action('init', 'maxiblocks_go_register_maxi_block_categories', 100);

/**
 * Check and update templates if necessary
 */
function maxiblocks_go_check_and_update_templates()
{
    $templates_imported = get_option('maxiblocks_go_templates_imported', false);

    if ($templates_imported) {
        $current_version = get_option('maxiblocks_go_templates_version', '0');
        $theme_version = wp_get_theme('maxiblocks-go')->get('Version');

        if (version_compare($current_version, $theme_version, '<')) {
            maxiblocks_go_import_templates();
            update_option('maxiblocks_go_templates_version', $theme_version);
        }
    }
}
add_action('init', 'maxiblocks_go_check_and_update_templates', 1);


/**
 * Import templates
 */
function maxiblocks_go_import_templates()
{
    // Copy templates
    maxiblocks_go_copy_directory(MAXIBLOCKS_GO_MAXI_TEMPLATES_PATH, MAXIBLOCKS_GO_PATH . '/templates');

    // Copy patterns
    maxiblocks_go_copy_directory(MAXIBLOCKS_GO_MAXI_PATTERNS_PATH, MAXIBLOCKS_GO_PATH . '/patterns');

    // Copy parts
    maxiblocks_go_copy_directory(MAXIBLOCKS_GO_MAXI_PARTS_PATH, MAXIBLOCKS_GO_PATH . '/parts');

    maxiblocks_go_add_styles_meta_fonts_to_db();
}
