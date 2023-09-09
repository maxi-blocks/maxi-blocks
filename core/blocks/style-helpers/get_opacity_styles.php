<?php

function get_opacity_styles($obj, $isHover = false, $prefix = '')
{
    if (!is_array($obj)) {
        return [];
    }
    $response = [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $attr_key = get_attribute_key('opacity', $isHover, $prefix, $breakpoint);
        if (isset($obj[$attr_key]) && $obj[$attr_key] !== '') {
            $response[$breakpoint] = [
                'opacity' => $obj[$attr_key]
            ];
        }
    }

    return $response;
}
