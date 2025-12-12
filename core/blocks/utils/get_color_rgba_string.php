<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_palette_color.php';

function get_var_with_color($block_style, $variable)
{
    $color = str_replace(' ', '', get_palette_color(str_replace('color-', '', $variable), $block_style));

    // Guard: Don't add fallback if color is empty or false to prevent broken CSS
    // Only add the comma and color value if we have a valid color (not empty, not false)
    $has_valid_color = strpos($variable, 'color-') !== false && $color && $color !== '';

    return "var(--maxi-" . $block_style . "-" . $variable .
        ($has_valid_color ? "," . $color : "") . ")";
}

function get_color_rgba_string($args)
{
    $block_style = $args['block_style'];
    $first_var = $args['first_var'];
    $opacity = $args['opacity'];
    $second_var = $args['second_var'] ?? null;


    return $second_var
        ? "var(--maxi-" . $block_style . "-" . $first_var . ",rgba(" . get_var_with_color($block_style, $second_var) . "," . (is_numeric($opacity) ? $opacity : 1) . "))"
        : "rgba(" . get_var_with_color($block_style, $first_var) . "," . (is_numeric($opacity) ? $opacity : 1) . ")";
}
