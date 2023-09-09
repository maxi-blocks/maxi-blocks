<?php

function get_is_valid($val, $cleaned = false)
{
    return ($cleaned &&
        ($val ||
            is_int($val) ||
            is_bool($val) ||
            (empty($val) && isset($val)))) ||
        !$cleaned;
}
