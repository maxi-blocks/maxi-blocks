<?php
require_once MAXI_PLUGIN_DIR_PATH . 'core/defaults/sc_defaults.php';


class MaxiBlocks_StyleCards
{
    /**
     * This plugin's instance.
     *
     * @var MaxiBlocks_StyleCards
     */
    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_StyleCards();
        }
    }

    /**
     * Return the registered instance
     */
    public static function get_instance()
    {
        return self::$instance;
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        add_action('admin_enqueue_scripts', [$this, 'enqueue_styles']);

        // Wrap wp_enqueue_scripts in wp action to check for blocks
        add_action('wp', function () {
            if (class_exists('MaxiBlocks_Blocks') && MaxiBlocks_Blocks::has_blocks()) {
                add_action('wp_enqueue_scripts', [$this, 'enqueue_styles']);
            }
        });

        // Run the migration once
        add_action('admin_init', [$this, 'run_link_palette_migration']);
    }

    /**
     * Enqueuing styles
     */
    public function enqueue_styles()
    {
        if (!wp_style_is('maxi-blocks-sc-vars', 'registered')) {
            $vars = $this->get_style_card_variables();

            // SC variables
            if ($vars) {
                wp_register_style('maxi-blocks-sc-vars', false, [], MAXI_PLUGIN_VERSION);
                wp_enqueue_style('maxi-blocks-sc-vars');
                wp_add_inline_style('maxi-blocks-sc-vars', $vars);
            }
        }

        if (!wp_style_is('maxi-blocks-sc-styles', 'registered')) {
            $styles = $this->get_style_card_styles();

            // MVP: ensure no margin-bottom for button
            if (str_contains($styles, 'margin-bottom: var(--maxi-light-button-margin-bottom-general);')) {
                $styles = str_replace('margin-bottom: var(--maxi-light-button-margin-bottom-general);', '', $styles);
            }

            // SC styles
            if ($styles) {
                wp_register_style('maxi-blocks-sc-styles', false, [], MAXI_PLUGIN_VERSION);
                wp_enqueue_style('maxi-blocks-sc-styles');
                wp_add_inline_style('maxi-blocks-sc-styles', $styles);
            }
        }
    }

    public function get_style_card_object_from_db()
    {
        global $wpdb;
        $style_card = maybe_unserialize(
            $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                    'sc_string'
                )
            )
        );

        if (!$style_card) {
            $this->add_default_maxi_blocks_sc_string();
            $style_card = maybe_unserialize(
                $wpdb->get_var(
                    $wpdb->prepare(
                        "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                        'sc_string'
                    )
                )
            );
        }

        return $style_card;
    }

    public function add_default_maxi_blocks_sc_string()
    {
        global $wpdb;
        global $default_sc_string;
        // Include the default SC string from the specified path
        require_once MAXI_PLUGIN_DIR_PATH . 'core/defaults/sc_defaults.php';

        $wpdb->insert("{$wpdb->prefix}maxi_blocks_general", array(
            'id' => 'sc_string',
            'object' => serialize($default_sc_string),
        ));
    }

    /**
     * Process custom colors from style cards and add them to the CSS variables
     *
     * @param string $style The CSS variables string
     * @param array|string $style_card_obj The style card object or JSON string
     * @return string The modified CSS variables string with custom colors
     */
    public function process_custom_colors($style, $style_card_obj)
    {
        // If style is empty or not a string, return it as is
        if (empty($style) || !is_string($style)) {
            return $style;
        }

        // Check if style_card_obj is a string (JSON), convert it to array
        if (is_string($style_card_obj)) {
            $style_card_obj = json_decode($style_card_obj, true);

            // If JSON decoding failed, return the original style
            if (json_last_error() !== JSON_ERROR_NONE || !is_array($style_card_obj)) {
                return $style;
            }
        }

        // If it's still not an array after potential conversion, return the original style
        if (!is_array($style_card_obj)) {
            return $style;
        }

        // Get the active style card
        $active_style_card = null;

        foreach ($style_card_obj as $key => $value) {
            if (is_array($value) && isset($value['status']) && $value['status'] === 'active') {
                $active_style_card = $value;
                break;
            }
        }

        if (!$active_style_card) {
            // If no active card found, use the first one as fallback
            $first_key = array_key_first($style_card_obj);
            $active_style_card = $style_card_obj[$first_key] ?? null;

            // If still no active card, return original style
            if (!$active_style_card) {
                return $style;
            }
        }

        // Extract custom colors from the active style card
        $custom_colors = [];

        // Try to get custom colors from various possible locations
        if (isset($active_style_card['light']['styleCard']['color']['customColors']) &&
            is_array($active_style_card['light']['styleCard']['color']['customColors'])) {
            $custom_colors['light'] = $active_style_card['light']['styleCard']['color']['customColors'];
        }

        if (isset($active_style_card['dark']['styleCard']['color']['customColors']) &&
            is_array($active_style_card['dark']['styleCard']['color']['customColors'])) {
            $custom_colors['dark'] = $active_style_card['dark']['styleCard']['color']['customColors'];
        }

        if (isset($active_style_card['color']['customColors'])) {
            // Handle both string and array formats for backward compatibility
            $base_custom_colors = $active_style_card['color']['customColors'];

            // If it's a string, try to decode it (sometimes it's double-encoded)
            if (is_string($base_custom_colors)) {
                $decoded = json_decode($base_custom_colors, true);
                if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                    $base_custom_colors = $decoded;
                }
            }

            // If we now have an array, use it
            if (is_array($base_custom_colors)) {
                // If we don't have specific light/dark colors, use the general ones for both
                if (empty($custom_colors['light'])) {
                    $custom_colors['light'] = $base_custom_colors;
                }
                if (empty($custom_colors['dark'])) {
                    $custom_colors['dark'] = $base_custom_colors;
                }
            }
        }

        // If no custom colors found in any location, return the original style
        if (empty($custom_colors)) {
            return $style;
        }

        // Find the position to insert the custom colors
        $insert_pos = strrpos($style, '}');
        if ($insert_pos === false) {
            $insert_pos = strlen($style);
        }

        // Build the custom colors CSS variables
        $custom_color_vars = '';

        // Process light style custom colors
        if (!empty($custom_colors['light'])) {
            foreach ($custom_colors['light'] as $index => $color_value) {
                if (empty($color_value)) continue; // Skip empty colors

                // Extract RGB values if it's an rgba format
                $rgb_values = $this->extract_rgb_values($color_value);
                $numeric_id = 1000 + $index;

                // Add the CSS variable
                $custom_color_vars .= "--maxi-light-color-{$numeric_id}:{$rgb_values};";
            }
        }

        // Process dark style custom colors
        if (!empty($custom_colors['dark'])) {
            foreach ($custom_colors['dark'] as $index => $color_value) {
                if (empty($color_value)) continue; // Skip empty colors

                // Extract RGB values if it's an rgba format
                $rgb_values = $this->extract_rgb_values($color_value);
                $numeric_id = 1000 + $index;

                // Add the CSS variable
                $custom_color_vars .= "--maxi-dark-color-{$numeric_id}:{$rgb_values};";
            }
        }

        // Insert the custom colors before the closing brace
        $modified_style = substr_replace($style, $custom_color_vars, $insert_pos, 0);

        return $modified_style;
    }

    /**
     * Extract RGB values from a color string
     *
     * @param string|array $color_data The color string (rgba, hex, etc.) or an array like ['value' => 'color_string', 'name' => '...']
     * @return string The RGB values as a comma-separated string (e.g., "255, 255, 255")
     */
    private function extract_rgb_values($color_data)
    {
        $color_string_to_parse = null;

        // Check if input is the new array format {value: "...", name: "..."}
        if (is_array($color_data) && isset($color_data['value'])) {
            $color_string_to_parse = $color_data['value'];
        } elseif (is_string($color_data)) {
            $color_string_to_parse = $color_data;
        }

        // If after potential extraction, $color_string_to_parse is not a string or is empty (per PHP's empty() rules)
        if (empty($color_string_to_parse)) {
            return "0, 0, 0";
        }

        // At this point, $color_string_to_parse is a non-empty string.
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
            // The function is expected to return R,G,B components.
            return "0, 0, 0";
        }
    }

    /**
     * Get SC
     */
    public function get_style_card_variables()
    {
        $style_card = $this->get_style_card_object_from_db();

        if (!$style_card) {
            if (isset($GLOBALS['default_sc_variables_string'])) {
                return $GLOBALS['default_sc_variables_string'];
            }

            return false;
        }

        if (!array_key_exists('_maxi_blocks_style_card', $style_card)) {
            $style_card['_maxi_blocks_style_card'] =
                $style_card['_maxi_blocks_style_card_preview'];
        }

        $style =
            is_preview() || is_admin()
                ? $style_card['_maxi_blocks_style_card_preview']
                : $style_card['_maxi_blocks_style_card'];

        if (!$style || empty($style)) {
            $style =
                is_preview() || is_admin() // If one fail, let's test the other one!
                    ? $style_card['_maxi_blocks_style_card']
                    : $style_card['_maxi_blocks_style_card_preview'];
        }

        if (!$style || empty($style) || $style === ':root{--maxi-active-sc-color:0,0,0;}') { // ':root{--maxi-active-sc-color:0,0,0;}' is the default value
            if (isset($GLOBALS['default_sc_variables_string'])) {
                return $GLOBALS['default_sc_variables_string'];
            }

            return false;
        }

        // Process and add custom colors to the style variables
        $current_style_cards = self::get_maxi_blocks_current_style_cards();

        // Only process custom colors if current_style_cards is available
        if ($current_style_cards) {
            $style = $this->process_custom_colors($style, $current_style_cards);
        }

        return $style;
    }

    public function get_style_card_styles()
    {
        $style_card = $this->get_style_card_object_from_db();

        if (!$style_card) {
            if (isset($GLOBALS['default_sc_styles_string'])) {
                return $GLOBALS['default_sc_styles_string'];
            }

            return false;
        }

        if (
            !array_key_exists('_maxi_blocks_style_card_styles', $style_card) &&
            array_key_exists('_maxi_blocks_style_card_styles_preview', $style_card)
        ) {
            $style_card['_maxi_blocks_style_card_styles'] =
                $style_card['_maxi_blocks_style_card_styles_preview'];
        }

        if (
            !array_key_exists('_maxi_blocks_style_card_styles', $style_card) &&
            !array_key_exists('_maxi_blocks_style_card_styles_preview', $style_card)
        ) {
            if (isset($GLOBALS['default_sc_styles_string'])) {
                return $GLOBALS['default_sc_styles_string'];
            }

            return false;
        }

        $sc_variables =
            is_preview() || is_admin()
                ? $style_card['_maxi_blocks_style_card_styles_preview']
                : $style_card['_maxi_blocks_style_card_styles'];

        if (!$sc_variables || empty($sc_variables)) {
            $sc_variables =
                is_preview() || is_admin() // If one fail, let's test the other one!
                    ? $style_card['_maxi_blocks_style_card_styles']
                    : $style_card['_maxi_blocks_style_card_styles_preview'];
        }

        if (!$sc_variables || empty($sc_variables)) {
            if (isset($GLOBALS['default_sc_styles_string'])) {
                return $GLOBALS['default_sc_styles_string'];
            }

            return false;
        }

        return $sc_variables;
    }

    public static function get_maxi_blocks_current_style_cards()
    {
        global $wpdb;

        // Check if table exists
        $table_name = $wpdb->prefix . 'maxi_blocks_general';

        // Prepare the query safely
        $table_exists = $wpdb->get_var(
            $wpdb->prepare(
                "SHOW TABLES LIKE %s",
                $table_name
            )
        );

        if ($table_exists != $table_name) {
            // Table doesn't exist
            return false;
        }

        $maxi_blocks_style_cards_current =
            $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                    'style_cards_current'
                )
            );

        if (
            $maxi_blocks_style_cards_current &&
            !empty($maxi_blocks_style_cards_current)
        ) {
            // Validate that it's a JSON string
            $decoded = json_decode($maxi_blocks_style_cards_current, true);

            // If it's valid JSON and an array, return the decoded array (more useful than string)
            if (json_last_error() === JSON_ERROR_NONE && is_array($decoded)) {
                // Process the style cards to ensure all custom colors are properly handled
                foreach ($decoded as $key => $card) {
                    // Make sure color object exists in each style card
                    if (!isset($card['color'])) {
                        $decoded[$key]['color'] = array();
                    }

                    // Copy custom colors from light/dark to root if they exist there but not in root
                    if ((!isset($card['color']['customColors']) || empty($card['color']['customColors'])) &&
                        (isset($card['light']['styleCard']['color']['customColors']) ||
                         isset($card['dark']['styleCard']['color']['customColors']))) {

                        $decoded[$key]['color']['customColors'] =
                            isset($card['light']['styleCard']['color']['customColors']) ?
                            $card['light']['styleCard']['color']['customColors'] :
                            $card['dark']['styleCard']['color']['customColors'];
                    }

                    // Ensure light has custom colors if they exist at root level
                    if (isset($card['color']['customColors']) &&
                        (!isset($card['light']['styleCard']['color']) ||
                         !isset($card['light']['styleCard']['color']['customColors']))) {

                        if (!isset($card['light']['styleCard']['color'])) {
                            $decoded[$key]['light']['styleCard']['color'] = array();
                        }

                        $decoded[$key]['light']['styleCard']['color']['customColors'] = $card['color']['customColors'];
                    }

                    // Ensure dark has custom colors if they exist at root level
                    if (isset($card['color']['customColors']) &&
                        (!isset($card['dark']['styleCard']['color']) ||
                         !isset($card['dark']['styleCard']['color']['customColors']))) {

                        if (!isset($card['dark']['styleCard']['color'])) {
                            $decoded[$key]['dark']['styleCard']['color'] = array();
                        }

                        $decoded[$key]['dark']['styleCard']['color']['customColors'] = $card['color']['customColors'];
                    }
                }

                // Re-encode as this function is expected to return a JSON string
                return json_encode($decoded);
            } else if (json_last_error() !== JSON_ERROR_NONE) {
                // If not valid JSON, return default style card instead
                return self::get_default_style_card();
            }

            // If it's valid but not an array, return as is
            return $maxi_blocks_style_cards_current;
        } else {
            $default_style_card = self::get_default_style_card();

            $wpdb->replace($wpdb->prefix . "maxi_blocks_general", [
                'id' => 'style_cards_current',
                'object' => $default_style_card
            ]);

            $maxi_blocks_style_cards_current = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                    'style_cards_current'
                )
            );

            // Validate the retrieved default style card is valid JSON
            if ($maxi_blocks_style_cards_current) {
                $decoded = json_decode($maxi_blocks_style_cards_current, true);
                if (json_last_error() !== JSON_ERROR_NONE || !is_array($decoded)) {
                    return false;
                }
            }

            return $maxi_blocks_style_cards_current;
        }
    }

    public static function get_maxi_blocks_active_style_card()
    {
        $maxi_blocks_style_cards = self::get_maxi_blocks_current_style_cards();

        if (!$maxi_blocks_style_cards) {
            return false;
        }

        // If it's already an array, use it directly
        if (is_array($maxi_blocks_style_cards)) {
            $maxi_blocks_style_cards_array = $maxi_blocks_style_cards;
        } else {
            // Otherwise, decode the JSON string
            $maxi_blocks_style_cards_array = json_decode(
                $maxi_blocks_style_cards,
                true
            );

            // Check if decoding was successful
            if (json_last_error() !== JSON_ERROR_NONE || !is_array($maxi_blocks_style_cards_array)) {
                return false;
            }
        }

        // Find the active style card
        $active_sc = null;
        foreach ($maxi_blocks_style_cards_array as $key => $sc) {
            if (is_array($sc) && isset($sc['status']) && $sc['status'] === 'active') {
                $active_sc = $sc;
                break;
            }
        }

        // If no active card found, use the first one as fallback
        if (!$active_sc && !empty($maxi_blocks_style_cards_array)) {
            $first_key = array_key_first($maxi_blocks_style_cards_array);
            $active_sc = $maxi_blocks_style_cards_array[$first_key] ?? false;
        }

        if (!$active_sc) {
            return false;
        }

        // Ensure custom colors are properly distributed across all locations for consistency
        // First, collect all custom colors from all locations
        $custom_colors = [];

        // Check root level
        if (isset($active_sc['color']['customColors']) && is_array($active_sc['color']['customColors'])) {
            $custom_colors = $active_sc['color']['customColors'];
        }

        // Check light style
        if (isset($active_sc['light']['styleCard']['color']['customColors']) && is_array($active_sc['light']['styleCard']['color']['customColors'])) {
            if (empty($custom_colors)) {
                $custom_colors = $active_sc['light']['styleCard']['color']['customColors'];
            }
        }

        // Check dark style
        if (isset($active_sc['dark']['styleCard']['color']['customColors']) && is_array($active_sc['dark']['styleCard']['color']['customColors'])) {
            if (empty($custom_colors)) {
                $custom_colors = $active_sc['dark']['styleCard']['color']['customColors'];
            }
        }

        // If we found custom colors, ensure they're in all locations
        if (!empty($custom_colors)) {
            // Root level
            if (!isset($active_sc['color'])) {
                $active_sc['color'] = [];
            }
            $active_sc['color']['customColors'] = $custom_colors;

            // Light style
            if (!isset($active_sc['light']['styleCard']['color'])) {
                if (!isset($active_sc['light']['styleCard'])) {
                    $active_sc['light']['styleCard'] = [];
                }
                $active_sc['light']['styleCard']['color'] = [];
            }
            $active_sc['light']['styleCard']['color']['customColors'] = $custom_colors;

            // Dark style
            if (!isset($active_sc['dark']['styleCard']['color'])) {
                if (!isset($active_sc['dark']['styleCard'])) {
                    $active_sc['dark']['styleCard'] = [];
                }
                $active_sc['dark']['styleCard']['color'] = [];
            }
            $active_sc['dark']['styleCard']['color']['customColors'] = $custom_colors;
        }

        return $active_sc;
    }

    public static function get_maxi_blocks_style_card_fonts($block_style, $text_level)
    {
        $maxi_blocks_style_cards = (object) self::get_maxi_blocks_active_style_card();
        $block_style_values = (object) $maxi_blocks_style_cards->$block_style;
        $default_values = $block_style_values->defaultStyleCard;
        $values = $block_style_values->styleCard;

        $style_card_values = (object) array_merge(
            (array) $default_values,
            (array) $values
        );

        $text_level_values = (object) $style_card_values->$text_level;

        if (!property_exists($text_level_values, 'font-family-general')) {
            $text_level_values = (object) $default_values[$text_level];
        }

        $font = $text_level_values->{'font-family-general'} ?? null;

        /**
         * Button case has an exception for font-family. If it's empty, it will use the
         * font-family of the paragraph text level.
         */
        if ($text_level === 'button' && (empty($font) || empty(str_replace('"', '', $font)) || str_contains($font, 'undefined'))) {
            $font = $style_card_values->p['font-family-general'] ?? $default_values['p']['font-family-general'];
        }

        $font_weights = [];
        $font_styles = [];

        foreach ($text_level_values as $key => $value) {
            if (strpos($key, 'font-weight') !== false) {
                $font_weights[] = $value;
            }
            if (strpos($key, 'font-style') !== false) {
                $font_styles[] = $value;
            }
        }

        return [$font, $font_weights, $font_styles];
    }

    public static function get_style_cards_values($sc_props, $block_style, $sc_entry)
    {
        $style_card = self::get_maxi_blocks_active_style_card();

        $get_sc_value = function ($target) use ($style_card, $block_style, $sc_entry) {
            $styleCardEntry = [$style_card[$block_style]['defaultStyleCard'][$sc_entry]];

            if (isset($style_card[$block_style]['styleCard'][$sc_entry])) {
                $styleCardEntry = array_merge(
                    $styleCardEntry,
                    $style_card[$block_style]['styleCard'][$sc_entry]
                );
            }

            $value = $styleCardEntry[$target] ?? null;

            return get_is_valid($value, true) ? $value : false;
        };

        if (is_string($sc_props)) {
            return $get_sc_value($sc_props);
        }

        $response = [];

        foreach ($sc_props as $target) {
            $response[$target] = $get_sc_value($target);
        }

        return $response;
    }

    /**
     * Gets a SC property value by block style and, property and name
     *
     * @param string $block_style
     * @param string $property
     * @param string $name
     */
    public static function get_active_style_cards_value_by_name($block_style, $property, $name)
    {
        $style_card = self::get_maxi_blocks_active_style_card();

        if (isset($style_card[$block_style]['styleCard'][$property][$name])) {
            return $style_card[$block_style]['styleCard'][$property][$name];
        } elseif (isset($style_card[$block_style]['defaultStyleCard'][$property][$name])) {
            return $style_card[$block_style]['defaultStyleCard'][$property][$name];
        } else {
            return null;
        }

    }

    public static function get_default_style_card()
    {
        $file_path = MAXI_PLUGIN_DIR_PATH . "core/defaults/defaultSC.json";

        // First try direct file reading
        if (file_exists($file_path) && is_readable($file_path)) {
            $json = file_get_contents($file_path);
            if ($json !== false) {
                return $json;
            }
        }

        // Fallback to WP_Filesystem if direct reading fails
        global $wp_filesystem;

        if (empty($wp_filesystem)) {
            require_once ABSPATH . '/wp-admin/includes/file.php';
            WP_Filesystem(false, false, true); // Initialize without credentials check
        }

        // If WP_Filesystem is still not available, return null
        if (empty($wp_filesystem)) {
            return null;
        }

        // Ensure the file exists before attempting to read
        if (!$wp_filesystem->exists($file_path)) {
            return null;
        }

        $json = $wp_filesystem->get_contents($file_path);

        return $json;
    }

    public static function migrate_style_cards_link_palette_color()
    {
        global $wpdb;

        $maxi_blocks_style_cards_current = self::get_maxi_blocks_current_style_cards();

        if (!$maxi_blocks_style_cards_current) {
            return false;
        }

        $style_cards = json_decode($maxi_blocks_style_cards_current, true);
        $updated = false;
        $sc_maxi_active = false;

        foreach ($style_cards as $key => $sc) {
            if (isset($sc['dark']['defaultStyleCard']['link']['link-palette-color']) && $sc['dark']['defaultStyleCard']['link']['link-palette-color'] == 5) {
                $style_cards[$key]['dark']['defaultStyleCard']['link']['link-palette-color'] = 4;
                $updated = true;
            }
            if (isset($sc['light']['defaultStyleCard']['link']['link-palette-color']) && $sc['light']['defaultStyleCard']['link']['link-palette-color'] == 5) {
                $style_cards[$key]['light']['defaultStyleCard']['link']['link-palette-color'] = 4;
                $updated = true;
            }
            if ($key === 'sc_maxi' && isset($sc['status']) && $sc['status'] === 'active') {
                $sc_maxi_active = true;
            }
        }

        if ($updated) {
            $updated_style_cards = json_encode($style_cards);
            $wpdb->update(
                $wpdb->prefix . "maxi_blocks_general",
                ['object' => $updated_style_cards],
                ['id' => 'style_cards_current']
            );
        }

        // Migrate sc_string if sc_maxi is active
        if ($sc_maxi_active) {
            $sc_string = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT object FROM {$wpdb->prefix}maxi_blocks_general WHERE id = %s",
                    'sc_string'
                )
            );

            if ($sc_string) {
                $sc_string = maybe_unserialize($sc_string);

                // Replace dark link color
                $sc_string = str_replace(
                    '--maxi-dark-link:rgba(var(--maxi-dark-color-5,255,255,255),1);',
                    '',
                    $sc_string
                );

                $sc_string = str_replace(
                    '--maxi-dark-link:rgba(var(--maxi-dark-color-4,255,74,23),1);',
                    '',
                    $sc_string
                );

                // Replace light link color
                $sc_string = str_replace(
                    '--maxi-light-link:rgba(var(--maxi-light-color-5,0,0,0),1);',
                    '',
                    $sc_string
                );

                $sc_string = str_replace(
                    '--maxi-light-link:rgba(var(--maxi-light-color-4,255,74,23),1);',
                    '',
                    $sc_string
                );

                $wpdb->update(
                    $wpdb->prefix . "maxi_blocks_general",
                    ['object' => serialize($sc_string)],
                    ['id' => 'sc_string']
                );

                $updated = true;

            }
        }

        return $updated;
    }

    public function run_link_palette_migration()
    {
        // Check if migration has already been run
        if (get_option('maxi_blocks_link_color_migrated') !== 'yes') {
            self::migrate_style_cards_link_palette_color();
            update_option('maxi_blocks_link_color_migrated', 'yes');
        }
    }
}
