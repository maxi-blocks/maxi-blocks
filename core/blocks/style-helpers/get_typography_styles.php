<?php

function get_typography_styles($params) {
    $obj = $params['obj'];
    $is_hover = $params['is_hover'] ?? false;
    $prefix = $params['prefix'] ?? '';
    $custom_format_typography = $params['custom_format_typography'] ?? false;
    $block_style = $params['block_style'];
    $text_level = $params['text_level'] ?? 'p';
    $normal_typography = $params['normal_typography']; // Just in case is hover,
    $sc_values = $params['sc_values'] ?? [];
    $is_style_cards = $params['is_style_cards'] ?? false;

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    $response = [];

    $hover_status = $obj["{$prefix}typography-status-hover"];
    $is_active = $sc_values['hover-color-global'];
    $affect_all = $sc_values['hover-color-all'];

    $global_hover_status = $is_active && $affect_all;

    if ($is_hover && !$hover_status && !$global_hover_status) return $response;

    $is_custom_format = !empty($custom_format_typography);

    $get_value = function($target, $breakpoint) use ($obj, $is_hover, $prefix, $is_custom_format) {
        return $obj[get_attribute_key($target, !$is_custom_format && $is_hover, $prefix, $breakpoint)];
    };

    $get_palette_color_status = function($breakpoint) use ($obj, $normal_typography, $prefix, $is_hover, $is_custom_format, $custom_format_typography) {
        $palette_status = get_last_breakpoint_attribute(
            "{$prefix}palette-status",
            $breakpoint,
            array_merge($obj, $normal_typography),
            $is_hover,
        );

        if (!is_null($palette_status)) return $palette_status;

        return $is_custom_format && get_last_breakpoint_attribute(
            "{$prefix}palette-status",
            $breakpoint,
            $custom_format_typography,
            $is_hover,
        );
    };

    $get_color_string = function($breakpoint) use ($get_palette_color_status, $get_value, $is_hover, $hover_status, $global_hover_status, $text_level, $block_style) {
        $palette_status = $get_palette_color_status($breakpoint);
        $palette_sc_status = $get_value('palette-sc-status', $breakpoint);
        $palette_color = $get_value('palette-color', $breakpoint);
        $palette_opacity = $get_value('palette-opacity', $breakpoint);

        if (!$palette_sc_status && $palette_status && (!$is_hover || $hover_status || $global_hover_status)) {
            return !is_null($palette_color) ? [
                "color" => get_color_rgba_string(
                    "{$text_level}-color" . ($is_hover ? '-hover' : ''),
                    "color-{$palette_color}",
                    $palette_opacity,
                    $block_style,
                ),
            ] : [];
        }

        if ($palette_status) {
            return !is_null($palette_color) ? [
                "color" => get_color_rgba_string(
                    "color-{$palette_color}",
                    $palette_opacity,
                    $block_style,
                ),
            ] : [];
        }

        $color = $get_value('color', $breakpoint);

        return !is_null($color) ? ["color" => $color] : [];
    };

    $get_unit_value = function($prop, $breakpoint) use ($is_custom_format, $custom_format_typography, $obj, $prefix, $normal_typography) {
        $unit = get_last_breakpoint_attribute(
            "{$prefix}{$prop}",
            $breakpoint,
            $is_custom_format ? $custom_format_typography : $obj,
            true,
        );

        if (!$normal_typography || $unit) return $unit == '-' ? '' : $unit;

        return get_last_breakpoint_attribute(
            "{$prefix}{$prop}",
            $breakpoint,
            $normal_typography,
        );
    };

    foreach ($breakpoints as $breakpoint) {
        $typography = [];

        $font_family = $get_value('font-family', $breakpoint);
        if (!is_null($font_family)) {
            $typography['font-family'] = "\"{$font_family}\"";
        }

        $typography = array_merge($typography, $get_color_string($breakpoint));

        $font_size = $get_value('font-size', $breakpoint);
        if (!is_null($font_size)) {
            $typography['font-size'] = "{$font_size}{$get_unit_value('font-size-unit', $breakpoint)}";
        }

        $font_weight = $get_value('font-weight', $breakpoint);
        if (!is_null($font_weight)) {
            $typography['font-weight'] = $font_weight;
        }

        $text_transform = $get_value('text-transform', $breakpoint);
        if (!is_null($text_transform)) {
            $typography['text-transform'] = $text_transform;
        }

        // Note the additional handling for 'unset' values
        $text_orientation = $get_value('text-orientation', $breakpoint);
        if (!is_null($text_orientation)) {
            $typography['writing-mode'] = $text_orientation !== 'unset' ? 'vertical-rl' : 'unset';
            $typography['text-orientation'] = $text_orientation;
        }

        $text_direction = $get_value('text-direction', $breakpoint);
        if (!is_null($text_direction)) {
            $typography['text-direction'] = $text_direction;
        }

        $white_space = $get_value('white-space', $breakpoint);
        if (!is_null($white_space)) {
            $typography['white-space'] = $white_space;
        }


        $word_spacing = $get_value('word-spacing', $breakpoint);
        if (!is_null($word_spacing)) {
            $typography['word-spacing'] = "{$word_spacing}{$get_unit_value('word-spacing-unit', $breakpoint)}";
        }

         $bottom_gap = $get_value('bottom-gap', $breakpoint);
        if (!is_null($bottom_gap)) {
            $typography['bottom-gap'] = "{$bottom_gap}{$get_unit_value('bottom-gap-unit', $breakpoint)}";
        }

        // Remember to replace the JavaScript object literal with an associative array
        if (!$is_style_cards) {
            $text_orientation = $get_value('text-orientation', $breakpoint);
            if (!is_null($text_orientation)) {
                $typography['writing-mode'] = $text_orientation !== 'unset' ? 'vertical-rl' : 'unset';
                $typography['text-orientation'] = $text_orientation;
            }

            $text_direction = $get_value('text-direction', $breakpoint);
            if (!is_null($text_direction)) {
                $typography['direction'] = $text_direction;
            }
        }

        if (!empty($typography)) {
            $response[$breakpoint] = $typography;
        }
    }

    return $response;
}