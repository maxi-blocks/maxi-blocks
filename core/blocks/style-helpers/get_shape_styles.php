<?php

function get_shape_styles($obj, $target, $blockStyle)
{
    $response = [
        'label' => 'Shape',
        'general' => []
    ];

    if ($target === 'svg' && isset($obj['shape-width'])) {
        $response['general']['max-width'] = $obj['shape-width'] . $obj['shape-width-unit'];
        $response['general']['max-height'] = $obj['shape-width'] . $obj['shape-width-unit'];
    }

    if ($target === 'path') {
        $palette_attributes = get_palette_attributes(
            $obj,
            'shape-fill-',
        );

        $palette_status = $palette_attributes['palette_status'];
        $palette_color = $palette_attributes['palette_color'];
        $palette_opacity = $palette_attributes['palette_opacity'];
        $color = $palette_attributes['color'];

        if ($palette_status && $palette_color) {
            $response['general']['fill'] = get_color_rgba_string(
                "color-$palette_color",
                $palette_opacity,
                $blockStyle
            );
        } elseif (!$palette_status && isset($color)) {
            $response['general']['fill'] = $color;
        }
    }

    return $response;
}
