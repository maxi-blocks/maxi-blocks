<?php

function get_attribute_key(
    $key,
    $is_hover = false,
    $prefix = '',
    $breakpoint = false
) {
    return $prefix . $key . ($breakpoint ? '-' . $breakpoint : '')
    . ($is_hover ? '-hover' : '');
}
