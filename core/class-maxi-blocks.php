<?php
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

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-group-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-container-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-row-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-column-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-accordion-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-pane-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-button-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-divider-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-image-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-svg-icon-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-text-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-video-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-number-counter-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-search-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-map-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-slide-maxi-block.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-slider-maxi-block.php';

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
            // Enqueue blocks styles and scripts
            add_action('init', [$this, 'enqueue_blocks_assets']);

            // Enqueue blocks
            add_action('init', [$this, 'register_blocks']);

            // Register MaxiBlocks attachment taxonomy and terms
            add_action('init', [$this,'maxi_add_image_taxonomy']);
            add_action('init', [$this,'maxi_add_image_taxonomy_term']);

            // Register MaxiBlocks category
            add_filter('block_categories_all', [$this, 'maxi_block_category']);
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
                $script_asset['version']
            );

            $editor_css = 'build/index.css';
            wp_register_style(
                'maxi-blocks-block-editor',
                plugins_url($editor_css, dirname(__FILE__)),
                [],
                filemtime(MAXI_PLUGIN_DIR_PATH . "/$editor_css")
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
                filemtime(MAXI_PLUGIN_DIR_PATH . "/$style_css")
            );
            wp_enqueue_style('maxi-blocks-block');
        }

        public function register_blocks()
        {
            if (class_exists('MaxiBlocks_Group_Maxi_Block')) {
                MaxiBlocks_Group_Maxi_Block::register();
            }
            if (class_exists('MaxiBlocks_Container_Maxi_Block')) {
                MaxiBlocks_Container_Maxi_Block::register();
            }
            if (class_exists('MaxiBlocks_Row_Maxi_Block')) {
                MaxiBlocks_Row_Maxi_Block::register();
            }
            if (class_exists('MaxiBlocks_Column_Maxi_Block')) {
                MaxiBlocks_Column_Maxi_Block::register();
            }
            if (class_exists('MaxiBlocks_Accordion_Maxi_Block')) {
                MaxiBlocks_Accordion_Maxi_Block::register();
            }
            if (class_exists('MaxiBlocks_Pane_Maxi_Block')) {
                MaxiBlocks_Pane_Maxi_Block::register();
            }
            if (class_exists('MaxiBlocks_Button_Maxi_Block')) {
                MaxiBlocks_Button_Maxi_Block::register();
            }
            if (class_exists('MaxiBlocks_Divider_Maxi_Block')) {
                MaxiBlocks_Divider_Maxi_Block::register();
            }
            if (class_exists('MaxiBlocks_Image_Maxi_Block')) {
                MaxiBlocks_Image_Maxi_Block::register();
            }
            if (class_exists('MaxiBlocks_SVG_Icon_Maxi_Block')) {
                MaxiBlocks_SVG_Icon_Maxi_Block::register();
            }
            if (class_exists('MaxiBlocks_Text_Maxi_Block')) {
                MaxiBlocks_Text_Maxi_Block::register();
            }
            if (class_exists('MaxiBlocks_Video_Maxi_Block')) {
                MaxiBlocks_Video_Maxi_Block::register();
            }
            if (class_exists('MaxiBlocks_Number_Counter_Maxi_Block')) {
                MaxiBlocks_Number_Counter_Maxi_Block::register();
            }
            if (class_exists('MaxiBlocks_Search_Maxi_Block')) {
                MaxiBlocks_Search_Maxi_Block::register();
            }
            if (class_exists('MaxiBlocks_Map_Maxi_Block')) {
                MaxiBlocks_Map_Maxi_Block::register();
            }
        }

        public function maxi_add_image_taxonomy()
        {
            $labels = array(
            'name'              => __('Maxi Images', 'max-blocks'),
            'singular_name'     => __('maxi-image-type', 'max-blocks'),
            'search_items'      => __('Search Maxi Images', 'max-blocks'),
            'all_items'         => __('All Maxi Images', 'max-blocks'),
            'edit_item'         => __('Edit Maxi Image', 'max-blocks'),
            'update_item'       => __('Update Maxi Image', 'max-blocks'),
            'add_new_item'      => __('Add New Maxi Image', 'max-blocks'),
            'new_item_name'     => __('New Maxi Image Name', 'max-blocks'),
        );

            $args = array(
            'labels' => $labels,
            'hierarchical' => false,
            'query_var' => true,
            'rewrite' => true,
            'show_admin_column' => true,
            'show_in_menu' => false,
            'show_ui' => false,
            'show_in_rest' => true
        );

            register_taxonomy('maxi-image-type', 'attachment', $args);
        }

        public function maxi_add_image_taxonomy_term()
        {
            if (!term_exists(__('Maxi Image', 'max-blocks'), 'maxi-image-type')) {
                wp_insert_term(
                    __('Maxi Image', 'max-blocks'),
                    'maxi-image-type',
                    array(
                      'description' => __('Images added by Maxi Blocks plugin', 'max-blocks'),
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
                        'title' => __('Maxi Blocks', 'maxi-blocks'),
                    ],
                ],
                $categories
            );
        }
    }
endif;
