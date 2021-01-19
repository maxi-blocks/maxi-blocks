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

		wp_localize_script(
			'maxi-front-scripts-js',
			'maxi_custom_data',
			array(
				'custom_data' => $this->customMeta()
			)
		);

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

        $styles = get_option("mb_post_api_{$post->ID}");

        if (!$styles)
            return;

        $meta = is_preview() || is_admin() ?
            $styles['_maxi_blocks_styles_preview'] :
            $styles['_maxi_blocks_styles'];

        if (!$meta || empty($meta))
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
            $response[$target] = [
                'breakpoints' => $fields->breakpoints,
                'content' => []
            ];
            foreach ($fields->content as $field => $props) {
                foreach ($props as $prop => $value) {
                    if (!isset($response[$target]['content'][$prop]))
                        $response[$target]['content'][$prop] = [];

                    $response[$target]['content'][$prop] =
                        array_merge($response[$target]['content'][$prop], (array) $value);
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

        foreach ($meta as $target => $element) {
            $target = self::getTarget($target);
            $breakpoints = $element['breakpoints'];
            $content = $element['content'];

            if (isset($content['general']) && !empty($content['general'])) {
                $response .= "body.maxi-blocks--active .maxi-block.$target{";
                $response .= self::getStyles($content['general']);
                $response .= '}';
            }
            if (isset($content['xxl']) && !empty($content['xxl'])) {
                $xxl = intval($breakpoints->xl) + 1;
                $response .= "@media only screen and (min-width: {$xxl}px) {body.maxi-blocks--active .maxi-block.$target{";
                $response .= self::getStyles($content['xxl']);
                $response .= '}}';
            }
            if (isset($content['xl']) && !empty($content['xl'])) {
                $response .= "@media only screen and (max-width: {$breakpoints->xl}px) {body.maxi-blocks--active .maxi-block.$target{";
                $response .= self::getStyles($content['xl']);
                $response .= '}}';
            }
            if (isset($content['l']) && !empty($content['l'])) {
                $response .= "@media only screen and (max-width: {$breakpoints->l}px) {body.maxi-blocks--active .maxi-block.$target{";
                $response .= self::getStyles($content['l']);
                $response .= '}}';
            }
            if (isset($content['m']) && !empty($content['m'])) {
                $response .= "@media only screen and (max-width: {$breakpoints->m}px) {body.maxi-blocks--active .maxi-block.$target{";
                $response .= self::getStyles($content['m']);
                $response .= '}}';
            }
            if (isset($content['s']) && !empty($content['s'])) {
                $response .= "@media only screen and (max-width: {$breakpoints->s}px) {body.maxi-blocks--active .maxi-block.$target{";
                $response .= self::getStyles($content['s']);
                $response .= '}}';
            }
            if (isset($content['xs']) && !empty($content['xs'])) {
                $response .= "@media only screen and (max-width: {$breakpoints->xs}px) {body.maxi-blocks--active .maxi-block.$target{";
                $response .= self::getStyles($content['xs']);
                $response .= '}}';
            }
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
            if ($property === 'font-options')
                continue;

            if ($property === 'max-width')
                $response .= "{$property}: {$value} !important;";
            else $response .= "{$property}: {$value};";


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
            foreach ($target['content'] as $breakpoint) {
                if (array_key_exists('font-family', $breakpoint)) {
                    $font_style = array_key_exists('font-style', $breakpoint) ? $breakpoint['font-style'] : 'normal';
                    $fontOptions[$breakpoint['font-family'] . '-' . $font_style] = $font_style;
                }
            }
        }

        foreach ($fontOptions as $font => $value) {
            $font_name = substr($font, 0, strpos($font,'-'));
            wp_enqueue_style(
                "{$font}",
                "https://fonts.googleapis.com/css2?family={$font_name}"
            );
        }
    }

    /**
     * Custom Meta
     */
    public function customMeta()
    {
        global $post;
        if (!$post || !isset($post->ID))
            return;

        $custom_data = get_option("mb_custom_data_{$post->ID}");

        if (!$custom_data)
            return;

        $result = $custom_data['custom_data'];

        if (!$result || empty($result))
            return;

        return json_decode($result);
    }
}

ResponsiveFrontendStyles::register();