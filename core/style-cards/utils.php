<?php

/**
 * Gets the active color from the style card.
 *
 * @param array $sc Style card array.
 * @param int $number Color index.
 * @return string Color value.
 */
function get_active_colour_from_sc($sc, $number)
{
    if (empty($sc)) {
        return '0,0,0';
    }

    if (!empty($sc['value'])) {
        return $sc['value']['light']['styleCard']['color'][$number] ??
               $sc['value']['light']['defaultStyleCard']['color'][$number] ??
               '0,0,0';
    }

    return $sc['light']['styleCard']['color'][$number] ??
           $sc['light']['defaultStyleCard']['color'][$number] ??
           '0,0,0';
}

/**
 * Get SC style string.
 *
 * @param array $sc_object Style card object.
 * @return string SC style string.
 */
function create_sc_style_string($sc_object)
{
    $response = ':root{';

    foreach ($sc_object as $key => $val) {
        if ($val) {
            $response .= "$key:$val;";
        }
    }

    $response .= '}';

    return $response;
}
