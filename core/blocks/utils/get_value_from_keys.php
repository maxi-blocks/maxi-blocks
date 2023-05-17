<?php

function get_value_from_keys($value, $keys)
{
    foreach ($keys as $key) {
        $value = isset($value->$key) ? $value->$key : null;
    }
    return $value;
}
