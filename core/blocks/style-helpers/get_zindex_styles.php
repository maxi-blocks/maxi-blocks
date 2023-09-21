<?php

function get_zindex_styles($obj)
{
    $response = [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        if (isset($obj["z-index-$breakpoint"])) {
            $response[$breakpoint] = ['z-index' => $obj["z-index-$breakpoint"]];
        }
    }

    return $response;
}
