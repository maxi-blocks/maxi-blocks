<?php

function get_icon_object($props, $target, $prefix = '', $is_IB = false)
{
    $response = [
        'background' => $props[$prefix . 'icon-background-active-media-general'] === 'color' ? get_color_background_object([
            ...get_group_attributes(
                $props,
                ['icon', 'background', 'icon_background_color'],
                false,
                $prefix
            ),
            ...get_group_attributes(
                $props,
                'background_color',
                false,
                'button_'
            ),
            'prefix' => $prefix . 'icon_',
            'block_style' => $props['block_style'],
            'is_icon_inherit' => $props[$prefix . 'icon_inherit'],
            'is_icon' => true
        ]) : null,
        'gradient' => $props[$prefix . 'icon-background-active-media-general'] === 'gradient' ? get_gradient_background_object([
            ...get_group_attributes(
                $props,
                ['icon', 'icon_background', 'icon_background_gradient'],
                false,
                $prefix
            ),
            'prefix' => $prefix . 'icon_',
            'block_style' => $props['block_style'],
            'is_icon' => true
        ]) : null,
        'padding' => $target === 'icon' ? get_margin_padding_styles([
            'obj' => [
                ...get_group_attributes($props, 'icon_padding', false, $prefix)
            ],
            'prefix' => $prefix . 'icon_'
        ]) : null,
        'border' => $target === 'icon' ? get_border_styles([
            'obj' => [
                ...get_group_attributes(
                    $props,
                    ['icon_border', 'icon_border_width', 'icon_border_radius'],
                    false,
                    $prefix
                )
            ],
            'prefix' => $prefix . 'icon_',
            'block_style' => $props['block_style'],
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
            !is_null($props[$prefix . 'icon_spacing_' . $breakpoint]) &&
            !is_null($props[$prefix . 'icon_position'])
        ) {
            if ($props[$prefix . 'icon_position'] === 'left' || $props[$prefix . 'icon_position'] === 'right') {
                $responsive[$breakpoint]['margin_' . ($props[$prefix . 'icon_position'] === 'right' ? 'left' : 'right')] = $props[$prefix . 'icon_only'] ? '0' : get_last_breakpoint_attribute(
                    $prefix . 'icon_spacing',
                    $breakpoint,
                    $props
                ) . 'px';
            } else {
                $responsive[$breakpoint]['margin_' . ($props[$prefix . 'icon_position'] === 'top' ? 'bottom' : 'top')] = $props[$prefix . 'icon_only'] ? '0' : get_last_breakpoint_attribute(
                    $prefix . 'icon_spacing',
                    $breakpoint,
                    $props
                ) . 'px';
            }
        }
    }

    $response['icon_responsive'] = $responsive;

    return $response;
}

function get_icon_hover_object($props, $target, $prefix = '', $iconType = '')
{
    $icon_hover_status = $props[$prefix . 'icon_status_hover'];
    $icon_hover_active_media = get_attribute_value(
        'icon_background_active_media',
        $prefix,
        true,
        'general',
        $props
    );

    $response = [
        'icon' => $icon_hover_status ? get_icon_styles([
            ...get_group_attributes(
                $props,
                ['icon_hover', 'typography'],
                true,
                $prefix
            )
        ], $props['block_style'], $props[$prefix . 'icon_inherit'], true, $iconType) : null,
        'background' => $icon_hover_status && $icon_hover_active_media === 'color' && $target === 'iconHover' ? get_color_background_object([
            ...get_group_attributes(
                $props,
                ['icon', 'icon_background_color', 'background', 'background_color'],
                true,
                $prefix
            ),
            'prefix' => $prefix . 'icon_',
            'block_style' => $props['block_style'],
            'is_icon_inherit' => $props[$prefix . 'icon_inherit'],
            'is_hover' => true,
            'is_icon' => true
        ]) : null,
        'gradient' => $icon_hover_status && $icon_hover_active_media === 'gradient' && $target === 'iconHover' ? get_gradient_background_object([
            ...get_group_attributes(
                $props,
                ['icon', 'icon_background', 'icon_background_gradient'],
                true,
                $prefix
            ),
            'prefix' => $prefix . 'icon_',
            'is_hover' => true,
            'block_style' => $props['block_style'],
            'is_icon' => true
        ]) : null,
        'border' => $icon_hover_status && $target === 'iconHover' ? get_border_styles([
            'obj' => [
                ...get_group_attributes(
                    $props,
                    ['icon_border', 'icon_border_width', 'icon_border_radius'],
                    true,
                    $prefix
                )
            ],
            'prefix' => $prefix . 'icon_',
            'block_style' => $props['block_style'],
            'is_hover' => true
        ]) : null
    ];

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

    $has_icon = isset($obj[$prefix . 'icon_content']) ? !!$obj[$prefix . 'icon_content'] : false;
    $icon_inherit = $obj[$prefix . 'icon_inherit'] ?? false;
    $icon_hover_status = $obj[$prefix . 'icon_status_hover'] ?? false;

    $use_icon_color = !$icon_inherit;
    $normal_target = $wrapper_target . ' ' . $target;
    $hover_target = $hover_on_icon ? $wrapper_target . ' ' . $target . ':hover' : $wrapper_target . ':hover ' . $target;

    $icon_type = isset($obj['svg_type']) ? strtolower($obj['svg_type']) : null;

    $response = array_merge(
        $has_icon && !$is_hover ? array_merge(
            get_svg_styles([
                'obj' => $obj,
                'target' => $normal_target,
                'block_style' => $block_style,
                'prefix' => $prefix . 'icon_',
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
                ' ' . $hover_target . ' svg path' => get_icon_path_styles($obj, true),
            ],
            get_svg_styles([
                'obj' => $obj,
                'target' => $hover_target,
                'block_style' => $block_style,
                'prefix' => $prefix . 'icon_',
                'use_icon_color' => $use_icon_color,
                'is_hover' => true,
                'icon_type' => $icon_type
            ])
        ) : [],
        [
            ' ' . $normal_target . ' svg path' => get_icon_path_styles($obj, false),
            ' ' . $hover_target => isset($obj['icon_status_hover']) && $obj['icon_status_hover'] ? get_icon_hover_object($obj, 'iconHover') : null,
            ' ' . $hover_target . ' svg > *' => isset($obj['icon_status_hover']) && $obj['icon_status_hover'] ? get_icon_hover_object($obj, 'iconHover') : null,
            ' ' . $hover_target . ' svg' => isset($obj['icon_status_hover']) && $obj['icon_status_hover'] ? get_icon_size($obj, true, $prefix, $icon_width_height_ratio) : null,
            ' ' . $hover_target . ' svg path' => isset($obj['icon_status_hover']) && $obj['icon_status_hover'] ? get_icon_path_styles($obj, true) : null,
        ]
    );

    write_log('get_group_attributes:');
    write_log(get_group_attributes($obj, ['background', 'border', 'borderWidth', 'borderRadius'], false, $prefix));

    $response = array_merge(
        $response,
        get_background_styles(
            array_merge(
                get_group_attributes($obj, ['background', 'border', 'borderWidth', 'borderRadius'], false, $prefix),
                ['block_style' => $block_style, 'prefix' => $prefix, 'is_button' => true]
            )
        ),
        get_background_styles(
            array_merge(
                get_group_attributes($obj, ['background', 'border', 'borderWidth', 'borderRadius'], true, $prefix),
                [
                    'is_hover' => true,
                    'block_style' => $block_style,
                    'prefix' => $prefix,
                    'is_button' => true

                ]
            )
        )
    );

    return $response;
}
