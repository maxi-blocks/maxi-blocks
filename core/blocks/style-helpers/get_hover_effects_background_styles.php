<?php

function get_hover_effects_background_styles($props, $block_style)
{
    $response = [
        'general' => [],
    ];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $current_active_media = get_last_breakpoint_attribute([
            'target' => 'hover-background-active-media',
            'breakpoint' => $breakpoint,
            'attributes' => $props,
        ]);

        if (!$current_active_media) {
            continue;
        }

        $response = array_merge($response, [
            (boolval($current_active_media) && $current_active_media === 'color'
                ? [
                    'background' => get_color_background_object([
                        ...get_group_attributes(
                            $props,
                            'background_color',
                            false,
                            'hover-'
                        ),
                        'block_style' => $block_style,
                        'breakpoint' => $breakpoint,
                        'prefix' => 'hover-',
                    ]),
                ]
                : []),
            (boolval($current_active_media) && $current_active_media === 'gradient'
                ? [
                    'background' => get_gradient_background_object([
                        ...get_group_attributes(
                            $props,
                            'background_gradient',
                            false,
                            'hover-'
                        ),
                        'breakpoint' => $breakpoint,
                        'prefix' => 'hover-',
                    ]),
                ]
                : []),
        ]);

        if (
            $current_active_media === 'gradient' &&
            isset($response['background'][$breakpoint]['background'])
        ) {
            $response['background'][$breakpoint]['background'] = preg_replace_callback(
                '/rgb\(/',
                function ($matches) {
                    return 'rgba(';
                },
                $response['background'][$breakpoint]['background']
            );

            $opacity_value = $props['hover-background-gradient-opacity'] ?? 1;

            $response['background'][$breakpoint]['background'] = preg_replace_callback(
                '/\((\d+),(\d+),(\d+)\)/',
                function ($matches) use ($opacity_value) {
                    return "($matches[1],$matches[2],$matches[3],$opacity_value)";
                },
                $response['background'][$breakpoint]['background']
            );
        }
    }

    return $response;
}
