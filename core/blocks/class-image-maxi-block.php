<?php
/**
 * MaxiBlocks Image Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
	exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block.php';

if (!class_exists('MaxiBlocks_Image_Maxi_Block')):
	class MaxiBlocks_Image_Maxi_Block extends MaxiBlocks_Block {
		/**
		 * Plugin's core instance.
		 *
		 * @var MaxiBlocks_Image_Maxi_Block
		 */
		private static $instance;

		/**
		 * Block name
		 */
		protected $block_name = 'image-maxi';

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
				self::$instance = new MaxiBlocks_Image_Maxi_Block();
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
			$svg_element = $props['SVGElement'] ?? false;

			$img_tag = $svg_element === '' || !$svg_element ? 'img' : 'svg';

			$data = [
				'customCss' => $customCss,
			];

			$styles_obj = [
				$uniqueID => [
					'' => self::get_wrapper_object($props),
					' .maxi-block__resizer--overflow' => array_merge(
						self::get_image_overflow($props),
						[
							'border' => get_border_styles([
								'obj' => get_group_attributes($props, [
									'borderRadius',
								]),
								'block_style' => $block_style,
							]),
						],
					),
					':hover' => self::get_hover_wrapper_object($props),
					' .maxi-image-block-wrapper' => array_merge(
						self::get_image_wrapper_object($props),
						self::get_clip_path_drop_shadow_object($props),
					),
					" .maxi-image-block-wrapper $img_tag" => self::get_image_object(
						$props,
					),
					":hover .maxi-image-block-wrapper $img_tag" => self::get_hover_image_object(
						$props,
					),
					':hover .maxi-image-block-wrapper' => self::get_clip_path_drop_shadow_object(
						$props,
						true,
					),
					' .maxi-image-block__image' => self::get_image_shape_object(
						'svg',
						$props,
					),
					' .maxi-image-block__image:hover' => self::get_image_shape_object(
						'svg',
						$props,
					),
					' .maxi-image-block__image pattern image' => self::get_image_shape_object(
						'image',
						$props,
					),
					' figcaption' => self::get_figcaption_object($props),
					' .maxi-hover-details .maxi-hover-details__content h4' => self::get_hover_effect_title_text_object(
						$props,
					),
					' .maxi-hover-details .maxi-hover-details__content p' => self::get_hover_effect_content_text_object(
						$props,
					),
					' .maxi-hover-details' => self::get_hover_effect_details_box_object(
						$props,
					),
				],
			];

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
			$custom_formats_styles = get_custom_formats_styles(
				' .maxi-image-block__caption',
				$props['custom-formats'] ?? [],
				$block_style,
				get_group_attributes($props, 'typography'),
				'p',
				false,
			);
			$hover_custom_formats_styles = get_custom_formats_styles(
				' .maxi-image-block__caption',
				$props['custom-formats'] ?? [],
				$block_style,
				get_group_attributes($props, 'typography'),
				'p',
				true,
			);
			$link_styles = array_merge(
				get_link_styles(
					get_group_attributes($props, 'link'),
					' a figcaption.maxi-image-block__caption',
					$block_style,
				),
				get_link_styles(
					get_group_attributes($props, 'link'),
					' a figcaption.maxi-image-block__caption',
					$block_style,
				),
			);

			$styles_obj[$uniqueID] = array_merge_recursive(
				$styles_obj[$uniqueID],
				$background_styles,
				$background_hover_styles,
				$custom_formats_styles,
				$hover_custom_formats_styles,
				$link_styles,
			);

			$response = style_processor($styles_obj, $data, $props);

			return $response;
		}

		public static function get_wrapper_object($props) {
			$block_style = $props['blockStyle'];

			$response = [
				'border' => get_border_styles([
					'obj' => get_group_attributes($props, [
						'border',
						'borderWidth',
						'borderRadius',
					]),
					'block_style' => $block_style,
				]),
				'overflow' => get_overflow_styles(
					get_group_attributes($props, 'overflow'),
				),
				'boxShadow' => get_box_shadow_styles([
					'obj' => get_group_attributes($props, 'boxShadow'),
					'block_style' => $block_style,
				]),
				'margin' => get_margin_padding_styles([
					'obj' => get_group_attributes($props, 'margin'),
				]),
				'padding' => get_margin_padding_styles([
					'obj' => get_group_attributes($props, 'padding'),
				]),
				'zIndex' => get_zindex_styles(
					get_group_attributes($props, 'zIndex'),
				),
				'position' => get_position_styles(
					get_group_attributes($props, 'position'),
				),
				'display' => get_display_styles(
					get_group_attributes($props, 'display'),
				),
				'alignment' => get_alignment_flex_styles(
					get_group_attributes($props, 'alignment'),
				),
				'size' => get_size_styles(get_group_attributes($props, 'size')),
				$fit_parent_size,
				'opacity' => get_opacity_styles(
					get_group_attributes($props, 'opacity'),
				),
				'flex' => get_flex_styles(get_group_attributes($props, 'flex')),
			];

			return $response;
		}

		public static function get_hover_wrapper_object($props) {
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

		public static function get_hover_effect_details_box_object($props) {
			$response = [];

			if (
				isset($props['hover-border-status']) &&
				$props['hover-border-status']
			) {
				$response['border'] = get_border_styles([
					'obj' => get_group_attributes(
						$props,
						[
							'hoverBorder',
							'hoverBorderWidth',
							'hoverBorderRadius',
						],
						false,
					),
					'prefix' => 'hover-',
					'block_style' => $props['blockStyle'],
				]);
			}

			$response['margin'] = get_margin_padding_styles([
				'obj' => get_group_attributes($props, 'hoverMargin'),
				'prefix' => 'hover-',
			]);

			$response['padding'] = get_margin_padding_styles([
				'obj' => get_group_attributes($props, 'hoverPadding'),
				'prefix' => 'hover-',
			]);

			$response['background'] = get_hover_effects_background_styles(
				get_group_attributes($props, [
					'hoverBackground',
					'hoverBackgroundColor',
					'hoverBackgroundGradient',
				]),
				$props['blockStyle'],
			);

			$response['size'] = get_size_styles(
				get_group_attributes($props, 'size'),
			);

			if (isset($props['imageRatio']) && $props['imageRatio']) {
				$response = array_merge(
					$response,
					get_aspect_ratio($props['imageRatio']) ?? [],
				);
			}

			return $response;
		}

		public static function get_hover_effect_title_text_object($props) {
			$response = [];

			if (
				isset($props['hover-title-typography-status']) &&
				$props['hover-title-typography-status']
			) {
				$response['typography'] = get_typography_styles([
					'obj' => get_group_attributes(
						$props,
						'hoverTitleTypography',
					),
					'prefix' => 'hover-title-',
					'block_style' => $props['blockStyle'],
				]);
			}

			return $response;
		}

		public static function get_hover_effect_content_text_object($props) {
			$response = [];

			if (
				isset($props['hover-content-typography-status']) &&
				$props['hover-content-typography-status']
			) {
				$response['typography'] = get_typography_styles([
					'obj' => get_group_attributes(
						$props,
						'hoverContentTypography',
					),
					'prefix' => 'hover-content-',
					'block_style' => $props['blockStyle'],
				]);
			}

			return $response;
		}

		public static function get_image_overflow($props) {
			$response = [];

			$response['overflow'] = get_overflow_styles(
				get_group_attributes($props, 'overflow'),
			);

			return $response;
		}

		public static function get_image_wrapper_object($props) {
			$response = [];

			$response['alignment'] = get_alignment_flex_styles(
				get_group_attributes($props, 'alignment'),
			);

			$border_styles = get_border_styles([
				'obj' => get_group_attributes($props, ['borderRadius']),
				'block_style' => $props['blockStyle'],
			]);

			$has_border_styles = array_reduce(
				$border_styles,
				function ($carry, $breakpoint_styles) {
					return $carry || !empty($breakpoint_styles);
				},
				false,
			);

			if ($has_border_styles) {
				$response['border'] = $border_styles;
			}

			if (isset($props['hover-extension']) && $props['hover-extension']) {
				$response['hoverExtension'] = [
					'general' => [
						'overflow' => 'visible',
					],
				];
			}

			$response['overflow'] = get_overflow_styles(
				get_group_attributes($props, 'overflow'),
			);

			$response['margin'] = get_margin_padding_styles([
				'obj' => get_group_attributes(
					$props,
					'margin',
					false,
					'image-',
				),
				'prefix' => 'image-',
			]);

			$response['padding'] = get_margin_padding_styles([
				'obj' => get_group_attributes(
					$props,
					'padding',
					false,
					'image-',
				),
				'prefix' => 'image-',
			]);

			if (isset($props['fitParentSize']) && $props['fitParentSize']) {
				$response['firParentSize'] = [
					'general' => [
						'overflow' => 'hidden',
					],
				];
			}

			return $response;
		}

		public static function get_image_fit_wrapper($props) {
			$fit_parent_size = $props['fitParentSize'] ?? false;

			$response = [];

			$breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

			foreach ($breakpoints as $breakpoint) {
				$response[$breakpoint] = [];

				$object_size = $fit_parent_size
					? get_last_breakpoint_attribute([
						'target' => 'object-size',
						'breakpoint' => $breakpoint,
						'attributes' => $props,
					])
					: get_default_attribute('object-size-general');
				$size = round($object_size * 100, 2);
				$displacement_coefficient = 100 - $size;

				if ($fit_parent_size) {
					$response[$breakpoint]['height'] = "{$size}%";
					$response[$breakpoint]['width'] = "{$size}%";
				}

				$horizontal_position = get_last_breakpoint_attribute([
					'target' => 'object-position-horizontal',
					'breakpoint' => $breakpoint,
					'attributes' => $props,
				]);

				$vertical_position = get_last_breakpoint_attribute([
					'target' => 'object-position-vertical',
					'breakpoint' => $breakpoint,
					'attributes' => $props,
				]);

				$horizontal_displacement = round(
					($displacement_coefficient * $horizontal_position) / 100,
					2,
				);

				$vertical_isplacement = round(
					($displacement_coefficient * $vertical_position) / 100,
					2,
				);

				$response[$breakpoint]['left'] = "$horizontal_displacement%";
				$response[$breakpoint]['top'] = "$vertical_isplacement%";

				$response[$breakpoint][
					'object-position'
				] = "$horizontal_position% $vertical_position%";
			}

			return $response;
		}

		public static function get_image_object($props) {
			$fit_parent_size = $props['fitParentSize'] ?? false;
			$image_ratio = $props['imageRatio'];
			$image_ratio_custom = $props['imageRatioCustom'];
			$img_width = $props['imgWidth'];
			$use_init_size = $props['useInitSize'] ?? false;
			$media_width = $props['mediaWidth'];
			$is_first_on_hierarchy = $props['isFirstOnHierarchy'];
			$svg_element = $props['SVGElement'] ?? '';

			$response = [
				'border' => get_border_styles([
					'obj' => get_group_attributes(
						$props,
						['border', 'borderWidth', 'borderRadius'],
						false,
						'image-',
					),
					'block_style' => $props['blockStyle'],
					'prefix' => 'image-',
				]),
				'boxShadow' => get_box_shadow_styles([
					'obj' => array_merge(
						get_group_attributes(
							$props,
							'boxShadow',
							false,
							'image-',
						),
						get_group_attributes($props, 'clipPath'),
						['SVGElement' => $svg_element],
					),
					'block_style' => $props['blockStyle'],
					'prefix' => 'image-',
				]),
			];

			if ($image_ratio) {
				$aspect_ratio =
					get_aspect_ratio($image_ratio, $image_ratio_custom) ?? [];

				$response = array_merge($response, $aspect_ratio);
			}

			$response['size'] = get_size_styles(
				get_group_attributes($props, 'size', false, 'image-'),
				'image-',
			);

			$response['clipPath'] = get_clip_path_styles([
				'obj' => get_group_attributes($props, 'clipPath'),
			]);

			if ($img_width && !$fit_parent_size) {
				$response['imgWidth'] = [
					'general' => [
						'width' => !$use_init_size
							? "$img_width%"
							: $media_width . 'px',
					],
				];
			}

			if (!$is_first_on_hierarchy) {
				$response['fitParentSize'] = self::get_image_fit_wrapper(
					$props,
				);
			}

			return $response;
		}

		public static function get_hover_image_object($props) {
			$response = [];

			if (
				isset($props['image-border-status-hover']) &&
				$props['image-border-status-hover']
			) {
				$response['border'] = get_border_styles([
					'obj' => get_group_attributes(
						$props,
						['border', 'borderWidth', 'borderRadius'],
						true,
						'image-',
					),
					'is_hover' => true,
					'block_style' => $props['blockStyle'],
					'prefix' => 'image-',
				]);
			}

			if (
				isset($props['image-box-shadow-status-hover']) &&
				$props['image-box-shadow-status-hover']
			) {
				$response['boxShadow'] = get_box_shadow_styles([
					'obj' => array_merge(
						get_group_attributes(
							$props,
							'boxShadow',
							true,
							'image-',
						),
						get_group_attributes($props, 'clipPath'),
						['SVGElement' => $props['SVGElement']],
					),
					'is_hover' => true,
					'block_style' => $props['blockStyle'],
					'prefix' => 'image-',
				]);
			}

			if (
				isset($props['clip-path-status-hover']) &&
				$props['clip-path-status-hover']
			) {
				$response['clipPath'] = get_clip_path_styles([
					'obj' => get_group_attributes($props, 'clipPath', true),
					'is_hover' => true,
				]);
			}

			return $response;
		}

		public static function get_clip_path_drop_shadow_object(
			$props,
			$is_hover = false
		) {
			$response = [];

			$svg_element = $props['SVGElement'] ?? 'null';

			if (!$is_hover) {
				$response['boxShadow'] = get_box_shadow_styles([
					'obj' => array_merge(
						get_group_attributes(
							$props,
							'boxShadow',
							false,
							'image-',
						),
						get_group_attributes($props, 'clipPath'),
						['SVGElement' => $svg_element],
					),
					'drop_shadow' => true,
					'block_style' => $props['blockStyle'],
					'prefix' => 'image-',
					'forClipPath' => true,
				]);
			}

			if ($props['image-box-shadow-status-hover'] && $is_hover) {
				$response['boxShadow'] = get_box_shadow_styles([
					'obj' => array_merge(
						get_group_attributes(
							$props,
							'boxShadow',
							true,
							'image-',
						),
						get_group_attributes($props, 'clipPath'),
						['SVGElement' => $svg_element],
					),
					'is_hover' => true,
					'drop_shadow' => true,
					'block_style' => $props['blockStyle'],
					'prefix' => 'image-',
					'for_clip_path' => true,
				]);
			}

			return $response;
		}

		public static function get_figcaption_object($props) {
			$response = [];

			if (
				isset($props['captionType']) &&
				$props['captionType'] !== 'none'
			) {
				$response['typography'] = get_typography_styles([
					'obj' => get_group_attributes($props, 'typography'),
					'block_style' => $props['blockStyle'],
				]);
			}

			$response['textAlignment'] = get_alignment_text_styles(
				get_group_attributes($props, 'textAlignment'),
			);

			if ($props['imgWidth']) {
				$response['imgWidth'] = [
					'general' => ['width' => $props['imgWidth'] . '%'],
				];
			}

			$response['captionMargin'] = [];

			$breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

			foreach ($breakpoints as $breakpoint) {
				$num = get_last_breakpoint_attribute([
					'target' => 'caption-gap',
					'breakpoint' => $breakpoint,
					'attributes' => $props,
				]);

				$unit = get_last_breakpoint_attribute([
					'target' => 'caption-gap-unit',
					'breakpoint' => $breakpoint,
					'attributes' => $props,
				]);

				if (!is_null($num) && !is_null($unit)) {
					$marginType =
						$props['captionPosition'] === 'bottom'
							? 'margin-top'
							: 'margin-bottom';

					$response['captionMargin'][$breakpoint] = [
						$marginType => $num . $unit,
					];
				}
			}

			return $response;
		}

		public static function get_image_shape_object($target, $props) {
			$response = [];

			if (isset($props['SVGElement']) && $props['SVGElement']) {
				$response['transform'] = get_image_shape_styles(
					get_group_attributes($props, 'imageShape'),
					$target,
				);
			}

			if (isset($props['clipPath']) && $props['clipPath']) {
				$response['image'] = [
					'general' => ['clip-path' => $props['clipPath']],
				];
			}

			if (
				$target === 'svg' &&
				isset($props['imageRatio']) &&
				$props['imageRatio']
			) {
				$response = array_merge(
					$response,
					get_aspect_ratio($props['imageRatio']) ?? [],
				);
			}

			return $response;
		}
	}
endif;
