<?php

/**
 * Function to get all fonts based on various attributes.
 *
 * This function accepts several parameters to determine which fonts to get,
 * then it gets them recursively if needed. It returns the result as an associative array.
 *
 * @param array $attr The attributes to base the font selection on.
 * @param bool|string $recursive_key The key to search for recursively in the attributes array. If false, no recursive search is performed.
 * @param bool $is_hover Whether the function should get hover fonts.
 * @param string $text_level The level of text for which to get the fonts. Default is 'p'.
 * @param string $block_style The style of block for which to get the fonts. Default is 'light'.
 * @param bool $only_backend Whether to only get backend fonts.
 *
 * @return array An associative array with the font names as keys, and arrays with 'weight' and 'style' as values.
 */
function get_all_fonts($attr, $recursive_key = false, $is_hover = false, $text_level = 'p', $block_style = 'light', $only_backend = false)
{

    $result = []; // Initialize result array.

    // Define the different breakpoints for the fonts.
    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    // Define the recursive function to get all fonts.
    $get_all_fonts_recursively = function ($obj) use ($breakpoints, $is_hover, $text_level, $only_backend, $recursive_key, $block_style, &$result, &$get_all_fonts_recursively) {

        // Loop through each breakpoint.
        foreach ($breakpoints as $breakpoint) {

            // Retrieve font name, weight, and style for the current breakpoint.
            $font_name = isset($obj["font-family-{$breakpoint}"]) ? $obj["font-family-{$breakpoint}"] : null;
            $font_weight = isset($obj["font-weight-{$breakpoint}"]) ? $obj["font-weight-{$breakpoint}"] : null;
            $font_style = isset($obj["font-style-{$breakpoint}"]) ? $obj["font-style-{$breakpoint}"] : null;

            // Process font properties if any property is set or the breakpoint is 'general'.
            if ($font_name || $font_weight || $font_style || $breakpoint === 'general') {

                // Define final font name, weight, and style, with fallback defaults.
                $final_font_name = $font_name;
                
                if (!$final_font_name && class_exists('MaxiBlocks_StyleCards')) {
                    $sc_font = MaxiBlocks_StyleCards::get_active_style_cards_value_by_name($block_style, $text_level, 'font-family-general');
                    if ($sc_font) {
                        $final_font_name = str_replace(['"', "'"], '', $sc_font);
                    }
                }

                $final_font_name = $final_font_name ?? "sc_font_{$block_style}_{$text_level}";
                $final_font_weight = $font_weight ?? '400';
                $final_font_style = $font_style ?? 'normal';

                // If the font already exists in the result, merge the new font weight and style with the existing one.
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

                // Add or update the font in the result array.
                $result[$final_font_name] = [
                    'weight' => $final_font_weight,
                    'style' => $final_font_style
                ];
            }
        }

        // Perform recursive search if needed.
        foreach ($obj as $key => $val) {
            if (isset($val) && is_string($recursive_key) && strpos($key, $recursive_key) !== false) {
                $recursive_fonts = [];
                foreach ($val as $recursive_val) {
                    $recursive_fonts = array_merge($recursive_fonts, $recursive_val);
                }

                // Call the recursive function with the recursive fonts.
                $get_all_fonts_recursively($recursive_fonts);
            }
        }
    };

    // Call the recursive function with the given attributes.
    $get_all_fonts_recursively($attr);

    // Return the result array.
    return $result;
}
