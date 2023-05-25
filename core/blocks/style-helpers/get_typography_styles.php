<?php

function get_typography_styles($args)
{
    $obj = $args['obj'];
    $is_hover = isset($args['isHover']) ? $args['isHover'] : false;
    $prefix = isset($args['prefix']) ? $args['prefix'] : '';
    $custom_format_typography = isset($args['customFormatTypography']) ? $args['customFormatTypography'] : false;
    $block_style = isset($args['block_style']) ? $args['block_style'] : '';
    $text_level = isset($args['textLevel']) ? $args['textLevel'] : 'p';
    $normal_typography = isset($args['normalTypography']) ? $args['normalTypography'] : null;
    $sc_values = isset($args['scValues']) ? $args['scValues'] : array();
    $is_style_cards = isset($args['isStyleCards']) ? $args['isStyleCards'] : false;

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

    $get_palette_color_status = function ($breakpoint) use ($obj, $custom_format_typography, $is_hover, $prefix, $is_custom_format) {
        $palette_status = get_last_breakpoint_attribute(
            array(
                'target' => $prefix . 'palette-status',
                'breakpoint' => $breakpoint,
                'attributes' => $is_custom_format ? $custom_format_typography : $obj,
                'isHover' => $is_hover
            )
        );

        if (!is_null($palette_status)) {
            return $palette_status;
        }

        if ($is_custom_format) {
            return get_last_breakpoint_attribute(
                array(
                    'target' => $prefix . 'palette-status',
                    'breakpoint' => $breakpoint,
                    'attributes' => $custom_format_typography,
                    'isHover' => $is_hover
                )
            );
        }

        return null;
    };

    $get_color_string = function ($breakpoint) use ($get_palette_color_status, $get_value, $is_hover, $hover_status, $text_level, $block_style, $global_hover_status) {
        $palette_status = $get_palette_color_status($breakpoint);
        $palette_sc_status = $get_value('palette-sc-status', $breakpoint);
        $palette_color = $get_value('palette-color', $breakpoint);
        $palette_opacity = $get_value('palette-opacity', $breakpoint);

        if (!$palette_sc_status && $palette_status && (!$is_hover || $hover_status || $global_hover_status)) {
            $text_level_color = $is_hover ? $text_level . '-color-hover' : $text_level . '-color';

            return !is_null($palette_color) ? array(
                'color' => get_color_rgba_string(
                    array(
                        'first_var' => $text_level_color,
                        'second_var' => 'color-' . $palette_color,
                        'opacity' => $palette_opacity,
                        'block_style' => $block_style
                    )
                )
            ) : array();
        }

        if ($palette_status) {
            return !is_null($palette_color) ? array(
                'color' => get_color_rgba_string(
                    array(
                        'first_var' => 'color-' . $palette_color,
                        'opacity' => $palette_opacity,
                        'block_style' => $block_style
                    )
                )
            ) : array();
        }

        $color = $get_value('color', $breakpoint);
        return !is_null($color) ? array('color' => $color) : array();
    };

    $get_unit_value = function ($prop, $breakpoint) use ($custom_format_typography, $obj, $normal_typography, $is_custom_format, $prefix) {
        $unit = get_last_breakpoint_attribute(
            array(
                'target' => $prefix . $prop,
                'breakpoint' => $breakpoint,
                'attributes' => $is_custom_format ? $custom_format_typography : $obj,
                'forceUseBreakpoint' => true
            )
        );

        if (!is_null($unit)) {
            return $unit === '-' ? '' : $unit;
        }

        return get_last_breakpoint_attribute(
            array(
                'target' => $prefix . $prop,
                'breakpoint' => $breakpoint,
                'attributes' => $normal_typography
            )
        );
    };

    $breakpoints = array('general', 'sm', 'md', 'lg', 'xl', 'xxl');

    foreach ($breakpoints as $breakpoint) {
        $typography = array(
            !is_null($get_value('font-family', $breakpoint)) ? ['font-family' => '"' . $get_value('font-family', $breakpoint) . '"'] : null,
            !is_null($get_value('font-size', $breakpoint)) ? ['font-size' => $get_value('font-size', $breakpoint) . $get_unit_value('font-size-unit', $breakpoint)] : null,
            !is_null($get_value('line-height', $breakpoint)) ? ['line-height' => $get_value('line-height', $breakpoint) . ($get_unit_value('line-height-unit', $breakpoint) ?: '')] : null,
            !is_null($get_value('letter-spacing', $breakpoint)) ? ['letter-spacing' => $get_value('letter-spacing', $breakpoint) . $get_unit_value('letter-spacing-unit', $breakpoint)] : null,
            !is_null($get_value('font-weight', $breakpoint)) ? ['font-weight' => $get_value('font-weight', $breakpoint)] : null,
            !is_null($get_value('text-transform', $breakpoint)) ? ['text-transform' => $get_value('text-transform', $breakpoint)] : null,
            !is_null($get_value('font-style', $breakpoint)) ? ['font-style' => $get_value('font-style', $breakpoint)] : null,
            !is_null($get_value('text-decoration', $breakpoint)) ? ['text-decoration' => $get_value('text-decoration', $breakpoint)] : null,
            !is_null($get_value('text-indent', $breakpoint)) ? ['text-indent' => $get_value('text-indent', $breakpoint) . $get_unit_value('text-indent-unit', $breakpoint)] : null,
            !is_null($get_value('text-shadow', $breakpoint)) ? ['text-shadow' => $get_value('text-shadow', $breakpoint)] : null,
            !is_null($get_value('vertical-align', $breakpoint)) ? ['vertical-align' => $get_value('vertical-align', $breakpoint)] : null,
            !is_null($get_value('text-orientation', $breakpoint)) ? ['writing-mode' => $get_value('text-orientation', $breakpoint) !== 'unset' ? 'vertical-rl' : 'unset'] : null,
            !is_null($get_value('text-orientation', $breakpoint)) ? ['text-orientation' => $get_value('text-orientation', $breakpoint)] : null,
            !is_null($get_value('text-direction', $breakpoint)) ? ['direction' => $get_value('text-direction', $breakpoint)] : null,
            !is_null($get_value('white-space', $breakpoint)) ? ['white-space' => $get_value('white-space', $breakpoint)] : null,
            !is_null($get_value('word-spacing', $breakpoint)) ? ['word-spacing' => $get_value('word-spacing', $breakpoint) . $get_unit_value('word-spacing-unit', $breakpoint)] : null,
            !is_null($get_value('bottom-gap', $breakpoint)) ? ['margin-bottom' => $get_value('bottom-gap', $breakpoint) . $get_unit_value('bottom-gap-unit', $breakpoint)] : null,
            ...!$is_style_cards ? [
                !is_null($get_value('text-orientation', $breakpoint)) ? ['writing-mode' => $get_value('text-orientation', $breakpoint) !== 'unset' ? 'vertical-rl' : 'unset'] : null,
                !is_null($get_value('text-direction', $breakpoint)) ? ['direction' => $get_value('text-direction', $breakpoint)] : null
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
