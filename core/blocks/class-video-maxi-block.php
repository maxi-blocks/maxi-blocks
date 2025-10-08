<?php
/**
 * MaxiBlocks Video Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block.php';

if (!class_exists('MaxiBlocks_Video_Maxi_Block')):
	class MaxiBlocks_Video_Maxi_Block extends MaxiBlocks_Block {
		/**
		 * Plugin's core instance.
		 *
		 * @var MaxiBlocks_Video_Maxi_Block
		 */
		private static $instance;

		/**
		 * Block name
		 */
		protected $block_name = 'video-maxi';

		/**
		 * Block
		 *
		 * WP Block Type object
		 */
		protected $block;

		/**
		 * Block custom css
		 */
		protected $block_custom_css = [];

		/**
		 * Registers the plugin.
		 */
		public static function register() {
			if (null === self::$instance) {
				self::$instance = new MaxiBlocks_Video_Maxi_Block();
			}
		}

		/**
		 * Get instance
		 */
		public static function get_instance() {
			return self::$instance;
		}

		public static function get_styles($props, $customCss, $sc_props) {
			$uniqueID = $props['uniqueID'];
			$block_style = $props['blockStyle'];
			$player_type = $props['playerType'];

			// transition
			$defaults = new StylesDefaults();
			$transition_default_canvas = $defaults->transitionDefault['canvas'];

			$block_class = ' .maxi-video-block';
			$video_class = $block_class . '__video-player';
			$overlay_class = $block_class . '__overlay';

			$transition = [
				'canvas' => $transition_default_canvas,
				'block' => [
					'border' => [
						'title' => 'Border',
						'target' => [$overlay_class, $video_class],
						'property' => ['border', 'border-radius'],
						'hoverProp' => 'video-border-status-hover',
					],
					'box shadow' => [
						'title' => 'Box shadow',
						'target' => [$overlay_class, $video_class],
						'property' => 'box-shadow',
						'hoverProp' => 'video-box-shadow-status-hover',
					],
					'overlay colour' => [
						'title' => 'Overlay colour',
						'target' => $overlay_class . '-background',
						'property' => 'background-color',
						'hoverProp' => 'overlay-background-status-hover',
					],
				],
			];

			$data = [
				'customCss' => $customCss,
				'transition' => $transition,
			];

			$styles_obj = [
				$uniqueID => [
					'' => self::get_normal_object($props),
					':hover' => self::get_hover_object($props),
					' .maxi-video-block__popup-wrapper' => self::get_lightbox_object(
						$props,
					),
					' .maxi-video-block__overlay-background' => self::get_overlay_background_object(
						$props,
					),
				],
			];

			if (
				isset($props['overlay-background-status-hover']) &&
				$props['overlay-background-status-hover']
			) {
				$styles_obj[$uniqueID][
					':hover .maxi-video-block__overlay-background'
				] = self::get_overlay_background_object($props, true);
			}

			if ($player_type === 'video') {
				$styles_obj = array_merge($styles_obj, [
					' .maxi-video-block__video-player' => self::get_video_styles(
						$props,
					),
					' .maxi-video-block__video-player:hover' => self::get_video_styles(
						$props,
						true,
					),
					' .maxi-video-block__video-container' => self::get_aspect_ratio_styles(
						$props,
					),
				]);
			} else {
				$styles_obj = array_merge($styles_obj, [
					' .maxi-video-block__overlay' => array_merge(
						self::get_video_styles($props),
						self::get_aspect_ratio_styles($props),
					),
					' .maxi-video-block__overlay:hover' => self::get_video_styles(
						$props,
						true,
					),
					' .maxi-video-block__overlay-image' => self::get_overlay_image_styles(
						$props,
					),
				]);
			}

			$background_styles = get_block_background_styles(
				array_merge(
					get_group_attributes($props, [
						'blockBackground',
						'border',
						'borderWidth',
						'borderRadius',
					]),
					['block_style' => $block_style],
				),
			);
			$background_hover_styles = get_block_background_styles(
				array_merge(
					get_group_attributes(
						$props,
						[
							'blockBackground',
							'border',
							'borderWidth',
							'borderRadius',
						],
						true,
					),
					[
						'block_style' => $block_style,
						'is_hover' => true,
					],
				),
			);
			$icon_object = array_merge(
				self::get_icon_object('play-', $props),
				self::get_icon_object('close-', $props),
			);

			$styles_obj[$uniqueID] = array_merge_recursive(
				$styles_obj[$uniqueID],
				$background_styles,
				$background_hover_styles,
				$icon_object,
			);

			$video_response = style_processor($styles_obj, $data, $props);

			$popup_styles_obj = [
				"popup-$uniqueID" => array_merge(
					[
						' .maxi-video-block__popup-wrapper' => self::get_lightbox_object(
							$props,
						),
						' .maxi-video-block__video-container' => self::get_aspect_ratio_styles(
							$props,
							true,
						),
					],
					self::get_icon_object('close-', $props),
				),
			];

			$popup_response = style_processor($popup_styles_obj, $data, $props);

			return array_merge($video_response, $popup_response);
		}

		public static function get_normal_object($props) {
			$block_style = $props['blockStyle'];

			$response = [
				'boxShadow' => get_box_shadow_styles([
					'obj' => array_merge(
						get_group_attributes($props, 'boxShadow'),
					),
					'block_style' => $block_style,
				]),
				'border' => get_border_styles([
					'obj' => array_merge(
						get_group_attributes($props, [
							'border',
							'borderWidth',
							'borderRadius',
						]),
					),
					'block_style' => $block_style,
				]),
				'padding' => get_margin_padding_styles([
					'obj' => get_group_attributes($props, 'padding'),
				]),
				'margin' => get_margin_padding_styles([
					'obj' => get_group_attributes($props, 'margin'),
				]),
				'opacity' => get_opacity_styles(
					array_merge(get_group_attributes($props, 'opacity')),
				),
				'zIndex' => get_zindex_styles(
					array_merge(get_group_attributes($props, 'zIndex')),
				),
				'display' => get_display_styles(
					array_merge(get_group_attributes($props, 'display')),
				),
				'size' => get_size_styles(
					array_merge(get_group_attributes($props, 'size')),
				),
				'overflow' => get_overflow_styles(
					array_merge(get_group_attributes($props, 'overflow')),
				),
				'flex' => get_flex_styles(
					array_merge(get_group_attributes($props, 'flex')),
				),
			];

			return $response;
		}

		public static function get_hover_object($props) {
			$block_style = $props['blockStyle'];

			$response = [
				'border' =>
					array_key_exists('border-status-hover', $props) &&
					$props['border-status-hover']
						? get_border_styles([
							'obj' => get_group_attributes(
								$props,
								['border', 'borderWidth', 'borderRadius'],
								true,
							),
							'is_hover' => true,
							'block_style' => $block_style,
						])
						: null,
				'boxShadow' =>
					array_key_exists('box-shadow-status-hover', $props) &&
					$props['box-shadow-status-hover']
						? get_box_shadow_styles([
							'obj' => get_group_attributes(
								$props,
								'boxShadow',
								true,
							),
							'is_hover' => true,
							'block_style' => $block_style,
						])
						: null,
				'opacity' =>
					array_key_exists('opacity-status-hover', $props) &&
					$props['opacity-status-hover']
						? get_opacity_styles(
							get_group_attributes($props, 'opacity', true),
							true,
						)
						: null,
			];

			return $response;
		}

		public static function get_lightbox_object($props) {
			$response = get_background_styles(
				array_merge(
					get_group_attributes(
						$props,
						['background', 'backgroundColor'],
						false,
						'lightbox-',
					),
					[
						'prefix' => 'lightbox-',
						'block_style' => $props['blockStyle'],
					],
				),
			);

			return $response;
		}

		public static function get_overlay_image_styles($props) {
			$prefix = 'overlay-media-';

			$response = [
				'size' => get_size_styles(
					get_group_attributes($props, 'size', false, $prefix),
					$prefix,
				),
				'opacity' => get_opacity_styles(
					get_group_attributes($props, 'opacity', false, $prefix),
					false,
					$prefix,
				),
			];

			return $response;
		}

		public static function get_overlay_background_object(
			$props,
			$isHover = false
		) {
			$response = get_background_styles(
				array_merge(get_group_attributes($props, 'videoOverlay'), [
					'prefix' => 'overlay-',
					'block_style' => $props['blockStyle'],
					'isHover' => $isHover,
				]),
			);

			return $response;
		}

		public static function get_aspect_ratio_styles(
			$props,
			$isPopup = false
		) {
			$videoRatio = $props['videoRatio'];
			$videoRatioCustom = $props['videoRatioCustom'];
			$popupRatio = $props['popupRatio'];
			$popupRatioCustom = $props['popupRatioCustom'];

			$response = [];

			if ($isPopup) {
				if ($popupRatio) {
					$response = get_aspect_ratio(
						$popupRatio,
						$popupRatioCustom,
					);
				}
				if ($videoRatio) {
					$response = get_aspect_ratio(
						$videoRatio,
						$videoRatioCustom,
					);
				}
			}

			return $response;
		}

		public static function get_close_icon_position($obj) {
			$response = [
				'label' => 'Position',
			];

			$iconPosition = $obj['close-icon-position'];

			$isSpacingPositive = $iconPosition === 'top-screen-right';

			$breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

			foreach ($breakpoints as $breakpoint) {
				$response[$breakpoint] = [];

				$rawIconSpacing = get_last_breakpoint_attribute([
					'target' => 'close-icon-spacing',
					'breakpoint' => $breakpoint,
					'attributes' => $obj,
				]);
				$iconSpacingUnit = get_last_breakpoint_attribute([
					'target' => 'close-icon-spacing-unit',
					'breakpoint' => $breakpoint,
					'attributes' => $obj,
				]);

				$iconSpacing = $isSpacingPositive
					? $rawIconSpacing
					: -$rawIconSpacing;

				$response[$breakpoint]['top'] =
					($iconSpacing ?? 0) . ($iconSpacingUnit ?? 'px');
				$response[$breakpoint]['right'] =
					($iconSpacing ?? 0) . ($iconSpacingUnit ?? 'px');
			}

			return [
				'iconPosition' => [
					'response' => $response,
				],
			];
		}

		public static function get_icon_object($prefix, $obj) {
			$iconHoverStatus = $obj[$prefix . 'icon-status-hover'] ?? false;

			$response = [
				" .maxi-video-block__{$prefix}button svg" => get_icon_size(
					$obj,
					false,
					$prefix,
				),
				" .maxi-video-block__{$prefix}button svg path" => get_icon_path_styles(
					$obj,
					false,
					$prefix,
				),
				" .maxi-video-block__{$prefix}button" => [
					'icon' => get_icon_styles(
						$obj,
						$obj['blockStyle'],
						false,
						false,
						$prefix,
					),
				],
			];

			if (strpos($prefix, 'close-') !== false) {
				$response[" .maxi-video-block__{$prefix}button"] = array_merge(
					$response[" .maxi-video-block__{$prefix}button"],
					[
						'iconPosition' => self::get_close_icon_position($obj),
					],
				);
			}
			if (isset($iconHoverStatus) && $prefix === 'play-') {
				$svg_styles = get_svg_styles([
					'obj' => $obj,
					'target' => ":hover .maxi-video-block__{$prefix}button",
					'block_style' => $obj['blockStyle'],
					'prefix' => "{$prefix}icon-",
					'useIconColor' => true,
					'isHover' => true,
				]);
				$response = array_merge(
					$response,
					[
						":hover .maxi-video-block__{$prefix}button svg" => array_merge(
							get_icon_size($obj, true, $prefix),
							[
								'icon' => get_icon_styles(
									$obj,
									$obj['blockStyle'],
									true,
									false,
									$prefix,
								),
							],
						),
						":hover .maxi-video-block__{$prefix}button svg path" => get_icon_path_styles(
							$obj,
							true,
							$prefix,
						),
					],
					$svg_styles,
				);
			}

			if (isset($iconHoverStatus) && $prefix !== 'play-') {
				$svg_styles = get_svg_styles([
					'obj' => $obj,
					'target' => ":hover .maxi-video-block__{$prefix}button",
					'block_style' => $obj['blockStyle'],
					'prefix' => "{$prefix}icon-",
					'useIconColor' => true,
					'isHover' => true,
				]);
				$response = array_merge(
					$response,
					[
						":hover .maxi-video-block__{$prefix}button svg" => array_merge(
							get_icon_size($obj, true, $prefix),
							[
								'icon' => get_icon_styles(
									$obj,
									$obj['blockStyle'],
									true,
									false,
									$prefix,
								),
							],
						),
						":hover .maxi-video-block__{$prefix}button svg path" => get_icon_path_styles(
							$obj,
							true,
							$prefix,
						),
					],
					$svg_styles,
				);
			}

			return $response;
		}

		public static function get_video_styles($props, $isHover = false) {
			$videoPrefix = 'video-';

			$response = [];

			if (
				!$isHover ||
				(isset($props[$videoPrefix . 'border-status-hover']) &&
					$props[$videoPrefix . 'border-status-hover'])
			) {
				$response = array_merge($response, [
					'border' => get_border_styles([
						'obj' => get_group_attributes(
							$props,
							['border', 'borderWidth', 'borderRadius'],
							$isHover,
							$videoPrefix,
						),
						'block_style' => $props['blockStyle'],
						'prefix' => $videoPrefix,
						'isHover' => $isHover,
					]),
				]);
			}

			if (
				!$isHover ||
				(isset($props[$videoPrefix . 'box-shadow-status-hover']) &&
					$props[$videoPrefix . 'box-shadow-status-hover'])
			) {
				$response = array_merge($response, [
					'boxShadow' => get_box_shadow_styles([
						'obj' => get_group_attributes(
							$props,
							'boxShadow',
							$isHover,
							$videoPrefix,
						),
						'block_style' => $props['blockStyle'],
						'prefix' => $videoPrefix,
						'isHover' => $isHover,
					]),
				]);
			}

			if (!$isHover) {
				$response = array_merge($response, [
					'padding' => get_margin_padding_styles([
						'obj' => get_group_attributes(
							$props,
							'padding',
							false,
							$videoPrefix,
						),
						'prefix' => $videoPrefix,
					]),
					'size' => get_size_styles(
						get_group_attributes(
							$props,
							'size',
							false,
							$videoPrefix,
						),
						$videoPrefix,
					),
				]);
			}

			return $response;
		}
	}
endif;
