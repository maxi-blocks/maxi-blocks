<?php
/**
 * MaxiBlocks Maxi Styles Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-style-cards.php';

$coreClasses = [
    'class-maxi-local-fonts',
    'class-maxi-style-cards',
    'class-maxi-api',
    'blocks/utils/get_all_fonts',
];

foreach ($coreClasses as $coreClass) {
    require_once MAXI_PLUGIN_DIR_PATH . 'core/' . $coreClass . '.php';
}

class MaxiBlocks_Styles
{
    /**
     * This plugin's instance.
     *
     * @var MaxiBlocks_Styles
     */
    private static $instance;
    private static $active_theme;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_Styles();
        }
        if (null === self::$active_theme) {
            self::$active_theme = self::get_active_theme();
        }
    }

    protected $max_execution_time;


    /**
     * Constructor
     */
    public function __construct()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'maxi_blocks_styles';

        add_filter('duplicate_post_new_post', [$this, 'update_post_unique_ids'], 10, 2);

        // Wrap the has_blocks check in wp action to ensure content is available
        add_action('wp', function () use ($wpdb, $table_name) {
            if (class_exists('MaxiBlocks_Blocks') && MaxiBlocks_Blocks::has_blocks()) {
                if ($wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table_name)) == $table_name) {
                    add_action('wp_enqueue_scripts', [$this, 'enqueue_styles']);  // legacy code
                }

                if (self::should_apply_content_filter()) {
                    add_filter('wp_enqueue_scripts', [$this, 'process_content_frontend']);
                }
            }
        });

        $this->max_execution_time = ini_get('max_execution_time');

        if (!get_option('maxi_blocks_sc_fonts_migration_done')) {
            if (!wp_next_scheduled('maxi_blocks_migrate_sc_fonts')) {
                // Schedule the migration to run in the background
                wp_schedule_single_event(time(), 'maxi_blocks_migrate_sc_fonts');
            }
        }

        add_action('maxi_blocks_migrate_sc_fonts', [$this, 'run_migrate_sc_fonts']);
    }

    private function should_apply_content_filter()
    {
        // Check if the REQUEST_URI contains context=edit
        if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'context=edit') !== false) {
            return false; // Do not apply the filter for this context
        }

        return true; // Apply the filter in other cases
    }

    /**
     * Legacy function
     * Get block data
     */
    public function get_block_data($js_var, $meta)
    {
        switch ($js_var) {
            case 'search':
                return [$meta, home_url('/') . '?s='];
                break;
            case 'map':
                return [$meta, get_option('google_api_key_option')];
                break;
            default:
                return [$meta];
                break;
        }
    }

    /**
     * Legacy function
     * Enqueuing styles
     */

    public function enqueue_styles()
    {

        $post_id = $this->get_id();
        $post_content = $this->get_content(false, $post_id);
        $this->apply_content('maxi-blocks-styles', $post_content, $post_id);

        $template_id = $this->get_id(true);
        $template_content = $this->get_content(true, $template_id);
        $this->apply_content('maxi-blocks-styles-templates', $template_content, $template_id);

        if ($this->need_custom_meta([['content' => $post_content], ['content' => $template_content, 'is_template' => true]])) {
            $scripts = [
                'hover-effects',
                'bg-video',
                'parallax',
                'scroll-effects',
                'number-counter',
                'shape-divider',
                'relations',
                'video',
                'search',
                'map',
                'accordion',
                'slider',
                'email-obfuscate'
            ];

            $template_parts = $this->get_template_parts($template_content);

            foreach ($scripts as &$script) {
                $js_var = str_replace('-', '_', $script);
                $js_var_to_pass = $script === 'relations' ? 'maxi' .
                    str_replace(
                        ' ',
                        '',
                        ucwords(str_replace('-', ' ', $script))
                    ).'Legacy' : 'maxi' .
                    str_replace(
                        ' ',
                        '',
                        ucwords(str_replace('-', ' ', $script))
                    );

                $js_script_name = 'maxi-' . $script;
                $js_script_path = '//js//min//' . $js_script_name . '.min.js';
                // $js_script_path = '//js//' . $js_script_name . '.js';

                $post_meta = $this->custom_meta($js_var, false);
                $template_meta = $this->custom_meta($js_var, true);
                $template_parts_meta = [];

                if ($template_parts && !empty($template_parts)) {
                    foreach ($template_parts as $template_part_id) {
                        $template_parts_meta = array_merge($template_parts_meta, $this->custom_meta($js_var, true, $template_part_id));
                    }
                }

                $meta = array_merge($post_meta, $template_meta, $template_parts_meta);

                if (!empty($meta)) {
                    if ($script === 'number-counter') {
                        wp_enqueue_script(
                            'maxi-waypoints-js',
                            plugins_url(
                                '/js/waypoints.min.js',
                                dirname(__FILE__)
                            ),
                            array(),
                            MAXI_PLUGIN_VERSION,
                            true
                        );
                    }

                    wp_enqueue_script(
                        $script === 'relations' ? $js_script_name.'-legacy' : $js_script_name,
                        plugins_url($js_script_path, dirname(__FILE__)),
                        array(),
                        MAXI_PLUGIN_VERSION,
                        true
                    );

                    wp_localize_script($script === 'relations' ? $js_script_name.'-legacy' : $js_script_name, $js_var_to_pass, $this->get_block_data($js_var, $meta));
                }
            }
        }
    }

    // Legacy function
    public function get_template_name()
    {
        $template_name = wp_get_theme()->stylesheet ?? get_template();

        return $template_name;
    }

    // Legacy function
    public function get_template_parts($content)
    {
        if ($content && array_key_exists('template_parts', $content)) {
            $template_parts = json_decode($content['template_parts'], true);
            if (!empty($template_parts)) {
                return $template_parts;
            }
        }

        /**
         * In case, when template has never been opened in FSE, it hadn't been saved in DB,
         * so it doesn't have template parts. In this case, we need to get default
         * template parts (header and footer).
         */
        $theme_name = $this->get_template_name();
        return [
            $theme_name . '//header',
            $theme_name . '//footer',
        ];
    }

    /**
     * Legacy function
     * Apply content
     */
    public function apply_content(string $name, $content, $id)
    {
        $is_content = $content && !empty($content);
        $is_template_part = is_string($name) && strpos($name, '-templates');
        $is_template = $is_template_part && str_ends_with($name, '-templates');

        if ($is_content) {
            $styles = $this->get_styles($content);
            $fonts = $this->get_fonts($content);

            if ($styles) {
                // Inline styles
                wp_register_style($name, false, [], MAXI_PLUGIN_VERSION);
                wp_enqueue_style($name);
                wp_add_inline_style($name, $styles);
            }

            if ($fonts) {
                $this->enqueue_fonts($fonts, $name);
            }
        } elseif ($this->get_template_name() === 'maxi-theme' && $is_template_part) {
            do_action('maxi_enqueue_template_styles', $name, $id, $is_template);
        }

        if ($is_template) {
            $template_parts = $this->get_template_parts($content);

            if ($template_parts && !empty($template_parts)) {
                foreach ($template_parts as $template_part) {
                    $template_part_name = 'maxi-blocks-style-templates-' . @end(explode('//', $template_part, 2));
                    $this->apply_content($template_part_name, $this->get_content(true, $template_part), $template_part);
                }
            }
        }
    }

    /**
     * Legacy function
     * Get id
     */
    public function get_id(bool $is_template = false)
    {
        if (!$is_template) {
            global $post;

            if (!$post) {
                return null;
            }

            return $post->ID;
        }

        $template_slug = get_page_template_slug();
        $template_id = $this->get_template_name() . '//';

        if (!is_archive() && $template_slug != '' && $template_slug !== false) {
            if (is_search()) {
                $template_id .= 'search';
            } else {
                $template_id .= $template_slug;
            }
        } elseif (is_home() || is_front_page()) {
            $block_templates = get_block_templates(['slug__in' => ['index', 'front-page', 'home']]);

            $has_front_page_and_home = count($block_templates) > 2;

            if ($has_front_page_and_home) {
                if (is_home() && !is_front_page()) {
                    $template_id .= 'home';
                } else {
                    $template_id .= in_array('front-page', array_column($block_templates, 'slug')) ? 'front-page' : 'home';
                }
            } else {
                // Arrived here, means we are probably trying to get index.php; so if the slug is not coming from $block_templates,
                // we need to start going down on the WP hierarchy to find the correct template.
                // TODO: create a better way to get the correct template.
                if ($block_templates && !empty($block_templates)) {
                    $template_id .= $block_templates[0]->slug;
                } elseif (is_search()) {
                    $template_id .= 'search';
                } elseif (is_404()) {
                    $template_id .= '404';
                } elseif (is_archive()) {
                    $template_id .= 'archive';
                } elseif (is_page()) {
                    $template_id .= 'page';
                } else {
                    $template_id .= 'single';
                }
            }
        } elseif (is_search()) {
            $template_id .= 'search';
        } elseif (is_404()) {
            $template_id .= '404';
        } elseif (is_category()) {
            $template_id .= 'category';
        } elseif (is_tag()) {
            $template_id .= 'tag';
        } elseif (is_author()) {
            $template_id .= 'author';
        } elseif (is_date()) {
            $template_id .= 'date';
        } elseif (is_tax()) {
            // It's a custom taxonomy archive
            $taxonomy = get_queried_object();
            $template_id .= 'taxonomy-' . $taxonomy->taxonomy;
        } elseif (is_archive()) {
            $template_id .= 'archive';
        } elseif (is_page()) {
            $template_id .= 'page';
        } else {
            $template_id .= 'single';
        }

        return $template_id;
    }

    /**
     * Legacy function
     * Get need custom meta
    */
    public function need_custom_meta($contents)
    {
        $need_custom_meta = false;

        if ($contents) {
            foreach ($contents as $contentData) {
                $content = $contentData['content'] ?? null;
                $is_template = $contentData['is_template'] ?? false;
                $is_template_part = $contentData['is_template_part'] ?? false;

                if ($content) {
                    if (
                        ((isset($content['prev_active_custom_data']) && (int) $content['prev_active_custom_data'] === 1) ||
                        (isset($content['active_custom_data']) && (int) $content['active_custom_data'] === 1))
                    ) {
                        $need_custom_meta = true;
                        break;
                    }
                }

                if ($is_template && !$is_template_part) {
                    $template_parts = $this->get_template_parts($content);

                    if ($template_parts) {
                        foreach ($template_parts as $template_part) {
                            $template_part_content = $this->get_content(true, $template_part);
                            if ($template_part_content && $this->need_custom_meta([['content' => $template_part_content, 'is_template_part' => true]])) {
                                $need_custom_meta = true;
                                break;
                            }
                        }
                    }
                }
            }
        }

        return $need_custom_meta;
    }

    /**
     * Legacy function
     * Gets content
     */
    public function get_content(bool $is_template = false, $id = null)
    {
        global $post;

        if (!$is_template && (!$post || !isset($post->ID))) {
            return false;
        }

        if (!$id) {
            return false;
        }

        global $wpdb;
        $content_array = [];
        if ($is_template) {
            // Prepare and execute the query for templates
            $content_array = (array) $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}maxi_blocks_styles_templates WHERE template_id = %s",
                    $id
                ),
                OBJECT
            );
        } else {
            // Prepare and execute the query for posts
            $content_array = (array) $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}maxi_blocks_styles WHERE post_id = %d",
                    $id
                ),
                OBJECT
            );
        }

        if (!$content_array || empty($content_array)) {
            return false;
        }

        $content = $content_array[0];

        if (!$content || empty($content)) {
            return false;
        }

        return json_decode(wp_json_encode($content), true);
    }

    /**
     * Legacy function
     * Gets post meta
     */
    public function get_meta($id, bool $is_template = false)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'maxi_blocks_custom_data' . ($is_template ? '_templates' : '');

        if ($wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table_name)) == $table_name) {
            global $post;

            if ((!$is_template && (!$post || !isset($post->ID))) || !$id) {
                return false;
            }

            $response = '';
            if ($is_template) {
                // Prepare and execute the query for templates
                $response = $wpdb->get_results(
                    $wpdb->prepare(
                        "SELECT custom_data_value FROM {$wpdb->prefix}maxi_blocks_custom_data_templates WHERE template_id = %s",
                        $id
                    ),
                    OBJECT
                );
            } else {
                // Prepare and execute the query for posts
                $response = $wpdb->get_results(
                    $wpdb->prepare(
                        "SELECT custom_data_value FROM {$wpdb->prefix}maxi_blocks_custom_data WHERE post_id = %d",
                        $id
                    ),
                    OBJECT
                );
            }

            if (!$response) {
                $response = '';
            }

            return $response;
        }
    }

    /**
     * Legacy function
     * Gets post styles content
     */
    public function get_styles(array $content)
    {
        $style =
            is_preview() || is_admin()
                ? $content['prev_css_value']
                : $content['css_value'];

        if (!$style || empty($style)) {
            return false;
        }

        $style = $this->update_color_palette_backups($style);

        return $style;
    }

    /**
     * Legacy function
     * Gets font styles content
     */
    public function get_fonts(array $content)
    {
        if (!isset($content['fonts_value'])) {
            return false;
        }
        $fonts =
            is_preview() || is_admin()
                ? $content['prev_fonts_value']
                : $content['fonts_value'];

        if (!$fonts || empty($fonts)) {
            return false;
        }

        return json_decode($fonts, true);
    }

    /**
     * Legacy function
     * Returns default breakpoints values in case breakpoints are not set
     */
    public function get_breakpoints($breakpoints)
    {

        // TODO: It may connect to the API to centralize the default values there
        return (object) [
            'xs' => 480,
            's' => 767,
            'm' => 1024,
            'l' => 1366,
            'xl' => 1920,
        ];
    }

    /**
     * Legacy function
     * Check font url status code with caching
     */
    public function check_font_url($font_url)
    {
        // OPTIMIZATION: Add static cache to avoid repeated HTTP requests
        static $font_url_cache = [];

        $font_url = str_replace(' ', '+', $font_url);

        // Check cache first
        if (isset($font_url_cache[$font_url])) {
            return $font_url_cache[$font_url];
        }

        // OPTIMIZATION: Try cURL first (often faster than get_headers)
        if (function_exists('curl_init')) {
            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $font_url);
            curl_setopt($ch, CURLOPT_NOBODY, true); // HEAD request
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
            curl_setopt($ch, CURLOPT_TIMEOUT, 1); // 1 second timeout
            curl_setopt($ch, CURLOPT_CONNECTTIMEOUT, 1); // 1 second connection timeout
            curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
            curl_setopt($ch, CURLOPT_MAXREDIRS, 3);
            curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Skip SSL verification for speed

            $result = curl_exec($ch);
            $http_code = curl_getinfo($ch, CURLINFO_HTTP_CODE);
            curl_close($ch);

            $is_valid = ($http_code == 200);
            $font_url_cache[$font_url] = $is_valid;

            return $is_valid;
        }

        // Fallback to get_headers if cURL not available
        $context = stream_context_create([
            'http' => [
                'method' => 'HEAD',
                'timeout' => 1, // Reduced timeout
                'ignore_errors' => true
            ]
        ]);

        $headers = @get_headers($font_url, 0, $context);

        if (!$headers) {
            $font_url_cache[$font_url] = false;
            return false;
        }

        $string = $headers[0];

        $result = strpos($string, '200') !== false;
        $font_url_cache[$font_url] = $result;

        return $result;
    }

    /**
     * Legacy function
     * Post fonts
     *
     * @return object   Font name with font options
     */
    public function enqueue_fonts($fonts, $name)
    {
        if (empty($fonts) || !is_array($fonts)) {
            return;
        }

        foreach ($fonts as $font => $values) {
            foreach ($values as $attribute => $value) {
                if (is_array($value)) {
                    $fonts[$font][$attribute] = array_values(array_unique($value))[0];
                }
            }
        }

        if (str_contains($name, '-templates-')) {
            $pattern = '/(-templates-)(\w*)/';
            $name = preg_replace($pattern, '', $name);
            $name = str_replace('style', 'styles', $name);
        }

        $use_local_fonts = (bool) get_option('local_fonts');
        $use_bunny_fonts = (bool) get_option('bunny_fonts');
        $font_api_url = $use_bunny_fonts ? 'https://fonts.bunny.net' : 'https://fonts.googleapis.com';

        $consolidated_fonts = [];

        // First pass: consolidate fonts with multiple weights
        foreach ($fonts as $font => $font_data) {
            $is_sc_font = strpos($font, 'sc_font') !== false;

            if ($is_sc_font) {
                $split_font = explode('_', str_replace('sc_font_', '', $font));
                $block_style = $split_font[0];
                $text_level = $split_font[1];

                if (class_exists('MaxiBlocks_StyleCards')) {
                    $sc_fonts = MaxiBlocks_StyleCards::get_maxi_blocks_style_card_fonts($block_style, $text_level);
                    @list($font, $font_weights, $font_styles) = $sc_fonts;
                }

                // If style card doesn't return a valid font, skip this sc_font entry
                if (empty($font) || $font === null) {
                    continue;
                }

                if (isset($font_data['weight']) && !in_array($font_data['weight'], $font_weights)) {
                    $font_weights = [[...$font_weights, intval($font_data['weight'])]];
                }

                if (isset($font_data['style']) && !in_array($font_data['style'], $font_styles)) {
                    $font_styles = [[...$font_styles, intval($font_data['style'])]];
                }
            }

            if ($font) {
                // Consolidate fonts by family name
                if (!isset($consolidated_fonts[$font])) {
                    $consolidated_fonts[$font] = [
                        'weights' => [],
                        'styles' => [],
                        'is_sc_font' => $is_sc_font
                    ];
                }

                // Add weights and styles to consolidated array
                $weights = isset($font_data['weight']) ? explode(',', $font_data['weight']) : ['400'];
                $styles = isset($font_data['style']) ? [$font_data['style']] : ['normal'];

                foreach ($weights as $weight) {
                    if (!in_array(trim($weight), $consolidated_fonts[$font]['weights'])) {
                        $consolidated_fonts[$font]['weights'][] = trim($weight);
                    }
                }

                foreach ($styles as $style) {
                    if (!in_array(trim($style), $consolidated_fonts[$font]['styles'])) {
                        $consolidated_fonts[$font]['styles'][] = trim($style);
                    }
                }
            }
        }

        // Second pass: process consolidated fonts
        foreach ($consolidated_fonts as $font => $font_info) {
            $is_sc_font = $font_info['is_sc_font'];
            $weights = $font_info['weights'];
            $styles = $font_info['styles'];

            if (!$is_sc_font) {
                // Create consolidated font data with multiple weights
                $consolidated_font_data = [
                    'weight' => implode(',', $weights),
                    'style' => implode(',', $styles)
                ];

                if ($use_local_fonts) {
                    $font_name_sanitized = str_replace(
                        ' ',
                        '',
                        strtolower($font)
                    );
                    $font_url =
                        wp_upload_dir()['baseurl'] .
                        '/maxi/fonts/' .
                        $font_name_sanitized .
                        '/style.css';
                } else {
                    $font_url = $font_api_url . "/css2?family=$font:";
                }

                if (!$use_local_fonts) {
                    $local_fonts = MaxiBlocks_Local_Fonts::get_instance();
                    $font_url = $local_fonts->generate_font_url(
                        $font_url,
                        $consolidated_font_data
                    );
                }

                if (!$use_local_fonts) {
                    if ($font_url) {
                        if ($this->check_font_url($font_url)) {
                            wp_enqueue_style(
                                $name . '-font-' . sanitize_title_with_dashes($font),
                                $font_url,
                                array(),
                                MAXI_PLUGIN_VERSION,
                                'all'
                            );
                        } else {
                            // Try fallback with weight 400 only
                            $local_fonts = MaxiBlocks_Local_Fonts::get_instance();
                            $fallback_font_data = ['weight' => '400', 'style' => 'normal'];
                            $fallback_font_url = $local_fonts->generate_font_url(
                                $font_api_url . "/css2?family=$font:",
                                $fallback_font_data
                            );

                            if ($this->check_font_url($fallback_font_url)) {
                                wp_enqueue_style(
                                    $name . '-font-' . sanitize_title_with_dashes($font),
                                    $fallback_font_url,
                                    array(),
                                    MAXI_PLUGIN_VERSION,
                                    'all'
                                );
                            }
                        }
                    }
                } else {
                    if ($font_url) {
                        wp_enqueue_style(
                            $name . '-font-' . sanitize_title_with_dashes($font),
                            $font_url,
                            array(),
                            MAXI_PLUGIN_VERSION
                        );
                    }
                }
            } else {
                // Handle sc_font case with consolidated weights/styles
                $consolidated_font_data = [
                    'weight' => implode(',', $weights),
                    'style' => implode(',', $styles)
                ];

                if ($use_local_fonts) {
                    $font_name_sanitized = str_replace(
                        ' ',
                        '',
                        strtolower($font)
                    );
                    $font_url =
                        wp_upload_dir()['baseurl'] .
                        '/maxi/fonts/' .
                        $font_name_sanitized .
                        '/style.css';
                } else {
                    $font_url = $font_api_url . "/css2?family=$font";
                }

                if ($font_url && !$use_local_fonts) {
                    $font_url .= ':';
                }

                if (!$use_local_fonts) {
                    $local_fonts = MaxiBlocks_Local_Fonts::get_instance();
                    $font_url = $local_fonts->generate_font_url(
                        $font_url,
                        $consolidated_font_data
                    );
                }

                if (!$use_local_fonts) {
                    if ($font_url) {
                        if ($this->check_font_url($font_url)) {
                            wp_enqueue_style(
                                $name . '-font-' . sanitize_title_with_dashes($font),
                                $font_url,
                                array(),
                                MAXI_PLUGIN_VERSION,
                                'all'
                            );
                        } else {
                            // Try fallback with weight 400 only
                            $local_fonts = MaxiBlocks_Local_Fonts::get_instance();
                            $fallback_font_data = ['weight' => '400', 'style' => 'normal'];
                            $fallback_font_url = $local_fonts->generate_font_url(
                                $font_api_url . "/css2?family=$font:",
                                $fallback_font_data
                            );

                            if ($this->check_font_url($fallback_font_url)) {
                                wp_enqueue_style(
                                    $name . '-font-' . sanitize_title_with_dashes($font),
                                    $fallback_font_url,
                                    array(),
                                    MAXI_PLUGIN_VERSION,
                                    'all'
                                );
                            }
                        }
                    }
                } else {
                    if ($font_url) {
                        wp_enqueue_style(
                            $name . '-font-' . sanitize_title_with_dashes($font),
                            $font_url,
                            array(),
                            MAXI_PLUGIN_VERSION
                        );
                    }
                }
            }
        }

        if ($use_local_fonts) {
            add_filter(
                'style_loader_tag',
                function ($html, $handle) {
                    if (strpos($handle, 'maxi-blocks-styles-font-') !== false || strpos($handle, 'maxi-blocks-style-templates-header-font-') !== false) {
                        $html = str_replace(
                            "rel='stylesheet'",
                            "rel='stylesheet preload'",
                            $html
                        );
                        $html = str_replace(
                            "media='all'",
                            "as='style' media='all'",
                            $html
                        );
                    }
                    return $html;
                },
                10,
                2
            );
        }
    }


    /**
     * Legacy function
     * Custom Meta
     */
    public function custom_meta(string $metaJs, bool $is_template = false, ?string $id = null)
    {
        global $post;
        if ((!$is_template && (!$post || !isset($post->ID))) || empty($metaJs)) {
            return [];
        }

        if (!$id) {
            $id = $this->get_id($is_template);
        }

        $custom_data = $this->get_meta($id, $is_template);

        if (!$custom_data) {
            return [];
        }

        $result_arr = (array) $custom_data[0];
        $result_string = $result_arr['custom_data_value'];
        $result = maybe_unserialize($result_string);

        if (!$result || empty($result)) {
            return [];
        }

        if (!isset($result[$metaJs])) {
            return [];
        }

        $result_decoded = $result[$metaJs];

        // TODO: This is a temporary solution to fix the issue with the bg_video, scroll_effects and slider meta
        if (in_array($metaJs, ['bg_video', 'scroll_effects', 'slider'])) {
            return [ true ];
        }

        if (!is_array($result_decoded) || empty($result_decoded)) {
            return [];
        }

        return $result_decoded;
    }

    // Legacy function
    public function update_color_palette_backups($style)
    {
        global $wpdb;

        $style_card = maybe_unserialize(
            $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                    'sc_string'
                )
            )
        );

        if (!$style_card) {
            return $style;
        }

        // Get used colors on the post style
        $needle = 'rgba(var(--maxi-';
        $last_pos = 0;
        $colors = [];

        while (($last_pos = strpos($style, $needle, $last_pos)) !== false) {
            $end_pos = strpos($style, ')', $last_pos);
            $color_str = substr($style, $last_pos, $end_pos - $last_pos + 1);

            if (!in_array($color_str, $colors)) {
                $colors[] = $color_str;
            }

            $last_pos = $last_pos + strlen($needle);
        }

        // Get color values from the SC considering the used on post style
        $color_vars = [];

        foreach ($colors as $color) {
            $color = str_replace('rgba(var(', '', $color);
            $color_var = explode(',', $color)[0];
            $color_content = str_replace($color_var, '', $color);
            $color_content = str_replace(')', '', $color_content);
            $color_content = ltrim($color_content, ',');

            if (!in_array($color_var, $color_vars)) {
                $color_vars[$color_var] = $color_content;
            }
        }

        $changed_sc_colors = [];
        $changed_custom_colors = [];

        if (!array_key_exists('_maxi_blocks_style_card', $style_card)) {
            $style_card['_maxi_blocks_style_card'] =
                $style_card['_maxi_blocks_style_card_preview'];
        }

        $style_card_vars =
            is_preview() || is_admin()
                ? $style_card['_maxi_blocks_style_card_preview']
                : $style_card['_maxi_blocks_style_card'];

        foreach ($color_vars as $color_key => $color_value) {
            // Check if this is a custom color
            if (preg_match('/--maxi-(light|dark)-color-custom-(\d+)/', $color_key, $matches)) {
                // Handle custom colors separately
                $this->process_custom_color_change($style_card_vars, $color_key, $color_value, $changed_custom_colors);
                continue;
            }

            $start_pos = strpos($style_card_vars, $color_key);
            // If the color key doesn't exist in style card vars, skip it
            if ($start_pos === false) {
                continue;
            }

            $end_pos = strpos($style_card_vars, ';', $start_pos);
            if ($end_pos === false) {
                $end_pos = strpos($style_card_vars, '}', $start_pos);
                if ($end_pos === false) {
                    continue;
                }
            }

            $color_sc_value = substr(
                $style_card_vars,
                $start_pos + strlen($color_key) + 1,
                $end_pos - $start_pos - strlen($color_key) - 1
            );

            if ($color_sc_value !== $color_value) {
                $changed_sc_colors[$color_key] = $color_sc_value;
            }
        }

        // In case there are changes, fix them
        if (empty($changed_sc_colors) && empty($changed_custom_colors)) {
            return $style;
        } else {
            $new_style = $style;

            // Merge both color change arrays and apply all replacements in a single loop
            $all_color_changes = array_merge($changed_sc_colors, $changed_custom_colors);

            // Apply all color changes in a single pass
            foreach ($all_color_changes as $color_key => $color_value) {
                $old_color_str =
                    "rgba(var($color_key," . $color_vars[$color_key] . ')';
                $new_color_str = "rgba(var($color_key," . $color_value . ')';

                $new_style = str_replace(
                    $old_color_str,
                    $new_color_str,
                    $new_style
                );
            }

            // Replaces all ,NUMBER)),SECOND_NUMBER) to ,SECOND_NUMBER) where SECOND_NUMBER can be a decimal
            $new_style = preg_replace(
                '/,\d+\)\),(\d+(\.\d+)?\))/',
                ',$1',
                $new_style
            );

            return $new_style;
        }
    }

    /**
     * Process a change in custom color
     *
     * @param string $style_card_vars The style card variables
     * @param string $color_key The color key
     * @param string $color_value The current color value
     * @param array &$changed_custom_colors Reference to array of changed custom colors
     */
    private function process_custom_color_change($style_card_vars, $color_key, $color_value, &$changed_custom_colors)
    {
        $start_pos = strpos($style_card_vars, $color_key);
        // If the color key doesn't exist in style card vars, don't change it
        if ($start_pos === false) {
            return;
        }

        $end_pos = strpos($style_card_vars, ';', $start_pos);
        if ($end_pos === false) {
            $end_pos = strpos($style_card_vars, '}', $start_pos);
            if ($end_pos === false) {
                return;
            }
        }

        $color_sc_value = substr(
            $style_card_vars,
            $start_pos + strlen($color_key) + 1,
            $end_pos - $start_pos - strlen($color_key) - 1
        );

        if ($color_sc_value !== $color_value) {
            $changed_custom_colors[$color_key] = $color_sc_value;
        }
    }

    /**
     * Legacy function
     * Set styles and custom data from home template to front-page template
     */
    public function set_home_to_front_page($post_id, $post, $update)
    {
        if (!($post->post_type === 'wp_template' && $post->post_name === 'front-page' && !$update)) {
            return;
        }

        global $wpdb;

        if (class_exists('MaxiBlocks_API')) {
            $home_id =  $this->get_template_name() . '//' . 'home';
            $home_content = $this->get_content(true, $home_id);

            $front_page_id = $this->get_template_name() . '//' . 'front-page';

            // Use singleton to avoid duplicate hook registration
            if (method_exists('MaxiBlocks_API', 'get_instance')) {
                $api = MaxiBlocks_API::get_instance();
            } else {
                $api = null;
            }

            $styles = isset($home_content['css_value']) && is_string($home_content['css_value']) ? $home_content['css_value'] : '';
            $fonts_value = isset($home_content['fonts_value']) && is_string($home_content['fonts_value']) ? json_decode($home_content['fonts_value'], true) : [];
            $template_parts = isset($home_content['template_parts']) && is_array($home_content['template_parts']) ? $home_content['template_parts'] : [];

            $api->post_maxi_blocks_styles([
                'id' => $front_page_id,
                'meta' => [
                    'styles' => $styles,
                    'fonts' => [$fonts_value],
                ],
                'isTemplate' => true,
                'templateParts' => $template_parts,
                'update' => true,
            ], false);

            ['table' => $table, 'where_clause' => $where_clause] = $api->get_query_params('maxi_blocks_custom_data', true);

            $table = sanitize_text_field($table);
            $where_clause = sanitize_text_field($where_clause);

            // Prepare the query with the $home_id placeholder
            $home_custom_data = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM {$table} WHERE {$where_clause}",
                    $home_id
                ),
                OBJECT
            );

            $api->set_maxi_blocks_current_custom_data([
                'id' => $front_page_id,
                'data' => $home_custom_data[0]->custom_data_value,
                'isTemplate' => true,
                'update' => true,
            ], false);
        }
    }

    /***************************** NEW CODE PER BLOCK ****************************/

    private function filter_recursive($input)
    {
        foreach ($input as &$value) {
            if (is_array($value)) {
                $value = $this->filter_recursive($value);
            }
        }
        return array_filter($input, function ($v) {
            return !(is_array($v) && count($v) == 0);
        });
    }


    /**
     * Processing content for blocks
     * @return string
     */
    public function process_content_frontend()
    {
        $post_id = $this->get_id();

        $content_meta_fonts = $this->get_content_meta_fonts_frontend($post_id, 'maxi-blocks-styles');

        if ($content_meta_fonts['meta'] !== null) {
            $meta_filtered = $this->filter_recursive($content_meta_fonts['meta']);
            $this->process_scripts($meta_filtered);
        }
    }

    /**
     * Get content and meta data
     * @param  int $id
     * @param  bool $template
     * @param  string $content_key
     * @return array
     */
    private function get_content_meta_fonts_frontend($id, $content_key)
    {
        $data = $this->get_content_for_blocks_frontend($id);

        if (!empty($data) && isset($data['content']) && isset($data['meta']) && isset($data['fonts'])) {
            $this->apply_content($content_key, $data['content'], $id);
            $this->enqueue_fonts($data['fonts'], $content_key);

            return [
                'content' => $data['content'],
                'meta' => $data['meta'],
                'fonts' => $data['fonts'],
            ];
        }
        return ['content' => null, 'meta' => null, 'fonts' => null];
    }


    /**
     * Process scripts
     * @param  array $post_meta
     * @param  array $template_meta
     * @param  string $template_content
     * @return void
     */
    private function process_scripts($post_meta)
    {
        $scripts = [
            'hover-effects',
            'bg-video',
            'parallax',
            'scroll-effects',
            'number-counter',
            'shape-divider',
            'relations',
            'video',
            'search',
            'map',
            'accordion',
            'slider',
            'navigation',
            'email-obfuscate',
        ];

        $script_attr = [
            'bg-video',
            'parallax',
            'scroll-effects',
            'shape-divider',
            'relations',
            'navigation',
            'email-obfuscate',
        ];

        foreach ($scripts as $script) {
            $js_var = str_replace('-', '_', $script);
            $js_var_to_pass = 'maxi' . str_replace(' ', '', ucwords(str_replace('-', ' ', $script)));
            $js_script_name = 'maxi-' . $script;
            $js_script_path = '//js//min//' . $js_script_name . '.min.js';
            //$js_script_path = '//js//' . $js_script_name . '.js';

            $block_meta = $this->custom_meta($js_var, false);
            $template_meta = $this->custom_meta($js_var, true);
            $meta_to_pass = [];

            $meta = array_merge_recursive($post_meta, $block_meta, $template_meta);
            $match = false;
            $block_names = [];

            foreach ($meta as $key => $value) {
                if (str_contains($key, $script)) {
                    $match = true;
                    $block_names[] = $key;
                } else {
                    if (is_array($value) && in_array($script, $script_attr)) {
                        foreach ($value as $k => $v) {
                            if (gettype($v) === 'string' && (str_contains($v, $script) || str_contains($v, $js_var))) {
                                $match = true;
                                $block_names[] = $key;
                            }
                        }
                    }
                }
            }

            if ($match) {
                foreach ($block_names as $block_name) {
                    if (!str_contains($block_name, 'maxi-blocks')) {
                        continue;
                    }
                    if ($script === 'relations') {
                        foreach ($meta[$block_name] as $json) {
                            if (is_string($json)) {
                                $array = json_decode($json, true);
                                if (isset($array['relations'])) {
                                    $meta_to_pass = array_merge($meta_to_pass, $array['relations']);  // Add the 'relations' value to the new array
                                }
                            }
                        }
                    } elseif ($script === 'navigation') {
                        foreach ($meta[$block_name] as $json) {
                            if (is_string($json)) {
                                $array = json_decode($json, true);
                                if (isset($array['navigation'])) {
                                    $block_style = $array['navigation']['style'];
                                    $overwrite_mobile = MaxiBlocks_StyleCards::get_active_style_cards_value_by_name($block_style, 'navigation', 'overwrite-mobile');
                                    if ($overwrite_mobile) {
                                        $always_show_mobile = MaxiBlocks_StyleCards::get_active_style_cards_value_by_name($block_style, 'navigation', 'always-show-mobile');
                                        $show_mobile_down_from = MaxiBlocks_StyleCards::get_active_style_cards_value_by_name($block_style, 'navigation', 'show-mobile-down-from');
                                        $meta[$block_name]['navigation']['always-show-mobile'] = $always_show_mobile;
                                        $meta[$block_name]['navigation']['show-mobile-down-from'] = $show_mobile_down_from;
                                    }

                                    $meta_to_pass = array_merge($meta_to_pass, $meta[$block_name]);
                                }
                            }
                        }
                    } else {
                        $meta_to_pass = array_merge($meta_to_pass, $meta[$block_name]);
                    }

                }

                if (!empty($meta_to_pass)) {
                    $this->enqueue_script_per_block($script, $js_script_name, $js_script_path, $js_var_to_pass, $js_var, $meta_to_pass);
                }
            }
        }
    }

    /**
     * Enqueue script per block
     * @param  string $script
     * @param  string $js_script_name
     * @param  string $js_script_path
     * @param  string $js_var_to_pass
     * @param  string $js_var
     * @param  array $meta
     * @return void
     */
    private function enqueue_script_per_block($script, $js_script_name, $js_script_path, $js_var_to_pass, $js_var, $meta)
    {
        if ($script === 'number-counter') {
            wp_enqueue_script('maxi-waypoints-js', plugins_url('/js/waypoints.min.js', dirname(__FILE__)), [], MAXI_PLUGIN_VERSION, array(
                'strategy'  => 'defer', 'in_footer' => true
                ));
        }

        $strategy = 'defer';
        $version = MAXI_PLUGIN_VERSION;

        if ($script === 'relations') {
            $strategy = 'async';
        }

        wp_enqueue_script($js_script_name, plugins_url($js_script_path, dirname(__FILE__)), [], $version, array(
            'strategy'  => $strategy, 'in_footer' => true
            ));
        wp_localize_script($js_script_name, $js_var_to_pass, $this->get_block_data($js_var, $meta));

        // Add prefetch link for the script
        $prefetch_url = plugins_url($js_script_path, dirname(__FILE__));
        echo "<link rel='prefetch' href='$prefetch_url' as='script'>";
    }


    /**
     * Check if block needs custom meta
     *
     * @param  string $unique_id
     * @return bool
     */
    public function block_needs_custom_meta($unique_id)
    {
        global $wpdb;

        $active_custom_data = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT active_custom_data FROM {$wpdb->prefix}maxi_blocks_styles_blocks WHERE block_style_id = %s",
                $unique_id
            )
        );

        return (bool)$active_custom_data;
    }

    /**
     * Gets content for blocks
     *
     * @param array $block
     * @param string &$styles
     * @param string &$prev_styles
     * @param array &$active_custom_data_array
     */
    public function process_block_frontend(array $block, array &$fonts, string &$styles, string &$prev_styles, array &$active_custom_data_array, bool &$gutenberg_blocks_status, string $maxi_block_style = '', array $blocks_data_cache = [])
    {
        global $wpdb;

        $block_name = $block['blockName'] ?? '';
        $props = $block['attrs'] ?? [];
        $unique_id = $props['uniqueID'] ?? null;
        $is_core_block = str_starts_with($block_name, 'core/');

        if ($gutenberg_blocks_status && $is_core_block && $maxi_block_style) {
            $level = $props['level'] ?? null;
            $text_level = null;

            if ($block_name === 'core/button') {
                $text_level = 'button';
            } elseif ($block_name === 'core/navigation') {
                $text_level = 'navigation';
                $remove_hover_underline = MaxiBlocks_StyleCards::get_active_style_cards_value_by_name($maxi_block_style, 'navigation', 'remove-hover-underline');
                if ($remove_hover_underline) {
                    $styles .= ' .maxi-blocks--active .maxi-container-block .wp-block-navigation ul li a:hover { text-decoration: none; }';
                }
            } elseif ($level) {
                $text_level = 'h' . $level;
            } else {
                $text_level = 'p';
            }

            $fonts_array = get_all_fonts([], false, false, $text_level, $maxi_block_style, false);
            $fonts = array_merge($fonts, $fonts_array);
        }

        if (!$maxi_block_style && str_starts_with($block_name, 'maxi-blocks/')) {
            $maxi_block_style = $props['blockStyle'] ?? 'light';
        }

        if (empty($props) || !isset($unique_id) || !$unique_id) {
            if (!empty($block['innerBlocks'])) {
                foreach ($block['innerBlocks'] as $innerBlock) {
                    $this->process_block_frontend($innerBlock, $fonts, $styles, $prev_styles, $active_custom_data_array, $gutenberg_blocks_status, $maxi_block_style, $blocks_data_cache);
                }
            } else {
                return;
            }

        }

        // OPTIMIZATION: Use cached data instead of individual database query
        $content_block = $blocks_data_cache[$unique_id] ?? null;

        if (!isset($content_block) || empty($content_block)) {
            if (!empty($block['innerBlocks'])) {
                foreach ($block['innerBlocks'] as $innerBlock) {
                    $this->process_block_frontend($innerBlock, $fonts, $styles, $prev_styles, $active_custom_data_array, $gutenberg_blocks_status, $maxi_block_style, $blocks_data_cache);
                }
            } else {
                return;
            }

        }

        if (isset($content_block['css_value'])) {
            if ($block_name === 'maxi-blocks/container-maxi' && $props['isFirstOnHierarchy'] && strpos($content_block['css_value'], 'min-width:100%') !== false) {
                if (self::$active_theme === 2023 || self::$active_theme === 2024 || self::$active_theme === 2025) {
                    $new_styles = "body.maxi-blocks--active .has-global-padding > #$unique_id {
					margin-right: calc(var(--wp--style--root--padding-right) * -1) !important;
					margin-left: calc(var(--wp--style--root--padding-left) * -1) !important;
					min-width: calc(100% + var(--wp--style--root--padding-right) + var(--wp--style--root--padding-left)) !important;
				}";
                    $content_block['css_value'] .= $new_styles;
                }
                if (self::$active_theme === 2022) {
                    $new_styles = "body.maxi-blocks--active .wp-site-blocks .entry-content > #$unique_id {
					margin-left: calc(-1 * var(--wp--custom--spacing--outer)) !important;
					margin-right: calc(-1 * var(--wp--custom--spacing--outer)) !important;
					min-width: calc(100% + var(--wp--custom--spacing--outer) * 2) !important;
				}";
                    $content_block['css_value'] .= $new_styles;
                }
                if (self::$active_theme === 'astra') {
                    $new_styles = "body.maxi-blocks--active .entry-content > #$unique_id {
						margin-left: calc( -50vw + 50%);
						margin-right: calc( -50vw + 50%);
						max-width: 100vw;
						width: 100vw;
				}";
                    $content_block['css_value'] .= $new_styles;
                }
            }
            if (strpos($content_block['css_value'], '@media only screen and (min-width:NaNpx)') !== false) {
                $content_block['css_value'] = $this->fix_broken_styles($content_block['css_value']);
            }

            $styles .= ' ' . $content_block['css_value'];
        }

        if (isset($content_block['prev_css_value'])) {
            $prev_styles .= ' ' . $content_block['prev_css_value'];
        }

        if (isset($content_block['active_custom_data'])) {
            $this->process_custom_data_frontend($block_name, $unique_id, $active_custom_data_array);
        }

        // fonts
        // TODO: split fonts and prev_fonts
        foreach (['prev_fonts_value', 'fonts_value'] as $fonts_key) {
            $fonts_json = $content_block[$fonts_key] ?? null;

            if ($fonts_json !== '' && $fonts_json !== null) {
                $fonts_array = json_decode($fonts_json, true) ?? [];
            } else {
                $fonts_array = [];
            }

            $fonts = array_merge($fonts, $fonts_array);

        }

        // Process inner blocks, if any
        if (!empty($block['innerBlocks'])) {
            foreach ($block['innerBlocks'] as $innerBlock) {
                $this->process_block_frontend($innerBlock, $fonts, $styles, $prev_styles, $active_custom_data_array, $gutenberg_blocks_status, $maxi_block_style, $blocks_data_cache);
            }
        }
    }

    /**
     * Fix broken styles by replacing undefinedpx with appropriate values.
     *
     * @param string $style The CSS style string.
     * @return string The fixed CSS style string.
     */
    private function fix_broken_styles($style)
    {
        // Replace NaNpx with 1921px
        $style = str_replace('min-width:NaNpx', 'min-width:1921px', $style);

        // Replace max-width:undefinedpx with appropriate values
        $style = preg_replace_callback(
            '/@media only screen and \(max-width:undefinedpx\)\{(.*?)\}/s',
            function ($matches) {
                $content = $matches[1];
                if (strpos($content, 'width:90%;') !== false) {
                    return str_replace('max-width:undefinedpx', 'max-width:1366px', $matches[0]);
                } elseif (strpos($content, 'moz-column-gap:2.5%;') !== false || strpos($content, 'column-gap:2.5%;') !== false) {
                    return str_replace('max-width:undefinedpx', 'max-width:767px', $matches[0]);
                } elseif (strpos($content, 'row-gap:40px;') !== false) {
                    return str_replace('max-width:undefinedpx', 'max-width:480px', $matches[0]);
                } elseif (strpos($content, 'top:-100px;') !== false) {
                    return str_replace('max-width:undefinedpx', 'max-width:1024px', $matches[0]);
                }
                return $matches[0];
            },
            $style
        );

        // If no specific matches, replace the last, second to last, and first max-width:undefinedpx
        $undefined_matches = [];
        preg_match_all('/max-width:undefinedpx/', $style, $undefined_matches, PREG_OFFSET_CAPTURE);

        if (!empty($undefined_matches[0])) {
            $count = count($undefined_matches[0]);
            if ($count >= 1) {
                $style = substr_replace($style, 'max-width:480px', $undefined_matches[0][$count - 1][1], strlen('max-width:undefinedpx'));
            }
            if ($count >= 2) {
                $style = substr_replace($style, 'max-width:767px', $undefined_matches[0][$count - 2][1], strlen('max-width:undefinedpx'));
            }
            if ($count >= 3) {
                $style = substr_replace($style, 'max-width:1366px', $undefined_matches[0][0][1], strlen('max-width:undefinedpx'));
            }
        }

        return $style;
    }

    /**
     * Process custom data
     *
     * @param array $block
     * @param string $unique_id
     * @param array &$active_custom_data_array
     */
    private function process_custom_data_frontend(string $block_name, string $unique_id, array &$active_custom_data_array)
    {
        global $wpdb;

        $block_meta = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT custom_data_value FROM {$wpdb->prefix}maxi_blocks_custom_data_blocks WHERE block_style_id = %s",
                $unique_id
            )
        );

        if (!empty($block_meta)) {
            if (isset($active_custom_data_array[$block_name])) {
                $active_custom_data_array[$block_name] = array_merge($active_custom_data_array[$block_name], [$unique_id => $block_meta]);
            } else {
                $active_custom_data_array[$block_name] = [$unique_id => $block_meta];
            }
        }
    }

    /**
     * Fetches content for blocks with various optimizations.
     *
     * @param int|null $id
     * @param string|null $passed_content
     * @return array
     */
    public function get_content_for_blocks_frontend(?int $id = null, ?string $passed_content = null)
    {
        global $post;

        if (!$id) {
            $post = get_post();
        } else {
            $post = get_post($id);
        }

        // Fetch blocks from template parts.
        $template_id = $this->get_id(true);
        $blocks = $this->fetch_blocks_by_template_id($template_id);

        $specific_archives = ['tag', 'category', 'author', 'date'];
        // Attempt to replace a specific archive type with 'archive' in the template_id
        $modified_template_id = $template_id;
        foreach ($specific_archives as $archive_type) {
            if (strpos($template_id, $archive_type) !== false) {
                // Replace the first occurrence of the archive_type with 'archive'
                $modified_template_id = preg_replace('/' . preg_quote($archive_type, '/') . '/', 'archive', $template_id, 1);
                break; // Exit the loop once a match is found and replacement is done
            }
        }

        // Check if the modification was successful and the modified template_id is different
        if ($modified_template_id !== $template_id) {
            // Fetch blocks for the modified template_id which now targets 'archive'
            $blocks_all_archives = $this->fetch_blocks_by_template_id($modified_template_id);

            // Merge the blocks specific to the archive with the general archive blocks
            $blocks = array_merge($blocks, $blocks_all_archives);
        }


        $blocks_post = [];

        // Fetch blocks from passed content or from the global post.
        if ($passed_content) {
            $blocks_post = parse_blocks($passed_content);
        } elseif ($post) {
            if (is_preview()) {
                $revisions = wp_get_post_revisions($post->ID);

                if (!empty($revisions)) {
                    $latest_revision = array_shift($revisions);
                    $blocks_post = parse_blocks($latest_revision->post_content);
                }
            } else {
                $blocks_post = parse_blocks($post->post_content);
            }
        }


        // Merge the blocks.
        if (is_array($blocks_post) && !empty($blocks_post)) {
            $blocks = array_merge_recursive($blocks, $blocks_post);
        }

        if (empty($blocks)) {
            return [];
        }

        // Fetch and parse reusable blocks.
        $reusable_blocks = $this->get_parsed_reusable_blocks_frontend($blocks);

        if (!empty($reusable_blocks)) {
            $blocks = array_merge_recursive($blocks, $reusable_blocks);
        }

        $custom_template_parts_blocks = $this->get_parsed_custom_template_parts_blocks_frontend($blocks);

        if (!empty($custom_template_parts_blocks)) {
            $blocks = array_merge_recursive($blocks, $custom_template_parts_blocks);
        }


        // Process the blocks to extract styles and other metadata.
        list($styles, $prev_styles, $active_custom_data_array, $fonts) = $this->process_blocks_frontend($blocks);

        // Construct the content array.
        $content = [
            'css_value' => $styles,
            'prev_css_value' => $prev_styles,
        ];

        return ['content' => json_decode(wp_json_encode($content), true), 'meta' => $active_custom_data_array, 'fonts'=> $fonts];
    }

    /**
    * Fetches blocks from template and template parts based on the template slug.
    *
    * @param string $template_id The ID of the template you want to fetch.
    * @return array
    */
    public function fetch_blocks_by_template_id($template_id)
    {
        global $wpdb;

        $parts = explode('//', $template_id);
        $template_slug = isset($parts[1]) ? $parts[1] : null;
        // Initialize the array to store all the blocks.
        $all_blocks = [];
        $templates = [];

        // First, check for the existence of wp_template(s) with the post_name equal to the template_slug.
        if ($template_slug !== null) {
            $templates = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}posts WHERE post_type = 'wp_template' AND post_name LIKE %s AND post_status = 'publish'",
                    '%' . $wpdb->esc_like($template_slug) . '%'
                )
            );
        }


        if ($template_slug === 'home') {
            // First, check for the existence of wp_template(s) with the post_name equal to the template_slug.
            $templates_home = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}posts WHERE post_type = 'wp_template' AND post_name = %s AND post_status = 'publish'",
                    'blog'
                )
            );
            $templates = array_merge($templates, $templates_home);
        }

        foreach ($templates as $template) {
            // Parse blocks for each template.
            $template_blocks = parse_blocks($template->post_content);
            $all_blocks = array_merge_recursive($all_blocks, $template_blocks);
        }

        // Fetch the 'header' and 'footer' template parts.
        $template_parts = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}posts WHERE post_type = 'wp_template_part' AND (post_name LIKE %s OR post_name LIKE %s) AND post_status = 'publish'",
                '%header%',
                '%footer%'
            )
        );

        foreach ($template_parts as $template_part) {
            $part_blocks = parse_blocks($template_part->post_content);
            $all_blocks = array_merge_recursive($all_blocks, $part_blocks);
        }

        if (get_template() === 'maxiblocks' || get_template() === 'maxiblocks-go') {
            $templates_blocks = $this->fetch_blocks_from_beta_maxi_theme_templates($template_id);
            if ($templates_blocks) {
                $all_blocks = array_merge_recursive($all_blocks, $templates_blocks);
            }
        }

        return $all_blocks;
    }

    public function fetch_blocks_from_beta_maxi_theme_template_parts($template_id)
    {
        $all_blocks = [];
        $theme_directory = get_template_directory();
        $parts_directory = $theme_directory . '/parts/';

        // Get a list of HTML files in the parts directory
        $file = $parts_directory . $template_id . '.html';
        if (!file_exists($file)) {
            return [];
        }

        // Try direct file reading first
        if (is_readable($file)) {
            $file_contents = file_get_contents($file);
            if ($file_contents !== false) {
                // Process file contents...
                $dom = new DOMDocument();
                @$dom->loadHTML($file_contents);
                // Rest of the processing...
                return $all_blocks;
            }
        }

        // Fallback to WP_Filesystem
        global $wp_filesystem;
        if (empty($wp_filesystem)) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            WP_Filesystem(false, false, true);
        }

        if (empty($wp_filesystem)) {
            return [];
        }

        $file_contents = $wp_filesystem->get_contents($file);
        if (!$file_contents) {
            return [];
        }

        // Rest of the processing...
        $dom = new DOMDocument();
        @$dom->loadHTML($file_contents);

        // Example: Extract all the text from the HTML
        $text_content = $dom->textContent;
        $part_blocks = parse_blocks($text_content);
        $all_blocks = array_merge_recursive($all_blocks, $part_blocks);

        $pattern = '/<!-- wp:pattern \{"slug":"((?:maxiblocks|maxiblocks-go)\/[^"]+)"\} \/-->/';
        preg_match_all($pattern, $file_contents, $matches);

        if (!empty($matches[1])) {
            foreach ($matches[1] as $slug) {
                $parsed_blocks = $this->fetch_blocks_from_beta_maxi_theme_patterns($slug);
                $all_blocks = array_merge_recursive($all_blocks, $parsed_blocks);
            }
        }

        return $all_blocks;
    }



    public function fetch_blocks_from_beta_maxi_theme_templates($template_id)
    {
        if (get_template() !== 'maxiblocks' && get_template() !== 'maxiblocks-go') {
            return;
        }
        $all_blocks = [];

        $parts = explode('//', $template_id);
        if (!isset($parts[0]) || ($parts[0] !== 'maxiblocks' && $parts[0] !== 'maxiblocks-go')) {
            return;
        }

        $template_slug = isset($parts[1]) ? $parts[1] : null;

        if (!$template_slug) {
            return;
        }

        if ($template_slug === 'index') {
            if (is_front_page() && is_home()) {
                // Default homepage
                $template_slug = 'home';
            } elseif (is_front_page()) {
                // Static homepage
                $template_slug = 'front-page';
            } elseif (is_home()) {
                // Blog page
                $template_slug = 'home';
            } else {
                // Fallback to index.html for other cases
                $template_slug = 'index';
            }
        }

        $theme_directory = get_template_directory();
        $template_directory = $theme_directory . '/templates/';
        $file = $template_directory . $template_slug . '.html';

        if (!file_exists($file)) {
            $header_blocks = $this->fetch_blocks_from_beta_maxi_theme_template_parts('header');
            $all_blocks = array_merge_recursive($all_blocks, $header_blocks);

            $footer_blocks = $this->fetch_blocks_from_beta_maxi_theme_template_parts('footer');
            $all_blocks = array_merge_recursive($all_blocks, $footer_blocks);
            return $all_blocks;
        }

        global $wp_filesystem;
        if (empty($wp_filesystem)) {
            require_once ABSPATH . '/wp-admin/includes/file.php';
            WP_Filesystem();
        }

        $file_contents = $wp_filesystem->get_contents($file);
        if (!$file_contents) {
            return;
        }

        if (strpos($file_contents, '"slug":"header"') !== false) {
            $header_blocks = $this->fetch_blocks_from_beta_maxi_theme_template_parts('header');
            $all_blocks = array_merge_recursive($all_blocks, $header_blocks);
        }

        if (strpos($file_contents, '"slug":"footer"') !== false) {
            $footer_blocks = $this->fetch_blocks_from_beta_maxi_theme_template_parts('footer');
            $all_blocks = array_merge_recursive($all_blocks, $footer_blocks);
        }

        $pattern = '/<!-- wp:pattern \{"slug":"((?:maxiblocks|maxiblocks-go)\/[^"]+)"\} \/-->/';
        preg_match_all($pattern, $file_contents, $matches);

        if (!empty($matches[1])) {
            foreach ($matches[1] as $slug) {
                $parsed_blocks = $this->fetch_blocks_from_beta_maxi_theme_patterns($slug);
                $all_blocks = array_merge_recursive($all_blocks, $parsed_blocks);
            }
        }

        return $all_blocks;
    }


    public function fetch_blocks_from_beta_maxi_theme_patterns($pattern_id)
    {
        $all_blocks = [];
        $parts = explode('/', $pattern_id);
        if (!isset($parts[0]) || ($parts[0] !== 'maxiblocks' && $parts[0] !== 'maxiblocks-go')) {
            return [];
        }

        $pattern_slug = isset($parts[1]) ? $parts[1] : null;
        if (!$pattern_slug) {
            return [];
        }

        $theme_directory = get_template_directory();
        $html_pattern = $theme_directory . '/patterns/' . $pattern_slug . '.html';
        $php_pattern = $theme_directory . '/patterns/' . $pattern_slug . '.php';

        $pattern_file = '';
        if (file_exists($html_pattern)) {
            $pattern_file = $html_pattern;
        } elseif (file_exists($php_pattern)) {
            $pattern_file = $php_pattern;
        }

        if (!empty($pattern_file)) {
            // Try direct file reading first
            if (is_readable($pattern_file)) {
                $file_contents = file_get_contents($pattern_file);
                if ($file_contents !== false) {
                    $pattern_blocks = parse_blocks($file_contents);
                    return array_merge_recursive($all_blocks, $pattern_blocks);
                }
            }

            // Fallback to WP_Filesystem
            global $wp_filesystem;
            if (empty($wp_filesystem)) {
                require_once ABSPATH . 'wp-admin/includes/file.php';
                WP_Filesystem(false, false, true);
            }

            if (!empty($wp_filesystem)) {
                $file_contents = $wp_filesystem->get_contents($pattern_file);
                if ($file_contents) {
                    $pattern_blocks = parse_blocks($file_contents);
                    $all_blocks = array_merge_recursive($all_blocks, $pattern_blocks);
                }
            }
        }

        return $all_blocks;
    }


    public function get_reusable_blocks_ids($blocks)
    {
        $reusableBlockIds = [];

        foreach ($blocks as $block) {
            if ($block['blockName'] === 'core/block' && !empty($block['attrs']['ref'])) {
                $reusableBlockIds[] = $block['attrs']['ref'];
            }

            if (!empty($block['innerBlocks'])) {
                $reusableBlockIds = array_merge($reusableBlockIds, $this->get_reusable_blocks_ids($block['innerBlocks']));
            }
        }

        return $reusableBlockIds;
    }

    /**
     * Fetches and parses reusable blocks from the provided blocks.
     *
     * @param array $blocks
     * @return array
     */
    private function get_parsed_reusable_blocks_frontend($blocks)
    {

        $reusable_block_ids = $this->get_reusable_blocks_ids($blocks);

        // Remove duplicates from the block IDs.
        $reusable_block_ids = array_unique($reusable_block_ids);
        $all_parsed_blocks = [];

        // Fetch and parse each reusable block by its ID.
        foreach ($reusable_block_ids as $block_id) {
            $block = get_post($block_id);
            if ($block) {
                $parsed_blocks = parse_blocks($block->post_content);
                $all_parsed_blocks = array_merge($all_parsed_blocks, $parsed_blocks);
            }
        }

        return $all_parsed_blocks;
    }

    private function get_parsed_custom_template_parts_blocks_frontend($blocks)
    {
        $parsed_blocks = [];

        foreach ($blocks as $block) {
            if ($block['blockName'] === 'core/template-part' && !empty($block['attrs']['slug'])) {
                $part = get_block_template(
                    get_stylesheet() .
                        '//' .
                        $block['attrs']['slug'],
                    'wp_template_part',
                );
                if ($part && !empty($part->content)) {
                    $parsed_blocks = array_merge($parsed_blocks, parse_blocks($part->content));
                }
            }
        }

        return $parsed_blocks;
    }

    /**
     * Processes the provided blocks to extract styles, fonts, and other metadata.
     *
     * @param array $blocks
     * @return array
     */
    private function process_blocks_frontend($blocks)
    {
        $styles = '';
        $prev_styles = '';
        $active_custom_data_array = [];
        $fonts = [];

        $style_cards = new MaxiBlocks_StyleCards();
        $current_style_cards = $style_cards->get_maxi_blocks_active_style_card();

        $gutenberg_blocks_status = $current_style_cards && array_key_exists('gutenberg_blocks_status', $current_style_cards) && $current_style_cards['gutenberg_blocks_status'];

        // OPTIMIZATION: Collect all unique IDs first to do bulk database query
        $unique_ids = $this->collect_unique_ids_from_blocks($blocks);
        $blocks_data_cache = [];

        if (!empty($unique_ids)) {
            global $wpdb;
            $placeholders = implode(',', array_fill(0, count($unique_ids), '%s'));
            $blocks_data_results = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}maxi_blocks_styles_blocks WHERE block_style_id IN ($placeholders)",
                    ...$unique_ids
                ),
                ARRAY_A
            );

            // Index results by block_style_id for fast lookup
            foreach ($blocks_data_results as $block_data) {
                $blocks_data_cache[$block_data['block_style_id']] = $block_data;
            }
        }

        foreach ($blocks as $block) {
            $this->process_block_frontend($block, $fonts, $styles, $prev_styles, $active_custom_data_array, $gutenberg_blocks_status, '', $blocks_data_cache);
        }

        return [$styles, $prev_styles, $active_custom_data_array, $fonts];
    }

    /**
     * Recursively collect all unique IDs from blocks for bulk database query
     *
     * @param array $blocks
     * @return array
     */
    private function collect_unique_ids_from_blocks($blocks)
    {
        $unique_ids = [];

        foreach ($blocks as $block) {
            $props = $block['attrs'] ?? [];
            $unique_id = $props['uniqueID'] ?? null;

            if ($unique_id && str_starts_with($block['blockName'] ?? '', 'maxi-blocks/')) {
                $unique_ids[] = $unique_id;
            }

            // Recursively process inner blocks
            if (!empty($block['innerBlocks'])) {
                $inner_ids = $this->collect_unique_ids_from_blocks($block['innerBlocks']);
                $unique_ids = array_merge($unique_ids, $inner_ids);
            }
        }

        return array_unique($unique_ids);
    }


    public static function generate_random_string()
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';

        for ($i = 0; $i < 3; $i++) {
            $index = wp_rand(0, strlen($characters) - 1);
            $randomString .= $characters[$index];
        }

        return $randomString;
    }

    public static function unique_id_generator($blockName)
    {
        $name = str_replace('maxi-blocks/', '', $blockName);
        $uniquePart = self::generate_random_string().substr(uniqid('', true), 0, 5);
        return "{$name}-{$uniquePart}-u";
    }

    public function get_block_fonts($block_name, $props, $only_backend = false)
    {
        $response = [];

        $typography = [];
        $typography_hover = [];
        $text_level = isset($props['textLevel']) ? $props['textLevel'] : 'p';
        $block_style = $props['blockStyle'];

        switch ($block_name) {
            case 'maxi-blocks/number-counter-maxi':
                $typography = get_group_attributes($props, 'numberCounter');
                break;
            case 'maxi-blocks/button-maxi':
                $typography = get_group_attributes($props, 'typography');
                $typography_hover = get_group_attributes($props, 'typographyHover');
                $text_level = 'button';
                break;
            default:
                $typography = get_group_attributes($props, 'typography');
                $typography_hover = get_group_attributes($props, 'typographyHover');
                break;
        }

        if (isset($typography_hover['typography-status-hover'])) {
            $response = array_merge_recursive(
                get_all_fonts($typography, 'custom-formats', false, $text_level, $block_style, $only_backend),
                get_all_fonts($typography_hover, 'custom-formats', true, $text_level, $block_style, $only_backend)
            );
        } else {
            $response = get_all_fonts($typography, 'custom-formats', false, $text_level, $block_style, $only_backend);
        }


        return $response;
    }

    public static function get_active_theme()
    {
        $current_theme = wp_get_theme();

        if ('Twenty Twenty-Four' === $current_theme->name || 'twentytwentyfour' === $current_theme->template) {
            return 2024;
        }
        if ('Twenty Twenty-Three' === $current_theme->name || 'twentytwentythree' === $current_theme->template) {
            return 2023;
        }
        if ('Twenty Twenty-Two' === $current_theme->name || 'twentytwentytwo' === $current_theme->template) {
            return 2022;
        }
        if ('Twenty Twenty-Five' === $current_theme->name || 'twentytwentyfive' === $current_theme->template) {
            return 2025;
        }
        if ('Astra' === $current_theme->name || 'astra' === $current_theme->template) {
            return 'astra';
        }

        return 0; // another theme
    }

    /**
     * Updates the unique IDs of all blocks within a new post's content.
     *
     * This function parses the blocks of the new post, updates their unique IDs,
     * and then re-serializes the blocks back into the post content.
     *
     * @param array $new_post The new post array containing 'post_content' among other details.
     * @return array The modified post array with updated block unique IDs in the content.
    */
    public function update_post_unique_ids($new_post)
    {
        $blocks = parse_blocks($new_post['post_content']);
        $this->update_unique_ids($blocks);

        $serialized_content = serialize_blocks($blocks);

        $new_post['post_content'] = $serialized_content;

        return $new_post;
    }

    /**
     * Recursively updates the unique IDs of blocks and their inner blocks.
     *
     * This function iterates through each block, generating a new unique ID based on the block name,
     * and replaces the old unique ID in the block's attributes, innerHTML, and innerContent.
     * It also recursively updates any inner blocks.
     *
     * @param array $blocks Reference to the array of blocks to be updated.
     * @return void
    */
    private function update_unique_ids(&$blocks)
    {
        $idMapping = [];
        $blocksWithRelations = [];

        foreach ($blocks as &$block) {
            $previous_unique_id = isset($block['attrs']['uniqueID']) ? $block['attrs']['uniqueID'] : null;
            if (!$previous_unique_id) {
                continue;
            }

            $block_name = $block['blockName'];
            if (strpos($block_name, 'maxi-blocks') === false) {
                continue;
            }

            $new_unique_id = self::unique_id_generator($block_name);
            $idMapping[$previous_unique_id] = $new_unique_id;

            $block['attrs']['uniqueID'] = $new_unique_id;

            if (isset($block['attrs']['background-layers'])) {
                foreach ($block['attrs']['background-layers'] as $key => &$value) {
                    if (isset($value['background-svg-SVGData'])) {
                        $svg_data = $value['background-svg-SVGData'];
                        foreach ($svg_data as $svg_data_key => $svg_data_value) {
                            if (strpos($svg_data_key, $previous_unique_id) !== false) {
                                $svg_data[$new_unique_id] = $svg_data_value;
                                unset($svg_data[$svg_data_key]);
                            }
                        }
                    }

                    if (isset($value['background-svg-SVGElement'])) {
                        $svg_element = $value['background-svg-SVGElement'];
                        $svg_element = str_replace($previous_unique_id, $new_unique_id, $svg_element);
                        $value['background-svg-SVGElement'] = $svg_element;
                    }
                }
            }

            $block['innerHTML'] = str_replace($previous_unique_id, $block['attrs']['uniqueID'], $block['innerHTML']);
            $block['innerContent'] = array_map(function ($content) use ($previous_unique_id, $block) {
                return is_string($content) ? str_replace($previous_unique_id, $block['attrs']['uniqueID'], $content) : $content;
            }, $block['innerContent']);

            if (isset($block['attrs']['relations']) && is_array($block['attrs']['relations'])) {
                $blocksWithRelations[] = &$block;
            }

            if (!empty($block['innerBlocks'])) {
                $this->update_unique_ids($block['innerBlocks']);
            }
        }

        $this->update_attribute_relations($blocksWithRelations, $idMapping);
    }

    /**
     * Updates the unique IDs in the attribute relations of the given blocks.
     *
     * @param array &$blocksWithRelations Array of references to blocks that contain attribute relations.
     * @param array &$idMapping Mapping of old unique IDs to new unique IDs.
     *
     * @return void
     */
    private function update_attribute_relations(&$blocksWithRelations, &$idMapping)
    {
        foreach ($blocksWithRelations as &$block) {
            if (is_array($block['attrs']['relations'])) {
                foreach ($block['attrs']['relations'] as &$relation) {
                    if (isset($relation['uniqueID']) && isset($idMapping[$relation['uniqueID']])) {
                        $relation['uniqueID'] = $idMapping[$relation['uniqueID']];
                    }
                }
            }
        }
    }

    public function run_migrate_sc_fonts()
    {
        $this->migrate_sc_fonts();
    }

    private function migrate_sc_fonts()
    {
        $style_cards = new MaxiBlocks_StyleCards();
        $current_style_cards = $style_cards->get_maxi_blocks_active_style_card();

        $font_families = [];

        // Recursive function to search for 'font-family' keys
        $collect_font_families = function ($array) use (&$collect_font_families, &$font_families) {
            foreach ($array as $key => $value) {
                if (is_array($value)) {
                    $collect_font_families($value);
                } elseif (strpos($key, 'font-family') !== false) {
                    $font_families[] = $value;
                }
            }
        };

        // Call the recursive function to collect font families
        $collect_font_families($current_style_cards);

        // Remove duplicate font families
        $unique_font_families = array_values(array_unique($font_families));

        global $wpdb;

        $db_custom_prefix = 'maxi_blocks_';
        $db_css_table_name = $wpdb->prefix . $db_custom_prefix . 'styles_blocks';

        $chunk_size = 1000; // Adjust the chunk size as needed

        foreach ($unique_font_families as $font_name) {
            $offset = 0;

            do {
                $query = $wpdb->prepare(
                    "SELECT * FROM $db_css_table_name WHERE fonts_value LIKE %s LIMIT %d OFFSET %d",
                    '%' . $wpdb->esc_like($font_name) . '%',
                    $chunk_size,
                    $offset
                );
                $results = $wpdb->get_results($query);

                foreach ($results as $row) {
                    $text_levels = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button'];
                    $block_styles = ['-dark-', '-light-'];

                    foreach ($block_styles as $block_style) {
                        $text_level_found = false;

                        foreach ($text_levels as $text_level) {
                            if (strpos($row->css_value, ' ' . $text_level) !== false) {
                                $new_font_name = 'sc_font_' . str_replace('-', '', $block_style) . '_' . ($text_level);
                                $text_level_found = true;
                                break;
                            }
                        }

                        if (!$text_level_found) {
                            $new_font_name = 'sc_font_' . str_replace('-', '', $block_style) . '_p';
                        }

                        if (strpos($row->fonts_value, $font_name) !== false) {
                            $new_fonts_value = str_replace($font_name, $new_font_name, $row->fonts_value);
                            $update_result = $wpdb->update(
                                $db_css_table_name,
                                ['fonts_value' => $new_fonts_value],
                                ['id' => $row->id]
                            );
                        }
                    }
                }

                $offset += $chunk_size;
            } while (count($results) === $chunk_size);
        }
        update_option('maxi_blocks_sc_fonts_migration_done', true);
    }

}
