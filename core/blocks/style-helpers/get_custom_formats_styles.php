<?php

function get_custom_formats_styles(
    $target,
    $custom_formats,
    $is_hover = false,
    $typography,
    $text_level,
    $block_style
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
