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

        // Re-use the centralized helper - it already performs all validations
        $active_style_card = self::get_maxi_blocks_active_style_card();

        // Bail out early when no active card is available
        if (!$active_style_card) {
            return $style;
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
            foreach ($custom_colors['light'] as $color_object) {
                if (empty($color_object) || !is_array($color_object) || !isset($color_object['id']) || !isset($color_object['value'])) {
                    continue; // Skip if malformed or missing id/value
                }

                $rgb_values = $this->extract_rgb_values($color_object['value']);
                $numeric_id = $color_object['id'];

                // Add the CSS variable
                $custom_color_vars .= "--maxi-light-color-{$numeric_id}:{$rgb_values};";
            }
        }

        // Process dark style custom colors
        if (!empty($custom_colors['dark'])) {
            foreach ($custom_colors['dark'] as $color_object) {
                if (empty($color_object) || !is_array($color_object) || !isset($color_object['id']) || !isset($color_object['value'])) {
                    continue; // Skip if malformed or missing id/value
                }

                $rgb_values = $this->extract_rgb_values($color_object['value']);
                $numeric_id = $color_object['id'];

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
        // Include the utility class if not already loaded
        require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/class-maxi-color-utils.php';

        // Use the shared implementation from the utility class
        return MaxiBlocks_ColorUtils::extract_rgb_values($color_data);
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

                        // Ensure all parent keys exist before writing
                        if (!isset($decoded[$key]['light'])) {
                            $decoded[$key]['light'] = array();
                        }
                        if (!isset($decoded[$key]['light']['styleCard'])) {
                            $decoded[$key]['light']['styleCard'] = array();
                        }
                        if (!isset($decoded[$key]['light']['styleCard']['color'])) {
                            $decoded[$key]['light']['styleCard']['color'] = array();
                        }

                        $decoded[$key]['light']['styleCard']['color']['customColors'] = $card['color']['customColors'];
                    }

                    // Ensure dark has custom colors if they exist at root level
                    if (isset($card['color']['customColors']) &&
                        (!isset($card['dark']['styleCard']['color']) ||
                         !isset($card['dark']['styleCard']['color']['customColors']))) {

                        // Ensure all parent keys exist before writing
                        if (!isset($decoded[$key]['dark'])) {
                            $decoded[$key]['dark'] = array();
                        }
                        if (!isset($decoded[$key]['dark']['styleCard'])) {
                            $decoded[$key]['dark']['styleCard'] = array();
                        }
                        if (!isset($decoded[$key]['dark']['styleCard']['color'])) {
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
            if (!isset($active_sc['light'])) {
                $active_sc['light'] = [];
            }
            if (!isset($active_sc['light']['styleCard'])) {
                $active_sc['light']['styleCard'] = [];
            }
            if (!isset($active_sc['light']['styleCard']['color'])) {
                $active_sc['light']['styleCard']['color'] = [];
            }
            $active_sc['light']['styleCard']['color']['customColors'] = $custom_colors;

            // Dark style
            if (!isset($active_sc['dark'])) {
                $active_sc['dark'] = [];
            }
            if (!isset($active_sc['dark']['styleCard'])) {
                $active_sc['dark']['styleCard'] = [];
            }
            if (!isset($active_sc['dark']['styleCard']['color'])) {
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

    /**
     * Helper function to get WP native styles
     */
    private static function get_wp_native_styles($organized_values, $style_card, $prefix, $style, $is_backend = false)
    {
        $response = '';
        $native_wp_prefix = $is_backend ? 'wp-block[data-type^="core/"]' : 'maxi-block--use-sc';
        $headings = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        $levels = array_merge(['p'], $headings);
        $breakpoints = [
            'xxl' => 1921,
            'xl' => 1920,
            'l' => 1366,
            'm' => 1024,
            's' => 767,
            'xs' => 480,
        ];
        $breakpoint_keys = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

        $add_styles_by_breakpoint = function ($breakpoint, $second_prefix = '') use (
            $organized_values,
            $prefix,
            $style,
            $levels,
            $native_wp_prefix,
            $headings,
            $style_card
        ) {
            $added_response = '';

            $breakpoint_level_sentences = self::get_sentences_by_breakpoint([
                'organized_values' => $organized_values,
                'style' => $style,
                'breakpoint' => $breakpoint,
                'targets' => $levels,
            ]);

            foreach ($breakpoint_level_sentences as $level => $sentences) {
                // Remove margin-bottom sentences
                $margin_sentence = null;
                foreach ($sentences as $key => $sentence) {
                    if (strpos($sentence, 'margin-bottom') !== false) {
                        $margin_sentence = $sentence;
                        unset($sentences[$key]);
                        break;
                    }
                }

                // Build selectors with level included
                $selectors = [
                    "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} {$level}",
                    "{$prefix} {$second_prefix} .maxi-{$style} {$level}.{$native_wp_prefix}",
                    "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} {$level} a",
                    "{$prefix} {$second_prefix} .maxi-{$style} {$level}.{$native_wp_prefix} a",
                ];

                // Add paragraph-specific selectors
                if ($level === 'p') {
                    $p_selectors = [
                        "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} div:has(> a, > time > a):not(.wp-element-button):not(.wp-block-navigation-item):not(.maxi-group-block)",
                        "{$prefix} {$second_prefix} .maxi-{$style} .wp-block-comments div:not(.wp-element-button):not(.wp-block-navigation-item):not(.maxi-group-block)",
                        "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-block-post-comments-form .comment-form textarea",
                        "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-block-post-comments-form .comment-form p:not(.form-submit) input",
                        "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-block-post-comments-form .comment-reply-title small a",
                        "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix}.wp-block-post-comments-form .comment-form textarea",
                        "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix}.wp-block-post-comments-form .comment-form p:not(.form-submit) input",
                        "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix}.wp-block-post-comments-form .comment-reply-title small a",
                        "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix}.wp-block-post-navigation-link a",
                        "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix}.wp-block-query-pagination-previous",
                        "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix}.wp-block-query-pagination-next",
                        "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix}.wp-block-query-pagination-numbers a",
                        "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix}.wp-block-query-pagination-numbers span",
                    ];
                    $selectors = array_merge($selectors, $p_selectors);

                    // Fix for .has-small-font-size
                    $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .wp-block-comments div:has(> a, > time > a):not(.wp-element-button):not(.wp-block-navigation-item):not(.maxi-group-block).has-small-font-size {font-size: inherit !important;}";
                    $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .wp-block-comments div:not(.wp-element-button):not(.wp-block-navigation-item):not(.maxi-group-block).has-small-font-size {font-size: inherit !important;}";
                }

                $added_response .= implode(', ', array_filter($selectors)) . " {" . implode(' ', $sentences) . "}";

                // Add margin-bottom sentence to all elements except the last one
                if ($margin_sentence) {
                    $added_response .= ":is(" . implode(', ', array_filter($selectors)) . "):not(:last-child) {" . $margin_sentence . "}";
                }

                // Add this after the main selectors in get_wp_native_styles
                if ($level === 'p') {
                    $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} li.{$native_wp_prefix} {" . implode(' ', $sentences) . "}";
                }

                // Add this after list styles
                if ($level === 'p' && $style === 'light') {
                    $added_response .= "{$prefix} {$second_prefix} p > span[data-rich-text-placeholder]::after {" . implode(' ', $sentences) . "}";
                }

                // Add this after rich text placeholder styles
                if ($level === 'h1' && $style === 'light') {
                    $added_response .= "{$prefix} .editor-editor-canvas__post-title-wrapper > h1.editor-post-title {" . implode(' ', $sentences) . "}";
                }
            }

            // WP native block when has link
            $wp_native_link_prefix = "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} a";
            foreach (['', ' span'] as $suffix) {
                $added_response .= "{$wp_native_link_prefix}{$suffix} { color: var(--maxi-{$style}-link); }";
                if (isset($style_card["--maxi-{$style}-link-hover"])) {
                    $added_response .= "{$wp_native_link_prefix}{$suffix}:hover { color: var(--maxi-{$style}-link-hover); }";
                    $added_response .= "{$wp_native_link_prefix}{$suffix}:focus { color: var(--maxi-{$style}-link-hover); }";
                }
                if (isset($style_card["--maxi-{$style}-link-active"])) {
                    $added_response .= "{$wp_native_link_prefix}{$suffix}:active { color: var(--maxi-{$style}-link-active); }";
                }
                if (isset($style_card["--maxi-{$style}-link-visited"])) {
                    $added_response .= "{$wp_native_link_prefix}{$suffix}:visited { color: var(--maxi-{$style}-link-visited); }";
                    if (isset($style_card["--maxi-{$style}-link-hover"])) {
                        $added_response .= "{$wp_native_link_prefix}{$suffix}:visited:hover { color: var(--maxi-{$style}-link-hover); }";
                    }
                }
            }

            // General color
            $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix}, {$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-block-post-comments-form .comment-reply-title small {
                color: var(--maxi-{$style}-p-color,rgba(var(--maxi-{$style}-color-3,155,155,155),1));
            }";

            // Headings color
            foreach ($headings as $heading) {
                $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} {$heading}.{$native_wp_prefix}, {$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} {$heading} {
                    color: var(--maxi-{$style}-{$heading}-color,rgba(var(--maxi-{$style}-color-5,0,0,0),1));
                }";
            }

            // Button color
            $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-element-button {
                background: var(--maxi-{$style}-button-background-color,rgba(var(--maxi-{$style}-color-4,255,74,23),1));
            }";

            if (isset($style_card["--maxi-{$style}-button-background-color-hover"])) {
                $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-element-button:hover {
                    background: var(--maxi-{$style}-button-background-color-hover);
                }";
            }

            // Remove form textarea background
            $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-block-post-comments-form .comment-form textarea {
                background: transparent;
                color: inherit;
                max-width: 100%;
            }";

            $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix}.wp-block-post-comments-form .comment-form textarea {
                background: transparent;
                color: inherit;
                max-width: 100%;
            }";

            // Remove form input background
            $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-block-post-comments-form .comment-form p:not(.form-submit) input {
                background: transparent;
                color: inherit;
                max-width: 100%;
            }";

            $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix}.wp-block-post-comments-form .comment-form p:not(.form-submit) input {
                background: transparent;
                color: inherit;
                max-width: 100%;
            }";

            // Add this after headings color styles
            $added_response .= "{$prefix} .editor-editor-canvas__post-title-wrapper > h1.editor-post-title {
                color: var(--maxi-light-h1-color,rgba(var(--maxi-light-color-5,0,0,0),1));
            }";

            return $added_response;
        };

        // Add styles for all breakpoints
        $response .= $add_styles_by_breakpoint('general');

        foreach ($breakpoints as $breakpoint => $value) {
            if ($is_backend) {
                $response .= $add_styles_by_breakpoint(
                    $breakpoint,
                    ".edit-post-visual-editor[maxi-blocks-responsive=\"{$breakpoint}\"]"
                );
            } else {
                $response .= "@media (" . ($breakpoint !== 'xxl' ? 'max' : 'min') . "-width: {$value}px) {";
                $response .= $add_styles_by_breakpoint($breakpoint);
                $response .= '}';
            }
        }

        return $response;
    }

    public static function maxi_import_sc($sc_content)
    {
        if ($sc_content) {
            global $wpdb;

            // Get default SC
            $default_sc = json_decode(self::get_default_style_card(), true);
            $default_maxi_sc = $default_sc['sc_maxi'];

            // Try to decode once
            $first_decode = json_decode($sc_content, true);

            // If still a string, try second decode
            if (is_string($first_decode)) {
                $imported_sc = json_decode($first_decode, true);
            } else {
                $imported_sc = $first_decode;
            }

            // If still not an array, check for JSON errors
            if (!is_array($imported_sc)) {
                return false;
            }

            // Deep merge default with imported
            $new_sc = array_replace_recursive($default_maxi_sc, $imported_sc);

            // Get current style cards
            $current_style_cards = json_decode(
                self::get_maxi_blocks_current_style_cards(),
                true
            );

            // Get the base name from the imported SC
            $base_name = $new_sc['name'] ?? 'Style Card';
            $name = $base_name;
            $counter = 1;

            // Check for existing names and increment counter if needed
            while (self::sc_name_exists($current_style_cards, $name)) {
                $counter++;
                $name = $base_name . '-' . $counter;
            }

            // Update the SC name
            $new_sc['name'] = $name;

            // Generate new SC ID
            $new_id = 'sc_' . time();

            // Set all cards as inactive
            foreach ($current_style_cards as &$card) {
                $card['status'] = '';
            }

            // Add new card to collection
            $current_style_cards[$new_id] = $new_sc;
            $current_style_cards[$new_id]['status'] = 'active';

            // Save updated style cards collection
            $wpdb->replace(
                "{$wpdb->prefix}maxi_blocks_general",
                array(
                    'id' => 'style_cards_current',
                    'object' => wp_json_encode($current_style_cards)
                )
            );

            // Use the proper organized values processing that handles all properties correctly
            $organized_values = self::get_organized_values($new_sc);

            // Generate CSS variables string
            $var_sc_string = ':root{';

            // Add default margin-bottom for text elements
            $text_elements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
            $styles = ['light', 'dark'];

            foreach ($styles as $style) {
                foreach ($text_elements as $element) {
                    $margin_key = "margin-bottom-general";
                    // Only add default if the margin-bottom is not already set
                    if (!isset($organized_values[$style][$element]['general']['margin-bottom'])) {
                        $var_name = "--maxi-{$style}-{$element}-{$margin_key}";
                        $var_sc_string .= "{$var_name}:20px;";
                    }
                }
            }

            // Continue with existing organized values
            foreach ($organized_values as $style => $style_data) {
                foreach ($style_data as $element => $element_data) {
                    if ($element === 'color') {
                        foreach ($element_data as $color_number => $color_value) {
                            $var_name = "--maxi-{$style}-color-{$color_number}";
                            $value = is_array($color_value) ? $color_value['value'] : $color_value;
                            $var_sc_string .= "{$var_name}:{$value};";
                        }
                        continue;
                    }

                    if ($element === 'menu') {
                        foreach ($element_data as $menu_prop => $menu_value) {
                            $var_name = $menu_value['var_name'];
                            $value = $menu_value['value'];
                            $var_sc_string .= "{$var_name}:{$value};";
                        }
                        continue;
                    }

                    foreach ($element_data as $breakpoint => $breakpoint_data) {
                        foreach ($breakpoint_data as $setting => $value) {
                            if (is_array($value)) {
                                $var_name = $value['var_name'] ?? "--maxi-{$style}-{$element}-{$setting}-{$breakpoint}";
                                $value = $value['value'];
                            } else {
                                $var_name = "--maxi-{$style}-{$element}-{$setting}-{$breakpoint}";
                            }
                            $var_sc_string .= "{$var_name}:{$value};";
                        }
                    }
                }
            }

            // Add active style card color
            $var_sc_string .= "--maxi-active-sc-color: 222, 36, 119;";

            $var_sc_string .= '}';

            // Generate styles string
            $styles_string = self::get_sc_styles($new_sc, true);

            $sc_string = array(
                '_maxi_blocks_style_card' => $var_sc_string,
                '_maxi_blocks_style_card_preview' => $var_sc_string,
                '_maxi_blocks_style_card_styles' => $styles_string,
                '_maxi_blocks_style_card_styles_preview' => $styles_string
            );

            // Save sc_string
            $wpdb->replace(
                "{$wpdb->prefix}maxi_blocks_general",
                array(
                    'id' => 'sc_string',
                    'object' => serialize($sc_string)
                )
            );

            return [
                'sc' => [
                    'success' => true,
                    'message' => sprintf(__('Style Card imported successfully as "%s"', 'maxi-blocks'), $name),
                    'id' => $new_id
                ]
            ];
        }
        return false;
    }

    /**
     * Helper function to check if a style card name already exists
     *
     * @param array $style_cards Array of existing style cards
     * @param string $name Name to check
     * @return boolean True if name exists, false otherwise
     */
    public static function sc_name_exists($style_cards, $name)
    {
        foreach ($style_cards as $card) {
            if (isset($card['name']) && $card['name'] === $name) {
                return true;
            }
        }
        return false;
    }

    private static function get_organized_values($style_card)
    {
        $organized_values = [];
        $styles = ['light', 'dark'];
        $elements = ['button', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'icon', 'divider', 'link', 'navigation'];
        $breakpoints_keys = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
        $settings = [
            'font-family',
            'font-size',
            'font-style',
            'font-weight',
            'line-height',
            'text-decoration',
            'text-transform',
            'letter-spacing',
            'white-space',
            'word-spacing',
            'text-indent',
            'margin-bottom',
            'padding-bottom',
            'padding-top',
            'padding-left',
            'padding-right',
        ];

        foreach ($styles as $style) {
            // Merge defaultStyleCard and styleCard for the current style using deep merge
            $style_data = array_replace_recursive(
                $style_card[$style]['defaultStyleCard'] ?? [],
                $style_card[$style]['styleCard'] ?? []
            );

            // Add default margin-bottom for text elements if not already set
            $text_elements = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
            foreach ($text_elements as $element) {
                $margin_key = "margin-bottom-general";

                // Only add default if the margin-bottom is not already set
                if (!isset($style_data[$element][$margin_key])) {
                    $organized_values[$style][$element]['general']['margin-bottom'] = [
                        'value' => '20px',
                        'var_name' => "--maxi-{$style}-{$element}-margin-bottom-general"
                    ];
                }
            }

            foreach ($elements as $element) {
                if (!isset($style_data[$element])) {
                    continue;
                }

                foreach ($settings as $setting) {
                    foreach ($breakpoints_keys as $breakpoint) {
                        $key = "{$setting}-{$breakpoint}";
                        $var_name = "--maxi-{$style}-{$element}-{$setting}-{$breakpoint}";

                        // Handle navigation styles differently
                        if ($element === 'navigation' && isset($style_data[$element][$breakpoint])) {
                            foreach ($style_data[$element][$breakpoint] as $prop => $value) {
                                $organized_values[$style][$element][$breakpoint][$prop] = [
                                    'value' => $value,
                                    'var_name' => "--maxi-{$style}-{$element}-{$prop}-{$breakpoint}"
                                ];
                            }
                        }
                                                // Handle other elements
                        elseif (isset($style_data[$element][$key])) {
                            $value = $style_data[$element][$key];

                            // Add units if needed
                            if ($setting === 'font-family') {
                                // Special case for button: if font-family is empty, use p font-family
                                if ($element === 'button' && ($value === '' || $value === null)) {
                                    $p_font_family_key = "font-family-{$breakpoint}";
                                    $value = isset($style_data['p'][$p_font_family_key])
                                        ? $style_data['p'][$p_font_family_key]
                                        : '';
                                }
                                $value = "\"{$value}\"";
                            } elseif (in_array($setting, ['font-size', 'line-height', 'letter-spacing', 'word-spacing', 'margin-bottom', 'text-indent', 'padding-bottom', 'padding-top', 'padding-left', 'padding-right'])) {
                                if (is_numeric($value)) {
                                    // Check for unit specification
                                    $unit_key = "{$setting}-unit-{$breakpoint}";
                                    $unit = isset($style_data[$element][$unit_key]) ? $style_data[$element][$unit_key] : 'px';

                                    // Default to px if no unit is specified
                                    if ($unit === null || $unit === '') {
                                        $unit = 'px';
                                    }

                                    $value .= $unit;
                                }
                            }

                            $organized_values[$style][$element][$breakpoint][$setting] = [
                                'value' => $value,
                                'var_name' => $var_name
                            ];
                        }
                    }
                }
            }

            // Colors
            if (isset($style_data['color'])) {
                for ($i = 1; $i <= 8; $i++) {
                    if (isset($style_data['color'][$i])) {
                        $organized_values[$style]['color'][$i] = [
                            'value' => $style_data['color'][$i],
                            'var_name' => "--maxi-{$style}-color-{$i}"
                        ];
                    }
                }
            }

                        // Menu colors - generate navigation menu color variables
            if (isset($style_data['navigation'])) {
                // Get default navigation settings from $default_maxi_sc
                $default_navigation = $default_maxi_sc[$style]['defaultStyleCard']['navigation'] ?? [];

                $menu_color_mappings = [
                    'menu-item' => 'menu-item-palette-color',
                    'menu-burger' => 'menu-burger-palette-color',
                    'menu-item-hover' => 'menu-item-hover-palette-color',
                    'menu-item-current' => 'menu-item-current-palette-color',
                    'menu-item-visited' => 'menu-item-visited-palette-color',
                    'menu-item-sub-bg' => 'menu-item-sub-bg-palette-color',
                    'menu-item-sub-bg-hover' => 'menu-item-sub-bg-hover-palette-color',
                    'menu-mobile-bg' => 'menu-mobile-bg-palette-color'
                ];

                foreach ($menu_color_mappings as $menu_prop => $palette_key) {
                    // Get the palette color number from navigation settings or default
                    $palette_color = isset($style_data['navigation'][$palette_key])
                        ? $style_data['navigation'][$palette_key]
                        : ($default_navigation[$palette_key] ?? 5);

                    // Get the actual color value from the color palette or default
                    $color_value = isset($style_data['color'][$palette_color])
                        ? $style_data['color'][$palette_color]
                        : ($default_maxi_sc[$style]['defaultStyleCard']['color'][$palette_color] ?? '0,0,0');

                    $var_name = "--maxi-{$style}-{$menu_prop}";
                    $rgba_value = "rgba(var(--maxi-{$style}-color-{$palette_color},{$color_value}),1)";

                    $organized_values[$style]['menu'][$menu_prop] = [
                        'value' => $rgba_value,
                        'var_name' => $var_name
                    ];
                }
            }
        }

        return $organized_values;
    }

    private static function get_link_colors_string($args)
    {
        $organized_values = $args['organized_values'];
        $prefix = $args['prefix'];
        $style = $args['style'];

        $response = '';

        if (isset($organized_values[$style]['color'])) {
            for ($i = 1; $i <= 8; $i++) {
                $color_number = $i;

                if (isset($organized_values[$style]['color'][$color_number])) {
                    $link_types = ['link', 'link-hover', 'link-active', 'link-visited'];

                    foreach ($link_types as $type) {
                        $response .= "{$prefix} .maxi-{$style}.maxi-sc-{$style}-{$type}-color-{$color_number}.maxi-block--has-link { --maxi-{$style}-{$type}-palette: var(--maxi-{$style}-color-{$color_number});}";
                        $response .= "{$prefix} .maxi-{$style}.maxi-sc-{$style}-{$type}-color-{$color_number} a.maxi-block--has-link { --maxi-{$style}-{$type}-palette: var(--maxi-{$style}-color-{$color_number});}";
                        $response .= "{$prefix} .maxi-{$style} .maxi-sc-{$style}-{$type}-color-{$color_number}.maxi-block--has-link { --maxi-{$style}-{$type}-palette: var(--maxi-{$style}-color-{$color_number});}";
                        $response .= "{$prefix} .maxi-{$style} .maxi-sc-{$style}-{$type}-color-{$color_number} a.maxi-block--has-link { --maxi-{$style}-{$type}-palette: var(--maxi-{$style}-color-{$color_number});}";
                    }
                }
            }
        }

        return $response;
    }

    private static function get_sentences_by_breakpoint($args)
    {
        $organized_values = $args['organized_values'];
        $style = $args['style'];
        $breakpoint = $args['breakpoint'];
        $targets = $args['targets'];
        $settings = [
            'font-family',
            'font-size',
            'font-style',
            'font-weight',
            'line-height',
            'text-decoration',
            'text-transform',
            'letter-spacing',
            'white-space',
            'word-spacing',
            'text-indent',
            'margin-bottom',
            'padding-bottom',
            'padding-top',
            'padding-left',
            'padding-right',
        ];

        $sentences = [];

        foreach ($targets as $target) {
            $sentences[$target] = [];

            foreach ($settings as $setting) {
                if (isset($organized_values[$style][$target][$breakpoint][$setting])) {
                    $value_data = $organized_values[$style][$target][$breakpoint][$setting];
                    $sentences[$target][] = "{$setting}: var({$value_data['var_name']});";
                }
            }
        }

        return $sentences;
    }

    private static function get_maxi_sc_styles($args)
    {
        $organized_values = $args['organized_values'];
        $prefix = $args['prefix'];
        $style = $args['style'];
        $is_backend = $args['is_backend'] ?? false;

        $response = '';
        $levels = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'navigation', 'button'];

        $add_styles_by_breakpoint = function ($breakpoint, $second_prefix = '') use (
            $organized_values,
            $prefix,
            $style,
            $levels
        ) {
            $added_response = '';

            $breakpoint_level_sentences = self::get_sentences_by_breakpoint([
                'organized_values' => $organized_values,
                'style' => $style,
                'breakpoint' => $breakpoint,
                'targets' => $levels,
            ]);

            // Process each level's sentences
            foreach ($breakpoint_level_sentences as $level => $sentences) {
                if ($level === 'navigation' || $level === 'button') {
                    continue; // Skip navigation and button here as we'll handle them separately
                }

                // Remove margin-bottom sentences
                $margin_sentence = null;
                foreach ($sentences as $key => $sentence) {
                    if (strpos($sentence, 'margin-bottom') !== false) {
                        $margin_sentence = $sentence;
                        unset($sentences[$key]);
                        break;
                    }
                }

                // Add webkit prefix for text-decoration
                $webkit_sentences = [];
                foreach ($sentences as $sentence) {
                    if (strpos($sentence, 'text-decoration:') !== false) {
                        $webkit_sentences[] = str_replace('text-decoration:', '-webkit-text-decoration:', $sentence);
                    }
                }

                // Combine original sentences with webkit prefixed ones
                $all_sentences = array_merge($webkit_sentences, $sentences);

                // Build selectors
                $selectors = [
                    "{$prefix} {$second_prefix} .maxi-{$style}.maxi-block.maxi-text-block",
                    "{$prefix} {$second_prefix} .maxi-{$style} .maxi-block.maxi-text-block",
                    "{$prefix} {$second_prefix} .maxi-{$style}.maxi-map-block__popup__content",
                    "{$prefix} {$second_prefix} .maxi-{$style} .maxi-map-block__popup__content",
                    "{$prefix} {$second_prefix} .maxi-{$style} .maxi-pane-block .maxi-pane-block__header",
                ];

                foreach ($selectors as $selector) {
                    $added_response .= "{$selector} {$level} {" . implode(' ', $all_sentences) . "}";
                }

                if ($margin_sentence) {
                    // Add margin-bottom for Text Maxi
                    $added_response .= "{$prefix} {$second_prefix} .maxi-{$style}.maxi-block.maxi-text-block {$level} {{$margin_sentence}}";
                    $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .maxi-block.maxi-text-block {$level} {{$margin_sentence}}";
                }
            }

            // Button styles
            if (isset($breakpoint_level_sentences['button']) && !empty($breakpoint_level_sentences['button'])) {
                $button_sentences = $breakpoint_level_sentences['button'];

                // Add webkit prefix for text-decoration
                $webkit_button_sentences = [];
                foreach ($button_sentences as $sentence) {
                    if (strpos($sentence, 'text-decoration:') !== false) {
                        $webkit_button_sentences[] = str_replace('text-decoration:', '-webkit-text-decoration:', $sentence);
                    }
                }

                // Combine original sentences with webkit prefixed ones
                $all_button_sentences = array_merge($webkit_button_sentences, $button_sentences);

                // Button selectors
                $button_selectors = [
                    "{$prefix} {$second_prefix} .maxi-{$style}.maxi-block.maxi-button-block .maxi-button-block__content",
                    "{$prefix} {$second_prefix} .maxi-{$style}.maxi-block .maxi-button-block .maxi-button-block__content",
                    "{$prefix} {$second_prefix} .maxi-{$style} .maxi-block--use-sc .wp-element-button"
                ];

                foreach ($button_selectors as $button_selector) {
                    $added_response .= "{$button_selector} {" . implode(' ', $all_button_sentences);

                    // Add color for wp-element-button
                    if (strpos($button_selector, 'wp-element-button') !== false) {
                        $added_response .= " color: var(--maxi-{$style}-p-color, rgba(var(--maxi-{$style}-color-3, 155, 155, 155), 1));";
                    }

                    $added_response .= "}";
                }
            }

            // Text Maxi list styles
            $list_selectors = [
                "{$prefix} {$second_prefix} .maxi-{$style}.maxi-list-block ul.maxi-text-block__content",
                "{$prefix} {$second_prefix} .maxi-{$style} .maxi-list-block ul.maxi-text-block__content",
                "{$prefix} {$second_prefix} .maxi-{$style}.maxi-list-block ol.maxi-text-block__content",
                "{$prefix} {$second_prefix} .maxi-{$style} .maxi-list-block ol.maxi-text-block__content",
            ];

            foreach ($list_selectors as $target) {
                $sentences = $breakpoint_level_sentences['p'];
                $margin_sentence = null;

                foreach ($sentences as $key => $sentence) {
                    if (strpos($sentence, 'margin-bottom') !== false) {
                        $margin_sentence = $sentence;
                        break;
                    }
                }

                if ($margin_sentence) {
                    $added_response .= "{$target} {" . $margin_sentence . "}";
                }
            }

            // Add list and pagination styles
            $list_pagination_selectors = [
                "{$prefix} {$second_prefix} .maxi-{$style}.maxi-block.maxi-text-block li",
                "{$prefix} {$second_prefix} .maxi-{$style} .maxi-block.maxi-text-block li",
                "{$prefix} {$second_prefix} .maxi-{$style} .maxi-pagination a",
                "{$prefix} {$second_prefix} .maxi-{$style} .maxi-pagination span.maxi-pagination__link--current",
            ];

            foreach ($list_pagination_selectors as $target) {
                $sentences = $breakpoint_level_sentences['p'];
                $margin_sentence = null;

                // Add webkit prefix for text-decoration
                $webkit_sentences = [];
                foreach ($sentences as $key => $sentence) {
                    if (strpos($sentence, 'margin-bottom') !== false) {
                        $margin_sentence = $sentence;
                        unset($sentences[$key]);
                    } elseif (strpos($sentence, 'text-decoration:') !== false) {
                        $webkit_sentences[] = str_replace('text-decoration:', '-webkit-text-decoration:', $sentence);
                    }
                }

                // Combine original sentences with webkit prefixed ones
                $all_sentences = array_merge($webkit_sentences, $sentences);

                $added_response .= "{$target} {" . implode(' ', $all_sentences) . "}";
            }

            // Text Maxi when has link
            $text_maxi_link_prefix = "{$prefix} {$second_prefix} .maxi-{$style}.maxi-block.maxi-block--has-link > .maxi-text-block__content:not(p)";

            $added_response .= "{$text_maxi_link_prefix} { color: var(--maxi-{$style}-link); }";
            $added_response .= "{$text_maxi_link_prefix}:hover { color: var(--maxi-{$style}-link-hover); }";
            $added_response .= "{$text_maxi_link_prefix}:focus { color: var(--maxi-{$style}-link-hover); }";
            $added_response .= "{$text_maxi_link_prefix}:active { color: var(--maxi-{$style}-link-active); }";
            $added_response .= "{$text_maxi_link_prefix}:visited { color: var(--maxi-{$style}-link-visited); }";
            $added_response .= "{$text_maxi_link_prefix}:visited:hover { color: var(--maxi-{$style}-link-hover); }";

            // Text block link styles
            $text_block_link_selectors = [
                "{$prefix} {$second_prefix} .maxi-{$style}.maxi-block.maxi-text-block a.maxi-block--has-link",
                "{$prefix} {$second_prefix} .maxi-{$style}.maxi-block .maxi-text-block a.maxi-block--has-link",
            ];

            foreach ($text_block_link_selectors as $target) {
                $added_response .= "{$target} { color: var(--maxi-{$style}-link); }";
                $added_response .= "{$target}:hover { color: var(--maxi-{$style}-link-hover); }";
                $added_response .= "{$target}:hover span { color: var(--maxi-{$style}-link-hover); }";
                $added_response .= "{$target}:focus { color: var(--maxi-{$style}-link-hover); }";
                $added_response .= "{$target}:focus span { color: var(--maxi-{$style}-link-hover); }";
                $added_response .= "{$target}:active { color: var(--maxi-{$style}-link-active); }";
                $added_response .= "{$target}:active span { color: var(--maxi-{$style}-link-active); }";
                $added_response .= "{$target}:visited { color: var(--maxi-{$style}-link-visited); }";
                $added_response .= "{$target}:visited span { color: var(--maxi-{$style}-link-visited); }";
                $added_response .= "{$target}:visited:hover { color: var(--maxi-{$style}-link-hover); }";
                $added_response .= "{$target}:visited:hover span { color: var(--maxi-{$style}-link-hover); }";
            }

            // Image Maxi styles
            $image_maxi_selectors = [
                "{$prefix} {$second_prefix} .maxi-{$style}.maxi-image-block .maxi-hover-details",
                "{$prefix} {$second_prefix} .maxi-{$style} .maxi-image-block .maxi-hover-details",
            ];

            foreach ($image_maxi_selectors as $target) {
                $image_sentences = [
                    'h4' => $breakpoint_level_sentences['h4'],
                    'p' => $breakpoint_level_sentences['p'],
                ];

                foreach ($image_sentences as $level => $sentences) {
                    if ($level !== 'p') {
                        // Remove margin-bottom sentences
                        foreach ($sentences as $key => $sentence) {
                            if (strpos($sentence, 'margin-bottom') !== false) {
                                unset($sentences[$key]);
                                break;
                            }
                        }
                    }

                    $added_response .= "{$target} {$level} {" . implode(' ', $sentences) . "}";
                }
            }

            // Image Maxi caption
            $caption_selectors = [
                "{$prefix} {$second_prefix} .maxi-{$style}.maxi-image-block figcaption",
                "{$prefix} {$second_prefix} .maxi-{$style} .maxi-image-block figcaption",
            ];

            foreach ($caption_selectors as $target) {
                $sentences = $breakpoint_level_sentences['p'];

                // Remove margin-bottom sentences
                foreach ($sentences as $key => $sentence) {
                    if (strpos($sentence, 'margin-bottom') !== false) {
                        unset($sentences[$key]);
                        break;
                    }
                }

                $added_response .= "{$target} {" . implode(' ', $sentences) . "}";
            }

            // Search Maxi
            $search_selectors = [
                "{$prefix} {$second_prefix} .maxi-{$style}.maxi-search-block .maxi-search-block__input",
                "{$prefix} {$second_prefix} .maxi-{$style} .maxi-search-block .maxi-search-block__input",
                "{$prefix} {$second_prefix} .maxi-{$style}.maxi-search-block .maxi-search-block__button__content",
                "{$prefix} {$second_prefix} .maxi-{$style} .maxi-search-block .maxi-search-block__button__content",
            ];

            foreach ($search_selectors as $target) {
                $sentences = $breakpoint_level_sentences['p'];

                // Remove margin-bottom sentences
                foreach ($sentences as $key => $sentence) {
                    if (strpos($sentence, 'margin-bottom') !== false) {
                        unset($sentences[$key]);
                        break;
                    }
                }

                $added_response .= "{$target} {" . implode(' ', $sentences) . "}";
            }

            // Navigation inside Maxi Container
            $target_item = "{$prefix} {$second_prefix} .maxi-{$style}.maxi-container-block .wp-block-navigation .wp-block-navigation__container .wp-block-navigation-item";
            $sentences = $breakpoint_level_sentences['navigation'] ?? [];

            // Remove margin-bottom sentences
            $margin_sentence = null;
            foreach ($sentences as $key => $sentence) {
                if (strpos($sentence, 'margin-bottom') !== false) {
                    $margin_sentence = $sentence;
                    unset($sentences[$key]);
                    break;
                }
            }

            $added_response .= "{$target_item} {" . implode(' ', $sentences) . "}";

            $target_link = "{$target_item} a";
            $target_button = "{$target_item} button";

            // Apply styles to both link and button elements
            foreach ([$target_link, $target_button] as $target) {
                $added_response .= "{$target} { color: var(--maxi-{$style}-menu-item); transition: color 0.3s 0s ease;}";
                $added_response .= "{$target} span { color: var(--maxi-{$style}-menu-item); transition: color 0.3s 0s ease; }";
                $added_response .= "{$target} + span { color: var(--maxi-{$style}-menu-item); transition: color 0.3s 0s ease;}";
                $added_response .= "{$target} + button { color: var(--maxi-{$style}-menu-item); transition: color 0.3s 0s ease;}";

                $added_response .= "{$target}:hover { color: var(--maxi-{$style}-menu-item-hover); }";
                $added_response .= "{$target}:hover span { color: var(--maxi-{$style}-menu-item-hover); }";
                $added_response .= "{$target}:hover + span { color: var(--maxi-{$style}-menu-item-hover); }";
                $added_response .= "{$target}:hover + button { color: var(--maxi-{$style}-menu-item-hover); }";
            }

            // Link-specific styles
            $added_response .= "{$target_link}:focus { color: var(--maxi-{$style}-menu-item-hover); }";
            $added_response .= "{$target_link}:focus span { color: var(--maxi-{$style}-menu-item-hover); }";
            $added_response .= "{$target_link}:focus + span { color: var(--maxi-{$style}-menu-item-hover); }";
            $added_response .= "{$target_link}:focus + button { color: var(--maxi-{$style}-menu-item-hover); }";

            $added_response .= "{$target_link}:visited { color: var(--maxi-{$style}-menu-item-visited); }";
            $added_response .= "{$target_link}:visited span { color: var(--maxi-{$style}-menu-item-visited); }";
            $added_response .= "{$target_link}:visited + span { color: var(--maxi-{$style}-menu-item-visited); }";
            $added_response .= "{$target_link}:visited + button { color: var(--maxi-{$style}-menu-item-visited); }";

            $added_response .= "{$target_link}:visited:hover { color: var(--maxi-{$style}-menu-item-hover); }";
            $added_response .= "{$target_link}:visited:hover span { color: var(--maxi-{$style}-menu-item-hover); }";
            $added_response .= "{$target_link}:visited:hover + span { color: var(--maxi-{$style}-menu-item-hover); }";
            $added_response .= "{$target_link}:visited:hover + button { color: var(--maxi-{$style}-menu-item-hover); }";

            // Current menu item styles
            $target_link_current = "{$target_item}.current-menu-item > a";

            $added_response .= "{$target_link_current} { color: var(--maxi-{$style}-menu-item-current); }";
            $added_response .= "{$target_link_current} span { color: var(--maxi-{$style}-menu-item-current); }";
            $added_response .= "{$target_link_current} + span { color: var(--maxi-{$style}-menu-item-current); }";
            $added_response .= "{$target_link_current} + button { color: var(--maxi-{$style}-menu-item-current); }";

            $added_response .= "{$target_link_current}:hover { color: var(--maxi-{$style}-menu-item-hover); }";
            $added_response .= "{$target_link_current}:hover span { color: var(--maxi-{$style}-menu-item-hover); }";
            $added_response .= "{$target_link_current}:hover + span { color: var(--maxi-{$style}-menu-item-hover); }";
            $added_response .= "{$target_link_current}:hover + button { color: var(--maxi-{$style}-menu-item-hover); }";

            $added_response .= "{$target_link_current}:focus { color: var(--maxi-{$style}-menu-item-hover); }";
            $added_response .= "{$target_link_current}:focus span { color: var(--maxi-{$style}-menu-item-hover); }";
            $added_response .= "{$target_link_current}:focus + span { color: var(--maxi-{$style}-menu-item-hover); }";
            $added_response .= "{$target_link_current}:focus + button { color: var(--maxi-{$style}-menu-item-hover); }";

            // Mobile menu icon/text styles
            $burger_item = "{$prefix} {$second_prefix} .maxi-{$style}.maxi-container-block .wp-block-navigation button.wp-block-navigation__responsive-container-open";
            $burger_item_close = "{$prefix} {$second_prefix} .maxi-{$style}.maxi-container-block .wp-block-navigation button.wp-block-navigation__responsive-container-close";

            foreach ([$burger_item, $burger_item_close] as $target) {
                $added_response .= "{$target} { color: var(--maxi-{$style}-menu-burger); }";
                foreach ($sentences as $sentence) {
                    if (strpos($sentence, 'font-family') !== false) {
                        $added_response .= "{$target} { font-family: var(--maxi-{$style}-navigation-font-family-general); }";
                    }
                }
            }

            // Mobile menu background
            $mobile_menu_bg_target = "{$prefix} {$second_prefix} .maxi-{$style}.maxi-container-block .wp-block-navigation .wp-block-navigation__responsive-container.has-modal-open";
            $added_response .= "{$mobile_menu_bg_target} { background-color: var(--maxi-{$style}-menu-mobile-bg) !important; }";

            // Sub-menus
            $sub_menu_target = "{$prefix} {$second_prefix} .maxi-{$style}.maxi-container-block .wp-block-navigation .wp-block-navigation__container ul li";
            $sub_menu_target_editor = "{$prefix} {$second_prefix} .maxi-{$style}.maxi-container-block .wp-block-navigation .wp-block-navigation__container .wp-block-navigation__submenu-container > div";

            $added_response .= "{$sub_menu_target} { background-color: var(--maxi-{$style}-menu-item-sub-bg); }";
            $added_response .= "{$sub_menu_target}:hover { background-color: var(--maxi-{$style}-menu-item-sub-bg-hover); }";

            $added_response .= "{$sub_menu_target_editor} { background-color: var(--maxi-{$style}-menu-item-sub-bg) !important; }";
            $added_response .= "{$sub_menu_target_editor}:hover { background-color: var(--maxi-{$style}-menu-item-sub-bg-hover) !important; }";

            foreach ([$sub_menu_target, $sub_menu_target_editor] as $target) {
                $added_response .= "{$target}.current-menu-item { background-color: var(--maxi-{$style}-menu-item-sub-bg-current); }";
                $added_response .= "{$target}.current-menu-item:hover { background-color: var(--maxi-{$style}-menu-item-sub-bg-hover); }";
            }

            return $added_response;
        };

        // Add styles for all breakpoints
        $response .= $add_styles_by_breakpoint('general');

        $breakpoints = [
            'xxl' => 1921,
            'xl' => 1920,
            'l' => 1366,
            'm' => 1024,
            's' => 767,
            'xs' => 480,
        ];

        foreach ($breakpoints as $breakpoint => $value) {
            if ($is_backend) {
                $response .= $add_styles_by_breakpoint(
                    $breakpoint,
                    ".edit-post-visual-editor[maxi-blocks-responsive=\"{$breakpoint}\"]"
                );
            } else {
                $response .= "@media (" . ($breakpoint !== 'xxl' ? 'max' : 'min') . "-width: {$value}px) {";
                $response .= $add_styles_by_breakpoint($breakpoint);
                $response .= '}';
            }
        }

        return $response;
    }

    private static function get_sc_styles($raw_style_card, $gutenberg_blocks_status = true, $is_backend = false)
    {
        $style_card = $raw_style_card;
        $response = '';
        $prefix = 'body.maxi-blocks--active';
        $styles = ['light', 'dark'];

        $organized_values = self::get_organized_values($style_card);

        foreach ($styles as $style) {
            // Link colors
            $response .= self::get_link_colors_string([
                'organized_values' => $organized_values,
                'prefix' => $prefix,
                'style' => $style,
            ]);

            // Maxi styles
            $response .= self::get_maxi_sc_styles([
                'organized_values' => $organized_values,
                'prefix' => $prefix,
                'style' => $style,
                'is_backend' => $is_backend,
            ]);

            // WP native blocks styles
            if ($gutenberg_blocks_status) {
                $response .= self::get_wp_native_styles($organized_values, $style_card, $prefix, $style, $is_backend);
            }
        }

        return self::process_css($response);
    }

    private static function process_css($css)
    {
        // Remove duplicate rules
        $css = preg_replace('/([^{}]*){([^{}]*)}/', '$1{$2}', $css);

        // Remove empty rules
        $css = preg_replace('/[^{}]+{}/', '', $css);

        // Remove extra whitespace
        $css = preg_replace('/\s+/', ' ', $css);

        return trim($css);
    }
}
