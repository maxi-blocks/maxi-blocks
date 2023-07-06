<?php

function get_icon_size(
    $obj,
    $is_hover = false,
    $prefix = '',
    $icon_width_height_ratio = 1
) {
    return get_svg_width_styles([
        'obj' => $obj,
        'is_hover' => $is_hover,
        'prefix' => $prefix.'icon-',
        'iconWidthHeightRatio' => $icon_width_height_ratio,
        'disableHeight' => false,
    ]);
}
