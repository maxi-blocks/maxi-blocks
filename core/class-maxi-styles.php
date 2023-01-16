<?php
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-local-fonts.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-style-cards.php';

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
        $post_content = $this->getPostContent();

        if (!$post_content || empty($post_content)) {
            return false;
        }

        $post_content = json_decode(json_encode($post_content), true);

        $styles = $this->getStyles($post_content);
        $fonts = $this->getFonts($post_content);

        if ($styles) {
            // Inline styles
            wp_register_style('maxi-blocks', false);
            wp_enqueue_style('maxi-blocks');
            wp_add_inline_style('maxi-blocks', $styles);
        }
        if ($fonts) {
            $this->enqueue_fonts($fonts);
        }

        $need_custom_meta = false;

        if (
            (int) $post_content['prev_active_custom_data'] === 1 ||
            (int) $post_content['active_custom_data'] === 1
        ) {
            $need_custom_meta = true;
        }

        if ($need_custom_meta) {
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

                $meta = $this->customMeta($js_var);

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

    /**
     * Gets post content
     */
    public function getPostContent()
    {
        global $post;

        if (!$post || !isset($post->ID)) {
            return false;
        }

        global $wpdb;
        $post_content_array = (array) $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}maxi_blocks_styles WHERE post_id = %d",
                $post->ID
            ),
            OBJECT
        );

        if (!$post_content_array || empty($post_content_array)) {
            return false;
        }

        $post_content = $post_content_array[0];

        if (!$post_content || empty($post_content)) {
            return false;
        }

        return $post_content;
    }

    /**
     * Gets post meta
     */
    public function getPostMeta($id)
    {
        global $post;

        if (!$post || !isset($post->ID)) {
            return false;
        }

        global $wpdb;
        $response = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT custom_data_value FROM {$wpdb->prefix}maxi_blocks_custom_data WHERE post_id = %d",
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
    public function getStyles($post_content)
    {
        $style =
            is_preview() || is_admin()
                ? $post_content['prev_css_value']
                : $post_content['css_value'];

        if (!$style || empty($style)) {
            return false;
        }

        $style = $this->update_color_palette_backups($style);

        return $style;
    }

    /**
     * Gets post styles content
     */
    public function getFonts($post_content)
    {
        $fonts =
            is_preview() || is_admin()
                ? $post_content['prev_fonts_value']
                : $post_content['fonts_value'];

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
     * Post fonts
     *
     * @return object   Font name with font options
     */

    public function enqueue_fonts($fonts)
    {
        if (empty($fonts) || !is_array($fonts)) {
            return;
        }

        $use_local_fonts = (bool) get_option('local_fonts');

        foreach ($fonts as $font => $font_data) {
            if (strpos($font, 'sc_font') !== false) {
                $split_font = explode('_', str_replace('sc_font_', '', $font));
                $block_style = $split_font[0];
                $text_level = $split_font[1];

                if (class_exists('MaxiBlocks_StyleCards')) {
                    $font = MaxiBlocks_StyleCards::get_maxi_blocks_style_card_fonts($block_style, $text_level);
                }
            }

            if ($font) {
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

                wp_enqueue_style(
                    'maxi-font-' . sanitize_title_with_dashes($font),
                    $font_url
                );
            }
        }

        if ($use_local_fonts) {
            add_filter('style_loader_tag', 'local_fonts_preload', 10, 2);
            function local_fonts_preload($html, $handle)
            {
                if (strpos($handle, 'maxi-font-') !== false) {
                    $html = str_replace(
                        "rel='stylesheet'",
                        "rel='stylesheet preload'",
                        $html
                    );
                    $html = str_replace(
                        "media='all'",
                        "as='style' crossorigin media='all'",
                        $html
                    );
                }
                return $html;
            }
        }
    }

    /**
     * Custom Meta
     */
    public function customMeta($metaJs)
    {
        global $post;
        if (!$post || !isset($post->ID) || empty($metaJs)) {
            return;
        }

        $custom_data = $this->getPostMeta($post->ID);

        if (!$custom_data) {
            return;
        }

        $result_arr = (array) $custom_data[0];
        $result_string = $result_arr['custom_data_value'];
        $result = maybe_unserialize($result_string);

        if (!$result || empty($result)) {
            return;
        }

        if (!isset($result[$metaJs])) {
            return;
        }

        $result_decoded = $result[$metaJs];

        if (empty($result_decoded)) {
            return;
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

            return $new_style;
        }
    }
}
