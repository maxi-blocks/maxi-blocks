<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-style-cards.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/class-maxi-color-utils.php';

/**
 * Gets a color from the active style card's palette
 *
 * @param string|int $color The color index or identifier (can be a number 1-8 or 'custom-X')
 * @param string $block_style The block style ('light' or 'dark')
 * @return string|false The color value or false if not found
 */
function get_palette_color($color, $block_style = 'light') {
    if (class_exists('MaxiBlocks_StyleCards')) {
        $sc_value = MaxiBlocks_StyleCards::get_instance()->get_maxi_blocks_active_style_card();

        if (!isset($sc_value)) {
            return false;
        }

        // Check if this is a custom color
        if (is_string($color) && strpos($color, 'custom-') === 0) {
            $custom_index = intval(str_replace('custom-', '', $color));

            // Try to get custom colors from various possible locations in the Style Card
            if (isset($sc_value[$block_style]['styleCard']['color']['customColors'][$custom_index])) {
                return extract_rgb_values($sc_value[$block_style]['styleCard']['color']['customColors'][$custom_index]);
            }

            // Try defaultStyleCard
            if (isset($sc_value[$block_style]['defaultStyleCard']['color']['customColors'][$custom_index])) {
                return extract_rgb_values($sc_value[$block_style]['defaultStyleCard']['color']['customColors'][$custom_index]);
            }

            // Try the opposite style as fallback
            $opposite_style = $block_style === 'light' ? 'dark' : 'light';

            if (isset($sc_value[$opposite_style]['styleCard']['color']['customColors'][$custom_index])) {
                return extract_rgb_values($sc_value[$opposite_style]['styleCard']['color']['customColors'][$custom_index]);
            }

            if (isset($sc_value[$opposite_style]['defaultStyleCard']['color']['customColors'][$custom_index])) {
                return extract_rgb_values($sc_value[$opposite_style]['defaultStyleCard']['color']['customColors'][$custom_index]);
            }

            // Try general color storage if available
            if (isset($sc_value['color']['customColors'][$custom_index])) {
                return extract_rgb_values($sc_value['color']['customColors'][$custom_index]);
            }

            return false;
        }

        // Regular palette color
        return $sc_value[$block_style]['styleCard']['color'][$color]
            ?? $sc_value[$block_style]['defaultStyleCard']['color'][$color]
            ?? $sc_value[$block_style === 'light' ? 'dark' : 'light']['styleCard']['color'][$color]
            ?? $sc_value[$block_style === 'light' ? 'dark' : 'light']['defaultStyleCard']['color'][$color]
            ?? false;
    }

    return false;
}

/**
 * Extract RGB values from a color string
 *
 * @param string $color_value The color string (rgba, hex, etc.)
 * @return string The RGB values as a comma-separated string
 */
function extract_rgb_values($color_value) {
    // Include the utility class if not already loaded
    require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/class-maxi-color-utils.php';

    // Use the shared implementation from the utility class
    return MaxiBlocks_ColorUtils::extract_rgb_values($color_value);
}

?>
