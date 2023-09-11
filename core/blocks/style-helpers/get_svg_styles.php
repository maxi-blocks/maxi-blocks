<?php

function get_svg_width_styles($args)
{
    $obj = $args['obj'];
    $is_hover = $args['is_hover'] ?? false;
    $prefix = $args['prefix'] ?? '';
    $icon_width_height_ratio = $args['iconWidthHeightRatio'] ?? 1;
    $disable_height = $args['disableHeight'] ?? true;

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    $response = [
        'label' => 'Icon size',
        'general' => [],
    ];

    $svg_type = get_attribute_value(
        'svgType',
        $obj,
        $is_hover,
        $prefix,
    );

    foreach ($breakpoints as $breakpoint) {
        $response[$breakpoint] = [];

        $icon_size = get_last_breakpoint_attribute([
            'target' => $prefix . 'width',
            'is_hover' => $is_hover,
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]) ?? get_last_breakpoint_attribute([
            'target' => $prefix . 'height',
            'is_hover' => $is_hover,
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]);

        $icon_unit = get_last_breakpoint_attribute([
            'target' => $prefix . 'width-unit',
            'is_hover' => $is_hover,
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]) ?? get_last_breakpoint_attribute([
            'target' => $prefix . 'height-unit',
            'is_hover' => $is_hover,
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]) ?? 'px';

        $icon_width_fit_content = get_last_breakpoint_attribute([
            'target' => $prefix . 'width-fit-content',
            'is_hover' => $is_hover,
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]);

        $icon_stroke_width = $svg_type !== 'Shape'
            ? get_last_breakpoint_attribute([
                'target' => $prefix . 'stroke',
                'is_hover' => $is_hover,
                'breakpoint' => $breakpoint,
                'attributes' => $obj,
            ])
            : 1;

        $per_stroke_width_coefficient = 4;

        $height_to_stroke_width_coefficient =
            1 +
            (($icon_stroke_width - 1) *
                $per_stroke_width_coefficient *
                $icon_width_height_ratio) /
                100;

        if (!is_null($icon_size) && !empty($icon_size)) {
            if ($icon_width_fit_content || !$disable_height) {
                $response[$breakpoint]['height'] = $icon_width_fit_content && $icon_width_height_ratio !== 1
                    ? round(
                        $icon_width_height_ratio > 1
                        ? ($icon_size * $height_to_stroke_width_coefficient) / $icon_width_height_ratio
                        : $icon_size / ($icon_width_height_ratio * $height_to_stroke_width_coefficient)
                    )
                    : $icon_size;
                $response[$breakpoint]['height'] .= $icon_unit;
            }

            $response[$breakpoint]['width'] = $icon_size . $icon_unit;
        }

        if (empty($response[$breakpoint]) && $breakpoint !== 'general') {
            unset($response[$breakpoint]);
        }
    }

    return ['iconSize' => $response];
}


function get_svg_path_styles($obj, $prefix = 'svg-', $is_hover = false)
{
    $response = [
        'label' => 'SVG path',
        'general' => [],
    ];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $response[$breakpoint] = [];

        $icon_stroke = $obj[get_attribute_key('stroke', $is_hover, $prefix, $breakpoint)] ?? null;

        if (!is_null($icon_stroke)) {
            $response[$breakpoint]['stroke-width'] = $icon_stroke;
        }

        if (empty($response[$breakpoint]) && $breakpoint !== 'general') {
            unset($response[$breakpoint]);
        }
    }

    return ['SVGPath' => $response];
}


function get_svg_path_fill_styles($obj, $block_style, $prefix = 'svg-', $is_hover = false)
{
    $response = [
        'label' => 'SVG path-fill',
        'general' => [],
    ];

    $palette_attributes = get_palette_attributes([
        'obj' => $obj,
        'prefix' => $prefix . 'fill-',
        'is_hover' => $is_hover,
    ]);

    $palette_status = $palette_attributes['palette_status'];
    $palette_sc_status = $palette_attributes['palette_sc_status'];
    $palette_color = $palette_attributes['palette_color'];
    $palette_opacity = $palette_attributes['palette_opacity'];
    $color = $palette_attributes['color'];

    if ($palette_status && $palette_color) {
        $response['general']['fill'] = get_color_rgba_string(
            $palette_sc_status
                ? [
                    'first_var' => 'color-' . $palette_color,
                    'opacity' => $palette_opacity,
                    'block_style' => $block_style,
                ]
                : [
                    'first_var' => 'icon-fill' . ($is_hover ? '-hover' : ''),
                    'second_var' => 'color-' . $palette_color,
                    'opacity' => $palette_opacity,
                    'block_style' => $block_style,
                ]
        );
    } elseif (!$palette_status && !is_null($color)) {
        $response['general']['fill'] = $color;
    }

    return ['SVGPathFill' => $response];
}


function get_svg_path_stroke_styles($obj, $block_style, $is_hover, $prefix = 'svg-', $use_icon_color = true)
{
    $response = [
        'label' => 'SVG Path stroke',
    ];

    if ($is_hover && !$use_icon_color && !isset($obj['typography-status-hover'])) {
        $response['general'] = [
            'stroke' => '',
        ];

        return $response;
    }

    $breakpoints = !$use_icon_color ? ['breakpoints'] : ['general'];

    foreach ($breakpoints as $breakpoint) {
        $response[$breakpoint] = [];

        $line_prefix = '';

        switch ($prefix) {
            case 'icon-':
            case 'active-icon-':
            case 'navigation-arrow-both-icon-':
            case 'navigation-dot-icon-':
            case 'active-navigation-dot-icon-':
                $line_prefix = $prefix . 'stroke-';
                break;
            default:
                $line_prefix = $prefix . 'line-';
                break;
        }

        $palette_attributes = get_palette_attributes([
            'obj' => $obj,
            'prefix' => $use_icon_color ? $line_prefix : '',
            'breakpoint' => !$use_icon_color ? $breakpoint : null,
            'is_hover' => $is_hover
        ]);

        $palette_status = $palette_attributes['palette_status'];
        $palette_color = $palette_attributes['palette_color'];
        $palette_opacity = $palette_attributes['palette_opacity'];
        $color = $palette_attributes['color'];

        if ($palette_status && $palette_color) {
            if ($use_icon_color) {
                $response['general']['stroke'] = get_color_rgba_string(
                    $palette_attributes['palette_sc_status']
                        ? [
                            'first_var' => 'color-' . $palette_color,
                            'opacity' => $palette_opacity,
                            'block_style' => $block_style,
                        ]
                        : [
                            'first_var' => 'icon-stroke' . ($is_hover ? '-hover' : ''),
                            'second_var' => 'color-' . $palette_color,
                            'opacity' => $palette_opacity,
                            'block_style' => $block_style,
                        ]
                );
            } else {
                $response[$breakpoint]['stroke'] = get_color_rgba_string([
                    'first_var' => 'color-' . $palette_color,
                    'opacity' => $palette_opacity,
                    'block_style' => $block_style,
                ]);
            }
        } elseif (!$palette_status && !is_null($color)) {
            $response[$breakpoint]['stroke'] = $color;
        }
    }

    return ['SVGPathStroke' => $response];
}

function get_svg_styles($params)
{
    $obj = $params['obj'];
    $target = $params['target'];
    $blockStyle = $params['block_style'];
    $prefix = $params['prefix'] ?? '';
    $is_hover = isset($params['is_hover']) ? $params['is_hover'] : false;
    $use_icon_color = isset($params['use_icon_color']) ? $params['use_icon_color'] : true;
    $icon_type = isset($params['icon_type']) ? $params['icon_type'] : '';

    $pathFillStyles = get_svg_path_fill_styles($obj, $blockStyle, $prefix, $is_hover);
    $pathStrokeStyles = get_svg_path_stroke_styles($obj, $blockStyle, $is_hover, $prefix, $use_icon_color);
    $pathStyles = get_svg_path_styles($obj, $prefix, $is_hover);

    $response = array();

    if ($icon_type !== 'line') {
        $response[" {$target} svg[data-fill]:not([fill^='none'])"] = $pathFillStyles;
        $response[" {$target} svg[data-fill]:not([fill^='none']) *"] = $pathFillStyles;
        $response[" {$target} svg g[data-fill]:not([fill^='none'])"] = $pathFillStyles;
        $response[" {$target} svg use[data-fill]:not([fill^='none'])"] = $pathFillStyles;
        $response[" {$target} svg circle[data-fill]:not([fill^='none'])"] = $pathFillStyles;
        $response[" {$target} svg path[data-fill]:not([fill^='none'])"] = $pathFillStyles;
    }

    $response[" {$target} svg path"] = $pathStyles;

    if ($icon_type !== 'shape') {
        $response[" {$target} svg[data-stroke]:not([stroke^='none']) *"] = $pathStrokeStyles;
        $response[" {$target} svg path[data-stroke]:not([stroke^='none'])"] = $pathStrokeStyles;
        $response[" {$target} svg[data-stroke]:not([stroke^='none'])"] = $pathStrokeStyles;
        $response[" {$target} svg g[data-stroke]:not([stroke^='none'])"] = $pathStrokeStyles;
        $response[" {$target} svg use[data-stroke]:not([stroke^='none'])"] = $pathStrokeStyles;
        $response[" {$target} svg circle[data-stroke]:not([stroke^='none'])"] = $pathStrokeStyles;
    }

    if ($is_hover) {
        $hover_styles = array(
            " {$target} svg[data-hover-stroke] path" => $pathStyles,
            " {$target} svg path[data-hover-stroke]" => $pathStyles,
        );

        if ($icon_type !== 'line') {
            $hover_styles[" {$target} svg[data-hover-fill] path:not([fill^='none'])"] = $pathFillStyles;
            $hover_styles[" {$target} svg path[data-hover-fill]:not([fill^='none'])"] = $pathFillStyles;
            $hover_styles[" {$target} svg g[data-hover-fill]:not([fill^='none'])"] = $pathFillStyles;
            $hover_styles[" {$target} svg use[data-hover-fill]:not([fill^='none'])"] = $pathFillStyles;
        }

        if ($icon_type !== 'shape') {
            $hover_styles[" {$target} svg[data-hover-stroke] path:not([stroke^='none'])"] = $pathStrokeStyles;
            $hover_styles[" {$target} svg path[data-hover-stroke]:not([stroke^='none'])"] = $pathStrokeStyles;
            $hover_styles[" {$target} svg g[data-hover-stroke]:not([stroke^='none'])"] = $pathStrokeStyles;
            $hover_styles[" {$target} svg use[data-hover-stroke]:not([stroke^='none'])"] = $pathStrokeStyles;
        }

        $response = array_merge($response, $hover_styles);
    }

    return $response;
}
