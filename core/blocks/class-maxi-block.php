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

// Define the directory paths.
$utilsDir = MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/';
$styleHelpersDir = MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/';

// Load the utility files.
foreach (glob($utilsDir . '*.php') as $file) {
    require_once $file;
}

// Load the style helper files.
foreach (glob($styleHelpersDir . '*.php') as $file) {
    require_once $file;
}

// Check if the class is already defined.
if (!class_exists('MaxiBlocks_Block')):

    /**
     * MaxiBlocks_Block Class
     *
     * Handles the main operations for the Maxi Block, such as registration,
     * rendering, and getting block data.
     */
    class MaxiBlocks_Block
    {
        /**
         * Block name
         */
        protected $block_name = '';

        /**
         * Block
         *
         * WP Block Type object
         */
        protected $block;

        /**
         * Block metadata
         */
        protected $block_metadata = [];

        /**
         * Block custom css
         */
        protected $block_custom_css = [];

        /**
         * Block sc props
         */
        protected $block_sc_props = [];

        /**
         * Block sc vars
         */
        protected $block_sc_vars = [];

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
            $this->block = register_block_type(
                MAXI_PLUGIN_DIR_PATH . 'src/blocks/' . $this->block_name . '/block.json',
                [
                   'render_callback' => [$this, 'render_block'],
                ]
            );
        }

        public function render_block($attributes, $content)
        {
            return $content;
        }

        public function get_block()
        {
            return $this->block;
        }

        public function get_block_name()
        {
            return $this->block_name;
        }

        /**
        * Get block metadata.
        *
        * Reads the block.json file to retrieve the block metadata.
        *
        * @return array The block metadata.
        */
        public function get_block_metadata()
        {
            // If the block metadata is not yet retrieved, read it from the block.json file.
            return $this->block_metadata = (!empty($this->block_metadata) ? $this->block_metadata : json_decode(
                file_get_contents(MAXI_PLUGIN_DIR_PATH . 'src/blocks/' . $this->block_name . '/block.json'),
                true
            ));

        }

        public function get_block_attributes($props)
        {
            return $this->block->prepare_attributes_for_render($props);
        }

        /**
         * Get block custom CSS.
         *
         * Retrieves the custom CSS from the block metadata.
         *
         * @return array The custom CSS for the block.
         */
        public function get_block_custom_css()
        {
            // If the custom CSS is not yet retrieved, get it from the block metadata.
            return $this->block_custom_css = (!empty($this->block_custom_css) ? $this->block_custom_css : $this->get_block_metadata()['customCss'] ?? []);

        }


        /**
         * Get block style card properties.
         *
         * Retrieves the style card properties from the block metadata.
         *
         * @return array The style card properties for the block.
         */
        public function get_block_sc_props()
        {
            // If the style card properties are not yet retrieved, get them from the block metadata.
            return $this->block_sc_props ??= $this->get_block_metadata()['scProps'] ?? [];
        }

        /**
         * Get block style card variables.
         *
         * Retrieves the style card variables using the style card properties and a given block style.
         *
         * @param array $block_style The block style used to calculate the style card variables.
         * @return array The style card variables for the block.
         */
        public function get_block_sc_vars($block_style)
        {
            if (isset($this->block_sc_vars)) {
                return $this->block_sc_vars;
            }
            $block_sc_props = $this->get_block_sc_props();
            if (empty($block_sc_props)) {
                return $this->block_sc_vars = [];
            }

            $sc_props = $block_sc_props['scElements'];
            $sc_entry = $block_sc_props['scType'];
            return $this->block_sc_vars = MaxiBlocks_StyleCards::get_style_cards_values($sc_props, $block_style, $sc_entry);
        }

    }

endif;
