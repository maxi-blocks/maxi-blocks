<?php
/**
 * MaxiBlocks Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

if (!class_exists('MaxiBlocks_Block')):
    class MaxiBlocks_Block
    {
        /**
         * Block name
         */
        protected $block_name = ''; 

        /**
         * Constructor.
         */
        public function __construct()
        {
            // Register block
            add_action('init', [$this, 'register_block'], 20);
        }

        public function register_block()
        {
            register_block_type(
              MAXI_PLUGIN_DIR_PATH . './src/blocks/' . $this->block_name . '/block.json',
              [
                 'render_callback' => [$this, 'render_block'],
              ]
		    );
        }

        public function render_block($attributes, $content)
        {
            return $content;
        }
    }

endif;