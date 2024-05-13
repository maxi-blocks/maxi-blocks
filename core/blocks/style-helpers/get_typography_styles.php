<?php

function get_typography_styles($args)
{
    $obj = $args['obj'];
    $is_hover = isset($args['is_hover']) ? $args['is_hover'] : false;
    $prefix = isset($args['prefix']) ? $args['prefix'] : '';
    $custom_format_typography = isset($args['custom_format_typography']) ? $args['custom_format_typography'] : false;
    $block_style = isset($args['block_style']) ? $args['block_style'] : '';
    $text_level = isset($args['text_level']) ? $args['text_level'] : 'p';
    $normal_typography = isset($args['normal_typography']) ? $args['normal_typography'] : null;
    $sc_values = isset($args['sc_values']) ? $args['sc_values'] : array();
    $is_style_cards = isset($args['is_style_cards']) ? $args['is_style_cards'] : false;
    $disable_palette_defaults = isset($args['disable_palette_defaults']) ? $args['disable_palette_defaults'] : false;
    $disable_bottom_gap = isset($args['disable_bottom_gap']) ? $args['disable_bottom_gap'] : false;

    $response = array();

    $hover_status = array_key_exists($prefix . 'typography-status-hover', $obj) && $obj[$prefix . 'typography-status-hover'];

    $is_active = isset($sc_values['hover-color-global']) ? $sc_values['hover-color-global'] : null;
    $affect_all = isset($sc_values['hover-color-all']) ? $sc_values['hover-color-all'] : null;

    $global_hover_status = $is_active && $affect_all;

    if ($is_hover && !$hover_status && !$global_hover_status) {
        return $response;
    }

    $is_custom_format = (bool) $custom_format_typography;

    $get_value = function ($target, $breakpoint) use ($obj, $is_custom_format, $is_hover, $prefix) {
        $attribute_key = get_attribute_key($target, !$is_custom_format && $is_hover, $prefix, $breakpoint);
        return isset($obj[$attribute_key]) ? $obj[$attribute_key] : null;
    };

    $get_last_breakpoint_value = function ($target, $breakpoint) use ($prefix, $obj, $is_custom_format, $is_hover) {
        return get_last_breakpoint_attribute([
            'target' => "{$prefix}{$target}",
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
            'is_hover' => !$is_custom_format && $is_hover,
        ]);
    };

    $get_default_value = function ($target) use ($is_custom_format, $is_hover, $prefix) {
        return get_default_attribute(get_attribute_key($target, !$is_custom_format && $is_hover, $prefix, 'general'));
    };

    $get_palette_color_status = function ($breakpoint) use ($prefix, $obj, $is_hover, $normal_typography, $custom_format_typography) {
        $palette_status = get_last_breakpoint_attribute([
            'target' => "{$prefix}palette-status",
            'breakpoint' => $breakpoint,
            'attributes' => array_merge($obj ?? [], $normal_typography ?? []),
            'is_hover' => $is_hover,
        ]);

        if (!is_null($palette_status)) {
            return $palette_status;
        }

        return $custom_format_typography && get_last_breakpoint_attribute([
            'target' => "{$prefix}palette-status",
            'breakpoint' => $breakpoint,
            'attributes' => $custom_format_typography,
            'is_hover' => $is_hover,
        ]);
    };

    $is_default_opacity = function ($opacity, $default_opacity, $breakpoint) {
        return $opacity === $default_opacity ||
            (is_null($opacity) && is_null($default_opacity)) ||
            ($breakpoint === 'general' && $opacity === 1); // supports reset on general
    };

    $get_color_string = function ($breakpoint) use (
        $get_palette_color_status,
        $is_default_opacity,
        $get_value,
        $is_hover,
        $hover_status,
        $global_hover_status,
        $get_last_breakpoint_value,
        $disable_palette_defaults,
        $get_default_value,
        $text_level,
        $block_style,
    ) {
        $palette_status = $get_palette_color_status($breakpoint);
        $palette_sc_status = $get_last_breakpoint_value('palette-sc-status', $breakpoint);
        $palette_color = $get_last_breakpoint_value('palette-color', $breakpoint);

        if (!$palette_sc_status && $palette_status && (!$is_hover || $hover_status || $global_hover_status)) {
            if (is_null($palette_color)) {
                return [];
            }

            $palette_opacity = $get_last_breakpoint_value('palette-opacity', $breakpoint);

            if ($disable_palette_defaults) {
                $default_palette_color = $get_default_value('palette-color');
                $default_palette_opacity = $get_default_value('palette-opacity');

                if ($palette_color === $default_palette_color && $is_default_opacity($palette_opacity, $default_palette_opacity, $breakpoint)) {
                    return [];
                }
            }

            return [
                'color' => get_color_rgba_string([
                    'first_var' => "{$text_level}-color" . ($is_hover ? '-hover' : ''),
                    'second_var' => "color-{$palette_color}",
                    'opacity' => $palette_opacity,
                    'block_style' => $block_style,
                ]),
            ];
        }

        if ($palette_status) {
            if (is_null($palette_color)) {
                return [];
            }

            $palette_opacity = $get_last_breakpoint_value('palette-opacity', $breakpoint);

            if ($disable_palette_defaults) {
                $default_palette_color = $get_default_value('palette-color');
                $default_palette_opacity = $get_default_value('palette-opacity');

                if ($palette_color === $default_palette_color && $is_default_opacity($palette_opacity, $default_palette_opacity, $breakpoint)) {
                    return [];
                }
            }

            return [
                'color' => get_color_rgba_string([
                    'first_var' => "color-{$palette_color}",
                    'opacity' => $palette_opacity,
                    'block_style' => $block_style,
                ]),
            ];
        }

        $color = $get_value('color', $breakpoint);
        return !is_null($color) ? ['color' => $color] : [];
    };

    // As sometimes creators just change the value and not the unit, we need to
    // be able to request the non-hover unit
    $get_unit_value = function ($prop, $breakpoint) use ($custom_format_typography, $obj, $normal_typography, $is_custom_format, $prefix) {
        $unit = get_last_breakpoint_attribute([
            'target' => $prefix . $prop,
            'breakpoint' => $breakpoint,
            'attributes' => $is_custom_format ? $custom_format_typography : $obj,
        ]);

        if (!$normal_typography || $unit) {
            return $unit === '-' ? '' : $unit;
        }

        return get_last_breakpoint_attribute([
            'target' => $prefix . $prop,
            'breakpoint' => $breakpoint,
            'attributes' => $normal_typography
        ]);
    };

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $typography = array_merge(
            !is_null($get_value('font-family', $breakpoint)) ? ['font-family' => '"' . $get_value('font-family', $breakpoint) . '"'] : [],
            !is_null($get_value('font-size', $breakpoint)) ? ['font-size' => $get_value('font-size', $breakpoint) . $get_unit_value('font-size-unit', $breakpoint)] : [],
            !is_null($get_value('line-height', $breakpoint)) ? ['line-height' => $get_value('line-height', $breakpoint) . ($get_unit_value('line-height-unit', $breakpoint) ?: '')] : [],
            !is_null($get_value('letter-spacing', $breakpoint)) ? ['letter-spacing' => $get_value('letter-spacing', $breakpoint) . $get_unit_value('letter-spacing-unit', $breakpoint)] : [],
            !is_null($get_value('font-weight', $breakpoint)) ? ['font-weight' => $get_value('font-weight', $breakpoint)] : [],
            !is_null($get_value('text-transform', $breakpoint)) ? ['text-transform' => $get_value('text-transform', $breakpoint)] : [],
            !is_null($get_value('font-style', $breakpoint)) ? ['font-style' => $get_value('font-style', $breakpoint)] : [],
            !is_null($get_value('text-decoration', $breakpoint)) ? ['text-decoration' => $get_value('text-decoration', $breakpoint)] : [],
            !is_null($get_value('text-indent', $breakpoint)) ? ['text-indent' => $get_value('text-indent', $breakpoint) . $get_unit_value('text-indent-unit', $breakpoint)] : [],
            !is_null($get_value('text-shadow', $breakpoint)) ? ['text-shadow' => $get_value('text-shadow', $breakpoint)] : [],
            !is_null($get_value('vertical-align', $breakpoint)) ? ['vertical-align' => $get_value('vertical-align', $breakpoint)] : [],
            !is_null($get_value('text-orientation', $breakpoint)) ? ['writing-mode' => $get_value('text-orientation', $breakpoint) !== 'unset' ? 'vertical-rl' : 'unset'] : [],
            !is_null($get_value('text-orientation', $breakpoint)) ? ['text-orientation' => $get_value('text-orientation', $breakpoint)] : [],
            !is_null($get_value('text-direction', $breakpoint)) ? ['direction' => $get_value('text-direction', $breakpoint)] : [],
            !is_null($get_value('white-space', $breakpoint)) ? ['white-space' => $get_value('white-space', $breakpoint)] : [],
            !is_null($get_value('word-spacing', $breakpoint)) ? ['word-spacing' => $get_value('word-spacing', $breakpoint) . $get_unit_value('word-spacing-unit', $breakpoint)] : [],
            !$disable_bottom_gap && !is_null($get_value('bottom-gap', $breakpoint)) ? ['margin-bottom' => $get_value('bottom-gap', $breakpoint) . $get_unit_value('bottom-gap-unit', $breakpoint)] : [],
            ...!$is_style_cards ? [
                !is_null($get_value('text-orientation', $breakpoint)) ? ['writing-mode' => $get_value('text-orientation', $breakpoint) !== 'unset' ? 'vertical-rl' : 'unset'] : [],
                !is_null($get_value('text-direction', $breakpoint)) ? ['direction' => $get_value('text-direction', $breakpoint)] : []
            ] : []
        );

        $typography = array_merge($typography, $get_color_string($breakpoint));

        $typography = array_filter($typography, function ($value) {
            return !is_null($value);
        });

        if (!empty($typography)) {
            $response[$breakpoint] = $typography;
        }
    }

    return $response;
}
