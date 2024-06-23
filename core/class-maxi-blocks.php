<?php
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-style-cards.php';

/**
 * MaxiBlocks Core Class
 *
 * @since   1.0.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

if (!class_exists('MaxiBlocks_Blocks')):
    class MaxiBlocks_Blocks
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Blocks
         */
        private static $instance;

        /**
         * Array of all the block classes in MaxiBlocks.
         *
         * @var array
         */
        private $blocks_classes = [
            'Group_Maxi_Block',
            'Container_Maxi_Block',
            'Row_Maxi_Block',
            'Column_Maxi_Block',
            'Accordion_Maxi_Block',
            'Pane_Maxi_Block',
            'Button_Maxi_Block',
            'Divider_Maxi_Block',
            'Image_Maxi_Block',
            'SVG_Icon_Maxi_Block',
            'Text_Maxi_Block',
            'List_Item_Maxi_Block',
            'Video_Maxi_Block',
            'Number_Counter_Maxi_Block',
            'Search_Maxi_Block',
            'Map_Maxi_Block',
            'Slide_Maxi_Block',
            'Slider_Maxi_Block',
        ];


        /**
         * Registers the plugin.
         */
        public static function register()
        {
            if (null === self::$instance) {
                self::$instance = new MaxiBlocks_Blocks();
            }
        }

        /**
         * Constructor.
         */
        public function __construct()
        {
            $this->include_block_classes(); // Includes all block classes.

            // Enqueue blocks styles and scripts
            add_action('init', [$this, 'enqueue_blocks_assets']);

            // Enqueue blocks
            add_action('init', [$this, 'register_blocks']);

            // Register MaxiBlocks attachment taxonomy and terms
            add_action('init', [$this,'maxi_add_image_taxonomy']);
            add_action('init', [$this,'maxi_add_image_taxonomy_term']);

            // Register MaxiBlocks category
            add_filter('block_categories_all', [$this, 'maxi_block_category']);

            $style_cards = new MaxiBlocks_StyleCards();
            $current_style_cards = $style_cards->get_maxi_blocks_active_style_card();

            if($current_style_cards && array_key_exists('gutenberg_blocks_status', $current_style_cards) && $current_style_cards['gutenberg_blocks_status']) {
                add_filter("render_block", [$this, "maxi_add_sc_native_blocks"], 10, 3);
            }

        }

        /**
         * Includes all the block classes.
         */
        private function include_block_classes()
        {
            foreach ($this->blocks_classes as $class) {
                $file_path = MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-' . strtolower(str_replace('_', '-', $class)) . '.php';
                if (file_exists($file_path)) {
                    require_once $file_path;
                }
            }
        }

        public function enqueue_blocks_assets()
        {
            $script_asset_path = MAXI_PLUGIN_DIR_PATH . 'build/index.asset.php';
            if (!file_exists($script_asset_path)) {
                throw new Error( //phpcs:ignore
                    'You need to run `npm start` or `npm run build` for the "create-block/test-maxi-blocks" block first.'
                );
            }

            $index_js = 'build/index.js';
            $script_asset = require $script_asset_path;
            wp_register_script(
                'maxi-blocks-block-editor',
                plugins_url($index_js, dirname(__FILE__)),
                $script_asset['dependencies'],
                MAXI_PLUGIN_VERSION,
                true
            );

            $editor_css = 'build/index.css';
            wp_register_style(
                'maxi-blocks-block-editor',
                plugins_url($editor_css, dirname(__FILE__)),
                [],
                MAXI_PLUGIN_VERSION
            );

            register_block_type('maxi-blocks/block-settings', [
                'editor_script' => 'maxi-blocks-block-editor',
                'editor_style' => 'maxi-blocks-block-editor',
            ]);

            $style_css = 'build/style-index.css';
            wp_register_style(
                'maxi-blocks-block',
                plugins_url($style_css, dirname(__FILE__)),
                [],
                MAXI_PLUGIN_VERSION
            );
            wp_enqueue_style('maxi-blocks-block');
        }

        /**
         * Registers the block classes.
         */
        public function register_blocks()
        {
            foreach ($this->blocks_classes as $class) {
                $full_class_name = 'MaxiBlocks_' . $class;
                if (class_exists($full_class_name)) {
                    call_user_func([$full_class_name, 'register']);
                }
            }
        }

        public function maxi_add_image_taxonomy()
        {
            $labels = array(
            'name'              => __('Maxi Images', 'maxi-blocks'),
            'singular_name'     => __('maxi-image-type', 'maxi-blocks'),
            'search_items'      => __('Search Maxi Images', 'maxi-blocks'),
            'all_items'         => __('All Maxi Images', 'maxi-blocks'),
            'edit_item'         => __('Edit Maxi Image', 'maxi-blocks'),
            'update_item'       => __('Update Maxi Image', 'maxi-blocks'),
            'add_new_item'      => __('Add New Maxi Image', 'maxi-blocks'),
            'new_item_name'     => __('New Maxi Image Name', 'maxi-blocks'),
        );

            $args = array(
            'labels' => $labels,
            'hierarchical' => false,
            'query_var' => true,
            'rewrite' => true,
            'show_admin_column' => true,
            'show_in_menu' => false,
            'show_ui' => false,
            'show_in_rest' => true,
            'show_in_nav_menus' => false,
            'show_tagcloud'     => false,
            'show_in_quick_edit' => false,
            'meta_box_cb'       => false,
        );

            register_taxonomy('maxi-image-type', 'attachment', $args);
        }

        public function maxi_add_image_taxonomy_term()
        {
            if (!term_exists(__('Maxi Image', 'maxi-blocks'), 'maxi-image-type')) {
                wp_insert_term(
                    __('Maxi Image', 'maxi-blocks'),
                    'maxi-image-type',
                    array(
                      'description' => __('Images added by MaxiBlocks plugin', 'maxi-blocks'),
                      'slug'        => 'maxi-image'
                    )
                );
            }
        }

        public function maxi_block_category($categories)
        {
            return array_merge(
                [
                    [
                        'slug' => 'maxi-blocks',
                        'title' => __('MaxiBlocks', 'maxi-blocks'),
                    ],
                ],
                $categories
            );
        }

        public function maxi_add_sc_native_blocks($block_content, $block, $instance)
        {
            if (str_contains($block['blockName'] ?? '', 'core/') && isset($block_content) && !empty($block_content)) {
                // We create a new DOMDocument object
                $dom = new DOMDocument();
                @$dom->loadHTML(mb_convert_encoding($block_content, 'HTML-ENTITIES', 'UTF-8'), LIBXML_HTML_NOIMPLIED | LIBXML_HTML_NODEFDTD);

                // Using XPath to find the elements we want to change
                $xpath = new DOMXPath($dom);

                // Look for all elements
                $elements = $xpath->query('//*');

                // Check if elements are found
                if(isset($elements) && $elements->length > 0) {
                    // Pick the first element
                    $element = $elements[0];

                    // Check if the element is a DOMElement
                    if ($element instanceof DOMElement) {
                        $classes = $element->getAttribute('class');

                        if (!isset($classes) || empty($classes)) {
                            $element->setAttribute('class', 'maxi-block--use-sc');
                        } elseif (!str_contains($classes, 'maxi-block--use-sc')) {
                            $element->setAttribute('class', $classes . ' maxi-block--use-sc');
                        }
                    }

                    $block_content = $dom->saveHTML();
                }
            }

            return $block_content;
        }
    }
endif;
