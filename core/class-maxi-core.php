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

// define('MAXI_PLUGIN_DIR_PATH', plugin_dir_path(__FILE__));

if (!class_exists('MaxiBlocks_Core')):
    class MaxiBlocks_Core
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Core
         */
        private static $instance;

        /**
         * Registers the plugin.
         */
        public static function register()
        {
            if (null === self::$instance) {
                self::$instance = new MaxiBlocks_Core();
            }
        }

        /**
         * Constructor.
         */
        public function __construct()
        {

            // Add MaxiBlocks classes on body element
            add_filter('body_class', [$this, 'maxi_blocks_body_class'], 99);
            add_filter('admin_body_class', [$this, 'maxi_blocks_body_class'], 99);

            // Add fonts for the editor
            add_action('enqueue_block_editor_assets', function () {
                wp_enqueue_style('maxi-blocks-editor-font', esc_url(MAXI_PLUGIN_URL_PATH) . 'core/admin/fonts/inter/style.css');
            });

            // Add All Images - Maxi Images filter to the media library
            add_action('wp_enqueue_media', function () {
                if (term_exists('maxi-image', 'maxi-image-type')) {
                    wp_enqueue_script(
                        'maxi-media-images-filter',
                        plugin_dir_url(__DIR__) . 'js/mediaFilter.min.js',
                        array(
                            'media-editor',
                            'media-views'
                        ),
                        MAXI_PLUGIN_VERSION,
                        array(
                            'strategy'  => 'defer', 'in_footer' => true
                            )
                    );
                    wp_localize_script(
                        'maxi-media-images-filter',
                        'maxiImagesFilterTerms',
                        array(
                            'terms' => get_terms('maxi-image-type'),
                        )
                    );
                }
            });
        }


        public function maxi_blocks_body_class($classes)
        {
            $mb_class_accessibility_class = get_option('accessibility_option') ? ' maxi-blocks--accessibility ' : '';
            $mb_class = " maxi-blocks--active $mb_class_accessibility_class";

            if (gettype($classes) === 'string') {
                $classes .= $mb_class;
            }
            if (gettype($classes) === 'array') {
                array_push($classes, $mb_class);
            }

            return $classes;
        }
    }
endif;
