<?php

function get_var_with_color($block_style, $variable) {
    $color = str_replace(' ', '', get_palette_color($block_style, str_replace('color-', '', $variable)));
    return "var(--maxi-" . $block_style . "-" . $variable . 
        (strpos($variable, 'color-') !== false && $color ? "," . $color : "") . ")";
}

function get_color_rgba_string($block_style, $first_var, $opacity, $second_var = null) {
    return $second_var 
        ? "var(--maxi-" . $block_style . "-" . $first_var . ",rgba(" . get_var_with_color($block_style, $second_var) . "," . (is_numeric($opacity) ? $opacity : 1) . "))"
        : "rgba(" . get_var_with_color($block_style, $first_var) . "," . (is_numeric($opacity) ? $opacity : 1) . ")";
}

?>
