<?php

function get_icon_object($props, $target, $prefix = '', $is_IB = false)
{
    $background = isset($props[$prefix . 'icon-background-active-media-general']) && $props[$prefix . 'icon-background-active-media-general'] === 'color' ? get_color_background_object(array_merge(
        get_group_attributes(
            $props,
            ['icon', 'background', 'iconBackgroundColor'],
            false,
            $prefix
        ),
        get_group_attributes(
            $props,
            'backgroundColor',
            false,
            'button-'
        ),
        [
            'prefix' => $prefix . 'icon-',
            'block_style' => $props['blockStyle'],
            'is_icon_inherit' => $props[$prefix . 'icon-inherit'],
            'is_icon' => true
        ]
    )) : null;

    $response = [
        'background' => $background,
        'gradient' =>isset($props[$prefix . 'icon-background-active-media-general']) && $props[$prefix . 'icon-background-active-media-general'] === 'gradient' ? get_gradient_background_object(array_merge(
            get_group_attributes(
                $props,
                ['icon', 'iconBackground', 'iconBackgroundGradient'],
                false,
                $prefix
            ),
            [
                'prefix' => $prefix . 'icon-',
                'block_style' => $props['blockStyle'],
                'is_icon' => true
            ]
        )) : null,
        'padding' => $target === 'icon' ? get_margin_padding_styles([
            'obj' => get_group_attributes($props, 'iconPadding', false, $prefix),
            'prefix' => $prefix . 'icon-'
        ]) : null,
        'border' => $target === 'icon' ? get_border_styles([
            'obj' => get_group_attributes(
                $props,
                ['iconBorder', 'iconBorderWidth', 'iconBorderRadius'],
                false,
                $prefix
            ),
            'prefix' => $prefix . 'icon-',
            'block_style' => $props['blockStyle'],
            'is_IB' => $is_IB
        ]) : null
    ];

    $responsive = [
        'label' => 'Icon responsive',
        'general' => []
    ];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $responsive[$breakpoint] = [];

        if (
            isset($props[$prefix . 'icon-spacing-' . $breakpoint]) &&
            isset($props[$prefix . 'icon-position'])
        ) {
            if ($props[$prefix . 'icon-position'] === 'left' || $props[$prefix . 'icon-position'] === 'right') {
                $responsive[$breakpoint]['margin-' . ($props[$prefix . 'icon-position'] === 'right' ? 'left' : 'right')] = $props[$prefix . 'icon-only'] ? '0' : get_last_breakpoint_attribute([
                    'target' => $prefix . 'icon-spacing',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]) . 'px';
            } else {
                $responsive[$breakpoint]['margin-' . ($props[$prefix . 'icon-position'] === 'top' ? 'bottom' : 'top')] = $props[$prefix . 'icon-only'] ? '0' : get_last_breakpoint_attribute([
                    'prefix' => $prefix . 'icon-spacing',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]) . 'px';
            }
        }
    }

    $response['iconResponsive'] = $responsive;

    return $response;
}

function get_icon_hover_object($props, $target, $prefix = '', $iconType = '')
{
    $icon_hover_status = $props[$prefix . 'icon-status-hover'] ?? false;

    if($icon_hover_status) {
        $icon_hover_active_media = get_attribute_value(
            'iconBackgroundActiveMedia',
            $props,
            true,
            'general',
            $prefix,
        );

        $response = [
            'icon' => $icon_hover_status ? get_icon_styles(
                get_group_attributes(
                    $props,
                    ['iconHover', 'typography'],
                    true,
                    $prefix
                ),
                $props['blockStyle'],
                $props[$prefix . 'icon-inherit'],
                true,
                $iconType
            ) : null,
            'background' => $icon_hover_status && $icon_hover_active_media === 'color' && $target === 'iconHover' ? get_color_background_object(array_merge(
                get_group_attributes(
                    $props,
                    ['icon', 'iconBackgroundColor', 'background', 'backgroundColor'],
                    true,
                    $prefix
                ),
                [
                    'prefix' => $prefix . 'icon-',
                    'block_style' => $props['blockStyle'],
                    'is_icon_inherit' => $props[$prefix . 'icon-inherit'],
                    'is_hover' => true,
                    'is_icon' => true
                ]
            )) : null,
            'gradient' => $icon_hover_status && $icon_hover_active_media === 'gradient' && $target === 'iconHover' ? get_gradient_background_object(array_merge(
                get_group_attributes(
                    $props,
                    ['icon', 'iconBackground', 'iconBackgroundGradient'],
                    true,
                    $prefix
                ),
                [
                    'prefix' => $prefix . 'icon-',
                    'is_hover' => true,
                    'block_style' => $props['blockStyle'],
                    'is_icon' => true
                ]
            )) : null,
            'border' => $icon_hover_status && $target === 'iconHover' ? get_border_styles([
                'obj' => get_group_attributes(
                    $props,
                    ['iconBorder', 'iconBorderWidth', 'iconBorderRadius'],
                    true,
                    $prefix
                ),
                'prefix' => $prefix . 'icon-',
                'block_style' => $props['blockStyle'],
                'is_hover' => true
            ]) : null
            ];
    } else {
        $response = null;
    }

    return $response;
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

    $has_icon = isset($obj[$prefix . 'icon-content']) ? !!$obj[$prefix . 'icon-content'] : false;
    $icon_inherit = $obj[$prefix . 'icon-inherit'] ?? false;
    $icon_hover_status = $obj[$prefix . 'icon-status-hover'] ?? false;

    $use_icon_color = !$icon_inherit;
    $normal_target = $wrapper_target . ' ' . $target;
    $hover_target = $hover_on_icon ? $wrapper_target . ' ' . $target . ':hover' : $wrapper_target . ':hover ' . $target;

    $icon_type = isset($obj['svgType']) ? strtolower($obj['svgType']) : null;

    $response = array_merge(
        $has_icon && !$is_hover ? array_merge(
            get_svg_styles([
                'obj' => $obj,
                'target' => $normal_target,
                'block_style' => $block_style,
                'prefix' => $prefix . 'icon-',
                'use_icon_color' => $use_icon_color,
                'icon_type' => $icon_type
            ]),
            [
                ' ' . $wrapper_target . ' ' . $target => get_icon_object($obj, 'icon', $prefix, $is_IB),
                ' ' . $wrapper_target . ' ' . $target . ' svg' => get_icon_size($obj, false, $prefix, $icon_width_height_ratio),
                ' ' . $wrapper_target . ' ' . $target . ' svg > *' => get_icon_object($obj, 'svg', $prefix),
                ' ' . $wrapper_target . ' ' . $target . ' svg path' => get_icon_path_styles($obj, false, $prefix)
            ]
        ) : [],
        $icon_hover_status ? array_merge(
            [
                ' ' . $hover_target => get_icon_hover_object($obj, 'iconHover', $prefix, $icon_type),
                ' ' . $hover_target . ' svg > *' => get_icon_hover_object($obj, 'iconHover', $prefix, $icon_type),
                ' ' . $hover_target . ' svg' => get_icon_size($obj, true, $prefix, $icon_width_height_ratio),
                ' ' . $hover_target . ' svg path' => get_icon_path_styles($obj, true, $prefix),
            ],
            get_svg_styles([
                'obj' => $obj,
                'target' => $hover_target,
                'block_style' => $block_style,
                'prefix' => $prefix . 'icon-',
                'use_icon_color' => $use_icon_color,
                'is_hover' => true,
                'icon_type' => $icon_type
            ])
        ) : [],
        [
            ' ' . $normal_target . ' svg path' => get_icon_path_styles($obj, false),
            ' ' . $hover_target => isset($obj['icon-status-hover']) && $obj['icon-status-hover'] ? get_icon_hover_object($obj, 'iconHover') : null,
            ' ' . $hover_target . ' svg > *' => isset($obj['icon-status-hover']) && $obj['icon-status-hover'] ? get_icon_hover_object($obj, 'iconHover') : null,
            ' ' . $hover_target . ' svg' => isset($obj['icon-status-hover']) && $obj['icon-status-hover'] ? get_icon_size($obj, true, $prefix, $icon_width_height_ratio) : null,
            ' ' . $hover_target . ' svg path' => isset($obj['icon-status-hover']) && $obj['icon-status-hover'] ? get_icon_path_styles($obj, true) : null,
        ]
    );

    return $response;
}
