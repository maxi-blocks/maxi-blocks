<?php

if ( ! defined( 'ABSPATH' ) ) exit;

function get_number_counter_sc_colour_string($args)
{
    $palette = get_palette_attributes([
        'obj' => $args['obj'],
        'prefix' => $args['prefix'],
        'breakpoint' => $args['breakpoint'] ?? null,
    ]);

    if (
        isset($palette['palette_status']) &&
        $palette['palette_status'] &&
        !empty($palette['palette_color'])
    ) {
        $palette_variable = 'color-' . $palette['palette_color'];
        $should_use_style_card_variable =
            !isset($palette['palette_sc_status']) || !$palette['palette_sc_status'];

        $color_args = [
            'first_var' => $should_use_style_card_variable
                ? $args['sc_variable']
                : $palette_variable,
            'opacity' => $palette['palette_opacity'],
            'block_style' => $args['block_style'],
        ];

        if ($should_use_style_card_variable) {
            $color_args['second_var'] = $palette_variable;
        }

        return get_color_rgba_string($color_args);
    }

    return !empty($palette['color']) ? $palette['color'] : null;
}

function get_circle_bar_styles($obj, $block_style)
{
    $response = [
        'label' => 'Number Counter',
        'general' => []
    ];

    $get_color = function ($breakpoint) use ($obj, $block_style) {
        return get_number_counter_sc_colour_string([
            'obj' => $obj,
            'prefix' => 'number-counter-circle-bar-',
            'breakpoint' => $breakpoint,
            'block_style' => $block_style,
            'sc_variable' => 'number-counter-circle-bar',
        ]);
    };

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $response[$breakpoint] = [
            'stroke' => $get_color($breakpoint)
        ];
    }

    return ['numberCounterCircleBar' => $response];
}

function get_circle_background_styles($obj, $block_style)
{
    $response = [
        'label' => 'Number Counter',
        'general' => []
    ];

    $color = get_number_counter_sc_colour_string([
        'obj' => $obj,
        'prefix' => 'number-counter-circle-background-',
        'block_style' => $block_style,
        'sc_variable' => 'number-counter-circle-background',
    ]);

    if (isset($color)) {
        $response['general']['stroke'] = $color;
    }

    return ['numberCounterBackground' => $response];
}

function get_text_styles($obj, $block_style)
{
    $response = [
        'label' => 'Number Counter',
        'general' => []
    ];

    $get_color = function ($breakpoint) use ($obj, $block_style) {
        return get_number_counter_sc_colour_string([
            'obj' => $obj,
            'prefix' => 'number-counter-text-',
            'breakpoint' => $breakpoint,
            'block_style' => $block_style,
            'sc_variable' => 'number-counter-color',
        ]);
    };

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $response[$breakpoint] = [
            ...(!isset($obj["number-counter-title-font-size-{$breakpoint}"]) ? [] : ['font-size' => "{$obj["number-counter-title-font-size-{$breakpoint}"]}px"]),
            ...(!isset($obj["font-family-{$breakpoint}"]) ? [] : ['font-family' => $obj["font-family-{$breakpoint}"]]),
            ...(!isset($obj["font-weight-{$breakpoint}"]) ? [] : ['font-weight' => $obj["font-weight-{$breakpoint}"]]),
            'color' => $get_color($breakpoint)
        ];
    }

    return ['numberCounterText' => $response];
}

function get_sup_styles($obj)
{
    $response = [
        'label' => 'Number Counter',
        'general' => []
    ];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        if (isset($obj["number-counter-title-font-size-{$breakpoint}"])) {
            $val = $obj["number-counter-title-font-size-{$breakpoint}"];
            $use_val = round((float)$val/1.5, 2);

            $response['general']['font-size'] =  $use_val.'px';
        }
    }

    return ['numberCounterSup' => $response];
}

function get_number_counter_styles($obj, $target, $block_style)
{
    $response = [
        " {$target} .maxi-number-counter__box__circle" => get_circle_bar_styles($obj, $block_style),
        " {$target} .maxi-number-counter__box__background" => get_circle_background_styles($obj, $block_style),
        " {$target} .maxi-number-counter__box__text" => get_text_styles($obj, $block_style),
        " {$target} .maxi-number-counter__box__text tspan" => get_sup_styles($obj)
    ];

    return $response;
}
