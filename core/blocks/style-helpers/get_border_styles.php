<?php

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
    $key_words = ['top-left', 'top-right', 'bottom-right', 'bottom-left', 'top', 'right', 'bottom', 'left'];

    // Remove palette-sc-status keys
    $obj = array_filter($obj, function ($key) {
        return strpos($key, 'palette-sc-status') === false;
    }, ARRAY_FILTER_USE_KEY);

    $hover_status = get_attributes_value([
        'target' => 'border-status-hover',
        'props' => $obj,
        'prefix' => $prefix,
    ]);

    $is_active = $sc_values->{'hover-border-color-global'} ?? false;
    $affect_all = $sc_values->{'hover-border-color-all'} ?? false;

    $global_hover_status = $is_active && $affect_all;

    if ($is_hover && !is_null($hover_status) && !$hover_status && !$global_hover_status) {
        return [];
    }

    $key_words = [
        'top-left',
        'top-right',
        'bottom-right',
        'bottom-left',
        'top',
        'right',
        'bottom',
        'left',
    ];

    $omit_border_style = !$is_IB && !$hover_status && !$global_hover_status;

    $get_color_string = function ($breakpoint) use ($obj, $prefix, $is_hover, $is_button, $hover_status, $global_hover_status, $block_style) {
        $palette_attributes = get_palette_attributes([
            'obj' => $obj,
            'prefix' => $prefix . 'border-',
            'is_hover' => $is_hover,
            'breakpoint' => $breakpoint,
        ]);

        $palette_status = $palette_attributes['palette_status'];
        $palette_sc_status = $palette_attributes['palette_sc_status'];
        $palette_color = $palette_attributes['palette_color'];
        $palette_opacity = $palette_attributes['palette_opacity'];
        $color = $palette_attributes['color'];

        if (!$palette_status) {
            return $color;
        }

        if (!$palette_sc_status && $is_button && (!$is_hover || $hover_status || $global_hover_status)) {
            return get_color_rgba_string([
                'first_var' => ($is_button ? 'button-' : '') . 'border-color' . ($is_hover ? '-hover' : ''),
                'second_var' => 'color-' . $palette_color,
                'opacity' => $palette_opacity,
                'block_style' => $block_style,
            ]);
        }

        return get_color_rgba_string([
            'first_var' => 'color-' . $palette_color,
            'opacity' => $palette_opacity,
            'block_style' => $block_style,
        ]);
    };

    $response = [];

    // Pre-compute regex patterns
    $hover_suffix = $is_hover ? '-hover' : '';
    $regex_patterns = [];
    foreach ($breakpoints as $breakpoint) {
        $regex_patterns[$breakpoint] = '/-' . $breakpoint . $hover_suffix . '\b(?!.*\b-' . $breakpoint . $hover_suffix . '\b)/';
    }

    // Iterate over breakpoints
    foreach ($breakpoints as $breakpoint) {
        $response[$breakpoint] = [];

        $border_style = get_last_breakpoint_attribute([
            'target' => $prefix . 'border-style',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
            'is_hover' => $is_hover,
        ]);

        $is_border_none = is_null($border_style) || $border_style === 'none';
        $current_omit_border_style = $omit_border_style ? $is_border_none : false;

        $replacer = $regex_patterns[$breakpoint];

        foreach ($obj as $key => $raw_value) {
            $new_key = $prefix ? str_replace($prefix, '', $key) : $key;
            if (!preg_match($replacer, $new_key) || strpos($new_key, 'sync') !== false || strpos($new_key, 'unit') !== false) {
                continue;
            }

            $new_label = preg_replace($replacer, '', $new_key);

            $value = get_last_breakpoint_attribute([
                'target' => $prefix . $new_label,
                'is_hover' => $is_hover,
                'breakpoint' => $breakpoint,
                'attributes' => $obj,
            ]);

            if (!get_is_valid($value, true) && !($is_hover && $global_hover_status && strpos($key, 'color') !== false) && $key !== $prefix . 'border-palette-color-' . $breakpoint) {
                continue;
            }

            $is_key_word = false;
            foreach ($key_words as $key_word) {
                if (strpos($new_label, $key_word) !== false) {
                    $is_key_word = true;
                    break;
                }
            }

            if (strpos($key, 'style') !== false) {
                if (!$current_omit_border_style) {
                    if (($is_hover || $is_IB) && $is_border_none) {
                        $response[$breakpoint]['border'] = 'none';
                    } else {
                        $response[$breakpoint]['border-style'] = $border_style;
                    }
                }
            } elseif (!$is_key_word) {
                if ((strpos($key, 'color') !== false || strpos($key, 'opacity') !== false) && (!$is_border_none || ($is_hover && $global_hover_status))) {
                    $response[$breakpoint][$border_color_property] = $get_color_string($breakpoint);
                } elseif (!in_array($new_label, ['border-palette-status', 'border-palette-color', 'border-palette-opacity'])) {
                    $response[$breakpoint][$new_label] = (string) $value;
                }
            } elseif (in_array($new_label, ['border-top-width', 'border-right-width', 'border-left-width', 'border-bottom-width'])) {
                if ($is_border_none) {
                    continue;
                }
                $response[$breakpoint][$new_label] = is_numeric($value) ? $value . ($obj[$prefix . str_replace('-width', '-unit', $new_label)] ?? 'px') : '0px';
            } elseif (is_numeric($value)) {
                $response[$breakpoint][$new_label] = $value . ($obj[$prefix . str_replace($key_words[0], 'unit', $new_label)] ?? 'px');
            } else {
                $response[$breakpoint][$new_label] = '0px';
            }
        }
    }

    return $response;
}
