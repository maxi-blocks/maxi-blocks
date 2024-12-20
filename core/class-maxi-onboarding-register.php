<?php
/**
 * MaxiBlocks Onboarding Register Class
 *
 * @package MaxiBlocks
 * @since 1.0.0
 */

if (!defined('ABSPATH')) {
    exit();
}

class MaxiBlocks_Onboarding_Register
{
    /**
     * Register the onboarding functionality
     */
    public static function register()
    {
        if (is_admin()) {
            require_once MAXI_PLUGIN_DIR_PATH . 'core/admin/onboarding/class-maxi-onboarding.php';
            new MaxiBlocks_Onboarding();
        }
    }

    /**
     * Activation hook callback
     */
    public static function activate()
    {
        // Only set the redirect transient if onboarding hasn't been completed
        if (!get_option('maxi_blocks_onboarding_completed')) {
            set_transient('maxi_blocks_activation_redirect', true, 30);
        }
    }
}
