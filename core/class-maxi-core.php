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
            // Enqueue scripts and styles
            add_action('wp_enqueue_scripts', [$this, 'enqueue_scripts_styles']);

            // Add MaxiBlocks classes on body element
            add_filter('body_class', [$this, 'maxi_blocks_body_class'], 99);
            add_filter('admin_body_class', [$this, 'maxi_blocks_body_class'], 99);

            // Add All Images - Maxi Images filter to the media library
            add_action('wp_enqueue_media', function () {
                if (term_exists('maxi-image', 'maxi-image-type')) {
                    wp_enqueue_script('maxi-media-images-filter', plugin_dir_url(__DIR__) . 'js/mediaFilter.js', array( 'media-editor', 'media-views' ));
                    wp_localize_script('maxi-media-images-filter', 'maxiImagesFilterTerms', array(
                    'terms'     => get_terms('maxi-image-type', array( 'hide_empty' => false )),
                ));
                }
            });
        }

        public function enqueue_scripts_styles()
        {
            wp_enqueue_script(
                'maxi-waypoints-js',
                plugins_url('/js/waypoints.min.js', dirname(__FILE__)),
            );

            wp_enqueue_script(
                'maxi-map',
                plugins_url('/js/maxi-map.js', dirname(__FILE__)),
                [],
                false,
                true,
            );

            wp_localize_script(
                'maxi-map',
                'google_map_api_options',
                array(
                    'google_api_key' => get_option('google_api_key_option'),
                )
            );
            
            wp_enqueue_script(
                'maxi-hover-effects',
                plugins_url('/js/maxi-hover-effects.js', dirname(__FILE__)),
            );

            wp_enqueue_script(
                'maxi-number-counter',
                plugins_url('/js/maxi-number-counter.js', dirname(__FILE__)),
            );

            wp_enqueue_script(
                'maxi-bg-video',
                plugins_url('/js/maxi-bg-video.js', dirname(__FILE__)),
            );

            wp_enqueue_script(
                'maxi-parallax',
                plugins_url('/js/maxi-parallax.js', dirname(__FILE__)),
            );
           
            wp_enqueue_script(
                'maxi-scroll',
                plugins_url('/js/maxi-scroll-effects.js', dirname(__FILE__)),
            );
        }

        public function maxi_blocks_body_class($classes)
        {
            $MBClassAccessibilityClass = get_option('accessibility_option') ? ' maxi-blocks--accessibility ' : '';
            $MBClass = " maxi-blocks--active $MBClassAccessibilityClass";

            if (gettype($classes) === 'string') {
                $classes .= $MBClass;
            }
            if (gettype($classes) === 'array') {
                array_push($classes, $MBClass);
            }

            return $classes;
        }
    }
endif;