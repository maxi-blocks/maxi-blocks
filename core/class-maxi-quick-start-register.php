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
        // Only set the redirect transient if quick start hasn't been completed
        if (!get_option('maxi_blocks_quick_start_completed')) {
            set_transient('maxi_blocks_activation_redirect', true, 30);
        }
    }
}
