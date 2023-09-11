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

require_once MAXI_PLUGIN_DIR_PATH . 'core/defaults/styles_defaults.php';

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
         * Dynamic blocks
         */
        protected $dynamic_blocks = [
            'text-maxi',
            'button-maxi',
            'image-maxi',
            'group-maxi',
            'column-maxi',
            'row-maxi',
            'slide-maxi',
            'pane-maxi',
            'svg-icon-maxi',
        ];

        private static $dynamic_content_attributes = [
            'dc-error' => [
                'type' => 'string',
                'default' => '',
            ],
            'dc-status' => [
                'type' => 'boolean',
            ],
            'dc-source' => [
                'type' => 'string',
                'default' => 'wp',
            ],
            'dc-type' => [
                'type' => 'string',
            ],
            'dc-relation' => [
                'type' => 'string',
            ],
            'dc-id' => [
                'type' => 'number',
            ],
            'dc-author' => [
                'type' => 'number',
            ],
            'dc-show' => [
                'type' => 'string',
                'default' => 'current',
            ],
            'dc-field' => [
                'type' => 'string',
            ],
            'dc-format' => [
                'type' => 'string',
                'default' => 'd.m.Y t',
            ],
            'dc-custom-format' => [
                'type' => 'string',
            ],
            'dc-custom-date' => [
                'type' => 'boolean',
                'default' => false,
            ],
            'dc-year' => [
                'type' => 'string',
                'default' => 'numeric',
            ],
            'dc-month' => [
                'type' => 'string',
                'default' => 'numeric',
            ],
            'dc-day' => [
                'type' => 'string',
                'default' => 'numeric',
            ],
            'dc-hour' => [
                'type' => 'boolean',
                'default' => 'numeric',
            ],
            'dc-hour12' => [
                'type' => 'string',
                'default' => false,
            ],
            'dc-minute' => [
                'type' => 'string',
                'default' => 'numeric',
            ],
            'dc-second' => [
                'type' => 'string',
                'default' => 'numeric',
            ],
            'dc-locale' => [
                'type' => 'string',
                'default' => 'en',
            ],
            'dc-timezone' => [
                'type' => 'string',
                'default' => 'Europe/London',
            ],
            'dc-timezone-name' => [
                'type' => 'string',
                'default' => 'none',
            ],
            'dc-weekday' => [
                'type' => 'string',
            ],
            'dc-era' => [
                'type' => 'string',
            ],
            'dc-limit' => [
                'type' => 'number',
                'default' => 100,
            ],
            'dc-content' => [
                'type' => 'string',
            ],
            'dc-media-id' => [
                'type' => 'number',
            ],
            'dc-media-url' => [
                'type' => 'string',
            ],
            'dc-media-caption' => [
                'type' => 'string',
            ],
            'dc-link-status' => [
                'type' => 'boolean',
            ],
            'dc-link-url' => [
                'type' => 'string',
            ],
            'dc-post-taxonomy-links-status' => [
                'type' => 'boolean',
            ],
            'dc-custom-delimiter-status' => [
                'type' => 'boolean',
            ],
            'dc-delimiter-content' => [
                'type' => 'string',
                'default' => '',
            ],
            'dc-acf-group' => [
                'type' => 'string',
            ],
            'dc-acf-field-type' => [
                'type' => 'string',
            ],
            'dc-order' => [
                'type' => 'string',
            ],
            'dc-order-by' => [
                'type' => 'string',
            ],
            'dc-accumulator' => [
                'type' => 'number',
            ],
        ];

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
            $config = [
                'api_version' => 2,
                'editor_script' => 'maxi-blocks-block-editor',
                'render_callback' => [$this, 'render_block'],
                'attributes' => self::$dynamic_content_attributes,
            ];
            // If the block should be dynamic, use MaxiBlocks_DynamicContent
            if (in_array($this->block_name, $this->dynamic_blocks)) {
                $this->block = register_block_type("maxi-blocks/{$this->block_name}", array_merge(json_decode(file_get_contents(MAXI_PLUGIN_DIR_PATH . "build/blocks/{$this->block_name}/block.json"), true), $config));
            } else {
                $this->block = register_block_type(
                    "maxi-blocks/{$this->block_name}",
                    array_merge(
                        json_decode(file_get_contents(MAXI_PLUGIN_DIR_PATH . 'build/blocks/' . $this->block_name . '/block.json'), true),
                        [ 'render_callback' => [$this, 'render_block']]
                    )
                );
            }
        }

        public function render_block($attributes, $content)
        {
            // If the block should be dynamic, use MaxiBlocks_DynamicContent
            if (in_array($this->block_name, $this->dynamic_blocks)) {
                $dynamic_content = new MaxiBlocks_DynamicContent($this->block_name, $attributes, $content);
                return $dynamic_content->render_dc($attributes, $content);
            }

            // If not, proceed with the regular render logic
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
                file_get_contents(MAXI_PLUGIN_DIR_PATH . 'build/blocks/' . $this->block_name . '/block.json'),
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
