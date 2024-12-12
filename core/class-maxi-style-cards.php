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

                // Add list styles for paragraphs
                if ($level === 'p') {
                    $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} li.{$native_wp_prefix} {" . implode(' ', $sentences) . "}";
                }

                // Add margin-bottom sentence to all elements except the last one
                if ($margin_sentence) {
                    $added_response .= ":is(" . implode(', ', array_filter($selectors)) . "):not(:last-child) {" . $margin_sentence . "}";
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

            // Parse imported SC
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

            // Create variables object
            $organized_values = [];
            $styles = ['light', 'dark'];
            $elements = ['button', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'icon', 'divider', 'link', 'navigation'];
            $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
            $settings = [
                'font-family', 'font-size', 'font-style', 'font-weight', 'line-height',
                'text-decoration', 'text-transform', 'letter-spacing', 'white-space',
                'word-spacing', 'margin-bottom', 'text-indent', 'padding-bottom',
                'padding-top', 'padding-left', 'padding-right'
            ];

            foreach ($styles as $style) {
                // Merge defaultStyleCard and styleCard
                $style_data = array_merge(
                    $new_sc[$style]['defaultStyleCard'] ?? [],
                    $new_sc[$style]['styleCard'] ?? []
                );

                foreach ($elements as $element) {
                    if (!isset($style_data[$element])) {
                        continue;
                    }

                    foreach ($settings as $setting) {
                        foreach ($breakpoints as $breakpoint) {
                            $key = "{$setting}-{$breakpoint}";
                            $var_name = "--maxi-{$style}-{$element}-{$setting}-{$breakpoint}";

                            if (isset($style_data[$element][$key])) {
                                $value = $style_data[$element][$key];

                                // Add units if needed
                                if ($setting === 'font-family') {
                                    $value = "\"{$value}\"";
                                } elseif (in_array($setting, ['font-size', 'line-height', 'letter-spacing', 'word-spacing', 'margin-bottom', 'text-indent', 'padding-bottom', 'padding-top', 'padding-left', 'padding-right'])) {
                                    if (is_numeric($value)) {
                                        $value .= 'px';
                                    }
                                }

                                $organized_values[$style][$element][$breakpoint][$setting] = $value;
                            }
                        }
                    }
                }

                // Process colors
                if (isset($style_data['color'])) {
                    for ($i = 1; $i <= 8; $i++) {
                        if (isset($style_data['color'][$i])) {
                            $organized_values[$style]['color'][$i] = $style_data['color'][$i];
                        }
                    }
                }
            }

            // Generate CSS variables string
            $var_sc_string = ':root{';
            foreach ($organized_values as $style => $style_data) {
                foreach ($style_data as $element => $element_data) {
                    if ($element === 'color') {
                        foreach ($element_data as $color_number => $color_value) {
                            $var_sc_string .= "--maxi-{$style}-color-{$color_number}:{$color_value};";
                        }
                        continue;
                    }

                    foreach ($element_data as $breakpoint => $breakpoint_data) {
                        foreach ($breakpoint_data as $setting => $value) {
                            $var_sc_string .= "--maxi-{$style}-{$element}-{$setting}-{$breakpoint}:{$value};";
                        }
                    }
                }
            }
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

    // Helper function to handle array values
    private static function stringify_value($value)
    {
        if (is_array($value)) {
            if (isset($value['value'])) {
                return $value['value'];
            }
            if (isset($value[0])) {
                return $value[0];
            }
            return json_encode($value);
        }
        return $value;
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
            foreach ($elements as $element) {
                foreach ($breakpoints_keys as $breakpoint) {
                    foreach ($settings as $setting) {
                        $label = "--maxi-{$style}-{$element}-{$setting}-{$breakpoint}";

                        if (isset($style_card[$label])) {
                            if (!isset($organized_values[$style])) {
                                $organized_values[$style] = [];
                            }
                            if (!isset($organized_values[$style][$element])) {
                                $organized_values[$style][$element] = [];
                            }
                            if (!isset($organized_values[$style][$element][$breakpoint])) {
                                $organized_values[$style][$element][$breakpoint] = [];
                            }

                            $organized_values[$style][$element][$breakpoint][$setting] = $style_card[$label];
                            unset($style_card[$label]);
                        }
                    }
                }
            }

            // Colors
            for ($i = 1; $i <= 8; $i++) {
                $label = "--maxi-{$style}-color-" . $i;
                if (isset($style_card[$label])) {
                    if (!isset($organized_values[$style])) {
                        $organized_values[$style] = [];
                    }
                    if (!isset($organized_values[$style]['color'])) {
                        $organized_values[$style]['color'] = [];
                    }
                    $organized_values[$style]['color'][$i] = $style_card[$label];
                    unset($style_card[$label]);
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
                $value = isset($organized_values[$style][$target][$breakpoint][$setting])
                    ? $organized_values[$style][$target][$breakpoint][$setting]
                    : null;

                if ($value) {
                    $sentences[$target][] = "{$setting}: var(--maxi-{$style}-{$target}-{$setting}-{$breakpoint});";
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
        $levels = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
        $breakpoints = [
            'xxl' => 1921,
            'xl' => 1920,
            'l' => 1366,
            'm' => 1024,
            's' => 767,
            'xs' => 480,
        ];
        $breakpoint_keys = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

        // Add styles by breakpoint function
        $add_styles_by_breakpoint = function ($breakpoint, $second_prefix = '') use (
            $organized_values,
            $prefix,
            $style,
            $levels
        ) {
            $added_response = '';

            // Get breakpoint level sentences
            $breakpoint_level_sentences = self::get_sentences_by_breakpoint([
                'organized_values' => $organized_values,
                'style' => $style,
                'breakpoint' => $breakpoint,
                'targets' => $levels,
            ]);

            // Process each level's sentences
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

                // Build selectors
                $selectors = [
                    "{$prefix} {$second_prefix} .maxi-{$style}.maxi-block.maxi-text-block",
                    "{$prefix} {$second_prefix} .maxi-{$style} .maxi-block.maxi-text-block",
                    "{$prefix} {$second_prefix} .maxi-{$style}.maxi-map-block__popup__content",
                    "{$prefix} {$second_prefix} .maxi-{$style} .maxi-map-block__popup__content",
                    "{$prefix} {$second_prefix} .maxi-{$style} .maxi-pane-block .maxi-pane-block__header",
                ];

                foreach ($selectors as $selector) {
                    $added_response .= "{$selector} {$level} {" . implode(' ', $sentences) . "}";
                }

                if ($margin_sentence) {
                    // Add margin-bottom for Text Maxi
                    $added_response .= "{$prefix} {$second_prefix} .maxi-{$style}.maxi-block.maxi-text-block {$level} {{$margin_sentence}}";
                    $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .maxi-block.maxi-text-block {$level} {{$margin_sentence}}";
                }
            }

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
