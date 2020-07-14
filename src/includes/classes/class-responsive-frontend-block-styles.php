<?php

class ResponsiveFrontendStyles
{
    /**
     * This plugin's instance.
     *
     * @var ResponsiveFrontendStyles
     */
    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new ResponsiveFrontendStyles();
        }
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_styles'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_styles'));
    }

    /**
     * Enqueuing styles
     */
    public function enqueue_styles()
    {
        // Inline styles
        wp_register_style('maxi-blocks', false);
        wp_enqueue_style('maxi-blocks');
        wp_add_inline_style('maxi-blocks', $this->styles());

        $this->fonts();
    }

    /**
     * Gets meta content
     */
    public function getMeta()
    {
        global $post;
        if (!$post || !isset($post->ID))
            return;

        $styles = get_option('mb_styles_api');

        if (!isset($styles[$post->ID]))
            return;

        $meta = is_preview() || is_admin() ?
            $styles[$post->ID]['_maxi_blocks_styles_preview'] :
            $styles[$post->ID]['_maxi_blocks_styles'];

        if (!!$meta && empty($meta))
            return;
        $meta = json_decode($meta);
        return $this->organizeMeta($meta);
    }

    /**
     * Organizes meta in order to avoid duplicate selectors on style element
     */
    public function organizeMeta($meta)
    {
        $response = [];
        foreach ($meta as $target => $fields) {
            $response[$target] = [];
            foreach ($fields as $field => $props) {
                if (property_exists($props, 'font')) :
                    $response[$target]['font'] = $props->font;
                    $response[$target]['options'] = $props->options;
                endif;
                if (isset($props->desktop)) {
                    foreach ($props->desktop as $prop => $value) {
                        $response[$target]['desktop'][$prop] = $value;
                    }
                }
                if (isset($props->tablet)) {
                    foreach ($props->tablet as $prop => $value) {
                        $response[$target]['tablet'][$prop] = $value;
                    }
                }
                if (isset($props->mobile)) {
                    foreach ($props->mobile as $prop => $value) {
                        $response[$target]['mobile'][$prop] = $value;
                    }
                }
                if (isset($props->breakpoints)) {
                    $response[$target]['breakpoints'] = '';
                    foreach ($props->breakpoints as $screen => $breakpoint) {
                        $rule = $breakpoint->rule ?? '';
                        $content = $breakpoint->content ?? '';

                        if (!!$rule && !!$content)
                            $response[$target]['breakpoints'] .= "@media only screen and ($rule) {.$target{ $content}}";
                    }
                }
            }
        }

        return $response;
    }

    /**
     * Retrieve meta values for each device
     */
    public function organizeResponsiveMeta($target, $deviceProps)
    {
        $response = [];
        foreach ($deviceProps as $prop => $value) {
            $response[$target]['desktop'][$prop] = $value;
        }
        return $response;
    }

    /**
     * Create styles
     */
    public function styles()
    {
        $meta = $this->getMeta();
        if (empty($meta))
            return;
        $response = '';

        foreach ($meta as $target => $prop) {
            $target = self::getTarget($target);
            $important = ' !important';

            if (isset($prop['desktop']) && !empty($prop['desktop']) || !isset($prop['font'])) {
                $response .= ".{$target}{";
                if (isset($prop['font']))
                    $response .= "font-family: {$prop['font']}{$important};";
                if (isset($prop['desktop']) && !empty($prop['desktop']))
                    $response .= self::getStyles($prop['desktop']);
                $response .= '}';
            };
            if (isset($prop['tablet']) && !empty($prop['tablet'])) {
                $response .= "@media only screen and (max-width: 768px) {.$target{";
                $response .= self::getStyles($prop['tablet']);
                $response .= '}}';
            }
            if (isset($prop['mobile']) && !empty($prop['mobile'])) {
                $response .= "@media only screen and (max-width: 480px) {.$target{";
                $response .= self::getStyles($prop['mobile']);
                $response .= '}}';
            }
            if (isset($prop['breakpoints']) && !empty($prop['breakpoints']))
                $response .= $prop['breakpoints'];
        }

        return wp_strip_all_tags($response);
    }

    /**
     * Retrieve a cleaned target
     */
    public function getTarget($target)
    {
        if (strpos($target, '__$:'))
            return str_replace('__$', '', $target);
        if (strpos($target, '__$>'))
            return str_replace('__$', '', $target);
        if (strpos($target, '__$#'))
            return str_replace('__$', '', $target);
        return str_replace('__$', ' .', $target);
    }

    /**
     * Responsive styles
     */
    public function getStyles($styles)
    {
        $response = '';
        foreach ($styles as $property => $value) {
            $response .= "{$property}: {$value};";
        }
        return $response;
    }

    /**
     * Post fonts
     *
     * @return object   Font name with font options
     */

    public function fonts()
    {
        $meta = $this->getMeta();

        if (empty($meta))
            return;

        $fontOptions = [];
        foreach ($meta as $target) {
            if (isset($target['font'])) {
                $fontOptions[$target['font']] = $target['options'];
            }
        }

        foreach ($fontOptions as $font => $options) {
            foreach ($options as $style => $link) {
                wp_enqueue_style(
                    "{$font}-{$style}",
                    "https://fonts.googleapis.com/css2?family={$font}"
                );
            }
        }
    }
}

ResponsiveFrontendStyles::register();
