<?php

function get_custom_css($obj, $category, $index)
{
    $response = [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $customCssValue = get_last_breakpoint_attribute(array(
            'target' => 'custom-css',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ));

        $value = $customCssValue[$category][$index] ?? null;

        if ($value) {
            $response[$breakpoint] = [
                'css' => $value,
            ];
        }
    }

    return $response;
}

function get_custom_styles($props, $type, $index)
{
    $response = [
        'customCss' => get_custom_css(
            get_group_attributes($props, 'customCss'),
            $type,
            $index
        ),
    ];

    return $response;
}

function get_custom_css_object($selectors, $props)
{
    $response = [];

    foreach ($selectors as $category => $targets) {
        foreach ($targets as $index => $element) {
            $target = $element['target'];
            $css = get_custom_styles($props, $category, $index);
            if (!empty($css['customCss'])) {
                $response[$target] = $css;
            }
        }
    }

    return $response;
}
