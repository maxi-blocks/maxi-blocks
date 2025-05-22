<?php

/**
 * MaxiBlocks Color Utilities
 *
 * Utility class for color manipulation and conversion across the plugin.
 */
class MaxiBlocks_ColorUtils
{
    /**
     * Extract RGB values from a color string or array
     *
     * @param string|array $color_data The color string (rgba, hex, etc.) or an array with a 'value' key
     * @return string The RGB values as a comma-separated string (e.g., "255, 255, 255")
     */
    public static function extract_rgb_values($color_data)
    {
        $color_string_to_parse = null;

        // Check if input is the array format {value: "...", name: "..."}
        if (is_array($color_data) && isset($color_data['value'])) {
            $color_string_to_parse = $color_data['value'];
        } elseif (is_string($color_data)) {
            $color_string_to_parse = $color_data;
        }

        // If after potential extraction, $color_string_to_parse is not a string or is empty
        if (empty($color_string_to_parse)) {
            return "0, 0, 0";
        }

        // Handle potential JSON encoded strings (e.g., "\"rgba(...)\"").
        if (
            strpos($color_string_to_parse, '"rgba(') === 0 ||
            strpos($color_string_to_parse, '"rgb(') === 0 ||
            strpos($color_string_to_parse, '"#') === 0
        ) {
            $decoded_value = json_decode($color_string_to_parse);
            if (json_last_error() === JSON_ERROR_NONE && is_string($decoded_value)) {
                $color_string_to_parse = $decoded_value;
            } else {
                // Fallback: trim quotes if JSON decoding failed or didn't yield a string
                $color_string_to_parse = trim($color_string_to_parse, '"\'');
            }
            // Re-check if it became empty after trim/decode
            if (empty($color_string_to_parse)) {
                return "0, 0, 0";
            }
        }

        // Extract RGB values if it's an rgba format
        if (preg_match('/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*[\d.]+)?\)/', $color_string_to_parse, $matches)) {
            return "{$matches[1]}, {$matches[2]}, {$matches[3]}";
        } elseif (strpos($color_string_to_parse, '#') === 0) {
            // Convert HEX to RGB
            $hex = ltrim($color_string_to_parse, '#');
            if (strlen($hex) === 3) {
                $hex = $hex[0].$hex[0].$hex[1].$hex[1].$hex[2].$hex[2];
            }
            // Ensure hex is valid before using hexdec
            if (strlen($hex) === 6 && ctype_xdigit($hex)) {
                $r = hexdec(substr($hex, 0, 2));
                $g = hexdec(substr($hex, 2, 2));
                $b = hexdec(substr($hex, 4, 2));
                return "$r, $g, $b";
            } else {
                // Invalid hex format
                return "0, 0, 0";
            }
        } else {
            // For other formats (e.g., color names) or unparseable strings, return a default.
            return "0, 0, 0";
        }
    }
}
