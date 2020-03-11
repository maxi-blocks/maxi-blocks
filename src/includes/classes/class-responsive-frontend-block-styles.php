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
     * Footer Styling
     */
    public function enqueue_styles() {
        wp_register_style( 'gutenberg-extra', false );
        wp_enqueue_style( 'gutenberg-extra' );
        wp_add_inline_style('gutenberg-extra', $this->styles());
    }

    /**
     * Create styles
     */
    public function styles() {
        global $post;
        if (!$post || !isset($post->ID))
            return;
        $meta = get_post_meta($post->ID, '_gutenberg_extra_responsive_styles', true);
        if (empty($meta))
            return;
        $meta = json_decode( $meta );
        $response = '';
        
        foreach ( $meta as $target => $prop ) {
            foreach ( $prop as $className => $styles ) {
                $unit = $styles->unit;
                $response .= ".{$target}{";
                    $response .= self::getResponsiveStyles($styles->desktop, $unit);
                $response .= '}';
                $response .= "@media only screen and (max-width: 768px) {.{$target}{";
                    $response .= self::getResponsiveStyles($styles->tablet, $unit);
                $response .= '}}';
                $response .= "@media only screen and (max-width: 480px) {.{$target}{";
                    $response .= self::getResponsiveStyles($styles->mobile, $unit);
                $response .= '}}';
            }
        }

        return wp_strip_all_tags($response);
    }

    /**
     * Responsive styles
     */

    public function getResponsiveStyles($styles, $unit) {
        $response = '';
        $important = is_admin() ? ' !important' : '';
        foreach ( $styles as $property => $value ) {
            $property != 'sync' ?
                $response .= "{$property}: {$value}{$unit}{$important};" :
                null;
        }
        return $response;
    }
}

ResponsiveFrontendStyles::register();