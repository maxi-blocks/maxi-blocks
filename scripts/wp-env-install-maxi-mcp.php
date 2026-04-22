<?php
/**
 * Local wp-env helper: install the bundled Maxi MCP companion plugin.
 */

if (!defined('ABSPATH')) {
    exit(1);
}

require_once ABSPATH . 'wp-admin/includes/file.php';
require_once ABSPATH . 'wp-admin/includes/plugin.php';

WP_Filesystem();

global $wp_filesystem;

if (!$wp_filesystem) {
    WP_CLI::error('Filesystem access is not available.');
}

$source = WP_PLUGIN_DIR . '/maxi-blocks/maxi-mcp';
$target = WP_PLUGIN_DIR . '/maxi-mcp';

if (!$wp_filesystem->exists($source)) {
    WP_CLI::error('Bundled Maxi MCP source folder was not found.');
}

if ($wp_filesystem->exists($target)) {
    $wp_filesystem->delete($target, true);
}

$result = copy_dir($source, $target);

if (is_wp_error($result)) {
    WP_CLI::error($result->get_error_message());
}

$activation = activate_plugin('maxi-mcp/maxi-mcp.php');

if (is_wp_error($activation)) {
    WP_CLI::error($activation->get_error_message());
}

WP_CLI::success('Maxi MCP installed and activated.');
