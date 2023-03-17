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
