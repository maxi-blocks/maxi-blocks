<?php
class MaxiBlocks_Styles {
	/**
	 * This plugin's instance.
	 *
	 * @var MaxiBlocks_Styles
	 */
	private static $instance;

	/**
	 * Registers the plugin.
	 */
	public static function register() {
		if (null === self::$instance) {
			self::$instance = new MaxiBlocks_Styles();
		}
	}

	/**
	 * Constructor
	 */
	public function __construct() {
		add_action('wp_enqueue_scripts', [$this, 'enqueue_styles']);
	}

	/**
	 * Enqueuing styles
	 */
	public function enqueue_styles() {
		$styles = $this->getStyles();
		if ($styles) {
			// Inline styles
			wp_register_style('maxi-blocks', false);
			wp_enqueue_style('maxi-blocks');
			wp_add_inline_style('maxi-blocks', $styles);

			$this->enqueue_fonts($styles);
		}

		wp_localize_script('maxi-front-scripts-js', 'maxi_custom_data', [
			'custom_data' => $this->customMeta(),
		]);
	}

	/**
	 * Gets meta content
	 */
	public function getStyles() {
		global $post;
		if (!$post || !isset($post->ID)) {
			return false;
		}

		$styles = get_option("mb_post_api_{$post->ID}");

		if (!$styles) {
			return false;
		}

		$style =
			is_preview() || is_admin()
				? $styles['_maxi_blocks_styles_preview']
				: $styles['_maxi_blocks_styles'];

		if (!$style || empty($style)) {
			return false;
		}

		return $style;
	}

	/**
	 * Returns default breakpoints values in case breakpoints are not set
	 */
	public function getBreakpoints($breakpoints) {
		if (!empty((array) $breakpoints)) {
			return $breakpoints;
		}

		// It may connect to the API to centralize the default values there
		return (object) [
			'xs' => 480,
			's' => 768,
			'm' => 1024,
			'l' => 1366,
			'xl' => 1920,
		];
	}

	/**
	 * Post fonts
	 *
	 * @return object   Font name with font options
	 */

	public function enqueue_fonts($styles) {
		preg_match_all('/font-family:(\w+);/', $styles, $fonts);
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

	/**
	 * Custom Meta
	 */
	public function customMeta() {
		global $post;
		if (!$post || !isset($post->ID)) {
			return;
		}

		$custom_data = get_option("mb_custom_data_{$post->ID}");

		if (!$custom_data) {
			return;
		}

		$result = $custom_data['custom_data'];

		if (!$result || empty($result)) {
			return;
		}

		return json_decode($result);
	}
}