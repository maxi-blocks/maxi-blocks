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


class MaxiBlocks_Styles
{
    private static ?MaxiBlocks_Styles $instance = null;
    private static ?string $active_theme = null;

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


    /**
     * Constructor
     */
    public function __construct()
    {
        if(self::should_apply_content_filter()) {
            add_filter('wp_enqueue_scripts', [$this, 'process_content_frontend']);
        }
    }

    private function should_apply_content_filter()
    {
        // Check if the REQUEST_URI contains context=edit
        if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'context=edit') !== false) {
            return false; // Do not apply the filter for this context
        }

        return true; // Apply the filter in other cases
    }
    public function get_block_data(string $js_var, array $meta)
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

    public function apply_content(string $name, array $content, int|string $id)
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
                    $content = $this->get_content(true, $template_part);
                    if($content) {
                        $this->apply_content($template_part_name, $content, $template_part);
                    }
                }
            }
        }
    }

    public function get_id(bool $is_template = false): int|string|null
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
            if(is_search()) {
                $template_id .= 'search';
            } else {
                $template_id .= $template_slug;
            }
        } elseif (is_home() || is_front_page()) {
            /** @disregard P1010 Undefined type */
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
        } elseif (is_archive()) {
            $template_id .= 'archive';
        } elseif (is_page()) {
            $template_id .= 'page';
        } else {
            $template_id .= 'single';
        }

        return $template_id;
    }

    public function get_content(bool $is_template = false, int $id = null) : array|false
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

    public function get_meta(int|string $id, bool $is_template = false)
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

    public function get_styles(array $content): string|bool
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

    public function get_fonts(array $content): array|false
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
     * Check font url status code
     */
    public function check_font_url(string $font_url): bool
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

    public function enqueue_fonts(array $fonts, string $name): void
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
                                    MAXI_PLUGIN_VERSION,
                                    'all'
                                );
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
                    if (empty($font_weights)) {
                        $font_weights = [$font_data['weight']];
                    }
                    if (empty($font_styles) && isset($font_data['style'])) {
                        $font_styles = [$font_data['style']];
                    } else {
                        $font_styles = ['normal'];
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

                            if(is_array($font_style)) {
                                $font_style = implode('-', $font_style);
                            }

                            if (!$use_local_fonts) {

                                if ($font_url) {
                                    if ($this->check_font_url($font_url)) {
                                        wp_enqueue_style(
                                            $name . '-font-' . sanitize_title_with_dashes($font . '-' . $font_weight . '-' . $font_style),
                                            $font_url,
                                            array(),
                                            MAXI_PLUGIN_VERSION,
                                            'all'
                                        );
                                    } else {  // Load default font weight for cases where the saved font weight doesn't exist
                                        $font_url = strstr($font_url, ':wght', true);
                                        wp_enqueue_style(
                                            $name . '-font-' . sanitize_title_with_dashes($font),
                                            $font_url,
                                            array(),
                                            MAXI_PLUGIN_VERSION,
                                            'all'
                                        );
                                    }
                                }
                            } else {
                                if ($font_url) {
                                    wp_enqueue_style(
                                        $name . '-font-' . sanitize_title_with_dashes($font . '-' . $font_weight . '-' . $font_style),
                                        $font_url,
                                        array(),
                                        MAXI_PLUGIN_VERSION
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

    public function custom_meta(string $metaJs, bool $is_template = false, int|string $id = null)
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

    public function update_color_palette_backups(string $style): string
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

            // Replaces all ,NUMBER)),SECOND_NUMBER) to ,SECOND_NUMBER) where SECOND_NUMBER can be a decimal
            $new_style = preg_replace(
                '/,\d+\)\),(\d+(\.\d+)?\))/',
                ',$1',
                $new_style
            );

            return $new_style;
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

    public function process_content_frontend(): void
    {

        $post_id = $this->get_id();

        $content_meta_fonts = $this->get_content_meta_fonts_frontend($post_id, 'maxi-blocks-styles');

        if ($content_meta_fonts['meta'] !== null) {

            $meta_filtered = $this->filter_recursive($content_meta_fonts['meta']);
            $this->process_scripts($meta_filtered);
        }
    }

    private function get_content_meta_fonts_frontend(int|string $id, string $content_key): array
    {

        $data = $this->get_content_for_blocks_frontend($id);

        if(!empty($data) && isset($data['content']) && isset($data['meta']) && isset($data['fonts'])) {
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

    private function process_scripts(array $post_meta): void
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
        ];

        $script_attr = [
            'bg-video',
            'parallax',
            'scroll-effects',
            'shape-divider',
            'relations',
            'navigation',
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
                if(str_contains($key, $script)) {
                    $match = true;
                    $block_names[] = $key;
                } else {
                    if(is_array($value) && in_array($script, $script_attr)) {
                        foreach ($value as $k => $v) {
                            if(gettype($v) === 'string' && (str_contains($v, $script) || str_contains($v, $js_var))) {
                                $match = true;
                                $block_names[] = $key;
                            }
                        }
                    }
                }
            }

            if ($match) {
                foreach ($block_names as $block_name) {
                    if(!str_contains($block_name, 'maxi-blocks')) {
                        continue;
                    }
                    if($script === 'relations') {
                        foreach ($meta[$block_name] as $json) {
                            if (is_string($json)) {
                                $array = json_decode($json, true);
                                if (isset($array['relations'])) {
                                    $meta_to_pass = array_merge($meta_to_pass, $array['relations']);  // Add the 'relations' value to the new array
                                }
                            }
                        }
                    } elseif($script === 'navigation') {
                        foreach ($meta[$block_name] as $json) {
                            if (is_string($json)) {
                                $array = json_decode($json, true);
                                if (isset($array['navigation'])) {
                                    $block_style = $array['navigation']['style'];
                                    $overwrite_mobile = MaxiBlocks_StyleCards::get_active_style_cards_value_by_name($block_style, 'navigation', 'overwrite-mobile');
                                    if($overwrite_mobile) {
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

                if(!empty($meta_to_pass)) {
                    $this->enqueue_script_per_block($script, $js_script_name, $js_script_path, $js_var_to_pass, $js_var, $meta_to_pass);
                }
            }
        }
    }

    private function enqueue_script_per_block(
        string $script,
        string $js_script_name,
        string $js_script_path,
        string $js_var_to_pass,
        string $js_var,
        array $meta
    ): void {
        if ($script === 'number-counter') {
            wp_enqueue_script('maxi-waypoints-js', plugins_url('/js/waypoints.min.js', dirname(__FILE__)), [], MAXI_PLUGIN_VERSION, array(
                'strategy'  => 'defer', 'in_footer' => true
                ));
        }

        $prefetch_url = plugins_url($js_script_path, dirname(dirname(__FILE__)));

        wp_enqueue_script($js_script_name, plugins_url($js_script_path, dirname(__FILE__)), [], MAXI_PLUGIN_VERSION, array(
            'strategy'  => 'defer', 'in_footer' => true
            ));
        wp_localize_script($js_script_name, $js_var_to_pass, $this->get_block_data($js_var, $meta));

        // Add prefetch link for the script
        echo "<link rel='prefetch' href='$prefetch_url' as='script'>";
    }

    public function block_needs_custom_meta(string $unique_id): bool
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
     */
    public function process_block_frontend(
        array $block,
        array &$fonts,
        string &$styles,
        string &$prev_styles,
        array &$active_custom_data_array,
        bool &$gutenberg_blocks_status,
        string $maxi_block_style = ''
    ): void {
        global $wpdb;

        $block_name = $block['blockName'] ?? '';
        $props = $block['attrs'] ?? [];
        $unique_id = $props['uniqueID'] ?? null;
        $is_core_block = str_starts_with($block_name, 'core/');

        if($gutenberg_blocks_status && $is_core_block && $maxi_block_style) {
            $level = $props['level'] ?? null;
            $text_level = null;

            if($block_name === 'core/button') {
                $text_level = 'button';
            } elseif($block_name === 'core/navigation') {
                $text_level = 'navigation';
                $remove_hover_underline = MaxiBlocks_StyleCards::get_active_style_cards_value_by_name($maxi_block_style, 'navigation', 'remove-hover-underline');
                if($remove_hover_underline) {
                    $styles .= ' .maxi-blocks--active .maxi-container-block .wp-block-navigation ul li a:hover { text-decoration: none; }';
                }
            } elseif($level) {
                $text_level = 'h' . $level;
            } else {
                $text_level = 'p';
            }

            $fonts_array = get_all_fonts([], false, false, $text_level, $maxi_block_style, false);
            $fonts = array_merge($fonts, $fonts_array);
        }

        if(!$maxi_block_style && str_starts_with($block_name, 'maxi-blocks/')) {
            $maxi_block_style = $props['blockStyle'] ?? 'light';
        }

        if (empty($props) || !isset($unique_id) || !$unique_id) {
            if (!empty($block['innerBlocks'])) {
                foreach ($block['innerBlocks'] as $innerBlock) {
                    $this->process_block_frontend($innerBlock, $fonts, $styles, $prev_styles, $active_custom_data_array, $gutenberg_blocks_status, $maxi_block_style);
                }
            } else {
                return;
            }

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
            if (!empty($block['innerBlocks'])) {
                foreach ($block['innerBlocks'] as $innerBlock) {
                    $this->process_block_frontend($innerBlock, $fonts, $styles, $prev_styles, $active_custom_data_array, $gutenberg_blocks_status, $maxi_block_style);
                }
            } else {
                return;
            }
        }

        if (isset($content_block['css_value'])) {
            if($block_name === 'maxi-blocks/container-maxi' && $props['isFirstOnHierarchy'] && strpos($content_block['css_value'], 'min-width:100%') !== false) {
                if(self::$active_theme === "2023" || self::$active_theme === "2024") {
                    $new_styles = "body.maxi-blocks--active .has-global-padding > #$unique_id {
					margin-right: calc(var(--wp--style--root--padding-right) * -1) !important;
					margin-left: calc(var(--wp--style--root--padding-left) * -1) !important;
					min-width: calc(100% + var(--wp--style--root--padding-right) + var(--wp--style--root--padding-left)) !important;
				}";
                    $content_block['css_value'] .= $new_styles;
                }
                if(self::$active_theme === 2022) {
                    $new_styles = "body.maxi-blocks--active .wp-site-blocks .entry-content > #$unique_id {
					margin-left: calc(-1 * var(--wp--custom--spacing--outer)) !important;
					margin-right: calc(-1 * var(--wp--custom--spacing--outer)) !important;
					min-width: calc(100% + var(--wp--custom--spacing--outer) * 2) !important;
				}";
                    $content_block['css_value'] .= $new_styles;
                }
                if(self::$active_theme === 'astra') {
                    $new_styles = "body.maxi-blocks--active .entry-content > #$unique_id {
						margin-left: calc( -50vw + 50%);
						margin-right: calc( -50vw + 50%);
						max-width: 100vw;
						width: 100vw;
				}";
                    $content_block['css_value'] .= $new_styles;
                }
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
                $this->process_block_frontend($innerBlock, $fonts, $styles, $prev_styles, $active_custom_data_array, $gutenberg_blocks_status, $maxi_block_style);
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
     */
    public function get_content_for_blocks_frontend(int $id = null, string $passed_content = null): array
    {
        global $post;

        if(!$id) {
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
        if($passed_content) {
            $blocks_post = parse_blocks($passed_content);
        } elseif($post) {
            if(is_preview()) {
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

        // Process the blocks to extract styles and other metadata.
        [$styles, $prev_styles, $active_custom_data_array, $fonts] = $this->process_blocks_frontend($blocks);

        // Construct the content array.
        $content = [
            'css_value' => $styles,
            'prev_css_value' => $prev_styles,
        ];

        return ['content' => json_decode(wp_json_encode($content), true), 'meta' => $active_custom_data_array, 'fonts'=> $fonts];
    }

    /**
     * Fetches blocks from template and template parts based on the template slug.
     */
    public function fetch_blocks_by_template_id(string $template_id): array
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

        if($template_slug === 'home') {
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

        if (get_template() === 'maxiblocks') {
            $templates_blocks = $this->fetch_blocks_from_beta_maxi_theme_templates($template_id);
            if($templates_blocks) {
                $all_blocks = array_merge_recursive($all_blocks, $templates_blocks);
            }
        }

        return $all_blocks;
    }

    public function fetch_blocks_from_beta_maxi_theme_template_parts(string $template_id): array
    {
        $all_blocks = [];
        $theme_directory = get_template_directory();
        $parts_directory = $theme_directory . '/parts/';

        // Get a list of HTML files in the parts directory
        $file = $parts_directory . $template_id . '.html';
        if (!file_exists($file)) {
            return [];
        }

        global $wp_filesystem;

        if (empty($wp_filesystem)) {
            require_once ABSPATH . 'wp-admin/includes/file.php';
            WP_Filesystem();
        }

        $file_contents = $wp_filesystem->get_contents($file);
        if (!$file_contents) {
            return [];
        }

        // Example: Using DOMDocument to parse the HTML
        $dom = new DOMDocument();
        @$dom->loadHTML($file_contents);

        // Example: Extract all the text from the HTML
        $text_content = $dom->textContent;
        $part_blocks = parse_blocks($text_content);
        $all_blocks = array_merge_recursive($all_blocks, $part_blocks);

        $pattern = '/<!-- wp:pattern \{"slug":"(maxiblocks\/[^"]+)"\} \/-->/';
        preg_match_all($pattern, $file_contents, $matches);

        if (!empty($matches[1])) {
            foreach ($matches[1] as $slug) {
                $parsed_blocks = $this->fetch_blocks_from_beta_maxi_theme_patterns($slug);
                $all_blocks = array_merge_recursive($all_blocks, $parsed_blocks);
            }
        }

        return $all_blocks;
    }



    public function fetch_blocks_from_beta_maxi_theme_templates(string $template_id): array
    {
        if (get_template() !== 'maxiblocks') {
            return [];
        }
        $all_blocks = [];

        $parts = explode('//', $template_id);
        if (!isset($parts[0]) || $parts[0] !== 'maxiblocks') {
            return [];
        }

        $template_slug = isset($parts[1]) ? $parts[1] : null;

        if (!$template_slug) {
            return [];
        }

        if ($template_slug === 'index') {
            $template_slug = 'front-page';
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
            return [];
        }

        if (strpos($file_contents, '"slug":"header"') !== false) {
            $header_blocks = $this->fetch_blocks_from_beta_maxi_theme_template_parts('header');
            $all_blocks = array_merge_recursive($all_blocks, $header_blocks);
        }

        if (strpos($file_contents, '"slug":"footer"') !== false) {
            $footer_blocks = $this->fetch_blocks_from_beta_maxi_theme_template_parts('footer');
            $all_blocks = array_merge_recursive($all_blocks, $footer_blocks);
        }

        $pattern = '/<!-- wp:pattern \{"slug":"(maxiblocks\/[^"]+)"\} \/-->/';
        preg_match_all($pattern, $file_contents, $matches);

        if (!empty($matches[1])) {
            foreach ($matches[1] as $slug) {
                $parsed_blocks = $this->fetch_blocks_from_beta_maxi_theme_patterns($slug);
                $all_blocks = array_merge_recursive($all_blocks, $parsed_blocks);
            }
        }

        return $all_blocks;
    }


    public function fetch_blocks_from_beta_maxi_theme_patterns(string $pattern_id): array
    {
        $all_blocks = [];
        $parts = explode('/', $pattern_id);
        if (!isset($parts[0]) || $parts[0] !== 'maxiblocks') {
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
            global $wp_filesystem;
            if (empty($wp_filesystem)) {
                require_once ABSPATH . '/wp-admin/includes/file.php';
                WP_Filesystem();
            }

            $file_contents = $wp_filesystem->get_contents($pattern_file);

            if (!$file_contents) {
                return [];
            }

            $pattern_blocks = parse_blocks($file_contents);
            $all_blocks = array_merge_recursive($all_blocks, $pattern_blocks);
        }

        return $all_blocks;
    }


    public function get_reusable_blocks_ids(array $blocks): array
    {
        $reusable_block_ids = [];

        foreach ($blocks as $block) {
            if ($block['blockName'] === 'core/block' && !empty($block['attrs']['ref'])) {
                $reusable_block_ids[] = $block['attrs']['ref'];
            }

            if (!empty($block['innerBlocks'])) {
                $reusable_block_ids = array_merge($reusable_block_ids, $this->get_reusable_blocks_ids($block['innerBlocks']));
            }
        }

        return $reusable_block_ids;
    }

    /**
     * Fetches and parses reusable blocks from the provided blocks.
     */
    private function get_parsed_reusable_blocks_frontend(array $blocks): array
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

    /**
     * Processes the provided blocks to extract styles, fonts, and other metadata.
     */
    private function process_blocks_frontend(array $blocks): array
    {
        $styles = '';
        $prev_styles = '';
        $active_custom_data_array = [];
        $fonts = [];

        $style_cards = new MaxiBlocks_StyleCards();
        $current_style_cards = $style_cards->get_maxi_blocks_active_style_card();

        $gutenberg_blocks_status = $current_style_cards && array_key_exists('gutenberg_blocks_status', $current_style_cards) && $current_style_cards['gutenberg_blocks_status'];

        foreach ($blocks as $block) {
            $this->process_block_frontend($block, $fonts, $styles, $prev_styles, $active_custom_data_array, $gutenberg_blocks_status);
        }

        return [$styles, $prev_styles, $active_custom_data_array, $fonts];
    }

    public static function get_active_theme(): string
    {
        $current_theme = wp_get_theme();

        if ('Twenty Twenty-Four' === $current_theme->name || 'twentytwentyfour' === $current_theme->template) {
            return '2024';
        }
        if ('Twenty Twenty-Three' === $current_theme->name || 'twentytwentythree' === $current_theme->template) {
            return '2023';
        }
        if ('Twenty Twenty-Two' === $current_theme->name || 'twentytwentytwo' === $current_theme->template) {
            return '2022';
        }
        if ('Astra' === $current_theme->name || 'astra' === $current_theme->template) {
            return 'astra';
        }

        return 0; // another theme
    }
}
