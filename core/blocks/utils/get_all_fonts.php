<?php

/**
 * Function to get all fonts based on various attributes.
 *
 * @param array $attr The attributes to base the font selection on.
 * @param bool|string $recursive_key The key to search for recursively in the attributes array.
 * @param bool $is_hover Whether the function should get hover fonts.
 * @param string $text_level The level of text for which to get the fonts. Default is 'p'.
 * @param string $block_style The style of block for which to get the fonts. Default is 'light'.
 * @param bool $only_backend Whether to only get backend fonts.
 * @param array $prefixes An array of prefixes to use when getting font properties. Default is [''].
 *
 * @return array An associative array with the font names as keys, and arrays with 'weight' and 'style' as values.
 */
function get_all_fonts($attr, $recursive_key = false, $is_hover = false, $text_level = 'p', $block_style = 'light', $only_backend = false, $prefixes = [''])
{
    $result = [];
    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    $get_all_fonts_recursively = function ($obj) use ($breakpoints, $is_hover, $text_level, $only_backend, $recursive_key, $block_style, $prefixes, &$result, &$get_all_fonts_recursively) {
        $properties_to_check = [
            'font-family',
            'font-weight',
            'font-style',
        ];

        foreach ($breakpoints as $breakpoint) {
            foreach ($prefixes as $prefix) {
                $final_font_name = null;
                $final_font_weight = null;
                $final_font_style = null;

                foreach ($properties_to_check as $base_property) {
                    $property = get_attribute_key($base_property, $is_hover, $prefix, $breakpoint);
                    $value = isset($obj[$property]) ? $obj[$property] : null;

                    if ($value || $breakpoint === 'general') {
                        $final_property_name = strpos($base_property, 'cl-pagination') !== false
                            ? str_replace("-{$breakpoint}", '', $base_property)
                            : $base_property;

                        if (strpos($base_property, 'font-family') !== false) {
                            $final_value = $value ?? (strpos($final_property_name, 'pagination') !== false
                                ? null
                                : "sc_font_{$block_style}_{$text_level}");
                            $final_font_name = $final_value;
                        } elseif (strpos($base_property, 'font-weight') !== false) {
                            $final_value = $value ?? '400';
                            $final_font_weight = $final_value;
                        } elseif (strpos($base_property, 'font-style') !== false) {
                            $final_value = $value ?? 'normal';
                            $final_font_style = $final_value;
                        }

                        if ($final_font_name) {
                            if (!isset($result[$final_font_name])) {
                                $result[$final_font_name] = [
                                    'weight' => null,
                                    'style' => null,
                                ];
                            }

                            if ($final_font_weight) {
                                $result[$final_font_name]['weight'] = $final_font_weight;
                            }

                            if ($final_font_style) {
                                $result[$final_font_name]['style'] = $final_font_style;
                            }
                        }
                    }
                }
            }
        }

        // Perform recursive search if needed
        foreach ($obj as $key => $val) {
            if (isset($val) && is_array($val) && is_string($recursive_key) && strpos($key, $recursive_key) !== false) {
                foreach ($val as $recursive_val) {
                    $get_all_fonts_recursively($recursive_val);
                }
            }
        }
    };

    $get_all_fonts_recursively($attr);

    return $result;
}
