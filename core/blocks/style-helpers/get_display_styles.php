<?php

function get_display_styles($obj, $is_hover = false)
{
    $response = [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $attr_key = get_attribute_key('display', $is_hover, false, $breakpoint);
        if (array_key_exists($attr_key, $obj)) {
            $response[$breakpoint] = [
                'display' => $obj[$attr_key],
            ];
        }
    }

    return $response;
}
