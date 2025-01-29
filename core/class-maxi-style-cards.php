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
            return $maxi_blocks_style_cards_current;
        }
    }

    public static function get_maxi_blocks_active_style_card()
    {
        $maxi_blocks_style_cards = self::get_maxi_blocks_current_style_cards();

        if (!$maxi_blocks_style_cards) {
            return false;
        }

        $maxi_blocks_style_cards_array = json_decode(
            $maxi_blocks_style_cards,
            true
        );

        foreach ($maxi_blocks_style_cards_array as $key => $sc) {
            if ($sc['status'] === 'active') {
                return $sc;
            }
        }
        return false;
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
