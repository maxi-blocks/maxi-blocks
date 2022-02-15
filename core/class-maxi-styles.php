<?php

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
     * Enqueuing styles
     */
    public function enqueue_styles()
    {
        $post_content = $this->getPostContent();
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


        $needCustomMeta = false;

        if ((int)$post_content['prev_active_custom_data'] === 1 || (int)$post_content['active_custom_data'] === 1) {
            $needCustomMeta = true;
        }

        if ($needCustomMeta) {
            $scripts = ['hover-effects', 'bg-video', 'parallax', 'scroll-effects', 'number-counter', 'shape-divider'];

            foreach ($scripts as &$script) {
                $jsVar = str_replace('-', '_', $script);
                $jsVarToPass = 'maxi'.str_replace(' ', '', ucwords(str_replace('-', ' ', $script)));
                $jsScriptName = 'maxi-'.$script;
                $jsScriptPath = '//js//'.$jsScriptName.'.min.js';

                $meta = $this->customMeta($jsVar);

                if (!empty($meta)) {
                    if ($script === 'hover-effects') {
                        wp_enqueue_script(
                            'maxi-waypoints-js',
                            plugins_url('/js/waypoints.min.js', dirname(__FILE__)),
                        );
                    }

                    wp_enqueue_script(
                        $jsScriptName,
                        plugins_url($jsScriptPath, dirname(__FILE__)),
                    );

                    wp_localize_script($jsScriptName, $jsVarToPass, $meta);
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
        $post_content = (array)$wpdb->get_results(
            "SELECT * FROM {$wpdb->prefix}maxi_blocks_styles WHERE post_id = {$post->ID}",
            OBJECT
        )[0];

        if (!$post_content) {
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
            "SELECT custom_data_value FROM {$wpdb->prefix}maxi_blocks_custom_data WHERE post_id = {$id}",
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

        // It may connect to the API to centralize the default values there
        return (object) [
            'xs' => 480,
            's' => 768,
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

        foreach ($fonts as $font => $fontData) {
            if ($font) {
                $fontUrl = "https://fonts.googleapis.com/css2?family=$font:";
                if (!empty($fontData)) {
                    $fontWeight = array_key_exists('weight', $fontData) ? $fontData['weight'] : false;
                    $fontStyle = array_key_exists('style', $fontData) ? $fontData['style'] : false;

                    if (is_array($fontWeight)) {
                        $fontWeight = implode(',', $fontWeight);
                    }

                    if ($fontStyle === 'italic') {
                        $fontUrl .= 'ital,';
                    }

                    if (strpos($fontWeight, ',') !== false) {
                        $fontWeightArr = explode(',', $fontWeight);
                        sort($fontWeightArr);
                        $fontUrl .= 'wght@';
                        if ($fontStyle === 'italic') {
                            foreach ($fontWeightArr as $fw) {
                                $fontUrl .= '0,'.$fw.';';
                            }
                            foreach ($fontWeightArr as $fw) {
                                $fontUrl .= '1,'.$fw.';';
                            }
                        } else {
                            foreach ($fontWeightArr as $fw) {
                                $fontUrl .= $fw.';';
                            }
                        }
                        $fontUrl = rtrim($fontUrl, ';');
                    } elseif ($fontWeight) {
                        if ($fontStyle === 'italic') {
                            $fontUrl .= 'wght@0,'.$fontWeight.';1,'.$fontWeight;
                        } else {
                            $fontUrl .= 'wght@'.$fontWeight;
                        }
                    } else {
                        if ($fontStyle === 'italic') {
                            $fontUrl .= 'wght@0,400;1,400';
                        } else {
                            $fontUrl .= 'wght@400';
                        }
                    }
                } else {
                    $fontUrl = rtrim($fontUrl, ':');
                }
                
                wp_enqueue_style(
                    'maxi-'.sanitize_title_with_dashes($font),
                    $fontUrl
                );
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

        $resultArr = (array)$custom_data[0];
        $resultString = $resultArr['custom_data_value'];
        $result = maybe_unserialize($resultString);


        if (!$result || empty($result)) {
            return;
        }

        if (!isset($result[$metaJs])) {
            return;
        }

        $resultDecoded = $result[$metaJs];

        if (empty($resultDecoded)) {
            return;
        }

        return $resultDecoded;
    }

    public function update_color_palette_backups($style)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'maxi_blocks_general';
        $query =
            'SELECT object FROM ' . $table_name . ' where id = "sc_string"';

        $style_card = maybe_unserialize($wpdb->get_var($query));

        if (!$style_card) {
            return $style;
        }

        // Get used colors on the post style
        $needle = 'rgba(var(--maxi-';
        $lastPos = 0;
        $colors = array();

        while (($lastPos = strpos($style, $needle, $lastPos))!== false) {
            $endPos = strpos($style, ')', $lastPos);
            $colorStr = substr($style, $lastPos, $endPos - $lastPos + 1);

            if (!in_array($colorStr, $colors)) {
                $colors[] = $colorStr;
            }

            $lastPos = $lastPos + strlen($needle);
        }

        // Get color values from the SC considering the used on post style
        $colorVars = array();

        foreach ($colors as $color) {
            $color = str_replace('rgba(var(', '', $color);
            $colorVar = explode(',', $color)[0];
            $colorContent = str_replace($colorVar, '', $color);
            $colorContent = str_replace(')', '', $colorContent);
            $colorContent = ltrim($colorContent, ',');

            if (!in_array($colorVar, $colorVars)) {
                $colorVars[$colorVar] = $colorContent;
            }
        }

        $changedSCColors = array();

        $style_card = is_preview() || is_admin()
            ? $style_card['_maxi_blocks_style_card_preview']
            : $style_card['_maxi_blocks_style_card'];

        foreach ($colorVars as $colorKey => $colorValue) {
            $startPos = strpos($style_card, $colorKey);
            $endPos = strpos($style_card, ';--', $startPos);
            $colorSCValue = substr($style_card, $startPos + strlen($colorKey) + 1, $endPos - $startPos - strlen($colorKey) - 1);

            if ($colorSCValue !== $colorValue) {
                $changedSCColors[$colorKey] = $colorSCValue;
            }
        }

        // In case there are changes, fix them
        if (empty($changedSCColors)) {
            return $style;
        } else {
            $new_style = $style;

            foreach ($changedSCColors as $colorKey => $colorValue) {
                $old_color_str = "rgba(var($colorKey," . $colorVars[$colorKey] . ')';
                $new_color_str = "rgba(var($colorKey," . $colorValue . ')';

                $new_style = str_replace($old_color_str, $new_color_str, $new_style);
            }

            return $new_style;
        }
    }
}