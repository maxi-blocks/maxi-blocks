<?php

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
		// Inline styles
		if($this->sc_vars()) {
			wp_register_style('maxi-blocks-sc-vars', false);
			wp_enqueue_style('maxi-blocks-sc-vars');
			wp_add_inline_style('maxi-blocks-sc-vars', $this->sc_vars());
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
			require_once (dirname(__FILE__) . '/style-cards/default-style-card-maxi.php');
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
			if($sc['status'] === 'active')
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

		if($maxi_blocks_active_style_card_array) {
			$final_sc_array = array_replace_recursive($maxi_blocks_active_style_card_array['styleCardDefaults'], $maxi_blocks_active_style_card_array['styleCard']);

			foreach ($final_sc_array['light'] as $css_rule => $style_value) {
				$response .= '--maxi-light-'.$css_rule.':'.$style_value.';';
			}
		}

		$response .= '}';

		if($response !== ':root{}') return wp_strip_all_tags($response);
		else return false;
	}
}

StyleCardsVariables::register();
