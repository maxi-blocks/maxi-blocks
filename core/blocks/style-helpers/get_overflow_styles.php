<?php

function get_overflow_styles($obj)
{
    $response = [];
    $omit_overflow_x = true;
    $omit_overflow_y = true;

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $overflow_x = get_last_breakpoint_attribute([
            'target' => 'overflow-x',
            'breakpoint' => $breakpoint,
            'attributes' => $obj
        ]);
        $overflow_y = get_last_breakpoint_attribute([
            'target' => 'overflow-y',
            'breakpoint' => $breakpoint,
            'attributes' => $obj
        ]);

        $omit_overflow_x = $omit_overflow_x ? $overflow_x === 'visible' : false;
        $omit_overflow_y = $omit_overflow_y ? $overflow_y === 'visible' : false;

        if (!$omit_overflow_x) {
            $response[$breakpoint]['overflow-x'] = $overflow_x;
        }
        if (!$omit_overflow_y) {
            $response[$breakpoint]['overflow-y'] = $overflow_y;
        }
    }

    return $response;
}
