<?php

use function PHPSTORM_META\type;

class StyleCardsVariables {
	/**
	 * This plugin's instance.
	 *
	 * @var StyleCardsVariables
	 */
	private static $instance;

	/**
	 * Registers the plugin.
	 */
	public static function register() {
		if (null === self::$instance) {
			self::$instance = new StyleCardsVariables();
		}
	}

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action('admin_enqueue_scripts', array($this, 'enqueue_styles'));
		add_action('wp_enqueue_scripts', array($this, 'enqueue_styles'));
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
		$table_name = $wpdb->prefix . 'maxi_blocks_general';  // table name
		$query = 'SELECT object FROM ' . $table_name . ' where id = "style_cards_current"';
		$maxi_blocks_style_cards_current = $wpdb->get_var($query);
		if ($maxi_blocks_style_cards_current && !empty($maxi_blocks_style_cards_current))
			return $maxi_blocks_style_cards_current;
		else {
			require_once(MAXI_PLUGIN_DIR_PATH . 'API/style-cards/default-style-card-maxi.php');
			$defaultStyleCard = getDefaultStyleCard();

			$wpdb->replace($table_name, array(
				'id' => 'style_cards_current',
				'object' => $defaultStyleCard,
			));
			$maxi_blocks_style_cards_current = $wpdb->get_var($query);
			return $maxi_blocks_style_cards_current;
		}
	}

	public function get_maxi_blocks_active_style_card() {
		$maxi_blocks_style_cards = $this->get_maxi_blocks_current_style_cards();

		$maxi_blocks_style_cards_array = json_decode($maxi_blocks_style_cards, true);

		foreach ($maxi_blocks_style_cards_array as $key => $sc) {
			if ($sc['status'] === 'active')
				return $sc;
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
									$response .= "--maxi-$style-$element-$setting-$breakpoint: " . get_last_breakpoint_attribute(
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
				}

				if ($SC[$style]["$element-color-global"])
					$response .= "--maxi-$style-$element-color: " . $SC[$style]["$element-color"] . ';';

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
				"https://fonts.googleapis.com/css2?family={$font}"
			);
		}
	}
}

StyleCardsVariables::register();