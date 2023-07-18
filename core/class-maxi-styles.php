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

$coreClasses = [
    'class-maxi-local-fonts',
    'class-maxi-style-cards',
    'class-maxi-api',
    'blocks/utils/style_resolver',
    'blocks/utils/frontend_style_generator',
    'blocks/utils/get_row_gap_attributes',
    'blocks/utils/get_custom_data',
    'blocks/utils/get_custom_format_value',
    'blocks/utils/get_all_fonts',
    'blocks/utils/create_selectors',
];

foreach($coreClasses as $coreClass) {
    require_once MAXI_PLUGIN_DIR_PATH . 'core/' . $coreClass . '.php';
}

$blockClasses = [
    'class-group-maxi-block',
    'class-container-maxi-block',
    'class-row-maxi-block',
    'class-column-maxi-block',
    'class-accordion-maxi-block',
    'class-pane-maxi-block',
    'class-button-maxi-block',
    'class-divider-maxi-block',
    'class-image-maxi-block',
    'class-svg-icon-maxi-block',
    'class-text-maxi-block',
    'class-video-maxi-block',
    'class-number-counter-maxi-block',
    'class-search-maxi-block',
    'class-map-maxi-block',
    'class-slide-maxi-block',
    'class-slider-maxi-block'
];

foreach($blockClasses as $blockClass) {
    require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/' . $blockClass . '.php';
}


class MaxiBlocks_Styles
{
    /**
     * This plugin's instance.
     *
     * @var MaxiBlocks_Styles
     */
    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_Styles();
        }
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        //add_action('wp_enqueue_scripts', [$this, 'enqueue_styles']); // legacy code
        add_action('save_post', [$this, 'set_home_to_front_page'], 10, 3); // legacy code

        add_filter('the_content', [$this, 'process_content']);
        add_action('save_post', [$this, 'get_styles_meta_fonts_from_blocks'], 10, 4);
        // add_action('save_post_wp_template', [$this, 'get_styles_meta_fonts_from_blocks'], 10, 4);
        // add_action('save_post_wp_template_part', [$this, 'get_styles_meta_fonts_from_blocks'], 10, 4);
    }

    public function write_log($log)
    {
        if (is_array($log) || is_object($log)) {
            error_log(print_r($log, true));
        } else {
            error_log($log);
        }
    }

    /**
     * Legacy function
     * Get block data
     */
    public function get_block_data($js_var, $meta)
    {
        switch ($js_var) {
            case 'search':
                return [$meta, get_search_link()];
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
        global $post;

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
                'slider'
            ];

            $template_parts = $this->get_template_parts($template_content);

            foreach ($scripts as &$script) {
                $js_var = str_replace('-', '_', $script);
                $js_var_to_pass =
                    'maxi' .
                    str_replace(
                        ' ',
                        '',
                        ucwords(str_replace('-', ' ', $script))
                    );
                $js_script_name = 'maxi-' . $script;
                $js_script_path = '//js//min//' . $js_script_name . '.min.js';

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
                            )
                        );
                    }

                    wp_enqueue_script(
                        $js_script_name,
                        plugins_url($js_script_path, dirname(__FILE__))
                    );

                    wp_localize_script($js_script_name, $js_var_to_pass, $this->get_block_data($js_var, $meta));
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
    public function apply_content($name, $content, $id)
    {
        $is_content = $content && !empty($content);
        $is_template_part = is_string($name) && strpos($name, '-templates');
        $is_template = $is_template_part && str_ends_with($name, '-templates');

        if ($is_content) {
            $styles = $this->get_styles($content);
            $fonts = $this->get_fonts($content);

            if ($styles) {
                // Inline styles
                wp_register_style($name, false);
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
    public function get_id($is_template = false)
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

        if ($template_slug != '' && $template_slug !== false) {
            $template_id .= $template_slug;
        } elseif (is_home() || is_front_page()) {
            $block_templates = get_block_templates(['slug__in' => ['index', 'front-page', 'home']]);

            $has_front_page_and_home = count($block_templates) > 2;

            if ($has_front_page_and_home) {
                if (is_home() && !is_front_page()) {
                    $template_id .= 'index';
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

        // $this->write_log('need_custom_meta');
        // $this->write_log($contents);

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
        //$this->write_log($need_custom_meta);

        return $need_custom_meta;
    }

    /**
     * Legacy function
     * Gets content
     */
    public function get_content($is_template = false, $id = null)
    {
        global $post;

        if (!$is_template && (!$post || !isset($post->ID))) {
            return false;
        }

        if (!$id) {
            return false;
        }

        global $wpdb;
        $content_array = (array) $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}maxi_blocks_styles" . ($is_template ? "_templates" : "") . " WHERE " . ($is_template ? "template_id = %s" : "post_id = %d"),
                $id
            ),
            OBJECT
        );

        if (!$content_array || empty($content_array)) {
            return false;
        }

        $content = $content_array[0];

        if (!$content || empty($content)) {
            return false;
        }

        return json_decode(json_encode($content), true);
    }

    /**
     * Legacy function
     * Gets post meta
     */
    public function get_meta($id, $is_template = false)
    {
        global $post;

        if ((!$is_template && (!$post || !isset($post->ID))) || !$id) {
            return false;
        }

        global $wpdb;
        $response = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT custom_data_value FROM {$wpdb->prefix}maxi_blocks_custom_data" . ($is_template ? "_templates" : "") . " WHERE " . ($is_template ? "template_id = %s" : "post_id = %d"),
                $id
            ),
            OBJECT
        );

        if (!$response) {
            $response = '';
        }

        return $response;
    }

    /**
     * Legacy function
     * Gets post styles content
     */
    public function get_styles($content)
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
    public function get_fonts($content)
    {
        if(!isset($content['fonts_value'])) {
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
     * Check font url status code
     */
    public function check_font_url($font_url)
    {
        $font_url = str_replace(' ', '+', $font_url);

        $array = @get_headers($font_url);

        if (!$array) {
            return false;
        }

        $string = $array[0];

        if (strpos($string, '200')) {
            return true;
        } else {
            return false;
        }
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

        $loaded_fonts = [];


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

                if (isset($font_data['weight']) && !in_array($font_data['weight'], $font_weights)) {
                    $font_weights = [[...$font_weights, intval($font_data['weight'])]];
                }

                if (isset($font_data['style']) && !in_array($font_data['style'], $font_styles)) {
                    $font_styles = [[...$font_styles, intval($font_data['style'])]];
                }
            }

            if ($font) {
                if (!$is_sc_font) {
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
                        $font_url = "https://fonts.googleapis.com/css2?family=$font:";
                    }

                    if (!$use_local_fonts) {
                        $local_fonts = new MaxiBlocks_Local_Fonts();
                        $font_url = $local_fonts->generateFontURL(
                            $font_url,
                            $font_data
                        );
                    }

                    if (!$use_local_fonts) {
                        if ($font_url) {
                            if ($this->check_font_url($font_url)) {
                                wp_enqueue_style(
                                    $name . '-font-' . sanitize_title_with_dashes($font),
                                    $font_url,
                                    array(),
                                    null,
                                    'all'
                                );
                            }
                        }
                    } else {
                        if ($font_url) {
                            wp_enqueue_style(
                                $name . '-font-' . sanitize_title_with_dashes($font),
                                $font_url
                            );
                        }
                    }
                } else {
                    if (empty($font_weights)) {
                        $font_weights = [$font_data['weight']];
                    }
                    if (empty($font_styles)) {
                        $font_styles = [$font_data['style']];
                    }

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
                        $font_url = "https://fonts.googleapis.com/css2?family=$font";
                    }


                    if ($font_url && !$use_local_fonts) {
                        $font_url .= ':';
                    }

                    foreach ($font_weights as $font_weight) {
                        if (!is_array($font_weight)) {
                            $font_weight = [ $font_weight ];
                        }

                        foreach ($font_styles as $font_style) {
                            $already_loaded = false;

                            if (in_array(
                                [
                                    'font' => $font,
                                    'font_weight' => $font_weight,
                                    'font_style' => $font_style,
                                ],
                                $loaded_fonts
                            )) {
                                $already_loaded = true;
                            }

                            foreach ($font_weight as $weight) {
                                foreach ($loaded_fonts as $loaded_font) {
                                    if (in_array($weight, $loaded_font['font_weight']) && $loaded_font['font'] === $font) {
                                        $already_loaded = true;
                                    }
                                }
                            }

                            if ($already_loaded) {
                                continue;
                            }

                            $font_data = [
                                'weight' => $font_weight,
                                'style' => $font_style,
                            ];

                            if (!$use_local_fonts) {
                                $local_fonts = new MaxiBlocks_Local_Fonts();
                                $font_url = $local_fonts->generateFontURL(
                                    $font_url,
                                    $font_data
                                );
                            }

                            $loaded_fonts[] = [
                                'font' => $font,
                                'font_weight' => $font_weight,
                                'font_style' => $font_style,
                            ];

                            if (is_array($font_weight)) {
                                $font_weight = implode('-', $font_weight);
                            }

                            if (!$use_local_fonts) {
                                if ($font_url) {
                                    if ($this->check_font_url($font_url)) {

                                        wp_enqueue_style(
                                            $name . '-font-' . sanitize_title_with_dashes($font . '-' . $font_weight . '-' . $font_style),
                                            $font_url,
                                            array(),
                                            null,
                                            'all'
                                        );
                                    } else {  // Load default font weight for cases where the saved font weight doesn't exist
                                        $font_url = strstr($font_url, ':wght', true);
                                        wp_enqueue_style(
                                            $name . '-font-' . sanitize_title_with_dashes($font),
                                            $font_url,
                                            array(),
                                            null,
                                            'all'
                                        );
                                    }
                                }
                            } else {
                                if ($font_url) {
                                    wp_enqueue_style(
                                        $name . '-font-' . sanitize_title_with_dashes($font . '-' . $font_weight . '-' . $font_style),
                                        $font_url
                                    );
                                }
                            }
                        }
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
    public function custom_meta($metaJs, $is_template = false, $id = null)
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

        if (!array_key_exists('_maxi_blocks_style_card', $style_card)) {
            $style_card['_maxi_blocks_style_card'] =
                $style_card['_maxi_blocks_style_card_preview'];
        }

        $style_card =
            is_preview() || is_admin()
                ? $style_card['_maxi_blocks_style_card_preview']
                : $style_card['_maxi_blocks_style_card'];

        foreach ($color_vars as $color_key => $color_value) {
            $start_pos = strpos($style_card, $color_key);
            $end_pos = strpos($style_card, ';--', $start_pos);
            $color_sc_value = substr(
                $style_card,
                $start_pos + strlen($color_key) + 1,
                $end_pos - $start_pos - strlen($color_key) - 1
            );

            if ($color_sc_value !== $color_value) {
                $changed_sc_colors[$color_key] = $color_sc_value;
            }
        }

        // In case there are changes, fix them
        if (empty($changed_sc_colors)) {
            return $style;
        } else {
            $new_style = $style;

            foreach ($changed_sc_colors as $color_key => $color_value) {
                $old_color_str =
                    "rgba(var($color_key," . $color_vars[$color_key] . ')';
                $new_color_str = "rgba(var($color_key," . $color_value . ')';

                $new_style = str_replace(
                    $old_color_str,
                    $new_color_str,
                    $new_style
                );
            }

            // Replaces all ,1)),1) to ,1)
            $new_style = preg_replace(
                '/,1\)\),1\)/',
                ',1)',
                $new_style
            );

            return $new_style;
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

            $api = new MaxiBlocks_API();

            $api->post_maxi_blocks_styles([
                'id' => $front_page_id,
                'meta' => [
                    'styles' => $home_content['css_value'],
                    'fonts' => [json_decode($home_content['fonts_value'], true)],
                ],
                'isTemplate' => true,
                'templateParts' => $home_content['template_parts'],
                'update' => true,
            ], false);

            ['table' => $table, 'where_clause' => $where_clause] = $api->get_query_params('maxi_blocks_custom_data', true);

            $home_custom_data = $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM $table WHERE $where_clause",
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

    /**
     * Processing content for blocks
     * @param  string $content
     * @return string
     */
    public function process_content($content)
    {
        $post_id = $this->get_id();
        $contentMetaFonts = $this->get_content_meta_fonts($post_id, false, 'maxi-blocks-styles');

        $template_id = $this->get_id(true);
        $templateContentAndMeta = $this->get_content_meta_fonts($template_id, true, 'maxi-blocks-styles-templates');

        if ($contentMetaFonts['meta'] !== null || $contentMetaFonts['template_meta'] !== null) {
            $templateContent = isset($templateContentAndMeta['template_content']) ? $templateContentAndMeta['template_content'] : null;
            $this->process_scripts($contentMetaFonts['meta'], $contentMetaFonts['template_meta'], $templateContent);
        }

        return $content;
    }

    /**
     * Get content and meta data
     * @param  int $id
     * @param  bool $template
     * @param  string $content_key
     * @return array
     */
    private function get_content_meta_fonts($id, $template, $content_key)
    {
        $data = $this->get_content_for_blocks($template, $id);
        if(!empty($data) && isset($data['content']) && isset($data['meta']) && isset($data['fonts'])) {
            $this->apply_content($content_key, $data['content'], $id);
            $this->enqueue_fonts($data['fonts'], $content_key);
            $contentForBlocks = $this->get_content_for_blocks(!$template, $id);
            $templateMeta = $contentForBlocks['meta'] ?? null;
            return [
                'content' => $data['content'],
                'meta' => $data['meta'],
                'template_meta' => $templateMeta,
                'fonts' => $data['fonts'],
            ];
        }
        return ['content' => null, 'meta' => null, 'template_meta' => null, 'fonts' => null];
    }


    /**
     * Process scripts
     * @param  array $post_meta
     * @param  array $template_meta
     * @param  string $template_content
     * @return void
     */
    private function process_scripts($post_meta, $template_meta, $template_content)
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
            'slider'
        ];

        $template_parts = $this->get_template_parts($template_content);

        foreach ($scripts as $script) {
            $js_var = str_replace('-', '_', $script);
            $js_var_to_pass = 'maxi' . str_replace(' ', '', ucwords(str_replace('-', ' ', $script)));
            $js_script_name = 'maxi-' . $script;
            //$js_script_path = '//js//min//' . $js_script_name . '.min.js';
            $js_script_path = '//js//' . $js_script_name . '.js';

            $block_meta = $this->custom_meta($js_var, false);
            $template_meta = $this->custom_meta($js_var, true);
            $template_parts_meta = [];

            if ($template_parts) {
                $template_parts_meta = $this->get_template_parts_meta($template_parts, $js_var);
            }

            $meta = array_merge($post_meta, $template_meta, $template_parts_meta);
            $match = false;
            $block_name = '';

            foreach ($meta as $key => $value) {
                // write_log('key: '.$key);
                // write_log('script: '.$script);
                if(str_contains($key, $script)) {
                    $match = true;
                    $block_name = $key;
                }
            }

            if ($match) {
                $meta_to_pass = $meta[$block_name];
                $this->enqueue_script_per_block($script, $js_script_name, $js_script_path, $js_var_to_pass, $js_var, $meta_to_pass);
            }
        }
    }

    /**
     * Get template parts meta data
     * @param  array $template_parts
     * @param  string $js_var
     * @return array
     */
    private function get_template_parts_meta($template_parts, $js_var)
    {
        $template_parts_meta = [];

        foreach ($template_parts as $template_part_id) {
            $template_parts_meta = array_merge($template_parts_meta, $this->custom_meta($js_var, true, $template_part_id));
        }

        return $template_parts_meta;
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
            wp_enqueue_script('maxi-waypoints-js', plugins_url('/js/waypoints.min.js', dirname(__FILE__)));
        }

        wp_enqueue_script($js_script_name, plugins_url($js_script_path, dirname(__FILE__)));
        wp_localize_script($js_script_name, $js_var_to_pass, $this->get_block_data($js_var, $meta));
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
     * Gets content per blocks
     *
     * @param array $block
     * @param string &$styles
     * @param string &$prev_styles
     * @param array &$active_custom_data_array
     */
    public function process_block(array $block, array &$fonts, string &$styles, string &$prev_styles, array &$active_custom_data_array)
    {
        global $wpdb;

        $props = $block['attrs'] ?? [];
        $unique_id = $props['uniqueID'] ?? null;

        if (empty($props) || !isset($unique_id) || !$unique_id) {
            return;
        }

        $content_array_block = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}maxi_blocks_styles_blocks WHERE block_style_id = %s",
                $unique_id
            ),
            ARRAY_A
        );

        $content_block = $content_array_block[0] ?? null;

        if (!isset($content_block) || empty($content_block)) {
            return;
        }

        $styles .= ' ' . $content_block['css_value'];
        $prev_styles .= ' ' . $content_block['prev_css_value'];

        if ($content_block['active_custom_data']) {
            $this->process_custom_data($block, $unique_id, $active_custom_data_array);
        }

        // fonts
        $fonts_json = $content_block['fonts_value'];
        if($fonts_json !== '' && $fonts_json !== null) {
            $fonts_array = json_decode($fonts_json, true) ?? [];
        } else {
            $fonts_array = [];
        }

        $fonts = array_merge($fonts, $fonts_array);

        // Process inner blocks, if any
        if (!empty($block['innerBlocks'])) {
            foreach ($block['innerBlocks'] as $innerBlock) {
                $this->process_block($innerBlock, $fonts, $styles, $prev_styles, $active_custom_data_array);
            }
        }
    }

    /**
     * Process custom data
     *
     * @param array $block
     * @param string $unique_id
     * @param array &$active_custom_data_array
     */
    private function process_custom_data(array $block, string $unique_id, array &$active_custom_data_array)
    {
        global $wpdb;

        $block_name = $block['blockName'];

        $block_meta = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT custom_data_value FROM {$wpdb->prefix}maxi_blocks_custom_data_blocks WHERE block_style_id = %s",
                $unique_id
            )
        );

        if (!empty($block_meta)) {
            if (isset($active_custom_data_array[$block_name])) {
                $active_custom_data_array[$block_name][] = [$unique_id => $block_meta];
            } else {
                $active_custom_data_array[$block_name] = [$unique_id => $block_meta];
            }
        }
    }

    /**
     * Get content for blocks
     *
     * @param bool $is_template
     * @param int|null $id
     * @param string|null $passed_content
     * @return array|false
     */
    public function get_content_for_blocks(bool $is_template = false, $id = null, string $passed_content = null)
    {
        global $post, $wpdb;

        if ((!$is_template && (!$post || !isset($post->ID))) || !$id) {
            return [];
        }

        if ($is_template) {
            return [];
        }

        $blocks = parse_blocks($passed_content ?? $post->post_content);

        if (empty($blocks)) {
            return [];
        }

        $styles = '';
        $prev_styles = '';
        $active_custom_data_array = [];
        $fonts = [];

        foreach ($blocks as $block) {
            $this->process_block($block, $fonts, $styles, $prev_styles, $active_custom_data_array);
        }

        $content = [
            'css_value' => $styles,
            'prev_css_value' => $prev_styles,
        ];

        return ['content' => json_decode(json_encode($content), true), 'meta' => $active_custom_data_array, 'fonts'=> $fonts];
    }

    /**
     * Get styles meta fonts from blocks
     *
     * @return bool
     */
    public function get_styles_meta_fonts_from_blocks()
    {
        global $post;

        if (!$post || !isset($post->ID)) {
            return false;
        }

        $blocks = parse_blocks($post->post_content);

        if (empty($blocks)) {
            return false;
        }

        //Get PHP maximum execution time
        $max_execution_time = ini_get('max_execution_time');
        //Split blocks array into chunks of 3 blocks
        $block_chunks = array_chunk($blocks, 3);

        foreach ($block_chunks as $block_chunk) {
            // Process each block in the current chunk

            foreach($block_chunk as $block) {
                $this->get_styles_meta_fonts_from_block($block);
            }

            // Reset PHP maximum execution time for each chunk to avoid a timeout
            if ($max_execution_time != 0) {
                set_time_limit($max_execution_time - 2);
            }
        }

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

    /**
     * Get styles meta fonts from block
     *
     * @param array $block
     * @param array|null $context
     * @return array
     */
    public function get_styles_meta_fonts_from_block($block, $context = null)
    {
        global $wpdb;

        $styles = [];

        if(empty($block)) {
            return $styles;
        }

        $block_name = $block['blockName'];

        if ($block_name === null || strpos($block_name, 'maxi-blocks') === false) {
            return $styles;
        }

        $props = $block['attrs'];
        $block_style = $props['blockStyle'];

        $unique_id = $props['uniqueID'];

        $block_instance = null;

        $blockClasses = [
            'maxi-blocks/group-maxi' => 'MaxiBlocks_Group_Maxi_Block',
            'maxi-blocks/container-maxi' => 'MaxiBlocks_Container_Maxi_Block',
            'maxi-blocks/row-maxi' => 'MaxiBlocks_Row_Maxi_Block',
            'maxi-blocks/column-maxi' => 'MaxiBlocks_Column_Maxi_Block',
            'maxi-blocks/accordion-maxi' => 'MaxiBlocks_Accordion_Maxi_Block',
            'maxi-blocks/pane-maxi' => 'MaxiBlocks_Pane_Maxi_Block',
            'maxi-blocks/button-maxi' => 'MaxiBlocks_Button_Maxi_Block',
            'maxi-blocks/divider-maxi' => 'MaxiBlocks_Divider_Maxi_Block',
            'maxi-blocks/image-maxi' => 'MaxiBlocks_Image_Maxi_Block',
            'maxi-blocks/svg-icon-maxi' => 'MaxiBlocks_SVG_Icon_Maxi_Block',
            'maxi-blocks/text-maxi' => 'MaxiBlocks_Text_Maxi_Block',
            'maxi-blocks/video-maxi' => 'MaxiBlocks_Video_Maxi_Block',
            'maxi-blocks/number-counter-maxi' => 'MaxiBlocks_Number_Counter_Maxi_Block',
            'maxi-blocks/search-maxi' => 'MaxiBlocks_Search_Maxi_Block',
            'maxi-blocks/map-maxi' => 'MaxiBlocks_Map_Maxi_Block',
            'maxi-blocks/slider-maxi' => 'MaxiBlocks_Slider_Maxi_Block',
            'maxi-blocks/slide-maxi' => 'MaxiBlocks_Slide_Maxi_Block',
        ];

        if (class_exists($blockClasses[$block_name])) {
            $block_instance = $blockClasses[$block_name]::get_instance();
        }

        if($block_instance === null) {
            return $styles;
        }

        $props = $block_instance->get_block_attributes($props);

        $customCss = $block_instance->get_block_custom_css($props);
        $sc_props = $block_instance->get_block_sc_vars($block_style);
        $styles = $block_instance->get_styles($props, $customCss, $sc_props, $context);


        $inner_blocks = $block['innerBlocks'];

        // Context creator
        if ($block_name === 'maxi-blocks/row-maxi') {
            $column_size = [];

            if ($inner_blocks && !empty($inner_blocks)) {
                foreach ($inner_blocks as $inner_block) {
                    $attrs = $inner_block['attrs'];
                    $column_size_attrs = get_group_attributes($attrs, 'columnSize');
                    $unique_id = $attrs['uniqueID'];

                    $column_size[$unique_id] = $column_size_attrs;
                }
            }

            $context = [
                'row_gap_props' => array_merge(
                    get_row_gap_attributes($props),
                    [
                        'column_num' => count($inner_blocks),
                        'column_size' => $column_size,
                    ]
                ),
                'row_border_radius'=> get_group_attributes(
                    $props,
                    'borderRadius'
                ),
            ];
        } else {
            $context = null;
        }
        //$this->write_log('context END');

        if ($inner_blocks && !empty($inner_blocks)) {
            // Get PHP maximum execution time
            $max_execution_time = ini_get('max_execution_time');
            //Split inner_blocks array into chunks of 3
            $inner_block_chunks = array_chunk($inner_blocks, 3);

            foreach ($inner_block_chunks as $inner_block_chunk) {
                // Process each block in the current chunk
                foreach($inner_block_chunk as $inner_block) {
                    $styles = array_merge($styles, $this->get_styles_meta_fonts_from_block($inner_block, $context));
                }

                // Reset PHP maximum execution time for each chunk to avoid a timeout
                if ($max_execution_time != 0) {
                    set_time_limit($max_execution_time - 2);
                }
            }
        }


        $resolved_styles = style_resolver($styles);
        $frontend_styles = frontend_style_generator($resolved_styles, $unique_id);

        // custom meta
        $custom_meta_block = 0;

        $meta_blocks = [
            'maxi-blocks/number-counter-maxi',
            'maxi-blocks/video-maxi',
            'maxi-blocks/search-maxi',
            'maxi-blocks/map-maxi',
            'maxi-blocks/accordion-maxi',
            'maxi-blocks/pane-maxi',
            'maxi-blocks/slider-maxi',

        ];

        if(in_array($block_name, $meta_blocks)) {
            $custom_meta_block = 1;
        }

        $custom_meta = $this->get_custom_data_from_block($block_name, $props, $context);
        write_log('custom_meta for '.$block_name);
        write_log($custom_meta);
        write_log('custom_meta_json');
        write_log(json_encode($custom_meta));
        write_log('=========================');
        if(!empty($custom_meta)) {
            $custom_meta_json = json_encode($custom_meta);
            $exists = $wpdb->get_row(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}maxi_blocks_custom_data_blocks WHERE block_style_id = %s",
                    $unique_id
                ),
                OBJECT
            );

            if (!empty($exists)) {
                // Update the existing row.
                $old_custom_meta = $exists->custom_data_value;
                $wpdb->query(
                    $wpdb->prepare(
                        "UPDATE {$wpdb->prefix}maxi_blocks_custom_data_blocks
						SET custom_data_value = %s, prev_custom_data_value = %s
						WHERE block_style_id = %s",
                        $custom_meta_json,
                        $old_custom_meta,
                        $unique_id
                    )
                );
            } else {
                // Insert a new row.
                $wpdb->query(
                    $wpdb->prepare(
                        "INSERT INTO {$wpdb->prefix}maxi_blocks_custom_data_blocks (block_style_id, custom_data_value, prev_custom_data_value)
						VALUES (%s, %s, %s)",
                        $unique_id,
                        $custom_meta_json,
                        ''
                    )
                );
            }


        }

        // fonts

        $blocks_with_fonts = [
            'maxi-blocks/number-counter-maxi',
            'maxi-blocks/button-maxi',
            'maxi-blocks/text-maxi',
            'maxi-blocks/image-maxi',
        ];

        if (in_array($block_name, $blocks_with_fonts) && !empty($props)) {
            $fonts = json_encode($this->get_block_fonts($block_name, $props));
        } else {
            $fonts = '';
        }
        // save to DB
        $exists = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}maxi_blocks_styles_blocks WHERE block_style_id = %s",
                $unique_id
            ),
            OBJECT
        );

        if (!empty($exists)) {
            // Update the existing row.
            $old_css = $exists->css_value;
            $old_custom_meta = $exists->active_custom_data;
            $old_fonts = $exists->fonts_value;
            $wpdb->query(
                $wpdb->prepare(
                    "UPDATE {$wpdb->prefix}maxi_blocks_styles_blocks
					SET css_value = %s, prev_css_value = %s, prev_fonts_value = %s, fonts_value = %s, active_custom_data = %d, prev_active_custom_data = %d
					WHERE block_style_id = %s",
                    $frontend_styles,
                    $old_css,
                    $old_fonts,
                    $fonts,
                    $custom_meta_block,
                    $old_custom_meta,
                    $unique_id
                )
            );
        } else {
            // Insert a new row.
            $wpdb->query(
                $wpdb->prepare(
                    "INSERT INTO {$wpdb->prefix}maxi_blocks_styles_blocks (block_style_id, css_value, prev_css_value, fonts_value, prev_fonts_value, active_custom_data, prev_active_custom_data)
					VALUES (%s, %s, %s, %s, %s, %d, %d)",
                    $unique_id,
                    $frontend_styles,
                    '',
                    $fonts,
                    '',
                    $custom_meta_block,
                    0
                )
            );
        }

        return $styles;
    }

    /**
     * Retrieves custom data from a block, based on the block's name and properties.
     *
     * The function supports a variety of block types, and returns different data depending
     * on the block type. If the block type is not supported, the function returns an empty array.
     *
     * @param string $block_name The name of the block, e.g., 'maxi-blocks/number-counter-maxi'.
     * @param array $attributes An associative array of attributes for the block.
     * @return array An array containing the custom data from the block.
     */
    public function get_maxi_custom_data_from_block($block_name, $attributes)
    {
        // Define the block types and their corresponding attribute groups
        $block_types = [
            'maxi-blocks/accordion-maxi' => 'accordion',
            'maxi-blocks/container-maxi' => 'container',
            'maxi-blocks/map-maxi' => 'map',
            'maxi-blocks/number-counter-maxi' => 'numberCounter',
            'maxi-blocks/search-maxi' => 'search',
            'maxi-blocks/slider-maxi' => 'slider',
            'maxi-blocks/video-maxi' => 'video',
        ];

        // Iterate over the block types array
        foreach ($block_types as $block_type => $attr_group) {
            // If the block name matches the current block type
            if ($block_name === $block_type) {
                if($attr_group === 'accordion') {
                    write_log('ACCORDION PANE');
                    write_log(get_group_attributes($attributes, 'pane'));
                }
                switch ($attr_group) {
                    case 'accordion':
                        $pane_icon = $attributes['icon-content'] ?? null;
                        $pane_icon_active = $attributes['active-icon-content'] ?? null;
                        $accordion_layout = $attributes['accordionLayout'] ?? null;
                        $auto_pane_close = $attributes['autoPaneClose'] ?? null;
                        $is_collapsible = $attributes['isCollapsible'] ?? null;
                        $animation_duration = $attributes['animationDuration'] ?? null;

                        $unique_custom_data = [
                            'paneIcon' => $pane_icon,
                            'paneIconActive' => $pane_icon_active,
                            'accordionLayout' => $accordion_layout,
                            'autoPaneClose' => $auto_pane_close,
                            'isCollapsible' => $is_collapsible,
                            'animationDuration' => $animation_duration,
                        ];

                        break;
                    case 'container':
                        $shape_divider_top_status = $attributes['shape-divider-top-status'] ?? null;
                        $shape_divider_bottom_status = $attributes['shape-divider-bottom-status'] ?? null;
                        $shape_status = $shape_divider_top_status ?? $shape_divider_bottom_status;

                        $unique_custom_data = $shape_status ? get_group_attributes($attributes, 'shapeDivider') : [];

                        break;
                    case 'map':
                        $unique_custom_data = get_group_attributes($attributes, [
                            'mapInteraction',
                            'mapMarker',
                            'mapPopup',
                            'mapPopupText',
                        ]);

                        break;
                    case 'search':
                        $close_icon_prefix = 'close-';
                        $button_icon_content = $attributes['icon-content'] ?? null;
                        $button_close_icon_content = $attributes[$close_icon_prefix . 'icon-content'] ?? null;
                        $button_content = $attributes['buttonContent'] ?? null;
                        $button_content_close = $attributes['buttonContentClose'] ?? null;
                        $button_skin = $attributes['buttonSkin'] ?? null;
                        $icon_reveal_action = $attributes['iconRevealAction'] ?? null;
                        $skin = $attributes['skin'] ?? null;
                        $unique_custom_data = [
                            'icon-content' => $button_icon_content,
                            $close_icon_prefix . 'icon-content' => $button_close_icon_content,
                            'buttonContent' => $button_content,
                            'buttonContentClose' => $button_content_close,
                            'buttonSkin' => $button_skin,
                            'iconRevealAction' => $icon_reveal_action,
                            'skin' => $skin,
                        ];

                        break;
                    case 'slider':
                        $unique_custom_data = ['slider'=> true];

                        break;
                    default:
                        $unique_custom_data = [];
                        break;
                }
                // Construct and return the response array
                return
                   array_merge(
                       get_group_attributes($attributes, $attr_group),
                       $unique_custom_data,
                       ['breakpoints' => $this->get_breakpoints($attributes)]
                   );
            }
        }

        // If no matching block type was found, return an empty array
        return [];
    }



    /**
     * Retrieves custom data from a block, based on the block's name, properties and context.
     *
     * This function first extracts relevant properties from the given arguments, including unique ID,
     * status, background layers, relations, and context loop. It then calculates some properties
     * based on the extracted data. Finally, it constructs and returns an array that contains all
     * the calculated properties and the results from another method called `get_maxi_custom_data_from_block`.
     *
     * @param string $block_name The name of the block.
     * @param array $props An associative array of properties for the block.
     * @param array|null $context (Optional) The context in which the block is being processed.
     * @return array An array containing the custom data from the block.
     */
    public function get_custom_data_from_block($block_name, $props, $context = null)
    {
        // Extract the unique ID from the properties
        $unique_id = $props['uniqueID'];

        // Extract other relevant properties with default values if not set
        $dc_status = $props['dc-status'] ?? false;
        $bg_layers = $props['background-layers'] ?? [];
        $relations_raw = $props['relations'] ?? [];
        $context_loop = $context['contextLoop'] ?? null;

        // Calculate scroll attributes
        $scroll = get_group_attributes($props, 'scroll', false, '', true);

        // Calculate parallax layers if background layers are not empty
        $bg_parallax_layers = !empty($bg_layers) ? get_parallax_layers($unique_id, $bg_layers) : [];

        // Calculate video and scroll effects flags
        $has_video = get_has_video($unique_id, $bg_layers);
        $has_scroll_effects = get_has_scroll_effects($unique_id, $scroll);

        // Calculate relations if exist
        $relations = get_relations($unique_id, $relations_raw);

        // Construct the response by merging all calculated data and the data from another method
        $response = array_merge(
            !empty($bg_parallax_layers) ? ['parallax' => $bg_parallax_layers] : [],
            !empty($relations) ? ['relations' => $relations] : [],
            $has_video ? ['bg_video' => true] : [],
            $has_scroll_effects ? ['scroll_effects' => true] : [],
            $dc_status && isset($context_loop['cl-status'])
                    ? ['dynamic_content' => [$unique_id => $context_loop]]
                    : [],
            $this->get_maxi_custom_data_from_block($block_name, $props)
        );

        return $response;
    }

}
