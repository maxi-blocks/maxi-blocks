<?php

function get_palette_attributes($obj, $prefix = '', $breakpoint, $is_hover) {
    function get_value($key, $prefix, $obj, $is_hover, $breakpoint) {
        return is_null($breakpoint)
            ? get_attribute_value($prefix . $key, $obj, $is_hover, null)
            : get_last_breakpoint_attribute($prefix . $key, $breakpoint, $obj, $is_hover);
    }

    return [
        'palette_status' => get_value('palette-status', $prefix, $obj, $is_hover, $breakpoint),
        'palette_sc_status' => get_value('palette-sc-status', $prefix, $obj, $is_hover, $breakpoint),
        'palette_color' => get_value('palette-color', $prefix, $obj, $is_hover, $breakpoint),
        'palette_opacity' => get_value('palette-opacity', $prefix, $obj, $is_hover, $breakpoint),
        'color' => get_value('color', $prefix, $obj, $is_hover, $breakpoint),
    ];
}

?>
