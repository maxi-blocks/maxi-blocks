<?php

function get_shape_divider_styles($obj, $location)
{
    $response = [
        'label' => 'Shape Divider'
    ];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $response[$breakpoint] = [];

        if (isset($obj["shape-divider-$location-height-$breakpoint"])) {
            $response[$breakpoint]['height'] = $obj["shape-divider-$location-height-$breakpoint"] . ($obj["shape-divider-$location-height-unit-$breakpoint"] ?? 'px');
        }

        if (isset($obj["shape-divider-$location-opacity-$breakpoint"])) {
            $response[$breakpoint]['opacity'] = $obj["shape-divider-$location-opacity-$breakpoint"];
        }
    }

    $raw_positions = get_margin_padding_styles([
        'obj' => get_group_attributes($obj, 'padding')
    ]);

    foreach ($raw_positions as $breakpoint => $value) {
        $result = [];

        foreach ($value as $pos => $val) {
            if (str_replace('padding-', '', $pos) === $location) {
                $result[str_replace('padding-', '', $pos)] = '-' . $val;
            }
        }

        $response[$breakpoint] = array_merge($response[$breakpoint], $result);
    }

    return $response;
}

function get_shape_divider_svg_styles($obj, $location, $block_style)
{
    $response = [
        'label' => 'Shape Divider SVG',
        'general' => []
    ];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $response[$breakpoint] = [];

        $palette_attributes = get_palette_attributes([
            'obj' => $obj,
            'prefix' => "shape-divider-$location-",
            'breakpoint' => $breakpoint
        ]);

        $palette_status = $palette_attributes['palette_status'];
        $palette_color = $palette_attributes['palette_color'];
        $palette_opacity = $palette_attributes['palette_opacity'];
        $color = $palette_attributes['color'];

        if (!$palette_status && isset($color)) {
            $response[$breakpoint]['fill'] = $color;
        } elseif ($palette_status && $palette_color) {
            $response[$breakpoint]['fill'] = get_color_rgba_string([
                'first_var' => "color-$palette_color",
                'opacity' => $palette_opacity,
                'block_style' => $block_style
            ]);
        }
    }

    return $response;
}
