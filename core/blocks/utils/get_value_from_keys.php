<?php

if ( ! defined( 'ABSPATH' ) ) exit;

function get_value_from_keys($value, $keys)
{
    return array_reduce($keys, function ($acc, $key) {
        return $acc[$key] ?? null;
    }, $value);
}
