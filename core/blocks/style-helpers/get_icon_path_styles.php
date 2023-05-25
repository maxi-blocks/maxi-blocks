<?php

function get_icon_path_styles($obj, $is_hover = false, $prefix = '')
{
    $response = [
        'label' => 'Icon path',
        'general' => [],
    ];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $response[$breakpoint] = [];

        $icon_stroke = $obj[get_attribute_key('icon-stroke', $is_hover, $prefix, $breakpoint)] ?? null;

        if (!is_null($icon_stroke)) {
            $response[$breakpoint]['stroke-width'] = $icon_stroke;
        }

        if (empty($response[$breakpoint]) && $breakpoint !== 'general') {
            unset($response[$breakpoint]);
        }
    }

    return ['iconPath' => $response];
}
