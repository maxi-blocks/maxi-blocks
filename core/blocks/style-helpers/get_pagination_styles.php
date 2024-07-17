<?php

/**
 * Get pagination styles
 *
 * @param array $props Block properties
 * @return array Pagination styles
 */
function get_pagination_styles($props)
{
    $cl_pagination_prefix = 'cl-pagination-';

    $response = [
        'flex' => get_flex_styles(
            get_group_attributes($props, 'flex', false, $cl_pagination_prefix),
            $cl_pagination_prefix
        )
    ];

    return $response;
}

/**
 * Get pagination links styles
 *
 * @param array $props Block properties
 * @return array Pagination links styles
 */
function get_pagination_links_styles($props)
{
    $block_style = $props['blockStyle'];
    $cl_pagination_prefix = 'cl-pagination-';

    $response = [
        'typography' => get_typography_styles([
            'obj' => get_group_attributes($props, 'typography', false, $cl_pagination_prefix),
            'prefix' => $cl_pagination_prefix,
            'is_hover' => false,
            'block_style' => $block_style,
        ]),
    ];

    return $response;
}

/**
 * Get pagination colors
 *
 * @param array $props Block properties
 * @param string $type Color type (e.g., 'hover', 'current')
 * @return array Pagination colors
 */
function get_pagination_colours($props, $type)
{
    $block_style = $props['blockStyle'];

    $response = [];

    $prefix = "cl-pagination-link-{$type}-";

    $palette_status = get_attribute_value(
        "{$prefix}palette-status",
        $props,
        false
    );

    $palette_color = get_attribute_value(
        "{$prefix}palette-color",
        $props,
        false
    );

    $palette_opacity = get_attribute_value(
        "{$prefix}palette-opacity",
        $props,
        false
    );

    $color = get_attribute_value(
        "{$prefix}placeholder-color",
        $props,
        false
    );

    if ($palette_status) {
        $response = [
            'color' => get_color_rgba_string([
                'first_var' => "color-{$palette_color}",
                'opacity' => $palette_opacity,
                'block_style' => $block_style,
            ]),
        ];
    } elseif ($color) {
        $response = [
            'color' => $color,
        ];
    }

    return [$type => ['general' => $response]];
}
