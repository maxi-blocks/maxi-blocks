<?php
/**
 * MaxiBlocks Quick Start Register Class
 *
 * @package MaxiBlocks
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit();
}

class MaxiBlocks_QuickStart_Register
{
    /**
     * Register the quick start functionality
     */
    public static function register()
    {
        if (is_admin()) {
            require_once MAXI_PLUGIN_DIR_PATH . 'core/admin/quick-start/class-maxi-quick-start.php';
            new MaxiBlocks_QuickStart();
        }
    }

    /**
     * Activation hook callback
     */
    public static function activate()
    {
        global $wpdb;

        // Check if this is a first-time installation by checking if the
        // maxi_blocks_styles_blocks table is empty. Empty table = no prior usage
        $table_name = $wpdb->prefix . 'maxi_blocks_styles_blocks';
        $has_styles = $wpdb->get_var("SELECT COUNT(*) FROM `{$table_name}`");
        $quick_start_completed = get_option('maxi_blocks_quick_start_completed');

        // Set redirect transient only for genuine first-time users
        // Empty styles table indicates they've never used MaxiBlocks before
        if ($has_styles == 0 && !$quick_start_completed) {
            set_transient('maxi_blocks_activation_redirect', true, 30);
        }
    }
}
