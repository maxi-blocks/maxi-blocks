<?php

function get_value_from_keys($value, $keys)
{
    // write_log('get_value_from_keys');
    // write_log($value);
    // write_log($keys);
    return array_reduce($keys, function ($acc, $key) {
        return $acc[$key] ?? null;
    }, $value);
}
