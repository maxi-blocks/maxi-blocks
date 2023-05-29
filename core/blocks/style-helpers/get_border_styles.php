<?php

/**
 * IMPORTANT: version from https://github.com/maxi-blocks/maxi-blocks/pull/4679
 */

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

    $response = [];

    $hover_status = get_attributes_value([
        'target' => 'border-status-hover',
        'props' => $obj,
        'prefix' => $prefix,
    ]);

    $is_active = $sc_values->{'hover-border-color-global'} ?? false;
    $affect_all = $sc_values->{'hover-border-color-all'} ?? false;
    
    $global_hover_status = $is_active && $affect_all;
    
    if ($is_hover && isset($hover_status) && !$hover_status && !$global_hover_status) {
        return $response;
    }

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
        $response[$breakpoint] = [];

        $border_style = get_last_breakpoint_attribute([
            'target' => $prefix . 'border-style',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
            'isHover' => $is_hover,
        ]);

        $is_border_none = !isset($border_style) || $border_style === 'none';
        $omit_border_style = $omit_border_style ? $is_border_none : false;

        $get_value_and_unit = function ($target, $unit_target) use ($obj, $is_hover, $prefix, $breakpoint) {
            $current_value = get_attributes_value([
                'target' => $target,
                'props' => $obj,
                'is_hover' => $is_hover,
                'prefix' => $prefix,
                'breakpoint' => $breakpoint,
            ]);
            $current_unit = get_attributes_value([
                'target' => $target . '-unit',
                'props' => $obj,
                'is_hover' => $is_hover,
                'prefix' => $prefix,
                'breakpoint' => $breakpoint,
            ]) ?? get_attributes_value([
                'target' => "$unit_target",
                'props' => $obj,
                'is_hover' => $is_hover,
                'prefix' => $prefix,
                'breakpoint' => $breakpoint,
            ]);

            $has_current = isset($current_value) || isset($current_unit);

            if (!$has_current) {
                return null;
            }

            $last_value = get_last_breakpoint_attribute([
                'target' => $prefix . $target,
                'breakpoint' => $breakpoint,
                'attributes' => $obj,
                'is_hover' => $is_hover,
            ]);

            if (!isset($last_value)) {
                return null;
            }

            $last_unit = get_last_breakpoint_attribute([
                'target' => "$target-unit",
                'prefix' => $prefix,
                'breakpoint' => $breakpoint,
                'attributes' => $obj,
                'is_hover' => $is_hover,
            ]) ?? get_last_breakpoint_attribute([
                'target' => $unit_target,
                'prefix' => $prefix,
                'breakpoint' => $breakpoint,
                'attributes' => $obj,
                'is_hover' => $is_hover,
            ]) ?? 'px';

            return $last_value . $last_unit;
        };

        $prev_breakpoint = get_prev_breakpoint($breakpoint);

        if (!$is_border_none) {
            $get_color_string = function ($breakpoint) use ($obj, $is_hover, $prefix, $is_button, $hover_status, $global_hover_status, $block_style) {
                $current_color = get_attributes_value([
                    'target' => ['border-palette-status', 'border-palette-color', 'border-palette-opacity', 'border-color'],
                    'props' => $obj,
                    'is_hover' => $is_hover,
                    'prefix' => $prefix,
                    'breakpoint' => $breakpoint,
                    'return_object' => true
                ]);

                $has_different_color_attributes = false;

                foreach ($current_color as $value) {
                    if (!is_null($value)) {
                        $has_different_color_attributes = true;
                        break;
                    }
                }

                if (!$has_different_color_attributes) {
                    return null;
                }

                $palette_attributes = get_palette_attributes([
                    'obj' => $obj,
                    'prefix' => $prefix . 'border-',
                    'breakpoint' => $breakpoint,
                    'is_hover' => $is_hover,
                ]);

                $palette_status = $palette_attributes['palette_status'];
                $palette_color = $palette_attributes['palette_color'];
                $palette_opacity = $palette_attributes['palette_opacity'];
                $color = $palette_attributes['color'];

                if ($palette_status) {
                    if ($is_button && (!$is_hover || $hover_status || $global_hover_status)) {
                        return get_color_rgba_string([
                            'first_var' => ($is_button ? 'button-' : '') . 'border-color' . ($is_hover ? '-hover' : ''),
                            'second_var' => 'color-' . $palette_color,
                            'opacity' => $palette_opacity,
                            'block_style' => $block_style
                            ]);
                    } else {
                        return get_color_rgba_string([
                            'first_var' => 'color-' . $palette_color,
                            'opacity' => $palette_opacity,
                            'block_style' => $block_style
                        ]);
                    }
                }

                return $color;
            };

            $border_style_key = get_attribute_key('border-style', $is_hover, $prefix, $breakpoint);
            $current_border_style = null;

            if (array_key_exists($border_style_key, $obj)) {
                $current_border_style = $obj[$border_style_key];
            }

            if (!is_null($current_border_style)) {
                $response[$breakpoint]['border-style'] = $border_style;
            }

            $border_color = $get_color_string($breakpoint);
            if ($border_color) {
                $response[$breakpoint][$border_color_property] = $border_color;
            }

            foreach ($width_keys as $axis) {
                $css_property = 'border-' . $axis . '-width';
                $val = $get_value_and_unit($css_property, 'border-unit-width');
                $prev_val = null;

                if (array_key_exists($css_property, $response[$prev_breakpoint])) {
                    $prev_val = $response[$prev_breakpoint][$css_property];
                }

                if ($val && $val !== $prev_val) {
                    $response[$breakpoint][$css_property] = $val;
                }
            }
        } elseif (
            array_key_exists(get_attribute_key('border-style', $is_hover, $prefix, $breakpoint), $obj) &&
            !is_null($obj[get_attribute_key('border-style', $is_hover, $prefix, $breakpoint)]) &&
            $border_style === 'none'
        ) {
            $response[$breakpoint]['border'] = 'none';
        }

        // Border radius doesn't need border style
        foreach ($radius_keys as $axis) {
            $css_property = 'border-' . $axis . '-radius';
            $val = $get_value_and_unit($css_property, 'border-unit-radius');
            $prev_val = null;

            if (array_key_exists($css_property, $response[$prev_breakpoint])) {
                $prev_val = $response[$prev_breakpoint][$css_property];
            }

            if ($val && $val !== $prev_val) {
                $response[$breakpoint][$css_property] = $val;
            }
        }
    }

    return $response;
}
