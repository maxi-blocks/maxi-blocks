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

    public function write_log($log)
    {
        if (is_array($log) || is_object($log)) {
            error_log(print_r($log, true));
        } else {
            error_log($log);
        }
    }
        

    /**
     * Enqueuing styles
     */
    public function enqueue_styles()
    {
        $post_content = $this->getPostContent();
        $styles = $this->getStyles($post_content);
        $fonts = $this->getFonts($post_content);

        $needCustomMeta = $post_content['prev_active_custom_data'] === true || $post_content['active_custom_data'] === true;

        $this->write_log($needCustomMeta);

        if ($styles) {
            // Inline styles
            wp_register_style('maxi-blocks', false);
            wp_enqueue_style('maxi-blocks');
            wp_add_inline_style('maxi-blocks', $styles);
        }
        if ($fonts) {
            $this->enqueue_fonts($fonts);
        }

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

        return  explode(',', $fonts);
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
        if (!is_array($fonts)) {
            $fonts = [];
        }

        if (!array_key_exists('Roboto', $fonts)) {
            array_push($fonts, 'Roboto');
        }

        foreach ($fonts as $font) {
            wp_enqueue_style(
                $font,
                "https://fonts.googleapis.com/css2?family=$font:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900",
            );
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
}