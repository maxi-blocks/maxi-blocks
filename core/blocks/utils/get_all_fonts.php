<?php

function get_all_fonts($attr, $recursive_key = false, $is_hover = false, $text_level = 'p', $block_style = 'light', $only_backend = false)
{

    $result = [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    $get_all_fonts_recursively = function ($obj) use ($breakpoints, $is_hover, $text_level, $only_backend, $recursive_key, $block_style, &$result, &$get_all_fonts_recursively) {
        write_log("get_all_fonts");
        write_log($obj);
        foreach ($breakpoints as $breakpoint) {
            $font_name = isset($obj["font-family-{$breakpoint}"]) ? $obj["font-family-{$breakpoint}"] : null;
            $font_weight = isset($obj["font-weight-{$breakpoint}"]) ? $obj["font-weight-{$breakpoint}"] : null;
            $font_style = isset($obj["font-style-{$breakpoint}"]) ? $obj["font-style-{$breakpoint}"] : null;

            if ($font_name || $font_weight || $font_style || $breakpoint === 'general') {
                $final_font_name = $font_name ?? "sc_font_{$block_style}_{$text_level}";

                $final_font_weight = $font_weight ?? '400';

                $final_font_style = $font_style ?? 'normal';

                if (isset($result[$final_font_name])) {
                    $current_font_weight = $result[$final_font_name]['weight'];
                    $current_font_style = $result[$final_font_name]['style'];

                    if ($current_font_weight && !strpos($current_font_weight, (string)$final_font_weight)) {
                        $final_font_weight = "{$current_font_weight},{$final_font_weight}";
                    }

                    if ($current_font_style && !strpos($current_font_style, $final_font_style)) {
                        $final_font_style = "{$current_font_style},{$final_font_style}";
                    }
                }

                $result[$final_font_name] = [
                    'weight' => $final_font_weight,
                    'style' => $final_font_style
                ];
            }
        }

        foreach ($obj as $key => $val) {
            if (isset($val) && is_string($recursive_key) && strpos($key, $recursive_key) !== false) {
                $recursive_fonts = [];
                foreach ($val as $recursive_val) {
                    $recursive_fonts = array_merge($recursive_fonts, $recursive_val);
                }

                $get_all_fonts_recursively($recursive_fonts);
            }
        }
    };

    $get_all_fonts_recursively($attr);

    write_log('result');
    write_log($result);

    return $result;
}
