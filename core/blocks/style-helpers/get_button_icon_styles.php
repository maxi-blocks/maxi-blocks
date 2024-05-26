<?php

function get_icon_object($props, $target, $prefix = '', $is_IB = false)
{
    $prefix_icon = $prefix . 'icon-';
    $icon_background_active_media = $props[$prefix . 'icon-background-active-media-general'] ?? null;

    $background = ($icon_background_active_media === 'color') ? get_color_background_object(array_merge(
        get_group_attributes($props, ['icon', 'background', 'iconBackgroundColor'], false, $prefix),
        get_group_attributes($props, 'backgroundColor', false, 'button-'),
        [
            'prefix' => $prefix_icon,
            'block_style' => $props['blockStyle'],
            'is_icon_inherit' => $props[$prefix_icon . 'inherit'],
            'is_icon' => true
        ]
    )) : null;

    $gradient = ($icon_background_active_media === 'gradient') ? get_gradient_background_object(array_merge(
        get_group_attributes($props, ['icon', 'iconBackground', 'iconBackgroundGradient'], false, $prefix),
        [
            'prefix' => $prefix_icon,
            'block_style' => $props['blockStyle'],
            'is_icon' => true
        ]
    )) : null;

    $padding = ($target === 'icon') ? get_margin_padding_styles([
        'obj' => get_group_attributes($props, 'iconPadding', false, $prefix),
        'prefix' => $prefix_icon
    ]) : null;

    $border = ($target === 'icon') ? get_border_styles([
        'obj' => get_group_attributes($props, ['iconBorder', 'iconBorderWidth', 'iconBorderRadius'], false, $prefix),
        'prefix' => $prefix_icon,
        'block_style' => $props['blockStyle'],
        'is_IB' => $is_IB
    ]) : null;

    $responsive = [
        'label' => 'Icon responsive',
        'general' => []
    ];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
    $icon_position = $props[$prefix_icon . 'position'] ?? null;
    $icon_only = $props[$prefix_icon . 'only'] ?? false;

    foreach ($breakpoints as $breakpoint) {
        $responsive[$breakpoint] = [];
        $icon_spacing = $props[$prefix_icon . 'spacing-' . $breakpoint] ?? null;

        if ($icon_spacing && $icon_position) {
            $margin_side = ($icon_position === 'right' ? 'left' : ($icon_position === 'left' ? 'right' : ($icon_position === 'top' ? 'bottom' : 'top')));
            $responsive[$breakpoint]['margin-' . $margin_side] = $icon_only ? '0' : get_last_breakpoint_attribute([
                'target' => $prefix_icon . 'spacing',
                'breakpoint' => $breakpoint,
                'attributes' => $props
            ]) . 'px';
        }
    }

    return [
        'background' => $background,
        'gradient' => $gradient,
        'padding' => $padding,
        'border' => $border,
        'iconResponsive' => $responsive
    ];
}

function get_icon_hover_object($props, $target, $prefix = '', $iconType = '')
{
    $icon_hover_status = $props[$prefix . 'icon-status-hover'] ?? false;

    if (!$icon_hover_status) {
        return null;
    }

    $icon_hover_active_media = get_attribute_value(
        'iconBackgroundActiveMedia',
        $props,
        true,
        'general',
        $prefix,
    );

    $prefix_icon = $prefix . 'icon-';
    $common_attributes = [
        'prefix' => $prefix_icon,
        'block_style' => $props['blockStyle'],
        'is_icon_inherit' => $props[$prefix_icon . 'inherit'],
        'is_hover' => true,
        'is_icon' => true
    ];

    return [
        'icon' => get_icon_styles(
            get_group_attributes($props, ['iconHover', 'typography'], true, $prefix),
            $props['blockStyle'],
            $props[$prefix_icon . 'inherit'],
            true,
            $iconType
        ),
        'background' => ($icon_hover_active_media === 'color' && $target === 'iconHover') ? get_color_background_object(array_merge(
            get_group_attributes($props, ['icon', 'iconBackgroundColor', 'background', 'backgroundColor'], true, $prefix),
            $common_attributes
        )) : null,
        'gradient' => ($icon_hover_active_media === 'gradient' && $target === 'iconHover') ? get_gradient_background_object(array_merge(
            get_group_attributes($props, ['icon', 'iconBackground', 'iconBackgroundGradient'], true, $prefix),
            $common_attributes
        )) : null,
        'border' => get_border_styles([
            'obj' => get_group_attributes($props, ['iconBorder', 'iconBorderWidth', 'iconBorderRadius'], true, $prefix),
            'prefix' => $prefix_icon,
            'block_style' => $props['blockStyle'],
            'is_hover' => true
        ])
    ];
}

/**
 * Function to get button icon styles.
 *
 * @param array $params The array of parameters.
 * @return array The button icon styles.
 */
function get_button_icon_styles($params)
{
    $obj = $params['obj'] ?? null;
    $block_style = $params['block_style'] ?? null;
    $is_hover = $params['is_hover'] ?? false;
    $is_IB = $params['is_IB'] ?? false;
    $target = $params['target'] ?? '';
    $wrapper_target = $params['wrapper_target'] ?? '';
    $prefix = $params['prefix'] ?? '';
    $icon_width_height_ratio = $params['icon_width_height_ratio'] ?? null;
    $hover_on_icon = $params['hover_on_icon'] ?? false;

    $has_icon = !empty($obj[$prefix . 'icon-content']);
    $icon_inherit = $obj[$prefix . 'icon-inherit'] ?? false;
    $icon_hover_status = $obj[$prefix . 'icon-status-hover'] ?? false;

    $use_icon_color = !$icon_inherit;
    $normal_target = $wrapper_target . ' ' . $target;
    $hover_target = $hover_on_icon ? $wrapper_target . ' ' . $target . ':hover' : $wrapper_target . ':hover ' . $target;

    $icon_type = strtolower($obj['svgType'] ?? '');

    $response = [];

    if ($has_icon && !$is_hover) {
        $response = array_merge(
            get_svg_styles([
                'obj' => $obj,
                'target' => $normal_target,
                'block_style' => $block_style,
                'prefix' => $prefix . 'icon-',
                'use_icon_color' => $use_icon_color,
                'icon_type' => $icon_type
            ]),
            [
                " $wrapper_target $target" => get_icon_object($obj, 'icon', $prefix, $is_IB),
                " $wrapper_target $target svg" => get_icon_size($obj, false, $prefix, $icon_width_height_ratio),
                " $wrapper_target $target svg > *" => get_icon_object($obj, 'svg', $prefix),
                " $wrapper_target $target svg path" => get_icon_path_styles($obj, false, $prefix),
            ]
        );
    }

    if ($icon_hover_status) {
        $response = array_merge(
            $response,
            [
                " $hover_target" => get_icon_hover_object($obj, 'iconHover', $prefix, $icon_type),
                " $hover_target svg > *" => get_icon_hover_object($obj, 'iconHover', $prefix, $icon_type),
                " $hover_target svg" => get_icon_size($obj, true, $prefix, $icon_width_height_ratio),
                " $hover_target svg path" => get_icon_path_styles($obj, true, $prefix),
            ],
            get_svg_styles([
                'obj' => $obj,
                'target' => $hover_target,
                'block_style' => $block_style,
                'prefix' => $prefix . 'icon-',
                'use_icon_color' => $use_icon_color,
                'is_hover' => true,
                'icon_type' => $icon_type
            ]),
        );
    }

    return $response;
}
