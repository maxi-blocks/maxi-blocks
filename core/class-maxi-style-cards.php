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
		if (!$maxi_blocks_active_style_card_array) {
			return false;
		}

		$response = ':root{';
		$styles = ['light', 'dark'];
		$elements = [
			'button',
			'p',
			'h1',
			'h2',
			'h3',
			'h4',
			'h5',
			'h6',
			'divider',
		];
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

		// var_dump($maxi_blocks_active_style_card_array['dark']);

		$dark = array_merge(
			$maxi_blocks_active_style_card_array['dark']['defaultStyleCard'],
			$maxi_blocks_active_style_card_array['dark']['styleCard'],
		);
		$light = array_merge(
			$maxi_blocks_active_style_card_array['light']['defaultStyleCard'],
			$maxi_blocks_active_style_card_array['light']['styleCard'],
		);
		$SC = [
			'dark' => $dark,
			'light' => $light,
		];

		foreach ($styles as $style) {
			foreach ($elements as $element) {
				if ($element !== 'divider') {
					foreach ($settings as $setting) {
						foreach ($breakpoints as $breakpoint) {
							if (
								!(
									$breakpoint === 'general' &&
									in_array($setting, $settingToAvoidInGeneral)
								)
							) {
								$response .=
									"--maxi-$style-$element-$setting-$breakpoint: " .
									$this->get_last_breakpoint_attribute(
										$setting,
										$breakpoint,
										$SC[$style][$element],
									) .
									';';
							}
							if ($setting === 'font-family') {
								$font =
									$SC[$style][$element][
										"$setting-$breakpoint"
									] ?? null;

								if (
									!is_null($font) &&
									!in_array($font, $fonts)
								) {
									array_push($fonts, $font);
								}
							}
						}
					}
				}

				if (
					$SC[$style][$element]['color-global'] &&
					!empty($SC[$style][$element]['color'])
				) {
					$response .=
						"--maxi-$style-$element-color: " .
						$SC[$style][$element]['color'] .
						';';
				}

				if (
					$element === 'button' &&
					$SC[$style][$element]['background-color-global'] &&
					!empty($SC[$style][$element]['background-color'])
				) {
					$response .=
						"--maxi-$style-$element-background-color: " .
						$SC[$style][$element]['background-color'] .
						';';
				}
			}

			for ($i = 1; $i <= 7; $i++) {
				$response .=
					"--maxi-$style-color-$i: " . $SC[$style]['color'][$i] . ';';
			}
		}

		if ($response !== ':root{}') {
			$this->load_fonts($fonts);

			return wp_strip_all_tags($response);
		} else {
			return false;
		}
	}

	public function load_fonts($fonts) {
		foreach ($fonts as $font) {
			wp_enqueue_style(
				"{$font}",
				"https://fonts.googleapis.com/css2?family={$font}",
			);
		}
	}

	public function get_last_breakpoint_attribute(
		$target,
		$breakpoint,
		$attributes
	) {
		$breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
		$current_attr = $attributes["$target-$breakpoint"] ?? null;

		if (
			!is_null($current_attr) &&
			(is_numeric($current_attr) ||
				is_bool($current_attr) ||
				!empty($current_attr))
		) {
			return $current_attr;
		}

		$breakpoint_pos = array_search($breakpoint, $breakpoints);

		do {
			$breakpoint_pos -= 1;

			$current_attr =
				$attributes["$target-$breakpoints[$breakpoint_pos]"] ?? null;
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
				"dark": {
					"styleCard": {},
					"defaultStyleCard": {
						"color": {
							"global": false,
							"1": "#081219",
							"2": "#007cba",
							"3": "#9b9b9b",
							"4": "#ff4a17",
							"5": "#ffffff",
							"6": "#c9340a",
							"7": "#f5f5f5",
							"color": ""
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
							"color-global": false,
							"color": "",
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
							"background-color": ""
						},
						"hover": {
							"color-global": false,
							"color": ""
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
							"1": "#ffffff",
							"2": "#f2f9fd",
							"3": "#9b9b9b",
							"4": "#ff4a17",
							"5": "#000000",
							"6": "#c9340a",
							"7": "#081219"
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
							"color-global": false,
							"color": "",
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
							"background-color": ""
						},
						"hover": {
							"color-global": false,
							"color": ""
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
