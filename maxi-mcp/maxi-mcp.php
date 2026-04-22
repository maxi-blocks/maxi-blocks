<?php
/**
 * Plugin Name: Maxi MCP
 * Plugin URI: https://maxiblocks.com/
 * Description: Connect MaxiBlocks sites to Claude Code, Codex, and other MCP clients with a guided WordPress admin flow.
 * Version: 0.1.0
 * Requires at least: 6.9
 * Requires PHP: 8.0
 * Author: MaxiBlocks
 * Author URI: https://maxiblocks.com/
 * License: GPLv3 or later
 * License URI: https://www.gnu.org/licenses/gpl-3.0.txt
 * Text Domain: maxi-mcp
 */

if (!defined('ABSPATH')) {
    exit();
}

define('MAXI_MCP_PLUGIN_FILE', __FILE__);
define('MAXI_MCP_PLUGIN_DIR', plugin_dir_path(__FILE__));
define('MAXI_MCP_PLUGIN_URL', plugin_dir_url(__FILE__));
define('MAXI_MCP_VERSION', '0.1.0');

add_filter(
    'maxi_blocks_enable_builtin_mcp',
    static function ($enabled) {
        return get_option('maxi_mcp_enabled', false)
            ? false
            : $enabled;
    },
    1,
);

$maxi_autoload_path = WP_PLUGIN_DIR . '/maxi-blocks/vendor/autoload.php';
if (
    !class_exists('\WP\MCP\Core\McpAdapter') &&
    file_exists($maxi_autoload_path)
) {
    require_once $maxi_autoload_path;
}

require_once MAXI_MCP_PLUGIN_DIR . 'includes/class-maxi-mcp-plugin.php';

if (class_exists('Maxi_MCP_Plugin')) {
    Maxi_MCP_Plugin::register();
}
