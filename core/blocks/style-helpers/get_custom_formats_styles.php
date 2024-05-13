<?php

function get_custom_formats_styles(
    $target,
    $custom_formats,
    $typography,
    $text_level,
    $block_style,
    $disable_palette_defaults = false,
) {
    $response = [];

    if (is_array($custom_formats)) {
        foreach ($custom_formats as $key => $val) {
            $key = str_replace(
                'u002d',
                '-',
                $key
            );

            $response[$target . ' .' . $key] = [
                'typography' => get_typography_styles([
                    'obj' => $val,
                    'is_hover' => false,
                    'custom_format_typography' => $typography,
                    'text_level' => $text_level,
                    'block_style' => $block_style,
                    'disable_palette_defaults' => $disable_palette_defaults,
                ]),
            ];
        }
    }

    return $response;
}
