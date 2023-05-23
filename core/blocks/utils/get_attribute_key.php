<?php

function get_attribute_key(
    $key, 
    $isHover = false, 
    $prefix = '',
    $breakpoint = false
    )
    {
        return $prefix . $key . ($breakpoint ? '-' . $breakpoint : '') 
        . ($isHover ? '-hover' : '');
    }