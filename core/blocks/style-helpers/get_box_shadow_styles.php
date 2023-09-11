<?php

function get_box_shadow_styles($params)
{
    $obj = $params['obj'];
    $is_hover = isset($params['is_hover']) ? $params['is_hover'] : false;
    $drop_shadow = isset($params['drop_shadow']) ? $params['drop_shadow'] : false;
    $prefix = isset($params['prefix']) ? $params['prefix'] : '';
    $block_style = $params['block_style'];
    $for_clip_path = isset($params['for_clip_path']) ? $params['for_clip_path'] : false;
    $is_IB = isset($params['is_IB']) ? $params['is_IB'] : false;

    $response = [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $box_shadow_string = '';

        $get_value = function ($target) use ($obj, $is_hover, $prefix, $breakpoint) {
            $value = get_attributes_value([
                'target' => $target,
                'props' => $obj,
                'is_hover' => $is_hover,
                'prefix' => $prefix . 'box-shadow-',
                'breakpoint' => $breakpoint
            ]);

            $default_value =
                $breakpoint === 'general' ?
                    get_default_attribute($prefix . 'box-shadow-' . $target . '-' . $breakpoint)
                    : get_last_breakpoint_attribute([
                        'target' => $prefix . 'box-shadow-' . $target,
                        'breakpoint' => get_prev_breakpoint($breakpoint),
                        'attributes' => $obj,
                        'is_hover' => $is_hover
                    ]);

            return [
                'value' => $value,
                'default_value' => $default_value
            ];
        };

        $clip_path_exists = (get_last_breakpoint_attribute([
            'target' => 'clip-path',
            'breakpoint' => $breakpoint,
            'attributes' => $obj
        ]) && get_last_breakpoint_attribute([
           'target' =>  'clip-path-status',
            'breakpoint' => $breakpoint,
            'attributes' => $obj
       ])) || !empty($obj['SVGElement']);

        $default_clip_path_exists = $breakpoint === 'general' ? false : (get_last_breakpoint_attribute([
           'target' =>  'clip-path',
            'breakpoint' => get_prev_breakpoint($breakpoint),
            'attributes' => $obj
        ]) && get_last_breakpoint_attribute([
            'target' => 'clip-path-status',
            'breakpoint' => get_prev_breakpoint($breakpoint),
            'attributes' => $obj
        ])) || !empty($obj['SVGElement']);

        // Inset
        ['value' => $inset, 'default_value' => $default_inset] = $get_value('inset');

        // Horizontal
        ['value' => $horizontal, 'default_value' => $default_horizontal] = $get_value('horizontal');

        // Vertical
        ['value' => $vertical, 'default_value' => $default_vertical] = $get_value('vertical');

        // Blur
        ['value' => $blur, 'default_value' => $default_blur] = $get_value('blur');

        // Spread
        ['value' => $spread, 'default_value' => $default_spread] = $get_value('spread');

        // Horizontal Unit
        ['value' => $horizontal_unit, 'default_value' => $default_horizontal_unit] = $get_value('horizontal-unit');

        // Vertical Unit
        ['value' => $vertical_unit, 'default_value' => $default_vertical_unit] = $get_value('vertical-unit');

        // Blur Unit
        ['value' => $blur_unit, 'default_value' => $default_blur_unit] = $get_value('blur-unit');

        // Spread Unit
        ['value' => $spread_unit, 'default_value' => $default_spread_unit] = $get_value('spread-unit');

        // Palette
        $palette_status = get_last_breakpoint_attribute([
            'target' => $prefix . 'box-shadow-palette-status',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
            'is_hover' => $is_hover
        ]);

        // Color
        ['value' => $palette_color, 'default_value' => $default_palette_color] = $palette_status ? $get_value('palette-color') : $get_value('color');
        $default_color = get_color_rgba_string([
            'first_var' => 'color-' . $default_palette_color,
            'opacity' => $get_value('palette-opacity')['default_value'],
            'block_style' => $block_style
        ]);

        $color = $palette_status && $palette_color ? get_color_rgba_string([
            'first_var' => 'color-' . $palette_color,
            'opacity' => $get_value('palette-opacity')['value'],
            'block_style' => $block_style
        ]) : $palette_color;

        $is_not_default = ($breakpoint === 'general' && $is_IB) || ($breakpoint !== 'general' && $clip_path_exists !== $default_clip_path_exists && $prefix === 'image-' && $clip_path_exists) || (is_bool($inset) && $inset !== $default_inset) || (is_numeric($horizontal) && $horizontal !== 0 && $horizontal !== $default_horizontal) || (is_numeric($vertical) && $vertical !== 0 && $vertical !== $default_vertical) || (is_numeric($blur) && $blur !== 0 && $blur !== $default_blur) || (is_numeric($spread) && $spread !== 0 && $spread !== $default_spread) || (!is_null($horizontal_unit) && $horizontal_unit !== $default_horizontal_unit) || (!is_null($vertical_unit) && $vertical_unit !== $default_vertical_unit) || (!is_null($blur_unit) && $blur_unit !== $default_blur_unit) || (!is_null($spread_unit) && $spread_unit !== $default_spread_unit) || (!is_null($color) && $color !== $default_color);

        $horizontal_value = is_numeric($horizontal) ? $horizontal : $default_horizontal;
        $vertical_value = is_numeric($vertical) ? $vertical : $default_vertical;

        if ($is_not_default && $drop_shadow) {
            $blur_value = is_numeric($blur) ? round($blur / 3) : round($default_blur / 3);

            $box_shadow_string .= ($horizontal_value || 0) . ($horizontal_unit || 'px') . ' ';
            $box_shadow_string .= ($vertical_value || 0) . ($vertical_unit || 'px') . ' ';
            $box_shadow_string .= ($blur_value || 0) . ($blur_unit || 'px') . ' ';
            $box_shadow_string .= $color ?? $default_color;

            if (!($for_clip_path && !$clip_path_exists)) {
                $response[$breakpoint] = [
                    'filter' => 'drop-shadow(' . trim($box_shadow_string) . ')'
                ];
            }
        } elseif ($is_not_default) {
            $blur_value = is_numeric($blur) ? $blur : $default_blur;
            $spread_value = is_numeric($spread) ? $spread : $default_spread;
            $inset_value = is_bool($inset) ? $inset : $default_inset;

            $box_shadow_string .= ($inset_value && $inset_value ? 'inset ' : '');
            $box_shadow_string .= ($horizontal_value ?? 0) . ($horizontal_unit ?? 'px') . ' ';
            $box_shadow_string .= ($vertical_value ?? 0) . ($vertical_unit ?? 'px') . ' ';
            $box_shadow_string .= ($blur_value ?? 0) . ($blur_unit ?? 'px') . ' ';
            $box_shadow_string .= ($spread_value ?? 0) . ($spread_unit ?? 'px') . ' ';
            $box_shadow_string .= $color ?? $default_color;

            if (!($prefix === 'image-' && $clip_path_exists)) {
                $response[$breakpoint] = [
                    'box-shadow' => trim($box_shadow_string)
                ];
            } else {
                $response[$breakpoint] = [
                    'box-shadow' => 'none'
                ];
            }
        }
    }

    return $response;
}
