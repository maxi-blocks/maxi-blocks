<?php

function get_icon_styles(
    $obj,
    $block_style,
    $is_icon_inherit = true,
    $is_hover = false,
    $prefix = '',
    $icon_type = ''
) {
    $response = [
        'label' => 'Icon',
        'general' => [],
    ];

    $is_shape = $icon_type !== 'shape';

    if ($is_icon_inherit && (!is_array($obj) || !isset($obj['typography-status-hover']))) {
        return $response;
    }

    if ($is_icon_inherit) {
        $palette_attributes = get_palette_attributes([
            'obj' => $obj,
            'prefix' => $prefix,
            'isHover' => $is_hover,
            'breakpoint' => 'general',
        ]);
        $response['general']['fill'] = 'none';

        if (!$is_shape && !$palette_attributes['palette_status'] && isset($palette_attributes['color'])) {
            $response['general']['stroke'] = $palette_attributes['color'];
        } elseif (!$is_shape && $palette_attributes['palette_status'] && isset($palette_attributes['palette_color'])) {
            $response['general']['stroke'] = get_color_rgba_string(
                "color-{$palette_attributes['palette_color']}",
                $palette_attributes['palette_opacity'],
                $block_style,
            );
        }
    } else {
        $palette_attributes = get_palette_attributes([
            'obj' => $obj,
            'prefix' => "{$prefix}icon-",
            'isHover' => $is_hover,
        ]);

        if (!$is_shape && !$palette_attributes['palette_status'] && !is_null($palette_attributes['color'])) {
            $response['general']['stroke'] = $palette_attributes['color'];
        } elseif (!$is_shape && $palette_attributes['palette_status'] && isset($palette_attributes['palette_color'])) {
            $response['general']['stroke'] = get_color_rgba_string(
                "color-{$palette_attributes['palette_color']}",
                $obj[$palette_attributes['palette_opacity']],
                $block_style,
            );
        }
    }

    return $response;
}
