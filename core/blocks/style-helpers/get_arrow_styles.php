<?php

function get_arrow_object($props)
{
    $response = [];
    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $response[$breakpoint] = [];

        $arrow_status = get_last_breakpoint_attribute([
            'target' => 'arrow-status',
            'breakpoint' => $breakpoint,
            'attributes' => $props,
        ]);
        $arrow_width = get_last_breakpoint_attribute([
            'target' => 'arrow-width',
            'breakpoint' => $breakpoint,
            'attributes' => $props,
        ]);
        $arrow_side = get_last_breakpoint_attribute([
            'target' => 'arrow-side',
            'breakpoint' => $breakpoint,
            'attributes' => $props,
        ]);
        $arrow_position = get_last_breakpoint_attribute([
            'target' => 'arrow-position',
            'breakpoint' => $breakpoint,
            'attributes' => $props,
        ]);

        $response[$breakpoint]['display'] = $arrow_status ? 'block' : 'none';

        if (!is_null($arrow_width)) {
            $response[$breakpoint]['width'] = $arrow_width . 'px';
            $response[$breakpoint]['height'] = $arrow_width . 'px';
        }

        if ($arrow_side === 'top') {
            $response[$breakpoint]['left'] = $arrow_position . '%';
            $response[$breakpoint]['top'] = '-' . floor(sqrt(2) * $arrow_width / 2) . 'px';
        }

        if ($arrow_side === 'right') {
            $response[$breakpoint]['top'] = $arrow_position . '%';
            $response[$breakpoint]['left'] = 'calc(100% + ' . floor(sqrt(2) * $arrow_width / 2) . 'px)';
        }

        if ($arrow_side === 'bottom') {
            $response[$breakpoint]['left'] = $arrow_position . '%';
            $response[$breakpoint]['top'] = 'calc(100% + ' . (floor(sqrt(2) * $arrow_width / 2) + 1) . 'px)';
        }

        if ($arrow_side === 'left') {
            $response[$breakpoint]['top'] = $arrow_position . '%';
            $response[$breakpoint]['left'] = '-' . floor(sqrt(2) * $arrow_width / 2) . 'px';
        }
    }

    return $response;
}

function get_arrow_border($props, $is_hover)
{
    $response = [
        'label' => 'Arrow Border',
        'general' => []
    ];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $response[$breakpoint] = [];
        $border_radius_unit = get_last_breakpoint_attribute([
            'target' => 'border-unit-radius',
            'breakpoint' => $breakpoint,
            'attributes' => $props,
            'is_hover' => $is_hover,
        ]);


        $border_targets = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
        foreach ($border_targets as $target) {
            $val = get_last_breakpoint_attribute([
                'target' => "border-{$target}-radius",
                'breakpoint' => $breakpoint,
                'attributes' => $props,
                'is_hover' => $is_hover,
            ]);

            if (is_int($val)) {
                $response[$breakpoint]["border-{$target}-radius"] = "{$val}{$border_radius_unit}";
            }
        }
    }

    return $response;
}

function get_arrow_color_object($bg_layers, $block_style, $is_hover = false)
{
    $response = [
        'label' => 'Arrow Color',
        'general' => []
    ];

    $color_layers = array_filter($bg_layers, function ($layer) {
        return $layer['type'] === 'color';
    });
    $layer = $color_layers ? end($color_layers) : null;

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $response[$breakpoint] = [];

        $palette_attributes = get_palette_attributes([
            'obj' => $layer,
            'prefix' => 'background-',
            'is_hover' => $is_hover,
            'breakpoint' => $breakpoint,
        ]);
        $palette_status = $palette_attributes['palette_status'];
        $palette_color = $palette_attributes['palette_color'];
        $palette_opacity = $palette_attributes['palette_opacity'];
        $color = $palette_attributes['color'];

        if ($palette_status) {
            $response[$breakpoint]['background-color'] = get_color_rgba_string([
                'first_var' => "color-{$palette_color}",
                'opacity' => $palette_opacity,
                'block_style' => $block_style,
            ]);
        } else {
            $response[$breakpoint]['background-color'] = $color;
        }
    }

    return $response;
}

function get_arrow_styles($props)
{
    $target = $props['target'] ?? '';
    $block_style = $props['block_style'];
    $is_hover = $props['is_hover'] ?? false;
    $bg_layers = $props['background-layers'] ?? [];

    $is_border_active = array_reduce(array_keys($props), function ($carry, $key) use ($props) {
        if (strpos($key, 'border-style') !== false) {
            if (!is_null($props[$key]) && $props[$key] !== 'none') {
                return true;
            }
        }
        return $carry;
    }, false);

    $is_correct_border = array_reduce(array_keys($props), function ($carry, $key) use ($props) {
        if (strpos($key, 'border-style') !== false) {
            if ($key === 'border-style-general' && $props[$key] !== 'solid' && $props[$key] !== 'none') {
                return false;
            }
            if (!is_null($props[$key]) && $props[$key] !== 'solid' && $props[$key] !== 'none') {
                return false;
            }
        }
        return $carry;
    }, true);

    $is_background_color = !empty($bg_layers) ? array_reduce($bg_layers, function ($carry, $layer) {
        return $carry || $layer['type'] === 'color';
    }, false) : false;

    if (
        !array_reduce(array_keys($props), function ($carry, $key) use ($props) {
            if (strpos($key, 'arrow-status') !== false && $props[$key]) {
                return true;
            }
            return $carry;
        }, false) ||
        !$is_background_color ||
        ($is_border_active && !$is_correct_border)
    ) {
        return [];
    }

    $response = [];

    if (!$is_hover) {
        $response["{$target} .maxi-container-arrow .maxi-container-arrow--content"] = [
            'arrow' => get_arrow_object(get_group_attributes($props, 'arrow')),
        ];
    }

    $response["{$target} .maxi-container-arrow"] = [
        'shadow' => get_box_shadow_styles([
            'obj' => get_group_attributes($props, 'boxShadow'),
            'dropShadow' => true,
            'block_style' => $block_style,
        ]),
    ];

    if (array_key_exists('box-shadow-status-hover', $props) && $props['box-shadow-status-hover']) {
        $response[$target . $is_hover ? ':hover' : '' . " .maxi-container-arrow"] = [
            'shadow' => get_box_shadow_styles([
                'obj' => get_group_attributes($props, 'boxShadow', $is_hover),
                'is_hover' => $is_hover,
                'dropShadow' => true,
                'block_style' => $block_style,
            ]),
        ];
    }

    $response["{$target} .maxi-container-arrow .maxi-container-arrow--content:after"] = [
        'background' => get_arrow_color_object($bg_layers, $block_style),
    ];

    $response["{$target} .maxi-container-arrow:before"] = [
        'background' => get_arrow_color_object($bg_layers, $block_style),
        'borderRadius' => get_arrow_border(
            get_group_attributes($props, 'borderRadius', $is_hover),
            false
        ),
    ];

    if ($props['block-background-status-hover']) {
        $response["{$target}:hover .maxi-container-arrow:before"] = [
            'background' => get_arrow_color_object($bg_layers, $block_style, true),
            'borderRadius' => get_arrow_border(
                get_group_attributes($props, 'borderRadius', $is_hover),
                true
            ),
        ];
    }

    if ($props['block-background-status-hover']) {
        $response["{$target}:hover .maxi-container-arrow .maxi-container-arrow--content:after"] = [
            'background' => get_arrow_color_object($bg_layers, $block_style, $is_hover),
        ];
    }

    return $response;
}
