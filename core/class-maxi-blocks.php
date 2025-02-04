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

            // Always enqueue in admin
            if (is_admin()) {
                add_action('init', [$this, 'enqueue_blocks_assets']);
            } else {
                // For frontend, check for blocks after post is loaded
                add_action('wp', function () {
                    if (self::has_blocks()) {
                        $this->enqueue_blocks_assets();
                    }
                });
            }

            // Enqueue blocks
            add_action('init', [$this, 'register_blocks']);

            // Register MaxiBlocks attachment taxonomy and terms
            add_action('init', [$this, 'maxi_add_image_taxonomy']);
            add_action('init', [$this, 'maxi_add_image_taxonomy_term']);

            // Register MaxiBlocks category
            add_filter('block_categories_all', [$this, 'maxi_block_category']);

            $style_cards = new MaxiBlocks_StyleCards();
            $current_style_cards = $style_cards->get_maxi_blocks_active_style_card();

            if (
                $current_style_cards &&
                array_key_exists(
                    'gutenberg_blocks_status',
                    $current_style_cards,
                ) &&
                $current_style_cards['gutenberg_blocks_status']
            ) {
                add_filter(
                    'render_block',
                    [$this, 'maxi_add_sc_native_blocks'],
                    10,
                    3,
                );
            }
        }

        /**
         * Includes all the block classes.
         */
        private function include_block_classes()
        {
            foreach ($this->blocks_classes as $class) {
                $file_path =
                    MAXI_PLUGIN_DIR_PATH .
                    'core/blocks/class-' .
                    strtolower(str_replace('_', '-', $class)) .
                    '.php';
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
                    'You need to run `npm start` or `npm run build` for the "create-block/test-maxi-blocks" block first.',
                );
            }

            $index_js = 'build/index.js';
            $script_asset = require $script_asset_path;
            wp_register_script(
                'maxi-blocks-block-editor',
                plugins_url($index_js, dirname(__FILE__)),
                $script_asset['dependencies'],
                MAXI_PLUGIN_VERSION,
                true,
            );

            // Localize the script with our data
            wp_localize_script(
                'maxi-blocks-block-editor',
                'maxiBlocksMain',
                array(
                    'local_fonts' => get_option('local_fonts'),
                    'bunny_fonts' => get_option('bunny_fonts'),
                )
            );

            $editor_css = 'build/index.css';
            wp_register_style(
                'maxi-blocks-block-editor',
                plugins_url($editor_css, dirname(__FILE__)),
                [],
                MAXI_PLUGIN_VERSION,
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
                MAXI_PLUGIN_VERSION,
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
            $labels = [
                'name' => __('Maxi Images', 'max-blocks'),
                'singular_name' => __('maxi-image-type', 'max-blocks'),
                'search_items' => __('Search Maxi Images', 'max-blocks'),
                'all_items' => __('All Maxi Images', 'max-blocks'),
                'edit_item' => __('Edit Maxi Image', 'max-blocks'),
                'update_item' => __('Update Maxi Image', 'max-blocks'),
                'add_new_item' => __('Add New Maxi Image', 'max-blocks'),
                'new_item_name' => __('New Maxi Image Name', 'max-blocks'),
            ];

            $args = [
                'labels' => $labels,
                'hierarchical' => false,
                'query_var' => true,
                'rewrite' => true,
                'show_admin_column' => true,
                'show_in_menu' => false,
                'show_ui' => false,
                'show_in_rest' => true,
                'show_in_nav_menus' => false,
                'show_tagcloud' => false,
                'show_in_quick_edit' => false,
                'meta_box_cb' => false,
            ];

            register_taxonomy('maxi-image-type', 'attachment', $args);
        }

        public function maxi_add_image_taxonomy_term()
        {
            if (
                !term_exists(__('Maxi Image', 'max-blocks'), 'maxi-image-type')
            ) {
                wp_insert_term(
                    __('Maxi Image', 'max-blocks'),
                    'maxi-image-type',
                    [
                        'description' => __(
                            'Images added by MaxiBlocks plugin',
                            'max-blocks',
                        ),
                        'slug' => 'maxi-image',
                    ],
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
                $categories,
            );
        }

        public function maxi_add_sc_native_blocks(
            $block_content,
            $block,
            $instance
        ) {
            if (
                str_contains($block['blockName'] ?? '', 'core/') &&
                isset($block_content) &&
                !empty($block_content)
            ) {
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
                            1,
                        );

                        // If the class attribute doesn't exist, add it
                        if ($modified_tag === $opening_tag) {
                            $modified_tag = str_replace(
                                '>',
                                ' class="maxi-block--use-sc">',
                                $opening_tag,
                            );
                        }

                        // Replace the opening tag in the block content
                        $block_content = str_replace(
                            $opening_tag,
                            $modified_tag,
                            $block_content,
                        );
                    }
                }
            }

            return $block_content;
        }

        /**
         * Get block template parts for the current page
         *
         * @return array Array of template part objects
         */
        private function get_block_template_parts()
        {
            if (!wp_is_block_theme()) {
                return [];
            }

            $template_parts = [];

            // Get current template type
            $current_template_type = $this->get_current_template_type();

            $archive_templates = [
                'archive',
                'category',
                'tag',
                'author',
                'date',
            ];

            // Add the specific template for current page
            if ($current_template_type) {
                $template = get_block_template(
                    get_stylesheet() . '//' . $current_template_type,
                );
                if ($template && !empty($template->content)) {
                    $template_parts[] = $template;

                    // Parse template content for additional template parts
                    preg_match_all(
                        '/wp:template-part\s+({[^}]+})/',
                        $template->content,
                        $matches,
                    );

                    if (!empty($matches[1])) {
                        foreach ($matches[1] as $json_string) {
                            $template_part_data = json_decode(
                                $json_string,
                                true,
                            );
                            if (
                                $template_part_data &&
                                isset($template_part_data['slug'])
                            ) {
                                $part = get_block_template(
                                    get_stylesheet() .
                                        '//' .
                                        $template_part_data['slug'],
                                    'wp_template_part',
                                );
                                if ($part && !empty($part->content)) {
                                    $template_parts[] = $part;
                                }
                            }
                        }
                    }
                } else {
                    if (in_array($current_template_type, $archive_templates)) {
                        $template = get_block_template(
                            get_stylesheet() . '//archive',
                        );
                        if ($template && !empty($template->content)) {
                            $template_parts[] = $template;
                        }
                    }
                }
            }

            return $template_parts;
        }

        /**
         * Get the current template type based on WordPress template hierarchy
         *
         * @return string|null Template type
         */
        private function get_current_template_type()
        {
            if (get_page_template_slug()) {
                return get_page_template_slug();
            }
            if (is_front_page() && is_home()) {
                return 'index';
            } elseif (is_front_page()) {
                return 'front-page';
            } elseif (is_home()) {
                return 'home';
            } elseif (is_single()) {
                return 'single';
            } elseif (is_page()) {
                return 'page';
            } elseif (is_archive()) {
                if (is_category()) {
                    return 'category';
                } elseif (is_tag()) {
                    return 'tag';
                } elseif (is_author()) {
                    return 'author';
                } elseif (is_date()) {
                    return 'date';
                }
                return 'archive';
            } elseif (is_search()) {
                return 'search';
            } elseif (is_404()) {
                return '404';
            }

            return 'index';
        }

        /**
         * Check if content contains any Maxi blocks within reusable blocks
         *
         * @param string $content The content to check
         * @return boolean True if Maxi blocks found in reusable blocks
         */
        private function has_maxi_in_reusable_blocks($content)
        {
            // Get all reusable block IDs
            preg_match_all(
                '/wp:block\s*{\s*"ref"\s*:\s*(\d+)}/',
                $content,
                $matches,
            );
            $block_ids = $matches[1] ?? [];

            if (empty($block_ids)) {
                return false;
            }

            // Check each reusable block for Maxi blocks
            foreach ($block_ids as $block_id) {
                $block_post = get_post($block_id);
                if (
                    $block_post &&
                    strpos($block_post->post_content, 'wp:maxi-blocks/') !==
                        false
                ) {
                    return true;
                }
            }

            return false;
        }

        /**
         * Check if the current post/page contains Maxi blocks
         *
         * @return boolean
         */
        public static function has_blocks()
        {
            $has_blocks = false;
            $instance = new self();

            // First check template parts if using block theme
            if (wp_is_block_theme()) {
                $template_parts = $instance->get_block_template_parts();
                foreach ($template_parts as $template_part) {
                    if (!empty($template_part->content)) {
                        if (
                            strpos(
                                $template_part->content,
                                'wp:maxi-blocks/',
                            ) !== false ||
                            $instance->has_maxi_in_reusable_blocks(
                                $template_part->content,
                            )
                        ) {
                            $has_blocks = true;
                            break;
                        }
                    }
                }
            }

            // If no blocks found in templates, check main content
            if (!$has_blocks) {
                global $post;
                if ($post && !empty($post->post_content)) {
                    $has_blocks =
                        strpos($post->post_content, 'wp:maxi-blocks/') !==
                        false;
                    if (!$has_blocks) {
                        $has_blocks = $instance->has_maxi_in_reusable_blocks(
                            $post->post_content,
                        );
                    }
                }
            }

            return $has_blocks;
        }
    }
endif;
