<?php

class ResponsiveFrontendStyles {
    /**
     * This plugin's instance.
     *
     * @var ResponsiveFrontendStyles
     */
    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register() {
        if (null === self::$instance) {
            self::$instance = new ResponsiveFrontendStyles();
        }
    }

    /**
     * Constructor
     */
    public function __construct() {
        add_action('wp_enqueue_scripts', array($this, 'enqueue_styles'));
        add_action('admin_enqueue_scripts', array($this, 'enqueue_styles'));
    }

    /**
     * Enqueuing styles
     */
    public function enqueue_styles() {
        // Inline styles
        wp_register_style( 'gutenberg-extra', false );
        wp_enqueue_style( 'gutenberg-extra' );
        wp_add_inline_style('gutenberg-extra', $this->styles());

        // Inline fonts
        wp_register_script( 'gutenberg-extra-fonts', false );
        wp_enqueue_script( 'gutenberg-extra-fonts' );
        wp_add_inline_script(
            'gutenberg-extra-fonts',
            $this->fonts()
        );
    }

    /**
     * Gets meta content
     */
    public function getMeta () {
        global $post;
        if (!$post || !isset($post->ID))
            return;
        $meta = get_post_meta($post->ID, '_gutenberg_extra_responsive_styles', true);
        if (empty($meta))
            return;
        $meta = json_decode( $meta );
        return $this->organizeMeta($meta);
    }

    /**
     * Organizes meta in order to avoid duplicate selectors on style element
     */
    public function organizeMeta($meta) {
        $response = [];
        foreach ( $meta as $target => $fields ) {
            $response[$target] = [];
            foreach( $fields as $field => $props) {
                if ( property_exists($props, 'font') ) :
                    $response[$target]['font'] = $props->font;
                    $response[$target]['options'] = $props->options;
                endif;
                if (isset($props->desktop)) {
                    foreach( $props->desktop as $prop => $value ) {
                        $response[$target]['desktop'][$prop] = $value;
                    }
                }
                if (isset($props->tablet)) {
                    foreach( $props->tablet as $prop => $value ) {
                        $response[$target]['tablet'][$prop] = $value;
                    }
                }
                if (isset($props->mobile)) {
                    foreach( $props->mobile as $prop => $value ) {
                        $response[$target]['mobile'][$prop] = $value;
                    }
                }
            }
        }

        return $response;
    }

    /**
     * Retrieve meta values for each device
     */
    public function organizeResponsiveMeta($target, $deviceProps) {
        $response = [];
        foreach( $deviceProps as $prop => $value ) {
            $response[$target]['desktop'][$prop] = $value;
        }
        return $response;
    }

    /**
     * Create styles
     */
    public function styles() {
        $meta = $this->getMeta();
        if ( empty( $meta ) )
            return;
        $response = '';

        foreach ( $meta as $target => $prop ) {
            $target = str_replace( '__$', ' .', $target );
            if ( isset($prop['desktop']) && !empty ($prop['desktop']) || ! isset($prop['font']) ) {
                $response .= ".{$target}{";
                    if ( isset($prop['font']) )
                        $response .= "font-family: {$prop['font']};";
                    if (isset($prop['desktop']) && !empty ($prop['desktop']))
                        $response .= self::getStyles($prop['desktop']);
                $response .= '}';
            };
            if ( isset($prop['tablet']) && ! empty ($prop['tablet']) ) {
                $response .= "@media only screen and (max-width: 768px) {.{$target}{";
                    $response .= self::getStyles($prop['tablet']);
                $response .= '}}';
            }
            if ( isset($prop['mobile']) && ! empty ($prop['mobile']) ) {
                $response .= "@media only screen and (max-width: 480px) {.{$target}{";
                    $response .= self::getStyles($prop['mobile']);
                $response .= '}}';
            }
        }

        return wp_strip_all_tags($response);
    }

    /**
     * Responsive styles
     */
    public function getStyles($styles) {
        $response = '';
        $important = is_admin() ? ' !important' : '';
        foreach ( $styles as $property => $value ) {
            $response .= "{$property}: {$value}{$important};";
        }
        return $response;
    }

    /**
     * Post fonts
     *
     * @return object   Font name with font options
     */

    public function fonts() {
        $meta = $this->getMeta();
        var_dump($meta);
        if ( empty( $meta ) )
            return;
        $response = [];
        foreach ( $meta as $target ) {
            if (isset($target['font'])) {
                $response[$target['font']] = $target['options'];
            }
        }
        $obj = json_encode((object)$response);
        return "var fontsToLoad = $obj";
    }
}

ResponsiveFrontendStyles::register();