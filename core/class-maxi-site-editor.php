<?php
/**
 * Class MaxiBlocks_SiteEditor
 *
 * Handles site editor functionality for MaxiBlocks
 *
 * @package MaxiBlocks
 * @since 1.0.0
 */

class MaxiBlocks_SiteEditor
{
    /**
     * Constructor
     */
    public function __construct()
    {
        // Define plugin constants if not already defined
        if (!defined('MAXI_BLOCKS_PLUGIN_FILE')) {
            define('MAXI_BLOCKS_PLUGIN_FILE', dirname(dirname(__FILE__)) . '/plugin.php');
        }

        if (!defined('MAXI_BLOCKS_VERSION')) {
            define('MAXI_BLOCKS_VERSION', '1.0.0'); // You should replace this with your actual version
        }

        $this->init();
    }

    /**
     * Initialize the class
     */
    private function init()
    {
        // Use the specific hook for site editor
    }

}
