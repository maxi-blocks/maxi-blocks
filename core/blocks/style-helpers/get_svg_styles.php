<?php

function get_svg_width_styles($args)
{
    $obj = $args['obj'];
    $is_hover = $args['is_hover'] ?? false;
    $prefix = $args['prefix'] ?? '';
    $icon_width_height_ratio = $args['iconWidthHeightRatio'] ?? 1;
    $disable_height = $args['disableHeight'] ?? true;

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    write_log('get_svg_width_styles');
    write_log('$obj');
    write_log($obj);
    write_log('$icon_width_height_ratio');
    write_log($icon_width_height_ratio);
    write_log('$disable_height');
    write_log($disable_height);
    write_log('====================');

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
                if ($icon_width_fit_content && $icon_width_height_ratio !== 1) {
                    if ($icon_width_height_ratio > 1) {
                        $response[$breakpoint]['height'] = round(($icon_size * $height_to_stroke_width_coefficient) / $icon_width_height_ratio);
                    } else {
                        $denominator = $icon_width_height_ratio * $height_to_stroke_width_coefficient;
                        if ($denominator != 0) {
                            $response[$breakpoint]['height'] = round($icon_size / $denominator);
                        } else {
                            $response[$breakpoint]['height'] = 0; // Default value or handling for division by zero
                        }
                    }
                } else {
                    $response[$breakpoint]['height'] = $icon_size;
                }
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

function get_icon_width_height_ratio($svg_string)
{
    if (!$svg_string) {
        return 1;
    }

    $svg_string = preg_replace('/data-stroke="[^"]*"/', '', $svg_string);
    $svg_string = preg_replace('/data-fill="[^"]*"/', '', $svg_string);
    $svg_string = preg_replace('/rgba\([^)]+\),1\)"/', '', $svg_string);
    // write_log('get_icon_width_height_ratio');
    // write_log($svg_string);

    // Use SimpleXML to parse the SVG
    $svg = new SimpleXMLElement($svg_string);
    // write_log('svg');
    // write_log($svg);

    // Extract path data
    $path_data = (string) $svg->path['d'];
    // write_log('path_data');
    // write_log($path_data);

    // Initialize bounding box values
    $min_x = PHP_INT_MAX;
    $min_y = PHP_INT_MAX;
    $max_x = PHP_INT_MIN;
    $max_y = PHP_INT_MIN;

    $x = 0; // Current x-coordinate
    $y = 0; // Current y-coordinate

    // Split the path data by spaces
    $commands = preg_split('/(?=[MLlhHvVzZ])/', $path_data);
    $commands = array_filter($commands);
    // write_log('commands');
    // write_log($commands);

    // Parse the commands
    foreach ($commands as $command) {
        // Split combined commands further
        $subcommands = preg_split('/(?=[MLlhHvVzZ])/', $command);
        // write_log('subcommands');
        // write_log($subcommands);
        foreach ($subcommands as $subcommand) {
            $parts = preg_split('/[\s,]+/', trim($subcommand));
            if (!isset($parts[0]) || $parts[0] === '') {
                continue; // Skip this iteration if the first part is not set or empty
            }

            $type = $parts[0][0]; // Extract the command type, which is the first character

            // If the type is a command followed by its parameters (like `M19.032`), remove the command character to leave only the parameters.
            if (strlen($parts[0]) > 1) {
                $parts[0] = substr($parts[0], 1);
            } else {
                array_shift($parts); // Remove the command type
            }
            // write_log('type');
            // write_log($type);

            while (!empty($parts)) {
                switch ($type) {
                    case 'M': // Move to absolute coordinates
                        $x = (float) array_shift($parts);
                        $y = (float) array_shift($parts);
                        break;

                    case 'm': // Move to relative coordinates
                        $x += (float) array_shift($parts);
                        $y += (float) array_shift($parts);
                        break;

                    case 'L': // Line to absolute coordinates
                        $x = (float) array_shift($parts);
                        $y = (float) array_shift($parts);
                        break;

                    case 'l': // Line to relative coordinates
                        $x += (float) array_shift($parts);
                        $y += (float) array_shift($parts);
                        break;

                    case 'H': // Horizontal line absolute
                        $x = (float) array_shift($parts);
                        break;

                    case 'h': // Horizontal line relative
                        $x += (float) array_shift($parts);
                        break;

                    case 'V': // Vertical line absolute
                        $y = (float) array_shift($parts);
                        break;

                    case 'v': // Vertical line relative
                        $y += (float) array_shift($parts);
                        break;

                    case 'Z': // Close path
                    case 'z': // Close path
                        // No coordinate changes, but could consider logic for closing the path if necessary
                        break;

                        // Note: There are more path commands (like curves) which are not handled here.
                        // To fully support them, you'd need to add additional cases.

                    default:
                        array_shift($parts);
                        break;
                }

                $min_x = min($min_x, $x);
                $max_x = max($max_x, $x);
                $min_y = min($min_y, $y);
                $max_y = max($max_y, $y);
            }
        }
    }
    // write_log('min_x');
    // write_log($min_x);
    // write_log('max_x');
    // write_log($max_x);
    // write_log('min_y');
    // write_log($min_y);
    // write_log('max_y');
    // write_log($max_y);

    // Compute the width and height
    $width = $max_x - $min_x;
    $height = $max_y - $min_y;

    // Check for zero height
    if ($height == 0) {
        return $width > 0 ? PHP_INT_MAX : 1;
    }

    // Calculate aspect ratio and round to 2 decimal places
    $aspect_ratio = round($width / $height, 2);

    return $aspect_ratio;
}
