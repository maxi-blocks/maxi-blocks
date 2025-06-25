<?php

if (!defined('ABSPATH')) {
	exit(); // Exit if accessed directly.
}

if (!defined('MAXIBLOCKS_GO_PREFIX')) {
	define('MAXIBLOCKS_GO_PREFIX', 'maxiblocks-go-');
}

if (!defined('MAXIBLOCKS_GO_PATH')) {
	// path to the root theme folder
	define('MAXIBLOCKS_GO_PATH', get_template_directory());
}

if (!defined('MAXIBLOCKS_GO_MAXI_TEMPLATES_PLUGIN_PATH')) {
	// path to the templates folder in plugin
	define(
		'MAXIBLOCKS_GO_MAXI_TEMPLATES_PLUGIN_PATH',
		plugin_dir_path(__FILE__) . 'templates/',
	);
}

if (!defined('MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_PATH')) {
	// path to the patterns folder in plugin
	define(
		'MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_PATH',
		plugin_dir_path(__FILE__) . 'patterns/',
	);
}

if (!defined('MAXIBLOCKS_GO_MAXI_PARTS_PLUGIN_PATH')) {
	// path to the parts folder in plugin
	define(
		'MAXIBLOCKS_GO_MAXI_PARTS_PLUGIN_PATH',
		plugin_dir_path(__FILE__) . 'parts/',
	);
}

if (!defined('MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_URL')) {
	// url to the patterns folder in plugin
	define(
		'MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_URL',
		plugin_dir_url(__FILE__) . 'patterns/',
	);
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
function plugin_maxiblocks_go_register_maxi_block_categories() {
	// Define block pattern categories with labels.
	$block_pattern_categories = [
		'maxiblocks-go-author-bio' => [
			'label' => __('MaxiBlocks author bio', 'maxiblocks-go'),
		],
		'maxiblocks-go-post-single' => [
			'label' => __('MaxiBlocks post single', 'maxiblocks-go'),
		],
		'maxiblocks-go-homepage' => [
			'label' => __('MaxiBlocks homepage', 'maxiblocks-go'),
		],
		'maxiblocks-go-footer' => [
			'label' => __('MaxiBlocks footer', 'maxiblocks-go'),
		],
		'maxiblocks-go-header-navigation' => [
			'label' => __('MaxiBlocks header navigation', 'maxiblocks-go'),
		],
		'maxiblocks-go-blog-index' => [
			'label' => __('MaxiBlocks blog index', 'maxiblocks-go'),
		],
		'maxiblocks-go-not-found-404' => [
			'label' => __('MaxiBlocks not found 404', 'maxiblocks-go'),
		],
		'maxiblocks-go-all-archives' => [
			'label' => __('MaxiBlocks all archives', 'maxiblocks-go'),
		],
		'maxiblocks-go-search-results' => [
			'label' => __('MaxiBlocks search results', 'maxiblocks-go'),
		],
	];

	// Allow filtering the block pattern categories.
	$block_pattern_categories = apply_filters(
		'plugin_maxiblocks_go_block_pattern_categories',
		$block_pattern_categories,
	);

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
function plugin_maxiblocks_go_check_and_update_templates() {
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
function plugin_maxiblocks_go_import_templates() {
	// Copy templates
	plugin_maxiblocks_go_copy_directory(
		MAXIBLOCKS_GO_MAXI_TEMPLATES_PLUGIN_PATH,
		MAXIBLOCKS_GO_PATH . '/templates',
	);

	// Copy patterns
	plugin_maxiblocks_go_copy_directory(
		MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_PATH,
		MAXIBLOCKS_GO_PATH . '/patterns',
	);

	// Copy parts
	plugin_maxiblocks_go_copy_directory(
		MAXIBLOCKS_GO_MAXI_PARTS_PLUGIN_PATH,
		MAXIBLOCKS_GO_PATH . '/parts',
	);

	plugin_maxiblocks_go_add_styles_meta_fonts_to_db();
}

// Previews for patterns

function plugin_maxiblocks_go_get_maxi_patterns() {
	return glob(MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_PATH . '*', GLOB_ONLYDIR);
}

function plugin_maxiblocks_go_fse_admin_script() {
	$fse_js_url = MAXI_PLUGIN_URL_PATH . 'core/maxiblocks-go/js/fse.js';

	wp_enqueue_script(
		MAXIBLOCKS_GO_FSE_JS,
		$fse_js_url,
		[],
		MAXI_PLUGIN_VERSION,
		true,
	);

	$vars = [
		'url' => MAXIBLOCKS_GO_MAXI_PATTERNS_PLUGIN_URL,
		'directories' => plugin_maxiblocks_go_get_maxi_patterns(),
	];

	wp_localize_script(MAXIBLOCKS_GO_FSE_JS, 'maxiblocks', $vars);
}
add_action('admin_enqueue_scripts', 'plugin_maxiblocks_go_fse_admin_script');

/**
 * One-time migrator to remove ' maxi-block--has-link' from blog-home-page-dark-bhpd-pro-02.php
 */
function plugin_maxiblocks_go_migrate_has_link_classes()
{
	// Check if templates have been imported
	$templates_imported = get_option('maxiblocks_go_templates_imported', false);

	// Check if migration has already been run
	$migration_completed = get_option('maxiblocks_go_has_link_migration_completed', false);

	// Only run if templates are imported and migration hasn't been completed
	if ($templates_imported && !$migration_completed) {
		// Initialize WP Filesystem API
		if (!function_exists('WP_Filesystem')) {
			require_once ABSPATH . 'wp-admin/includes/file.php';
		}

		// Initialize filesystem with credentials
		$credentials = request_filesystem_credentials('', '', false, false, array());
		if (!WP_Filesystem($credentials)) {
			// Mark as completed to prevent repeated attempts if filesystem is not accessible
			update_option('maxiblocks_go_has_link_migration_completed', 'skipped-no-filesystem');
			return;
		}

		global $wp_filesystem;

		// Target the copied file in the maxiblocks-go theme, regardless of active theme
		$pattern_file_path = get_theme_root() . '/maxiblocks-go/patterns/blog-home-page-dark-bhpd-pro-02.php';

		// Check if file exists
		if ($wp_filesystem->exists($pattern_file_path)) {
			// Check if file is readable
			if ($wp_filesystem->is_readable($pattern_file_path)) {
				// Read the file content
				$file_content = $wp_filesystem->get_contents($pattern_file_path);

				if ($file_content !== false) {
					// Remove all occurrences of ' maxi-block--has-link'
					$updated_content = str_replace(' maxi-block--has-link', '', $file_content);

					// Only write if there were changes
					if ($updated_content !== $file_content) {
						// Check if file is writable before attempting to write
						if ($wp_filesystem->is_writable($pattern_file_path)) {
							// Write the updated content back to the file
							if ($wp_filesystem->put_contents($pattern_file_path, $updated_content)) {
								// Mark migration as completed
								update_option('maxiblocks_go_has_link_migration_completed', true);
							} else {
								// Mark as failed to prevent repeated attempts
								update_option('maxiblocks_go_has_link_migration_completed', 'failed-write-error');
							}
						} else {
							// Mark as failed due to write permissions
							update_option('maxiblocks_go_has_link_migration_completed', 'failed-not-writable');
						}
					} else {
						// No changes needed, mark as completed anyway
						update_option('maxiblocks_go_has_link_migration_completed', 'completed-no-changes');
					}
				} else {
					// Mark as failed due to read error
					update_option('maxiblocks_go_has_link_migration_completed', 'failed-read-error');
				}
			} else {
				// Mark as skipped due to read permissions
				update_option('maxiblocks_go_has_link_migration_completed', 'skipped-not-readable');
			}
		} else {
			// Mark as skipped since file doesn't exist
			update_option('maxiblocks_go_has_link_migration_completed', 'skipped-file-not-found');
		}
	}
}
add_action('init', 'plugin_maxiblocks_go_migrate_has_link_classes', 2);
