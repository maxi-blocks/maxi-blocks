<?php

function get_prev_breakpoint($breakpoint)
{
    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    $index = array_search($breakpoint, $breakpoints);
    return $index > 0 ? $breakpoints[$index - 1] : 'general';
}
