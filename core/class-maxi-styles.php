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
		$post_content = $this->getPostMeta();
		$styles = $this->getStyles($post_content);
		$fonts = $this->getFonts($post_content);

		if ($styles) {
			// Inline styles
			wp_register_style('maxi-blocks', false);
			wp_enqueue_style('maxi-blocks');
			wp_add_inline_style('maxi-blocks', $styles);
		}
		if ($fonts) {
			$this->enqueue_fonts($fonts);
		}

		wp_localize_script('maxi-front-scripts-js', 'maxi_custom_data', [
			'custom_data' => $this->customMeta(),
		]);
	}

	/**
	 * Gets post meta content
	 */
	public function getPostMeta() {
		global $post;

		if (!$post || !isset($post->ID)) {
			return false;
		}

		$post_content = get_option("mb_post_api_{$post->ID}");

		if (!$post_content) {
			return false;
		}

		return $post_content;
	}

	/**
	 * Gets post styles content
	 */
	public function getStyles($post_content) {
		$style =
			is_preview() || is_admin()
				? $post_content['_maxi_blocks_styles_preview']
				: $post_content['_maxi_blocks_styles'];

		if (!$style || empty($style)) {
			return false;
		}

		$style = $this->update_color_palette_backups($style);

		return $style;
	}

	/**
	 * Gets post styles content
	 */
	public function getFonts($post_content) {
		$fonts =
			is_preview() || is_admin()
				? $post_content['_maxi_blocks_fonts_preview']
				: $post_content['_maxi_blocks_fonts'];

		if (!$fonts || empty($fonts)) {
			return false;
		}

		return $fonts;
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

	public function enqueue_fonts($fonts) {
		if (!is_array($fonts)) {
			$fonts = [];
		}

		if (!array_key_exists('Roboto', $fonts)) {
			array_push($fonts, 'Roboto');
		}

		foreach ($fonts as $font) {
			wp_enqueue_style(
				$font,
				"https://fonts.googleapis.com/css2?family=$font:ital,wght@0,100;0,200;0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,100;1,200;1,300;1,400;1,500;1,600;1,700;1,800;1,900",
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

	public function update_color_palette_backups($style) {
		// Get used colors on the post style
		$needle = 'rgba(var(--maxi-';
		$lastPos = 0;
		$colors = array();

		while (($lastPos = strpos($style, $needle, $lastPos))!== false) {
			$endPos = strpos($style, ')', $lastPos);
			$colorStr = substr($style, $lastPos, $endPos - $lastPos + 1);

			if(!in_array($colorStr, $colors))
				$colors[] = $colorStr;

			$lastPos = $lastPos + strlen($needle);
		}

		// Get color values from the SC considering the used on post style
		$colorVars = array();

		foreach ($colors as $color) {
			$color = str_replace('rgba(var(', '', $color);
			$colorVar = explode(',', $color)[0];
			$colorContent = str_replace($colorVar, '', $color);
			$colorContent = str_replace(')', '', $colorContent);
			$colorContent = ltrim($colorContent,',');

			if(!in_array($colorVar , $colorVars))
				$colorVars[$colorVar] = $colorContent;
		}

		$changedSCColors = array();

		$style_card = get_option('mb_sc_string');
		$style_card = is_preview() || is_admin()
			? $style_card['_maxi_blocks_style_card_preview']
			: $style_card['_maxi_blocks_style_card'];

		foreach ($colorVars as $colorKey => $colorValue) {
			$startPos = strpos($style_card, $colorKey);
			$endPos = strpos($style_card, ';--', $startPos);
			$colorSCValue = substr($style_card, $startPos + strlen($colorKey) + 1, $endPos - $startPos - strlen($colorKey) - 1);

			if($colorSCValue !== $colorValue)
				$changedSCColors[$colorKey] = $colorSCValue;
		}

		// In case there are changes, fix them
		if(empty($changedSCColors))
			return $style;
		else {
			$new_style = $style;

			foreach ($changedSCColors as $colorKey => $colorValue) {
				$old_color_str = "rgba(var($colorKey," . $colorVars[$colorKey] . ')';
				$new_color_str = "rgba(var($colorKey," . $colorValue . ')';

				$new_style = str_replace($old_color_str, $new_color_str, $new_style);
			}

			/**
			 * Onces done, would be good to save the styles to the DB
			 * to avoid future loops. Not urgent at all
			 *
			 * Waiting for #2482 to do it 👍
			 */
			return $new_style;
		}
	}
}