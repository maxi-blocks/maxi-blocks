<?php

function get_value($key, $prefix, $obj, $is_hover, $breakpoint) {
    return is_null($breakpoint)
        ? get_attributes_value([
            'target' => $prefix . $key,
            'props' => $obj,
            'is_hover' => $is_hover,
        ])
        : get_last_breakpoint_attribute([
            'target' => $prefix . $key,
            'attributes' => $obj,
            'is_hover' => $is_hover,
            'breakpoint' => $breakpoint,
        ]);
}

function get_palette_attributes($args) {
    $obj = $args['obj'];
    $prefix = $args['prefix'] ?? '';
    $breakpoint = $args['breakpoint'] ?? null;
    $is_hover = $args['is_hover'] ?? false;

    return [
        'palette_status' => get_value('palette-status', $prefix, $obj, $is_hover, $breakpoint),
        'palette_sc_status' => get_value('palette-sc-status', $prefix, $obj, $is_hover, $breakpoint),
        'palette_color' => get_value('palette-color', $prefix, $obj, $is_hover, $breakpoint),
        'palette_opacity' => get_value('palette-opacity', $prefix, $obj, $is_hover, $breakpoint),
        'color' => get_value('color', $prefix, $obj, $is_hover, $breakpoint),
    ];
}

?>
