<?php

class MaxiBlocks_StyleCards
{
    /**
     * This plugin's instance.
     *
     * @var MaxiBlocks_StyleCards
     */
    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_StyleCards();
        }
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        add_action('admin_enqueue_scripts', [$this, 'enqueue_styles']);
        add_action('wp_enqueue_scripts', [$this, 'enqueue_styles']);
    }

    /**
     * Enqueuing styles
     */
    public function enqueue_styles()
    {
        $vars = $this->getStylesString();

        // Inline styles
        if ($vars) {
            wp_register_style('maxi-blocks-sc-vars', false);
            wp_enqueue_style('maxi-blocks-sc-vars');
            wp_add_inline_style('maxi-blocks-sc-vars', $vars);

        // $this->enqueue_fonts($vars);
        } else {
            wp_register_style('maxi-blocks-sc-vars', false);
            wp_enqueue_style('maxi-blocks-sc-vars');
            wp_add_inline_style('maxi-blocks-sc-vars', 'Murphy is here!');
        }
    }

    /**
     * Get SC
     */
    public function getStylesString()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'maxi_blocks_general'; // table name
        $query =
            'SELECT object FROM ' .
            $table_name .
            ' where id = "sc_string"';
        
        $style_card =  maybe_unserialize($wpdb->get_var($query));

        if (!$style_card) {
            return 'no style_card on maybe_unserialize';
        }

        $style =
            is_preview() || is_admin()
                ? $style_card['_maxi_blocks_style_card_preview']
                : $style_card['_maxi_blocks_style_card'];

        if (!$style || empty($style)) {
            $style =
                is_preview() || is_admin() // If one fail, let's test the other one!
                    ? $style_card['_maxi_blocks_style_card']
                    : $style_card['_maxi_blocks_style_card_preview'];
        }

        if (!$style || empty($style)) {
            return 'empty($style)';
        }

        return $style;
    }

    public function get_maxi_blocks_current_style_cards()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'maxi_blocks_general'; // table name
        $query =
            'SELECT object FROM ' .
            $table_name .
            ' where id = "style_cards_current"';
        $maxi_blocks_style_cards_current = $wpdb->get_var($query);
        if (
            $maxi_blocks_style_cards_current &&
            !empty($maxi_blocks_style_cards_current)
        ) {
            return $maxi_blocks_style_cards_current;
        } else {
            $defaultStyleCard = $this->getDefaultStyleCard();

            $wpdb->replace($table_name, [
                'id' => 'style_cards_current',
                'object' => $defaultStyleCard,
            ]);
            $maxi_blocks_style_cards_current = $wpdb->get_var($query);
            return $maxi_blocks_style_cards_current;
        }
    }

    public function get_maxi_blocks_active_style_card()
    {
        $maxi_blocks_style_cards = $this->get_maxi_blocks_current_style_cards();

        $maxi_blocks_style_cards_array = json_decode(
            $maxi_blocks_style_cards,
            true,
        );

        foreach ($maxi_blocks_style_cards_array as $key => $sc) {
            if ($sc['status'] === 'active') {
                return $sc;
            }
        }
        return false;
    }

    public function enqueue_fonts($vars)
    {
        preg_match_all('/font-family-general:(\w+);/', $vars, $fonts);
        $fonts = array_unique($fonts[1]);

        if (empty($fonts)) {
            return;
        }

        foreach ($fonts as $font) {
            wp_enqueue_style(
                "{$font}",
                "https://fonts.googleapis.com/css2?family={$font}",
            );
        }
    }

    public static function getDefaultStyleCard()
    {
        $json = '{
			"sc_maxi": {
				"name": "Maxi (Default)",
				"status": "active",
				"dark": {
					"styleCard": {},
					"defaultStyleCard": {
						"color": {
							"1": "8,18,25",
							"2": "5,23,33",
							"3": "155,155,155",
							"4": "255,74,23",
							"5": "255,255,255",
							"6": "201,52,10",
							"7": "245,245,245",
							"8": "9,60,88"
						},
						"p": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 3,
							"palette-opacity": 1,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 24,
							"font-size-unit-xxl": "px",
							"font-size-xl": 16,
							"font-size-unit-xl": "px",
							"line-height-xxl": 34,
							"line-height-unit-xxl": "px",
							"line-height-xl": 26,
							"line-height-unit-xl": "px",
							"font-weight-general": 400,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset"
						},
						"h1": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 5,
							"palette-opacity": 1,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 65,
							"font-size-unit-xxl": "px",
							"font-size-xl": 45,
							"font-size-unit-xl": "px",
							"font-size-l": 40,
							"font-size-unit-l": "px",
							"font-size-m": 36,
							"font-size-unit-m": "px",
							"font-size-s": 34,
							"font-size-unit-s": "px",
							"font-size-xs": 32,
							"font-size-unit-xs": "px",
							"line-height-xxl": 75,
							"line-height-unit-xxl": "px",
							"line-height-xl": 55,
							"line-height-unit-xl": "px",
							"line-height-l": 50,
							"line-height-unit-l": "px",
							"line-height-m": 46,
							"line-height-unit-m": "px",
							"line-height-s": 44,
							"line-height-unit-s": "px",
							"line-height-xs": 42,
							"line-height-unit-xs": "px",
							"font-weight-general": 500,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset"
						},
						"h2": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 5,
							"palette-opacity": 1,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 55,
							"font-size-unit-xxl": "px",
							"font-size-xl": 38,
							"font-size-unit-xl": "px",
							"font-size-l": 36,
							"font-size-unit-l": "px",
							"font-size-m": 32,
							"font-size-unit-m": "px",
							"font-size-s": 30,
							"font-size-unit-s": "px",
							"font-size-xs": 28,
							"font-size-unit-xs": "px",
							"line-height-xxl": 65,
							"line-height-unit-xxl": "px",
							"line-height-xl": 48,
							"line-height-unit-xl": "px",
							"line-height-l": 46,
							"line-height-unit-l": "px",
							"line-height-m": 42,
							"line-height-unit-m": "px",
							"line-height-s": 40,
							"line-height-unit-s": "px",
							"line-height-xs": 38,
							"line-height-unit-xs": "px",
							"font-weight-general": 500,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset"
						},
						"h3": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 5,
							"palette-opacity": 1,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 45,
							"font-size-unit-xxl": "px",
							"font-size-xl": 30,
							"font-size-unit-xl": "px",
							"font-size-m": 26,
							"font-size-unit-m": "px",
							"font-size-s": 24,
							"font-size-unit-s": "px",
							"line-height-xxl": 55,
							"line-height-unit-xxl": "px",
							"line-height-xl": 40,
							"line-height-unit-xl": "px",
							"line-height-m": 36,
							"line-height-unit-m": "px",
							"line-height-s": 34,
							"line-height-unit-s": "px",
							"font-weight-general": 500,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset"
						},
						"h4": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 5,
							"palette-opacity": 1,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 38,
							"font-size-unit-xxl": "px",
							"font-size-xl": 26,
							"font-size-unit-xl": "px",
							"font-size-l": 24,
							"font-size-unit-l": "px",
							"font-size-s": 22,
							"font-size-unit-s": "px",
							"line-height-xxl": 48,
							"line-height-unit-xxl": "px",
							"line-height-xl": 36,
							"line-height-unit-xl": "px",
							"line-height-l": 34,
							"line-height-unit-l": "px",
							"line-height-s": 32,
							"line-height-unit-s": "px",
							"font-weight-general": 500,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset"
						},
						"h5": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 5,
							"palette-opacity": 1,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 34,
							"font-size-unit-xxl": "px",
							"font-size-xl": 22,
							"font-size-unit-xl": "px",
							"font-size-m": 20,
							"font-size-unit-m": "px",
							"line-height-xxl": 44,
							"line-height-unit-xxl": "px",
							"line-height-xl": 32,
							"line-height-unit-xl": "px",
							"line-height-m": 30,
							"line-height-unit-m": "px",
							"font-weight-general": 500,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset"
						},
						"h6": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 5,
							"palette-opacity": 1,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 30,
							"font-size-unit-xxl": "px",
							"font-size-xl": 20,
							"font-size-unit-xl": "px",
							"font-size-m": 18,
							"font-size-unit-m": "px",
							"line-height-xxl": 40,
							"line-height-unit-xxl": "px",
							"line-height-xl": 30,
							"line-height-unit-l": "px",
							"line-height-m": 28,
							"line-height-unit-m": "px",
							"font-weight-general": 500,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset"
						},
						"button": {
							"border-color-global": false,
							"border-palette-status": true,
							"border-palette-color": 5,
							"border-palette-opacity": 1,
							"border-color": "",
							"hover-border-color-global": false,
							"hover-border-color-all": false,
							"hover-border-palette-status": true,
							"hover-border-palette-color": 6,
							"hover-border-palette-opacity": 1,
							"hover-border-color": "",
							"color-global": false,
							"palette-status": true,
							"palette-color": 1,
							"palette-opacity": 1,
							"color": "",
							"hover-color-global": false,
							"hover-color-all": false,
							"hover-palette-status": true,
							"hover-palette-color": 5,
							"hover-palette-opacity": 1,
							"hover-color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 24,
							"font-size-unit-xxl": "px",
							"font-size-xl": 16,
							"font-size-unit-xl": "px",
							"line-height-xl": 100,
							"line-height-unit-xl": "%",
							"font-weight-general": 400,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset",
							"background-color-global": false,
							"background-palette-status": true,
							"background-palette-color": 4,
							"background-palette-opacity": 1,
							"background-color": "",
							"hover-background-color-global": false,
							"hover-background-color-all": false,
							"hover-background-palette-status": true,
							"hover-background-palette-color": 6,
							"hover-background-palette-opacity": 1,
							"hover-background-color": ""
						},
						"link": {
							"link-color-global": false,
							"link-palette-status": true,
							"link-palette-color": 4,
							"link-palette-opacity": 1,
							"link-color": "",
							"hover-color-global": false,
							"hover-palette-status": true,
							"hover-palette-color": 6,
							"hover-palette-opacity": 1,
							"hover-color": "",
							"active-color-global": false,
							"active-palette-status": true,
							"active-palette-color": 6,
							"active-palette-opacity": 1,
							"active-color": "",
							"visited-color-global": false,
							"visited-palette-status": true,
							"visited-palette-color": 6,
							"visited-palette-opacity": 1,
							"visited-color": ""
						},
						"icon": {
							"line-global": false,
							"line-palette-status": true,
							"line-palette-color": 7,
							"line-palette-opacity": 1,
							"line": "",
							"fill-global": false,
							"fill-palette-status": true,
							"fill-palette-color": 4,
							"fill-palette-opacity": 1,
							"fill": ""
						},
						"divider": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 1,
							"palette-opacity": 1,
							"color": ""
						}
					}
				},
				"light": {
					"styleCard": {},
					"defaultStyleCard": {
						"color": {
							"1": "255,255,255",
							"2": "242,249,253",
							"3": "155,155,155",
							"4": "255,74,23",
							"5": "0,0,0",
							"6": "201,52,10",
							"7": "8,18,25",
							"8": "150,176,203"
						},
						"p": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 3,
							"palette-opacity": 1,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 24,
							"font-size-unit-xxl": "px",
							"font-size-xl": 16,
							"font-size-unit-xl": "px",
							"line-height-xxl": 34,
							"line-height-unit-xxl": "px",
							"line-height-xl": 26,
							"line-height-unit-xl": "px",
							"font-weight-general": 400,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset"
						},
						"h1": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 5,
							"palette-opacity": 1,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 65,
							"font-size-unit-xxl": "px",
							"font-size-xl": 45,
							"font-size-unit-xl": "px",
							"font-size-l": 40,
							"font-size-unit-l": "px",
							"font-size-m": 36,
							"font-size-unit-m": "px",
							"font-size-s": 34,
							"font-size-unit-s": "px",
							"font-size-xs": 32,
							"font-size-unit-xs": "px",
							"line-height-xxl": 75,
							"line-height-unit-xxl": "px",
							"line-height-xl": 55,
							"line-height-unit-xl": "px",
							"line-height-l": 50,
							"line-height-unit-l": "px",
							"line-height-m": 46,
							"line-height-unit-m": "px",
							"line-height-s": 44,
							"line-height-unit-s": "px",
							"line-height-xs": 42,
							"line-height-unit-xs": "px",
							"font-weight-general": 500,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset"
						},
						"h2": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 5,
							"palette-opacity": 1,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 55,
							"font-size-unit-xxl": "px",
							"font-size-xl": 38,
							"font-size-unit-xl": "px",
							"font-size-l": 36,
							"font-size-unit-l": "px",
							"font-size-m": 32,
							"font-size-unit-m": "px",
							"font-size-s": 30,
							"font-size-unit-s": "px",
							"font-size-xs": 28,
							"font-size-unit-xs": "px",
							"line-height-xxl": 65,
							"line-height-unit-xxl": "px",
							"line-height-xl": 48,
							"line-height-unit-xl": "px",
							"line-height-l": 46,
							"line-height-unit-l": "px",
							"line-height-m": 42,
							"line-height-unit-m": "px",
							"line-height-s": 40,
							"line-height-unit-s": "px",
							"line-height-xs": 38,
							"line-height-unit-xs": "px",
							"font-weight-general": 500,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset"
						},
						"h3": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 5,
							"palette-opacity": 1,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 45,
							"font-size-unit-xxl": "px",
							"font-size-xl": 30,
							"font-size-unit-xl": "px",
							"font-size-m": 26,
							"font-size-unit-m": "px",
							"font-size-s": 24,
							"font-size-unit-s": "px",
							"line-height-xxl": 55,
							"line-height-unit-xxl": "px",
							"line-height-xl": 40,
							"line-height-unit-xl": "px",
							"line-height-m": 36,
							"line-height-unit-m": "px",
							"line-height-s": 34,
							"line-height-unit-s": "px",
							"font-weight-general": 500,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset"
						},
						"h4": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 5,
							"palette-opacity": 1,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 38,
							"font-size-unit-xxl": "px",
							"font-size-xl": 26,
							"font-size-unit-xl": "px",
							"font-size-l": 24,
							"font-size-unit-l": "px",
							"font-size-s": 22,
							"font-size-unit-s": "px",
							"line-height-xxl": 48,
							"line-height-unit-xxl": "px",
							"line-height-xl": 36,
							"line-height-unit-xl": "px",
							"line-height-l": 34,
							"line-height-unit-l": "px",
							"line-height-s": 32,
							"line-height-unit-s": "px",
							"font-weight-general": 500,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset"
						},
						"h5": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 5,
							"palette-opacity": 1,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 34,
							"font-size-unit-xxl": "px",
							"font-size-xl": 22,
							"font-size-unit-xl": "px",
							"font-size-m": 20,
							"font-size-unit-m": "px",
							"line-height-xxl": 44,
							"line-height-unit-xxl": "px",
							"line-height-xl": 32,
							"line-height-unit-xl": "px",
							"line-height-m": 30,
							"line-height-unit-m": "px",
							"font-weight-general": 500,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset"
						},
						"h6": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 5,
							"palette-opacity": 1,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 30,
							"font-size-unit-xxl": "px",
							"font-size-xl": 20,
							"font-size-unit-xl": "px",
							"font-size-m": 18,
							"font-size-unit-m": "px",
							"line-height-xxl": 40,
							"line-height-unit-xxl": "px",
							"line-height-xl": 30,
							"line-height-unit-l": "px",
							"line-height-m": 28,
							"line-height-unit-m": "px",
							"font-weight-general": 500,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset"
						},
						"button": {
							"border-color-global": false,
							"border-palette-status": true,
							"border-palette-color": 5,
							"border-palette-opacity": 1,
							"border-color": "",
							"hover-border-color-global": false,
							"hover-border-color-all": false,
							"hover-border-palette-status": true,
							"hover-border-palette-color": 6,
							"hover-border-palette-opacity": 1,
							"hover-border-color": "",
							"color-global": false,
							"palette-status": true,
							"palette-color": 1,
							"palette-opacity": 1,
							"color": "",
							"hover-color-global": false,
							"hover-color-all": false,
							"hover-palette-status": true,
							"hover-palette-color": 5,
							"hover-palette-opacity": 1,
							"hover-color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 24,
							"font-size-unit-xxl": "px",
							"font-size-xl": 16,
							"font-size-unit-xl": "px",
							"line-height-xl": 100,
							"line-height-unit-xl": "%",
							"font-weight-general": 400,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset",
							"background-color-global": false,
							"background-palette-status": true,
							"background-palette-color": 4,
							"background-palette-opacity": 1,
							"background-color": "",
							"hover-background-color-global": false,
							"hover-background-color-all": false,
							"hover-background-palette-status": true,
							"hover-background-palette-color": 6,
							"hover-background-palette-opacity": 1,
							"hover-background-color": ""
						},
						"link": {
							"link-color-global": false,
							"link-palette-status": true,
							"link-palette-color": 4,
							"link-palette-opacity": 1,
							"link-color": "",
							"hover-color-global": false,
							"hover-palette-status": true,
							"hover-palette-color": 6,
							"hover-palette-opacity": 1,
							"hover-color": "",
							"active-color-global": false,
							"active-palette-status": true,
							"active-palette-color": 6,
							"active-palette-opacity": 1,
							"active-color": "",
							"visited-color-global": false,
							"visited-palette-status": true,
							"visited-palette-color": 6,
							"visited-palette-opacity": 1,
							"visited-color": ""
						},
						"icon": {
							"line-color-global": false,
							"line-palette-status": true,
							"line-palette-color": 7,
							"line-palette-opacity": 1,
							"line": "",
							"fill-color-global": false,
							"fill-palette-status": true,
							"fill-palette-color": 4,
							"fill-palette-opacity": 1,
							"fill": ""
						},
						"divider": {
							"color-global": false,
							"palette-status": true,
							"palette-color": 1,
							"palette-opacity": 1,
							"color": ""
						}
					}
				}
			}
		}';

        return $json;
    }
}