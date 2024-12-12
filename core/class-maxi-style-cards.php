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
        add_action('wp_enqueue_scripts', [$this, 'enqueue_styles']);

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
        global $wp_filesystem;

        if (empty($wp_filesystem)) {
            require_once ABSPATH . '/wp-admin/includes/file.php';
            WP_Filesystem();
        }

        $file_path = MAXI_PLUGIN_DIR_PATH . "core/defaults/defaultSC.json";

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

    public static function maxi_import_sc($sc_content)
    {
        if ($sc_content) {
            global $wpdb;

            // Get default SC
            $default_sc = json_decode(self::get_default_style_card(), true);
            $default_maxi_sc = $default_sc['sc_maxi'];

            // Parse imported SC (double decode as it's a JSON string within a string)
            $imported_sc = json_decode($sc_content, true);

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

            // Create variables object first
            $get_sc_variables_object = function ($sc) {
                $response = array();
                $styles = array('light', 'dark');
                $elements = array('button', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'icon', 'divider', 'link', 'navigation');
                $breakpoints = array('general', 'xxl', 'xl', 'l', 'm', 's', 'xs');
                $settings = array(
                    'font-family', 'font-size', 'font-style', 'font-weight', 'line-height',
                    'text-decoration', 'text-transform', 'letter-spacing', 'white-space',
                    'word-spacing', 'margin-bottom', 'text-indent', 'padding-bottom',
                    'padding-top', 'padding-left', 'padding-right'
                );

                // Helper function to merge style card data
                $merge_style_cards = function ($default_card, $style_card) {
                    if (empty($style_card)) {
                        return $default_card;
                    }
                    if (empty($default_card)) {
                        return $style_card;
                    }
                    return array_replace_recursive($default_card, $style_card);
                };

                foreach ($styles as $style) {
                    // Merge defaultStyleCard and styleCard
                    $style_data = $merge_style_cards(
                        $sc[$style]['defaultStyleCard'] ?? array(),
                        $sc[$style]['styleCard'] ?? array()
                    );

                    // Process each element
                    foreach ($elements as $element) {
                        if (!isset($style_data[$element])) {
                            continue;
                        }

                        // Process each setting
                        foreach ($settings as $setting) {
                            foreach ($breakpoints as $breakpoint) {
                                $key = "{$setting}-{$breakpoint}";
                                $var_name = "--maxi-{$style}-{$element}-{$setting}-{$breakpoint}";

                                if (isset($style_data[$element][$key])) {
                                    $value = $style_data[$element][$key];

                                    // Add units if needed
                                    if ($setting === 'font-family') {
                                        $value = "\"{$value}\"";
                                    } elseif (in_array($setting, array('font-size', 'line-height', 'letter-spacing', 'word-spacing', 'margin-bottom', 'text-indent', 'padding-bottom', 'padding-top', 'padding-left', 'padding-right'))) {
                                        if (is_numeric($value)) {
                                            $value .= 'px';
                                        }
                                    }

                                    $response[$var_name] = $value;
                                }
                            }
                        }
                    }

                    // Process colors
                    if (isset($style_data['color'])) {
                        for ($i = 1; $i <= 8; $i++) {
                            if (isset($style_data['color'][$i])) {
                                $response["--maxi-{$style}-color-{$i}"] = $style_data['color'][$i];
                            }
                        }
                    }
                }

                return $response;
            };

            // Create CSS variables string
            $create_sc_style_string = function ($sc_object) {
                $response = ':root{';
                foreach ($sc_object as $key => $val) {
                    if ($val) {
                        $response .= "{$key}:{$val};";
                    }
                }
                $response .= '}';
                return $response;
            };

            // Create variables object and convert to CSS string
            $variables_object = $get_sc_variables_object($new_sc);
            $var_sc_string = $create_sc_style_string($variables_object);

            // Create styles similar to getSCStyles.js
            $get_sc_styles = function ($sc) {
                $response = '';
                $prefix = 'body.maxi-blocks--active';
                $styles = array('light', 'dark');
                $breakpoints = array(
                    'xxl' => 1921,
                    'xl' => 1920,
                    'l' => 1366,
                    'm' => 1024,
                    's' => 767,
                    'xs' => 480
                );
                $breakpoint_keys = array('general', 'xxl', 'xl', 'l', 'm', 's', 'xs');

                // Helper function to organize values like in JS
                $get_organized_values = function ($sc) use ($styles, $breakpoint_keys) {
                    $organized_values = array();

                    foreach ($styles as $style) {
                        if (!isset($sc[$style])) {
                            continue;
                        }

                        $style_data = array_merge(
                            $sc[$style]['defaultStyleCard'] ?? array(),
                            $sc[$style]['styleCard'] ?? array()
                        );

                        // Process typography settings
                        $elements = array('p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'button', 'navigation');
                        $settings = array(
                            'font-family', 'font-size', 'font-style', 'font-weight', 'line-height',
                            'text-decoration', 'text-transform', 'letter-spacing', 'white-space',
                            'word-spacing', 'margin-bottom', 'text-indent', 'padding-top', 'padding-right', 'padding-bottom', 'padding-left'
                        );

                        foreach ($elements as $element) {
                            if (!isset($style_data[$element])) {
                                continue;
                            }

                            foreach ($settings as $setting) {
                                foreach ($breakpoint_keys as $breakpoint) {
                                    $key = "{$setting}-{$breakpoint}";
                                    if (isset($style_data[$element][$key])) {
                                        $organized_values[$style][$element][$breakpoint][$setting] =
                                            "var(--maxi-{$style}-{$element}-{$setting}-{$breakpoint})";
                                    }
                                }
                            }
                        }

                        // Process colors
                        if (isset($style_data['color'])) {
                            $organized_values[$style]['color'] = $style_data['color'];
                        }
                    }

                    return $organized_values;
                };

                // Get organized values
                $organized_values = $get_organized_values($sc);

                // Helper function to get Maxi block styles
                $get_maxi_sc_styles = function ($style, $breakpoint, $prefix) use ($organized_values) {
                    $response = '';

                    // Text block styles
                    $text_selectors = array(
                        "{$prefix} .maxi-{$style}.maxi-block.maxi-text-block",
                        "{$prefix} .maxi-{$style} .maxi-block.maxi-text-block",
                        "{$prefix} .maxi-{$style}.maxi-map-block__popup__content",
                        "{$prefix} .maxi-{$style} .maxi-map-block__popup__content",
                        "{$prefix} .maxi-{$style} .maxi-pane-block .maxi-pane-block__header"
                    );

                    $elements = array('p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6');
                    foreach ($elements as $element) {
                        if (!isset($organized_values[$style][$element][$breakpoint])) {
                            continue;
                        }

                        $styles_string = '';
                        foreach ($organized_values[$style][$element][$breakpoint] as $prop => $value) {
                            $styles_string .= "{$prop}: {$value};";
                        }

                        foreach ($text_selectors as $selector) {
                            $response .= "{$selector} {$element} {";
                            $response .= $styles_string;
                            $response .= "}";
                        }

                        // Add paragraph styles to lists and links
                        if ($element === 'p') {
                            foreach ($text_selectors as $selector) {
                                // Add styles for lists
                                $response .= "{$selector} li {";
                                $response .= $styles_string;
                                $response .= "}";

                                // Add styles for links
                                $response .= "{$selector} a {";
                                $response .= $styles_string;
                                $response .= "}";
                            }
                        }
                    }

                    // Add paragraph styles to lists and links
                    if ($element === 'p') {
                        foreach ($text_selectors as $selector) {
                            // Add styles for lists
                            $response .= "{$selector} li {";
                            $response .= $styles_string;
                            $response .= "}";

                            // Add styles for links
                            $response .= "{$selector} a {";
                            $response .= $styles_string;
                            $response .= "}";
                        }
                    }

                    // Image Maxi
                    $image_selectors = array(
                        "{$prefix} .maxi-{$style}.maxi-image-block .maxi-hover-details",
                        "{$prefix} .maxi-{$style} .maxi-image-block .maxi-hover-details"
                    );

                    foreach ($image_selectors as $target) {
                        // Apply h4 styles
                        if (isset($organized_values[$style]['h4'][$breakpoint])) {
                            $h4_styles = '';
                            foreach ($organized_values[$style]['h4'][$breakpoint] as $prop => $value) {
                                if ($prop !== 'margin-bottom') {
                                    $h4_styles .= "{$prop}: {$value};";
                                }
                            }
                            $response .= "{$target} h4 {{$h4_styles}}";
                        }

                        // Apply p styles
                        if (isset($organized_values[$style]['p'][$breakpoint])) {
                            $p_styles = '';
                            foreach ($organized_values[$style]['p'][$breakpoint] as $prop => $value) {
                                $p_styles .= "{$prop}: {$value};";
                            }
                            $response .= "{$target} p {{$p_styles}}";
                        }
                    }

                    // Search Maxi
                    $search_selectors = array(
                        "{$prefix} .maxi-{$style}.maxi-search-block .maxi-search-block__input",
                        "{$prefix} .maxi-{$style} .maxi-search-block .maxi-search-block__input",
                        "{$prefix} .maxi-{$style}.maxi-search-block .maxi-search-block__button__content",
                        "{$prefix} .maxi-{$style} .maxi-search-block .maxi-search-block__button__content"
                    );

                    foreach ($search_selectors as $target) {
                        if (isset($organized_values[$style]['p'][$breakpoint])) {
                            $p_styles = '';
                            foreach ($organized_values[$style]['p'][$breakpoint] as $prop => $value) {
                                if ($prop !== 'margin-bottom') {
                                    $p_styles .= "{$prop}: {$value};";
                                }
                            }
                            $response .= "{$target} {{$p_styles}}";
                        }
                    }

                    // Text Maxi when has link
                    $textMaxiLinkPrefix = "{$prefix} .maxi-{$style}.maxi-block.maxi-block--has-link > .maxi-text-block__content:not(p)";

                    $response .= "{$textMaxiLinkPrefix} { color: var(--maxi-{$style}-link); }";
                    $response .= "{$textMaxiLinkPrefix}:hover { color: var(--maxi-{$style}-link-hover); }";
                    $response .= "{$textMaxiLinkPrefix}:focus { color: var(--maxi-{$style}-link-hover); }";
                    $response .= "{$textMaxiLinkPrefix}:active { color: var(--maxi-{$style}-link-active); }";
                    $response .= "{$textMaxiLinkPrefix}:visited { color: var(--maxi-{$style}-link-visited); }";
                    $response .= "{$textMaxiLinkPrefix}:visited:hover { color: var(--maxi-{$style}-link-hover); }";

                    // Button block styles
                    $response .= "{$prefix} .maxi-{$style}.maxi-button-block {";
                    $response .= "font-family: var(--maxi-{$style}-button-font-family-{$breakpoint});";
                    $response .= "font-size: var(--maxi-{$style}-button-font-size-{$breakpoint});";
                    $response .= "background-color: var(--maxi-{$style}-button-background-color);";
                    $response .= "}";

                    // Navigation styles
                    $targetItem = "{$prefix} .maxi-{$style}.maxi-container-block .wp-block-navigation .wp-block-navigation__container .wp-block-navigation-item";

                    // Get all navigation styles including paddings
                    if (isset($organized_values[$style]['navigation'][$breakpoint])) {
                        $nav_styles = '';
                        foreach ($organized_values[$style]['navigation'][$breakpoint] as $prop => $value) {
                            $nav_styles .= "{$prop}: {$value};";
                        }
                        $response .= "{$targetItem} {{$nav_styles}}";
                    }

                    $targetLink = "{$targetItem} a";
                    $targetButton = "{$targetItem} button";

                    foreach (array($targetLink, $targetButton) as $target) {
                        $response .= "{$target} { color: var(--maxi-{$style}-menu-item); transition: color 0.3s 0s ease;}";
                        $response .= "{$target} span { color: var(--maxi-{$style}-menu-item); transition: color 0.3s 0s ease; }";
                        $response .= "{$target} + span { color: var(--maxi-{$style}-menu-item); transition: color 0.3s 0s ease;}";
                        $response .= "{$target} + button { color: var(--maxi-{$style}-menu-item); transition: color 0.3s 0s ease;}";

                        $response .= "{$target}:hover { color: var(--maxi-{$style}-menu-item-hover); }";
                        $response .= "{$target}:hover span { color: var(--maxi-{$style}-menu-item-hover); }";
                        $response .= "{$target}:hover + span { color: var(--maxi-{$style}-menu-item-hover); }";
                        $response .= "{$target}:hover + button { color: var(--maxi-{$style}-menu-item-hover); }";
                    }

                    $response .= "{$targetLink}:focus { color: var(--maxi-{$style}-menu-item-hover); }";
                    $response .= "{$targetLink}:focus span { color: var(--maxi-{$style}-menu-item-hover); }";
                    $response .= "{$targetLink}:focus + span { color: var(--maxi-{$style}-menu-item-hover); }";
                    $response .= "{$targetLink}:focus + button { color: var(--maxi-{$style}-menu-item-hover); }";

                    $response .= "{$targetLink}:visited { color: var(--maxi-{$style}-menu-item-visited); }";
                    $response .= "{$targetLink}:visited span { color: var(--maxi-{$style}-menu-item-visited); }";
                    $response .= "{$targetLink}:visited + span { color: var(--maxi-{$style}-menu-item-visited); }";
                    $response .= "{$targetLink}:visited + button { color: var(--maxi-{$style}-menu-item-visited); }";

                    // Mobile menu styles
                    $burgerItem = "{$prefix} .maxi-{$style}.maxi-container-block .wp-block-navigation button.wp-block-navigation__responsive-container-open";
                    $burgerItemClose = "{$prefix} .maxi-{$style}.maxi-container-block .wp-block-navigation button.wp-block-navigation__responsive-container-close";

                    foreach (array($burgerItem, $burgerItemClose) as $target) {
                        $response .= "{$target} { color: var(--maxi-{$style}-menu-burger); }";
                        $response .= "{$target} { font-family: var(--maxi-{$style}-navigation-font-family-general); }";
                    }

                    // Mobile menu background
                    $mobileMenuBgTarget = "{$prefix} .maxi-{$style}.maxi-container-block .wp-block-navigation .wp-block-navigation__responsive-container.has-modal-open";
                    $response .= "{$mobileMenuBgTarget} { background-color: var(--maxi-{$style}-menu-mobile-bg) !important; }";

                    // Sub-menus
                    $subMenuTarget = "{$prefix} .maxi-{$style}.maxi-container-block .wp-block-navigation .wp-block-navigation__container ul li";
                    $subMenuTargetEditor = "{$prefix} .maxi-{$style}.maxi-container-block .wp-block-navigation .wp-block-navigation__container .wp-block-navigation__submenu-container > div";

                    $response .= "{$subMenuTarget} { background-color: var(--maxi-{$style}-menu-item-sub-bg); }";
                    $response .= "{$subMenuTarget}:hover { background-color: var(--maxi-{$style}-menu-item-sub-bg-hover); }";
                    $response .= "{$subMenuTargetEditor} { background-color: var(--maxi-{$style}-menu-item-sub-bg) !important; }";
                    $response .= "{$subMenuTargetEditor}:hover { background-color: var(--maxi-{$style}-menu-item-sub-bg-hover) !important; }";

                    // Comments form styles - update this section in $get_maxi_sc_styles
                    $commentsSelectors = array(
                        // Form elements
                        "{$prefix} .maxi-{$style} .wp-block .wp-block-post-comments-form .comment-form textarea",
                        "{$prefix} .maxi-{$style} .wp-block .wp-block-post-comments-form .comment-form p:not(.form-submit) input",
                        "{$prefix} .maxi-{$style} .wp-block .wp-block-post-comments-form .comment-reply-title small a",
                        "{$prefix} .maxi-{$style} .wp-block.wp-block-post-comments-form .comment-form textarea",
                        "{$prefix} .maxi-{$style} .wp-block.wp-block-post-comments-form .comment-form p:not(.form-submit) input",
                        "{$prefix} .maxi-{$style} .wp-block.wp-block-post-comments-form .comment-reply-title small a",
                        // Submit button
                        "{$prefix} .maxi-{$style} .wp-block .wp-block-post-comments-form .comment-form p.form-submit input",
                        "{$prefix} .maxi-{$style} .wp-block.wp-block-post-comments-form .comment-form p.form-submit input"
                    );

                    foreach ($commentsSelectors as $selector) {
                        if (strpos($selector, 'form-submit') !== false) {
                            // Submit button styles
                            $response .= "{$selector} { color: var(--maxi-{$style}-button-color); }";
                            $response .= "{$selector} { background: var(--maxi-{$style}-button-background-color); }";
                            if (isset($organized_values[$style]['button'][$breakpoint])) {
                                $button_styles = '';
                                foreach ($organized_values[$style]['button'][$breakpoint] as $prop => $value) {
                                    if ($prop !== 'margin-bottom') {
                                        $button_styles .= "{$prop}: {$value};";
                                    }
                                }
                                $response .= "{$selector} {{$button_styles}}";
                            }
                        } else {
                            // Other form elements
                            if (isset($organized_values[$style]['p'][$breakpoint])) {
                                $p_styles = '';
                                foreach ($organized_values[$style]['p'][$breakpoint] as $prop => $value) {
                                    if ($prop !== 'margin-bottom') {
                                        $p_styles .= "{$prop}: {$value};";
                                    }
                                }
                                $response .= "{$selector} {{$p_styles}}";
                            }
                            $response .= "{$selector} { background: transparent; color: inherit; max-width: 100%; }";
                        }
                    }

                    // Add comment form general color
                    $response .= "{$prefix} .maxi-{$style} .wp-block .wp-block-post-comments-form .comment-reply-title small { color: var(--maxi-{$style}-p-color,rgba(var(--maxi-{$style}-color-3,155,155,155),1)); }";

                    // Pagination styles
                    $paginationSelectors = array(
                        "{$prefix} .maxi-{$style} .wp-block.wp-block-post-navigation-link a",
                        "{$prefix} .maxi-{$style} .wp-block.wp-block-query-pagination-previous",
                        "{$prefix} .maxi-{$style} .wp-block.wp-block-query-pagination-next",
                        "{$prefix} .maxi-{$style} .wp-block.wp-block-query-pagination-numbers a",
                        "{$prefix} .maxi-{$style} .wp-block.wp-block-query-pagination-numbers span"
                    );

                    foreach ($paginationSelectors as $selector) {
                        $response .= "{$selector} { color: var(--maxi-{$style}-link); }";
                        $response .= "{$selector}:hover { color: var(--maxi-{$style}-link-hover); }";
                    }

                    // Editor styles
                    if ($style === 'light') {
                        $response .= "{$prefix} p > span[data-rich-text-placeholder]::after { color: var(--maxi-light-p-color); }";
                        $response .= "{$prefix} .editor-editor-canvas__post-title-wrapper > h1.editor-post-title { color: var(--maxi-light-h1-color); }";
                    }

                    return $response;
                };

                // Helper function for link colors
                $get_link_colors = function ($style, $prefix, $color_number) use ($organized_values) {
                    if (!isset($organized_values[$style]['color'][$color_number])) {
                        return '';
                    }

                    $response = '';
                    $selectors = array(
                        'link' => "--maxi-{$style}-link-palette",
                        'link-hover' => "--maxi-{$style}-link-hover-palette",
                        'link-active' => "--maxi-{$style}-link-active-palette",
                        'link-visited' => "--maxi-{$style}-link-visited-palette"
                    );

                    foreach ($selectors as $type => $var) {
                        $response .= "{$prefix} .maxi-{$style}.maxi-sc-{$style}-{$type}-color-{$color_number}.maxi-block--has-link { {$var}: var(--maxi-{$style}-color-{$color_number});}";
                        $response .= "{$prefix} .maxi-{$style}.maxi-sc-{$style}-{$type}-color-{$color_number} a.maxi-block--has-link { {$var}: var(--maxi-{$style}-color-{$color_number});}";
                        $response .= "{$prefix} .maxi-{$style} .maxi-sc-{$style}-{$type}-color-{$color_number}.maxi-block--has-link { {$var}: var(--maxi-{$style}-color-{$color_number});}";
                        $response .= "{$prefix} .maxi-{$style} .maxi-sc-{$style}-{$type}-color-{$color_number} a.maxi-block--has-link { {$var}: var(--maxi-{$style}-color-{$color_number});}";
                    }

                    return $response;
                };

                // Process each style (light/dark)
                foreach ($styles as $style) {
                    // Process colors
                    if (isset($organized_values[$style]['color'])) {
                        foreach ($organized_values[$style]['color'] as $number => $color) {
                            $response .= $get_link_colors($style, $prefix, $number);
                        }
                    }

                    // Add media queries for each breakpoint
                    $add_styles_for_breakpoint = function ($breakpoint = 'general') use ($style, $prefix, $sc, $get_maxi_sc_styles, $organized_values) {
                        return $get_maxi_sc_styles($style, $breakpoint, $prefix);
                    };

                    // Add styles for general breakpoint
                    $response .= $add_styles_for_breakpoint('general');

                    // Add styles for each breakpoint with media queries
                    foreach ($breakpoints as $breakpoint => $width) {
                        $response .= "@media (" . ($breakpoint === 'xxl' ? 'min' : 'max') . "-width: {$width}px) {";
                        $response .= $add_styles_for_breakpoint($breakpoint);
                        $response .= "}";
                    }
                }

                return $response;
            };

            // Generate styles string
            $styles_string = $get_sc_styles($new_sc);

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

            $results['sc'] = [
                'success' => true,
                'message' => sprintf(__('Style Card imported successfully as "%s"', 'maxi-blocks'), $name),
                'id' => $new_id
            ];
        }
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
}
