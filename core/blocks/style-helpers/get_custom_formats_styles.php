<?php

function get_custom_formats_styles(
    $target,
    $custom_formats,
    $block_style,
    $typography,
    $text_level,
    $is_hover = false,
) {
    $response = [];

    if ($custom_formats) {
        foreach ($custom_formats as $key => $val) {
            $response[$target . ' .' . $key] = [
                'typography' => get_typography_styles([
                    'obj' => $val,
                    'isHover' => false,
                    'customFormatTypography' => $typography,
                    'textLevel' => $text_level,
                    'block_style' => $block_style,
                ]),
            ];
        }
    }

    return $response;
}
