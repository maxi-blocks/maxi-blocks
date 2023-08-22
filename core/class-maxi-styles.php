<?php
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-local-fonts.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-style-cards.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-api.php';

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
        add_action('wp_enqueue_scripts', [$this, 'enqueue_styles']);
        add_action('save_post', [$this, 'set_home_to_front_page'], 10, 3);
    }

    /**
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

    public function get_template_name()
    {
        $template_name = wp_get_theme()->stylesheet ?? get_template();

        return $template_name;
    }

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
                if($block_templates && !empty($block_templates)) {
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
                        ((int) $content['prev_active_custom_data'] === 1 ||
                        (int) $content['active_custom_data'] === 1)
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
     * Gets post styles content
     */
    public function get_fonts($content)
    {
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
     * Returns default breakpoints values in case breakpoints are not set
     */
    public function getBreakpoints($breakpoints)
    {
        if (!empty((array) $breakpoints)) {
            return $breakpoints;
        }

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
     * Check font url status code
     */
    public function check_font_url($font_url)
    {
        $font_url = str_replace(' ', '+', $font_url);

        $array = @get_headers($font_url);

        if(!$array) {
            return false;
        }

        $string = $array[0];

        if(strpos($string, '200')) {
            return true;
        } else {
            return false;
        }
    }

    /**
     * Post fonts
     *
     * @return object   Font name with font options
     */
    public function enqueue_fonts($fonts, $name)
    {
        if (empty($fonts) || !is_array($fonts)) {
            return;
        }

        if(str_contains($name, '-templates-')) {
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

                    if(!$use_local_fonts) {
                        if($font_url) {
                            if($this->check_font_url($font_url)) {
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
                        if($font_url) {
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
                        if(!$font_weight) {
                            continue;
                        }

                        foreach ($font_styles as $font_style) {
                            if(!is_array($font_weight)) {
                                $font_weight = [ $font_weight ];
                            }

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

                            foreach($font_weight as $weight) {
                                foreach($loaded_fonts as $loaded_font) {
                                    if(in_array($weight, $loaded_font['font_weight']) && $loaded_font['font'] === $font) {
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

                            if(!$use_local_fonts) {
                                if($font_url) {
                                    if($this->check_font_url($font_url)) {
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
                                if($font_url) {
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
}
