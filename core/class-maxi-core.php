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
            add_filter(
                'admin_body_class',
                [$this, 'maxi_blocks_body_class'],
                99,
            );

            // Add fonts and editor-only CSS for both iframe and non-iframe editors
            add_action('enqueue_block_assets', function () {
                if (
                    !is_admin() &&
                    (!function_exists('wp_should_load_block_editor_scripts_and_styles') ||
                        !wp_should_load_block_editor_scripts_and_styles())
                ) {
                    return;
                }

                wp_enqueue_style('maxi-blocks-editor-font', esc_url(MAXI_PLUGIN_URL_PATH) . 'core/admin/fonts/inter/style.css');

                // Add inline CSS to hide resizable handles in Site Editor if option is enabled
                if (get_option('hide_fse_resizable_handles')) {
                    $custom_css = 'body.maxi-blocks--active .editor-resizable-editor__resize-handle { display: none !important; } body.maxi-blocks--active .editor-visual-editor.has-padding { padding: 0 !important; }';
                    wp_add_inline_style('maxi-blocks-editor-font', $custom_css);
                }

                // Add inline CSS to hide Gutenberg native responsive preview if option is enabled
                if (get_option('hide_gutenberg_responsive_preview')) {
                    $custom_css = 'body.maxi-blocks--active .components-dropdown.components-dropdown-menu.editor-preview-dropdown { display: none !important; }';
                    wp_add_inline_style('maxi-blocks-editor-font', $custom_css);
                }
            });

            // Add All Images - Maxi Images filter to the media library
            add_action('wp_enqueue_media', function () {
                if (term_exists('maxi-image', 'maxi-image-type')) {
                    wp_enqueue_script(
                        'maxi-media-images-filter',
                        plugin_dir_url(__DIR__) . 'js/mediaFilter.min.js',
                        ['media-editor', 'media-views'],
                        MAXI_PLUGIN_VERSION,
                        [
                            'strategy' => 'defer',
                            'in_footer' => true,
                        ],
                    );
                    wp_localize_script(
                        'maxi-media-images-filter',
                        'maxiImagesFilterTerms',
                        [
                            'terms' => get_terms('maxi-image-type'),
                        ],
                    );
                }
            });

            // Allow uploading common font mime types (TTF, OTF, WOFF, WOFF2)
            add_filter('upload_mimes', [$this, 'allow_font_mime_types']);

            // Ensure WordPress recognizes font file types properly during validation
            add_filter(
                'wp_check_filetype_and_ext',
                [$this, 'fix_font_filetype_and_ext'],
                10,
                5,
            );
        }

        public function maxi_blocks_body_class($classes)
        {
            $mb_class_accessibility_class = get_option('accessibility_option')
                ? ' maxi-blocks--accessibility '
                : '';
            $mb_class = " maxi-blocks--active $mb_class_accessibility_class";

            if (gettype($classes) === 'string') {
                $classes .= $mb_class;
            }
            if (gettype($classes) === 'array') {
                array_push($classes, $mb_class);
            }

            return $classes;
        }

        /**
         * Allow uploading font files via the Media Library.
         *
         * Adds support for TTF, OTF, WOFF and WOFF2 mime types.
         *
         * @param array $mimes Existing allowed mime types.
         *
         * @return array
         */
        public function allow_font_mime_types($mimes)
        {
            if (!current_user_can('upload_files')) {
                return $mimes;
            }

            // Map common font extensions to mime types
            // Using application/* types as they're more widely accepted
            $mimes['ttf'] = 'application/x-font-ttf';
            $mimes['otf'] = 'application/x-font-otf';
            $mimes['woff'] = 'application/font-woff';
            $mimes['woff2'] = 'application/font-woff2';

            return $mimes;
        }

        /**
         * Ensure WordPress detects the correct file type for font uploads.
         *
         * This completely bypasses WordPress MIME detection for font files
         * to avoid issues with different server configurations.
         *
         * @param array  $checked       Filetype data array.
         * @param string $file          Full path to the file.
         * @param string $filename      The name of the file (may differ from $file for temp files).
         * @param array  $mimes         Allowed mime types.
         * @param string $real_mime     The actual mime type from finfo.
         *
         * @return array
         */
        public function fix_font_filetype_and_ext(
            $checked,
            $file,
            $filename,
            $mimes,
            $real_mime = null
        ) {
            // Get file extension
            if (!$filename) {
                return $checked;
            }

            $file_ext = strtolower(pathinfo($filename, PATHINFO_EXTENSION));

            // Define allowed font extensions and their MIME types
            $font_types = [
                'ttf' => 'application/x-font-ttf',
                'otf' => 'application/x-font-otf',
                'woff' => 'application/font-woff',
                'woff2' => 'application/font-woff2',
            ];

            // If this is a font file, completely override the check
            // This bypasses WordPress's finfo_file check which can be unreliable for fonts
            if (isset($font_types[$file_ext])) {
                return [
                    'ext' => $file_ext,
                    'type' => $font_types[$file_ext],
                    'proper_filename' => false,
                ];
            }

            // For non-font files, return the original check
            return $checked;
        }
    }
endif;
