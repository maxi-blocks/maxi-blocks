<?php

function get_attribute_key(
    string $key, 
    bool $isHover = false, 
    string $prefix = '',
    bool $breakpoint = false
    ) : string
    {
        return $prefix . $key . ($breakpoint ? '-' . $breakpoint : '') 
        . ($isHover ? '-hover' : '');
    }