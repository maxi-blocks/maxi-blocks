<?php

function get_value_from_keys($value, $keys)
{
    foreach ($keys as $key) {
        if (!is_array($value) || !isset($value[$key])) {
            return null;
        }
        $value = $value[$key];
    }
    return $value;
}
