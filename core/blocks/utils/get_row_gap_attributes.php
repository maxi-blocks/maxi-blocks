<?php

function get_row_gap_attributes($props)
{
    $response = get_group_attributes($props, 'flex');
            
    foreach (array_keys($response) as $key) {
        if (!strpos($key, 'gap') !== false) {
            unset($response[$key]);
        }
    };
    
    return $response;
}
