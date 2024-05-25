<?php

function get_svg_width_styles($args)
{
    $obj = $args['obj'];
    $is_hover = $args['is_hover'] ?? false;
    $prefix = $args['prefix'] ?? '';
    $icon_width_height_ratio = $args['icon_width_height_ratio'] ?? 1;
    $disable_height = $args['disable_height'] ?? true;

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

    $per_stroke_width_coefficient = 4;
    $attribute_cache = [];

    foreach ($breakpoints as $breakpoint) {
        $get_attribute = function ($attr) use ($prefix, $is_hover, $breakpoint, $obj, &$attribute_cache) {
            $key = "{$attr}-{$breakpoint}-{$is_hover}";
            if (!isset($attribute_cache[$key])) {
                $attribute_cache[$key] = get_last_breakpoint_attribute([
                    'target' => "{$prefix}{$attr}",
                    'is_hover' => $is_hover,
                    'breakpoint' => $breakpoint,
                    'attributes' => $obj,
                ]);
            }
            return $attribute_cache[$key];
        };

        $response[$breakpoint] = [];

        $icon_size = $get_attribute('width') ?? $get_attribute('height');
        $icon_unit = $get_attribute('width-unit') ?? $get_attribute('height-unit') ?? 'px';
        $icon_width_fit_content = $get_attribute('width-fit-content');
        $icon_stroke_width = $svg_type !== 'Shape' ? $get_attribute('stroke') : 1;

        $height_to_stroke_width_coefficient = 1 + ((($icon_stroke_width - 1) * $per_stroke_width_coefficient * $icon_width_height_ratio) / 100);

        if (!is_null($icon_size) && !empty($icon_size)) {
            $response[$breakpoint] = $response[$breakpoint] ?? [];
            if ($icon_width_fit_content || !$disable_height) {
                $calculated_height = $icon_width_fit_content && $icon_width_height_ratio !== 1
                    ? round(
                        $icon_width_height_ratio > 1
                            ? ($icon_size * $height_to_stroke_width_coefficient) / $icon_width_height_ratio
                            : $icon_size / ($icon_width_height_ratio * $height_to_stroke_width_coefficient)
                    )
                    : $icon_size;
                $response[$breakpoint]['height'] = "{$calculated_height}{$icon_unit}";
            }
            $response[$breakpoint]['width'] = "{$icon_size}{$icon_unit}";
        }

        if (empty($response[$breakpoint]) && $breakpoint !== 'general') {
            unset($response[$breakpoint]);
        }
    }

    return ['iconSize' => $response];
}

function get_svg_path_styles($obj, $prefix = 'svg-', $is_hover = false)
{
    $prefix = $prefix === '' ? 'svg-' : $prefix;

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
    $prefix = $prefix === '' ? 'svg-' : $prefix;

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
    $prefix = $prefix === '' ? 'svg-' : $prefix;

    $response = [
        'label' => 'SVG Path stroke',
    ];

    if ($is_hover && !$use_icon_color && !isset($obj['typography-status-hover'])) {
        return array(
            'SVGPathStroke' => array(
                'label' => $response['label'],
                'general' => array('stroke' => ''),
            ),
        );
    }

    $breakpoints = $use_icon_color ? ['general'] : ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
    $line_prefix = in_array($prefix, array(
        'icon-',
        'close-icon-',
        'active-icon-',
        'navigation-arrow-both-icon-',
        'navigation-dot-icon-',
        'active-navigation-dot-icon-',
    ))
        ? $prefix . 'stroke-'
        : $prefix . 'line-';

    foreach ($breakpoints as $breakpoint) {
        $response[$breakpoint] = [];

        $palette_attributes = get_palette_attributes([
            'obj' => $obj,
            'prefix' => $use_icon_color ? $line_prefix : '',
            'breakpoint' => !$use_icon_color ? $breakpoint : null,
            'is_hover' => $is_hover
        ]);

        $palette_sc_status = $palette_attributes['palette_sc_status'];
        $palette_status = $palette_attributes['palette_status'];
        $palette_color = $palette_attributes['palette_color'];
        $palette_opacity = $palette_attributes['palette_opacity'];
        $color = $palette_attributes['color'];

        if ($palette_status && $palette_color) {
            $stroke_color = get_color_rgba_string(array(
                'first_var' => $palette_sc_status || !$use_icon_color
                    ? 'color-' . $palette_color
                    : 'icon-stroke' . ($is_hover ? '-hover' : ''),
                'second_var' => !$palette_sc_status && $use_icon_color
                    ? 'color-' . $palette_color
                    : null,
                'opacity' => $palette_opacity,
                'block_style' => $block_style,
            ));

            if ($use_icon_color) {
                $response['general'] = array('stroke' => $stroke_color);
            } else {
                $response[$breakpoint] = array('stroke' => $stroke_color);
            }
        } elseif (!$palette_status && !is_null($color)) {
            $response[$breakpoint] = array('stroke' => $color);
        }
    }

    return ['SVGPathStroke' => $response];
}

function get_svg_styles($params)
{
    $obj = $params['obj'];
    $target = $params['target'];
    $block_style = $params['block_style'];
    $prefix = $params['prefix'] ?? '';
    $is_hover = isset($params['is_hover']) ? $params['is_hover'] : false;
    $use_icon_color = isset($params['use_icon_color']) ? $params['use_icon_color'] : true;
    $icon_type = isset($params['icon_type']) ? $params['icon_type'] : '';

    $path_fill_styles = get_svg_path_fill_styles($obj, $block_style, $prefix, $is_hover);
    $path_stroke_styles = get_svg_path_stroke_styles($obj, $block_style, $is_hover, $prefix, $use_icon_color);
    $path_styles = get_svg_path_styles($obj, $prefix, $is_hover);

    $fill_selectors = [
        "{$target} svg[data-fill]:not([fill^=\"none\"])",
        "{$target} svg[data-fill]:not([fill^=\"none\"]) *",
        "{$target} svg g[data-fill]:not([fill^=\"none\"])",
        "{$target} svg use[data-fill]:not([fill^=\"none\"])",
        "{$target} svg circle[data-fill]:not([fill^=\"none\"])",
        "{$target} svg path[data-fill]:not([fill^=\"none\"])",
    ];

    $stroke_selectors = [
        "{$target} svg[data-stroke]:not([stroke^=\"none\"]) *",
        "{$target} svg path[data-stroke]:not([stroke^=\"none\"])",
        "{$target} svg[data-stroke]:not([stroke^=\"none\"])",
        "{$target} svg g[data-stroke]:not([stroke^=\"none\"])",
        "{$target} svg use[data-stroke]:not([stroke^=\"none\"])",
        "{$target} svg circle[data-stroke]:not([stroke^=\"none\"])",
    ];


    $response = [
        "{$target} svg path" => $path_styles,
    ];

    if ($is_hover) {
        $response["{$target} svg[data-hover-stroke] path"] = $path_styles;
        $response["{$target} svg path[data-hover-stroke]"] = $path_styles;
    }

    if ($icon_type !== 'line') {
        foreach ($fill_selectors as $selector) {
            $response[$selector] = $path_fill_styles;
        }
        if ($is_hover) {
            foreach ($fill_selectors as $selector) {
                $hover_selector = str_replace('[data-fill]', '[data-hover-fill]', $selector);
                $response[$hover_selector] = $path_fill_styles;
            }
        }
    }

    if ($icon_type !== 'shape') {
        foreach ($stroke_selectors as $selector) {
            $response[$selector] = $path_stroke_styles;
        }
        if ($is_hover) {
            foreach ($stroke_selectors as $selector) {
                $hover_selector = str_replace('[data-stroke]', '[data-hover-stroke]', $selector);
                $response[$hover_selector] = $path_stroke_styles;
            }
        }
    }

    return $response;
}
