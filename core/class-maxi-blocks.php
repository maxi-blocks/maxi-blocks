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

            $style_cards = new MaxiBlocks_StyleCards();
            $current_style_cards = $style_cards->get_maxi_blocks_active_style_card();

            if($current_style_cards && array_key_exists('gutenberg_blocks_status', $current_style_cards) && $current_style_cards['gutenberg_blocks_status']) {
                add_filter("render_block", [$this, "maxi_add_sc_native_blocks"], 10, 3);
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
            require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block-factory.php';
            $block_factory = MaxiBlocks_BlockFactory::get_instance();
            $block_factory->create_all_blocks();
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
                // Use regular expression to find the first opening tag
                if (preg_match('/<[^>]+>/', $block_content, $matches)) {
                    $opening_tag = $matches[0];

                    // Check if the 'maxi-block--use-sc' class is already present
                    if (!str_contains($opening_tag, 'maxi-block--use-sc')) {
                        // Add the 'maxi-block--use-sc' class to the opening tag
                        $modified_tag = preg_replace(
                            '/class=(["\'])/',
                            'class=$1maxi-block--use-sc ',
                            $opening_tag,
                            1
                        );

                        // If the class attribute doesn't exist, add it
                        if ($modified_tag === $opening_tag) {
                            $modified_tag = str_replace(
                                '>',
                                ' class="maxi-block--use-sc">',
                                $opening_tag
                            );
                        }

                        // Replace the opening tag in the block content
                        $block_content = str_replace($opening_tag, $modified_tag, $block_content);
                    }
                }
            }

            return $block_content;
        }
    }
endif;
