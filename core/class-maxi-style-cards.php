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
		$vars = $this->sc_vars();

		// Inline styles
		if ($vars) {
			wp_register_style('maxi-blocks-sc-vars', false);
			wp_enqueue_style('maxi-blocks-sc-vars');
			wp_add_inline_style('maxi-blocks-sc-vars', $vars);
		}
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

	/**
	 * Create variables
	 */
	public function sc_vars() {
		$maxi_blocks_active_style_card_array = $this->get_maxi_blocks_active_style_card();
		$response = ':root{';
		$styles = ['light', 'dark'];
		$elements = ['button', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'divider'];
		$breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
		$settings = [
			'font-family',
			'font-size',
			'font-style',
			'font-weight',
			'line-height',
			'text-decoration',
			'text-transform',
			'letter-spacing',
		];
		$settingToAvoidInGeneral = [
			'font-size',
			'line-height',
			'letter-spacing',
		];
		$fonts = [];

		$dark = array_merge(
			$maxi_blocks_active_style_card_array["styleCardDefaults"]["dark"],
			$maxi_blocks_active_style_card_array["styleCard"]["dark"]
		);
		$light = array_merge(
			$maxi_blocks_active_style_card_array["styleCardDefaults"]["light"],
			$maxi_blocks_active_style_card_array["styleCard"]["light"]
		);
		$SC = [
			'dark' 	=> $dark,
			'light' => $light
		];

		if ($maxi_blocks_active_style_card_array) {
			foreach ($styles as $style ) {
				foreach ($elements as $element) {
					if ($element !== 'divider') {
						foreach ($settings as $setting) {
							foreach ($breakpoints as $breakpoint ) {
								if(!($breakpoint === 'general' && in_array($setting, $settingToAvoidInGeneral))){
									$response .= "--maxi-$style-$element-$setting-$breakpoint: " . $this->get_last_breakpoint_attribute(
										"$element-$setting",
										$breakpoint,
										$SC[$style]
									) . ';';
								}
								if($setting === 'font-family'){
									$font = $SC[$style]["$element-$setting-$breakpoint"] ?? null;

									if(!is_null($font) && !in_array($font, $fonts))
										array_push($fonts, $font);
								}
							}
						}
					}

					if ($SC[$style]["$element-color-global"])
						$response .= "--maxi-$style-$element-color: " . $SC[$style]["$element-color"] . ';';

					if (
						$element === 'button' &&
						$SC[$style]["$element-background-color-global"]
					)
						$response .= "--maxi-$style-$element-background-color: " . $SC[$style]["$element-background-color"] . ';';
				}

				for ($i=1; $i <= 7; $i++) {
					$response .= "--maxi-$style-color-$i: " . $SC[$style]["color-$i"] . ';';
				}
			}
		}

		if ($response !== ':root{}') {
			$this->load_fonts($fonts);

			return wp_strip_all_tags($response);
		} else return false;
	}

	public function load_fonts($fonts) {
		foreach ($fonts as $font) {
			wp_enqueue_style(
				"{$font}",
				"https://fonts.googleapis.com/css2?family={$font}",
			);
		}
	}

	public function get_last_breakpoint_attribute($target, $breakpoint, $attributes) {
		$breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
		$current_attr = $attributes["$target-$breakpoint"] ?? null;

		if (
			!is_null($current_attr) &&
			(is_numeric($current_attr) ||
				is_bool($current_attr) ||
				!empty($current_attr))
		)
			return $current_attr;

		$breakpoint_pos = array_search($breakpoint, $breakpoints);

		do {
			$breakpoint_pos -= 1;

			$current_attr =
				$attributes[
					"$target-$breakpoints[$breakpoint_pos]"
				] ?? null;
		} while (
			$breakpoint_pos > 0 &&
			!is_numeric($current_attr) &&
			(empty($current_attr) || is_null($current_attr))
		);

		return $current_attr;
	}

	public static function getDefaultStyleCard() {
		$json = '{
			"sc_maxi": {
				"name": "Maxi (Default)",
				"status": "active",
				"styleCard": {
					"dark": {},
					"light": {}
				},
				"styleCardDefaults": {
					"dark": {
						"color-1": "#081219",
						"color-2": "#007cba",
						"color-3": "#9b9b9b",
						"color-4": "#ff4a17",
						"color-5": "#ffffff",
						"color-6": "#c9340a",
						"color-7": "#f5f5f5",
						"p-color": "",
						"p-color-global": false,
						"h1-color": "",
						"h1-color-global": false,
						"h2-color": "",
						"h2-color-global": false,
						"h3-color": "",
						"h3-color-global": false,
						"h4-color": "",
						"h4-color-global": false,
						"h5-color": "",
						"h5-color-global": false,
						"h6-color": "",
						"h6-color-global": false,
						"button-color": "",
						"button-color-global": false,
						"divider-color": "",
						"divider-color-global": false,
						"p-font-family-general": "Roboto",
						"p-font-size-xxl": "20px",
						"p-font-size-xl": "16px",
						"p-line-height-xxl": "1.5",
						"p-font-weight-general": "400",
						"p-text-transform-general": "none",
						"p-font-style-general": "normal",
						"p-letter-spacing-xxl": "0px",
						"p-text-decoration-general": "unset",
						"button-font-family-general": "Roboto",
						"button-font-size-xxl": "22px",
						"button-font-size-xl": "18px",
						"button-font-size-l": "16px",
						"button-line-height-xxl": 1.5,
						"button-line-height-xl": 1.625,
						"button-letter-spacing-xxl": "0px",
						"button-font-weight-general": "400",
						"button-text-transform-general": "none",
						"button-font-style-general": "normal",
						"button-text-decoration-general": "unset",
						"button-background-color-global": false,
						"button-background-color": "",
						"h1-font-family-general": "Roboto",
						"h1-font-size-xxl": "50px",
						"h1-font-size-xl": "45px",
						"h1-font-size-l": "40px",
						"h1-font-size-m": "36px",
						"h1-font-size-s": "34px",
						"h1-font-size-xs": "32px",
						"h1-line-height-xxl": 1.18,
						"h1-line-height-xl": 1.1,
						"h1-line-height-l": 1.22,
						"h1-line-height-m": 1.27,
						"h1-font-weight-general": "500",
						"h1-text-transform-general": "none",
						"h1-font-style-general": "normal",
						"h1-letter-spacing-xxl": "0px",
						"h1-text-decoration-general": "unset",
						"h2-font-family-general": "Roboto",
						"h2-font-size-xxl": "44px",
						"h2-font-size-xl": "38px",
						"h2-font-size-l": "36px",
						"h2-font-size-m": "32px",
						"h2-font-size-s": "30px",
						"h2-font-size-xs": "28px",
						"h2-line-height-xxl": 1.21,
						"h2-line-height-xl": 1.05,
						"h2-line-height-l": 1.26,
						"h2-line-height-m": 1.33,
						"h2-font-weight-general": "500",
						"h2-text-transform-general": "none",
						"h2-font-style-general": "normal",
						"h2-letter-spacing-xxl": "0px",
						"h2-text-decoration-general": "unset",
						"h3-font-family-general": "Roboto",
						"h3-font-size-xxl": "34px",
						"h3-font-size-xl": "30px",
						"h3-font-size-m": "26px",
						"h3-font-size-s": "24px",
						"h3-line-height-xxl": 1.25,
						"h3-line-height-xl": 1.3,
						"h3-line-height-l": 1.23,
						"h3-line-height-m": 1.16,
						"h3-font-weight-general": "500",
						"h3-text-transform-general": "none",
						"h3-font-style-general": "normal",
						"h3-letter-spacing-xxl": "0px",
						"h3-text-decoration-general": "unset",
						"h4-font-family-general": "Roboto",
						"h4-font-size-xxl": "30px",
						"h4-font-size-xl": "26px",
						"h4-font-size-l": "24px",
						"h4-font-size-s": "22px",
						"h4-line-height-xxl": 1.33,
						"h4-line-height-xl": 1.24,
						"h4-line-height-l": 1.38,
						"h4-line-height-m": 1.42,
						"h4-font-weight-general": "500",
						"h4-text-transform-general": "none",
						"h4-font-style-general": "normal",
						"h4-letter-spacing-xxl": "0px",
						"h4-text-decoration-general": "unset",
						"h5-font-family-general": "Roboto",
						"h5-font-size-xxl": "26px",
						"h5-font-size-xl": "22px",
						"h5-font-size-m": "20px",
						"h5-line-height-xxl": 1.36,
						"h5-line-height-xl": 1.26,
						"h5-line-height-l": 1.45,
						"h5-line-height-m": 1.5,
						"h5-font-weight-general": "500",
						"h5-text-transform-general": "none",
						"h5-font-style-general": "normal",
						"h5-letter-spacing-xxl": "0px",
						"h5-text-decoration-general": "unset",
						"h6-font-family-general": "Roboto",
						"h6-font-size-xxl": "24px",
						"h6-font-size-xl": "20px",
						"h6-font-size-m": "18px",
						"h6-line-height-xxl": 1.39,
						"h6-line-height-xl": 1.29,
						"h6-line-height-l": 1.5,
						"h6-line-height-m": 1.56,
						"h6-font-weight-general": "500",
						"h6-text-transform-general": "none",
						"h6-font-style-general": "normal",
						"h6-letter-spacing-xxl": "0px",
						"h6-text-decoration-general": "unset",
						"font-icon-font-size-general": "30px"
					},
					"light": {
						"color-1": "#ffffff",
						"color-2": "#f2f9fd",
						"color-3": "#9b9b9b",
						"color-4": "#ff4a17",
						"color-5": "#000000",
						"color-6": "#c9340a",
						"color-7": "#081219",
						"p-color": "",
						"p-color-global": false,
						"h1-color": "",
						"h1-color-global": false,
						"h2-color": "",
						"h2-color-global": false,
						"h3-color": "",
						"h3-color-global": false,
						"h4-color": "",
						"h4-color-global": false,
						"h5-color": "",
						"h5-color-global": false,
						"h6-color": "",
						"h6-color-global": false,
						"button-color": "",
						"button-color-global": false,
						"divider-color": "",
						"divider-color-global": false,
						"p-font-family-general": "Roboto",
						"p-font-size-xxl": "20px",
						"p-font-size-xl": "16px",
						"p-line-height-xxl": 1.5,
						"p-line-height-xl": 1.625,
						"p-font-weight-general": "400",
						"p-text-transform-general": "none",
						"p-font-style-general": "normal",
						"p-letter-spacing-xxl": "0px",
						"p-text-decoration-general": "unset",
						"button-font-family-general": "Roboto",
						"button-font-size-xxl": "22px",
						"button-font-size-xl": "18px",
						"button-font-size-l": "16px",
						"button-line-height-xxl": 1.5,
						"button-line-height-xl": 1.625,
						"button-font-weight-general": "400",
						"button-text-transform-general": "none",
						"button-font-style-general": "normal",
						"button-letter-spacing-xxl": "0px",
						"button-text-decoration-general": "unset",
						"button-background-color-global": false,
						"button-background-color": "",
						"h1-font-family-general": "Roboto",
						"h1-font-size-xxl": "50px",
						"h1-font-size-xl": "45px",
						"h1-font-size-l": "40px",
						"h1-font-size-m": "36px",
						"h1-font-size-s": "34px",
						"h1-font-size-xs": "32px",
						"h1-line-height-xxl": 1.18,
						"h1-line-height-xl": 1.1,
						"h1-line-height-l": 1.22,
						"h1-line-height-m": 1.27,
						"h1-font-weight-general": "500",
						"h1-text-transform-general": "none",
						"h1-font-style-general": "normal",
						"h1-letter-spacing-xxl": "0px",
						"h1-text-decoration-general": "unset",
						"h2-font-family-general": "Roboto",
						"h2-font-size-xxl": "44px",
						"h2-font-size-xl": "38px",
						"h2-font-size-l": "36px",
						"h2-font-size-m": "32px",
						"h2-font-size-s": "30px",
						"h2-font-size-xs": "28px",
						"h2-line-height-xxl": 1.21,
						"h2-line-height-xl": 1.05,
						"h2-line-height-l": 1.26,
						"h2-line-height-m": 1.33,
						"h2-font-weight-general": "500",
						"h2-text-transform-general": "none",
						"h2-font-style-general": "normal",
						"h2-letter-spacing-xxl": "0px",
						"h2-text-decoration-general": "unset",
						"h3-font-family-general": "Roboto",
						"h3-font-size-xxl": "34px",
						"h3-font-size-xl": "30px",
						"h3-font-size-l": "30px",
						"h3-font-size-m": "26px",
						"h3-font-size-s": "24px",
						"h3-line-height-xxl": 1.25,
						"h3-line-height-xl": 1.3,
						"h3-line-height-l": 1.23,
						"h3-line-height-m": 1.16,
						"h3-font-weight-general": "500",
						"h3-text-transform-general": "none",
						"h3-font-style-general": "normal",
						"h3-letter-spacing-xxl": "0px",
						"h3-text-decoration-general": "unset",
						"h4-font-family-general": "Roboto",
						"h4-font-size-xxl": "30px",
						"h4-font-size-xl": "26px",
						"h4-font-size-l": "24px",
						"h4-font-size-s": "22px",
						"h4-line-height-xxl": 1.33,
						"h4-line-height-xl": 1.24,
						"h4-line-height-l": 1.38,
						"h4-line-height-m": 1.42,
						"h4-font-weight-general": "500",
						"h4-text-transform-general": "none",
						"h4-font-style-general": "normal",
						"h4-letter-spacing-xxl": "0px",
						"h4-text-decoration-general": "unset",
						"h5-font-family-general": "Roboto",
						"h5-font-size-xxl": "28px",
						"h5-font-size-xl": "22px",
						"h5-font-size-m": "20px",
						"h5-line-height-xxl": 1.36,
						"h5-line-height-xl": 1.26,
						"h5-line-height-l": 1.45,
						"h5-line-height-m": 1.5,
						"h5-font-weight-general": "500",
						"h5-text-transform-general": "none",
						"h5-font-style-general": "normal",
						"h5-letter-spacing-xxl": "0px",
						"h5-text-decoration-general": "unset",
						"h6-font-family-general": "Roboto",
						"h6-font-size-xxl": "24px",
						"h6-font-size-xl": "20px",
						"h6-font-size-m": "18px",
						"h6-line-height-xxl": 1.39,
						"h6-line-height-xl": 1.29,
						"h6-line-height-l": 1.5,
						"h6-line-height-m": 1.56,
						"h6-font-weight-general": "500",
						"h6-text-transform-general": "none",
						"h6-font-style-general": "normal",
						"h6-letter-spacing-xxl": "0px",
						"h6-text-decoration-general": "unset",
						"font-icon-font-size-general": "30px"
					}
				}
			}
		}';

		return $json;
	}
}