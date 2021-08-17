<?php

class MaxiBlocks_StyleCards {
	/**
	 * This plugin's instance.
	 *
	 * @var MaxiBlocks_StyleCards
	 */
	private static $instance;

	/**
	 * Registers the plugin.
	 */
	public static function register() {
		if (null === self::$instance) {
			self::$instance = new MaxiBlocks_StyleCards();
		}
	}

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action('admin_enqueue_scripts', [$this, 'enqueue_styles']);
		add_action('wp_enqueue_scripts', [$this, 'enqueue_styles']);
	}

	/**
	 * Enqueuing styles
	 */
	public function enqueue_styles() {
		$vars = $this->getStylesString();

		// Inline styles
		if ($vars) {
			wp_register_style('maxi-blocks-sc-vars', false);
			wp_enqueue_style('maxi-blocks-sc-vars');
			wp_add_inline_style('maxi-blocks-sc-vars', $vars);

			$this->enqueue_fonts($vars);
		}
	}

	/**
	 * Get SC
	 */
	public function getStylesString() {
		$style_card = get_option('mb_sc_string');

		if (!$style_card) {
			return false;
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
			return false;
		}

		return $style;
	}

	public function get_maxi_blocks_current_style_cards() {
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

	public function get_maxi_blocks_active_style_card() {
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

	public function enqueue_fonts($vars) {
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

	public static function getDefaultStyleCard() {
		$json = '{
			"sc_maxi": {
				"name": "Maxi (Default)",
				"status": "active",
				"dark": {
					"styleCard": {},
					"defaultStyleCard": {
						"color": {
							"1": "8,18,25",
							"2": "6,39,57",
							"3": "155,155,155",
							"4": "255,74,23",
							"5": "255,255,255",
							"6": "201,52,10",
							"7": "245,245,245"
						},
						"p": {
							"color-global": false,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 18,
							"font-size-unit-xxl": "px",
							"font-size-xl": 16,
							"font-size-unit-xl": "px",
							"line-height-xxl": 1.5,
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
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 50,
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
							"line-height-xxl": 1.18,
							"line-height-xl": 1.1,
							"line-height-l": 1.22,
							"line-height-m": 1.27,
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
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 44,
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
							"line-height-xxl": 1.21,
							"line-height-xl": 1.05,
							"line-height-l": 1.26,
							"line-height-m": 1.33,
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
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 34,
							"font-size-unit-xxl": "px",
							"font-size-xl": 30,
							"font-size-unit-xl": "px",
							"font-size-m": 26,
							"font-size-unit-m": "px",
							"font-size-s": 24,
							"font-size-unit-s": "px",
							"line-height-xxl": 1.25,
							"line-height-xl": 1.3,
							"line-height-l": 1.23,
							"line-height-m": 1.16,
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
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 30,
							"font-size-unit-xxl": "px",
							"font-size-xl": 26,
							"font-size-unit-xl": "px",
							"font-size-l": 24,
							"font-size-unit-l": "px",
							"font-size-s": 22,
							"font-size-unit-s": "px",
							"line-height-xxl": 1.33,
							"line-height-xl": 1.24,
							"line-height-l": 1.38,
							"line-height-m": 1.42,
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
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 26,
							"font-size-unit-xxl": "px",
							"font-size-xl": 22,
							"font-size-unit-xl": "px",
							"font-size-m": 20,
							"font-size-unit-m": "px",
							"line-height-xxl": 1.36,
							"line-height-xl": 1.26,
							"line-height-l": 1.45,
							"line-height-m": 1.5,
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
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 24,
							"font-size-unit-xxl": "px",
							"font-size-xl": 20,
							"font-size-unit-xl": "px",
							"font-size-m": 18,
							"font-size-unit-m": "px",
							"line-height-xxl": 1.39,
							"line-height-xl": 1.29,
							"line-height-l": 1.5,
							"line-height-m": 1.56,
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
							"border-color": "",
							"hover-border-color-global": false,
							"hover-border-color": "",
							"color-global": false,
							"color": "",
							"hover-color-global": false,
							"hover-color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 22,
							"font-size-unit-xxl": "px",
							"font-size-xl": 18,
							"font-size-unit-xl": "px",
							"font-size-l": 16,
							"font-size-unit-l": "px",
							"line-height-xxl": 1.5,
							"line-height-xl": 1.625,
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"font-weight-general": 400,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"text-decoration-general": "unset",
							"background-color-global": false,
							"background-color": "",
							"hover-background-color-global": false,
							"hover-background-color": ""
						},
						"link": {
							"link-color-global": false,
							"link-color": "",
							"hover-color-global": false,
							"hover-color": "",
							"active-color-global": false,
							"active-color": "",
							"visited-color-global": false,
							"visited-color": ""
						},
						"icon": {
							"line-global": false,
							"line": "",
							"fill-global": false,
							"fill": ""
						},
						"divider": {
							"color-global": false,
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
							"7": "8,18,25"
						},
						"p": {
							"color-global": false,
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 18,
							"font-size-unit-xxl": "px",
							"font-size-xl": 16,
							"font-size-unit-xl": "px",
							"line-height-xxl": 1.5,
							"line-height-xl": 1.625,
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
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 50,
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
							"line-height-xxl": 1.18,
							"line-height-xl": 1.1,
							"line-height-l": 1.22,
							"line-height-m": 1.27,
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
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 44,
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
							"line-height-xxl": 1.21,
							"line-height-xl": 1.05,
							"line-height-l": 1.26,
							"line-height-m": 1.33,
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
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 34,
							"font-size-unit-xxl": "px",
							"font-size-xl": 30,
							"font-size-unit-xl": "px",
							"font-size-l": 30,
							"font-size-unit-l": "px",
							"font-size-m": 26,
							"font-size-unit-m": "px",
							"font-size-s": 24,
							"font-size-unit-s": "px",
							"line-height-xxl": 1.25,
							"line-height-xl": 1.3,
							"line-height-l": 1.23,
							"line-height-m": 1.16,
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
							"color": "",

							"font-family-general": "Roboto",
							"font-size-xxl": 30,
							"font-size-unit-xxl": "px",
							"font-size-xl": 26,
							"font-size-unit-xl": "px",
							"font-size-l": 24,
							"font-size-unit-l": "px",
							"font-size-s": 22,
							"font-size-unit-s": "px",
							"line-height-xxl": 1.33,
							"line-height-xl": 1.24,
							"line-height-l": 1.38,
							"line-height-m": 1.42,
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
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 28,
							"font-size-unit-xxl": "px",
							"font-size-xl": 22,
							"font-size-unit-xl": "px",
							"font-size-m": 20,
							"font-size-unit-m": "px",
							"line-height-xxl": 1.36,
							"line-height-xl": 1.26,
							"line-height-l": 1.45,
							"line-height-m": 1.5,
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
							"color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 24,
							"font-size-unit-xxl": "px",
							"font-size-xl": 20,
							"font-size-unit-xl": "px",
							"font-size-m": 18,
							"font-size-unit-m": "px",
							"line-height-xxl": 1.39,
							"line-height-xl": 1.29,
							"line-height-l": 1.5,
							"line-height-m": 1.56,
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
							"border-color": "",
							"hover-border-color-global": false,
							"hover-border-color": "",
							"color-global": false,
							"color": "",
							"hover-color-global": false,
							"hover-color": "",
							"font-family-general": "Roboto",
							"font-size-xxl": 22,
							"font-size-unit-xxl": "px",
							"font-size-xl": 18,
							"font-size-unit-xl": "px",
							"font-size-l": 16,
							"font-size-unit-l": "px",
							"line-height-xxl": 1.5,
							"line-height-xl": 1.625,
							"font-weight-general": 400,
							"text-transform-general": "none",
							"font-style-general": "normal",
							"letter-spacing-xxl": 0,
							"letter-spacing-unit-xxl": "px",
							"letter-spacing-xl": 0,
							"letter-spacing-unit-xl": "px",
							"text-decoration-general": "unset",
							"background-color-global": false,
							"background-color": "",
							"hover-background-color-global": false,
							"hover-background-color": ""
						},
						"link": {
							"link-color-global": false,
							"link-color": "",
							"hover-color-global": false,
							"hover-color": "",
							"active-color-global": false,
							"active-color": "",
							"visited-color-global": false,
							"visited-color": ""
						},
						"icon": {
							"line-global": false,
							"line": "",
							"fill-global": false,
							"fill": ""
						},
						"divider": {
							"color-global": false,
							"color": ""
						}
					}
				}
			}
		}';

		return $json;
	}
}