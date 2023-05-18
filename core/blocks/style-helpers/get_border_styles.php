<?php

/**
 * IMPORTANT: version from https://github.com/maxi-blocks/maxi-blocks/pull/4679 
 */

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_last_breakpoint_attribute.php';

function get_prev_breakpoint($breakpoint) {
	$breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    $index = array_search($breakpoint, $breakpoints);
    return $index > 0 ? $breakpoints[$index - 1] : 'general';
}

function get_border_styles($args)
{
    $obj = $args['obj'];
    $is_hover = $args['is_hover'] ?? false;
    $is_IB = $args['is_IB'] ?? false;
    $prefix = $args['prefix'] ?? '';
    $block_style = $args['block_style'];
    $is_button = $args['is_button'] ?? false;
    $sc_values = $args['sc_values'] ?? (object) [];
    $border_color_property = $args['border_color_property'] ?? 'border-color';

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    $response = array();

    $hover_status = get_attributes_value(
        'hover-status', 
        $obj, 
        $is_hover, 
        null, 
        $prefix
    );

    $is_active = $sc_values['hover-border-color-global'];
	$affect_all = $sc_values['hover-border-color-all'];
	
	$global_hover_status = $is_active && $affect_all;
	
	if ($is_hover && isset($hover_status) && !$hover_status && !$global_hover_status)
		return $response;

	$width_keys = [
		'top',
		'right',
		'bottom',
		'left'
	];
	$radius_keys = [
		'top-left',
		'top-right',
		'bottom-right',
		'bottom-left'
	];

    $omit_border_style = !$is_IB && !$hover_status && !$global_hover_status;

    // iterate over breakpoints
    foreach ($breakpoints as $breakpoint) {
        $response[$breakpoint] = (object) [];

        $border_style = get_last_breakpoint_attribute(
            'border-style',
            $prefix,
            $breakpoint,
            $obj,
            $is_hover,
		);

		$is_border_none = !isset($border_style) || $border_style === 'none';
		$omit_border_style = $omit_border_style ? $is_border_none : false;

        $get_value_and_unit = function($key, $axis) use ($obj, $is_hover, $prefix, $breakpoint) {
			$target = $key . $axis;
			$currentValue = $obj[get_attribute_key($target, $is_hover, $prefix, $breakpoint)];
			$currentUnit = $obj[get_attribute_key("${key}${axis}.u", $is_hover, $prefix, $breakpoint)] ?? $obj[get_attribute_key("${key}.u", $is_hover, $prefix, $breakpoint)];

			$hasCurrent = isset($currentValue) || isset($currentUnit);

			if (!$hasCurrent) return null;

			$lastValue = get_last_breakpoint_attribute(
				$target,
				$prefix,
				$breakpoint,
				$obj,
				$is_hover,
			);

			if (!isset($lastValue)) return null;

			$lastUnit = (get_last_breakpoint_attribute(
				"${key}${axis}.u",
				$prefix,
				$breakpoint,
				$obj,
				$is_hover,
			) ?? get_last_breakpoint_attribute(
				"${key}.u",
				$prefix,
				$breakpoint,
				$obj,
				$is_hover,
			)) || 'px';

			return $lastValue . $lastUnit;
		};

        $prev_breakpoint = get_prev_breakpoint($breakpoint);

        if (!$is_border_none) {
			$get_color_string = function ($obj, $is_hover, $prefix, $breakpoint) use ($is_button, $hover_status, $global_hover_status, $block_style) {
				$current_color = get_attributes_value(
					['border-palette-status', 'border-palette-color', 'border-palette-opacity', 'border-color'],
					$obj,
					$is_hover,
					$prefix,
					$breakpoint,
					true
				);

				$has_different_color_attributes = false;

				foreach ($current_color as $value) {
					if (!is_null($value)) {
						$has_different_color_attributes = true;
						break;
					}
				}

				if (!$has_different_color_attributes) return null;

				$palette_attributes = get_palette_attributes($obj, $prefix . 'border', $is_hover, $breakpoint);

				$palette_status = $palette_attributes['palette_status'];
				$palette_color = $palette_attributes['palette_color'];
				$palette_opacity = $palette_attributes['palette_opacity'];
				$color = $palette_attributes['color'];

				if ($palette_status) {
					if ($is_button && (!$is_hover || $hover_status || $global_hover_status)) {
						return get_color_rgba_string(
							($is_button ? 'button-' : '') . 'border-color' . ($is_hover ? '-hover' : ''),
							'color-' . $palette_color,
							$palette_opacity,
							$block_style
						);
					} else {
						return get_color_rgba_string(
							'color-' . $palette_color,
							$palette_opacity,
							$block_style
						);
					}
				}

				return $color;
			};

			$current_border_style = $obj[get_attribute_key('border-style', $is_hover, $prefix, $breakpoint)];
			if (!is_null($current_border_style))
				$response[$breakpoint]['border-style'] = $border_style;

			$border_color = $get_color_string($obj, $is_hover, $prefix, $breakpoint);
			if ($border_color)
				$response[$breakpoint][$border_color_property] = $border_color;

			foreach ($width_keys as $axis) {
				$val = $get_value_and_unit('border-width', $axis);
				$css_property = 'border-' . $axis . '-width';
				$prev_val = $response[$prev_breakpoint][$css_property];

				if ($val && $val !== $prev_val)
					$response[$breakpoint][$css_property] = $val;
			}
        } else if (
			!is_null($obj[get_attribute_key('border-style', $is_hover, $prefix, $breakpoint)]) &&
			$border_style === 'none'
		)
			$response[$breakpoint]['border'] = 'none';

		// Border radius doesn't need border style
		foreach ($radius_keys as $axis) {
			$val = $get_value_and_unit('border-radius', $axis);
			$css_property = 'border-' . $axis . '-radius';
			$prev_val = $response[$prev_breakpoint][$css_property];

			if ($val && $val !== $prev_val) 
				$response[$breakpoint][$css_property] = $val;
		}
    }

	return $response;
}
