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
        return $meta;
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
            foreach ( $prop as $className => $styles ) {
                if ( ! empty ((array)$styles->desktop) || property_exists($styles, 'font') ) {
                    $response .= ".{$target}{";
                        $response .= self::getResponsiveStyles($styles->desktop);
                        if ( property_exists($styles, 'font') ) {
                            $response .= "font-family: {$styles->font};";
                        }
                    $response .= '}';
                }
                if ( ! empty ((array)$styles->tablet) ) {
                    $response .= "@media only screen and (max-width: 768px) {.{$target}{";
                        $response .= self::getResponsiveStyles($styles->tablet);
                    $response .= '}}';
                }
                if ( ! empty ((array)$styles->mobile) ) {
                    $response .= "@media only screen and (max-width: 480px) {.{$target}{";
                        $response .= self::getResponsiveStyles($styles->mobile);
                    $response .= '}}';
                }
            }
        }

        return wp_strip_all_tags($response);
    }

    /**
     * Responsive styles
     */

    public function getResponsiveStyles($styles) {
        $response = '';
        $important = is_admin() ? ' !important' : '';
        foreach ( $styles as $property => $value ) {
            $property != 'sync' ?
                $response .= "{$property}: {$value}{$important};" :
                null;
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
        if ( empty( $meta ) )
            return;
        //$response = new ArrayObject();
        $response = [];
        foreach ( $meta as $target ) {
            if (property_exists($target, 'Typography')) {
                //$element = (object)[$target->Typography->font => $target->Typography->options];
                //array_push($response, $element);
                // $response->append($element)
                $response[$target->Typography->font] = $target->Typography->options;
            }
        }
        $obj = json_encode((object)$response);
        return "var fontsToLoad = $obj";
    }
}

ResponsiveFrontendStyles::register();