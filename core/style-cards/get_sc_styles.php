<?php

const STYLES = ['light', 'dark'];
const HEADINGS = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const LEVELS = ['p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'];
const ELEMENTS = ['button', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'icon', 'divider', 'link', 'navigation'];
const BREAKPOINTS = [
    'xxl' => 1921,
    'xl' => 1920,
    'l' => 1366,
    'm' => 1024,
    's' => 767,
    'xs' => 480
];
const BREAKPOINTS_KEYS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
const SETTINGS = [
    'font-family', 'font-size', 'font-style', 'font-weight', 'line-height', 'text-decoration',
    'text-transform', 'letter-spacing', 'white-space', 'word-spacing', 'text-indent',
    'margin-bottom', 'padding-bottom', 'padding-top', 'padding-left', 'padding-right'
];

function get_organized_values($style_card)
{
    $organized_values = [];

    foreach (STYLES as $style) {
        foreach (ELEMENTS as $element) {
            foreach (BREAKPOINTS_KEYS as $breakpoint) {
                foreach (SETTINGS as $setting) {
                    $label = "--maxi-$style-$element-$setting-$breakpoint";

                    if (isset($style_card[$label])) {
                        $organized_values[$style][$element][$breakpoint][$setting] = $style_card[$label];
                        unset($style_card[$label]);
                    }
                }
            }
        }
    }

    // Colors
    foreach (STYLES as $style) {
        for ($i = 1; $i <= 8; $i++) {
            $label = "--maxi-$style-color-$i";

            if (isset($style_card[$label])) {
                $organized_values[$style]['color'][$i] = $style_card[$label];
                unset($style_card[$label]);
            }
        }
    }

    return $organized_values;
}

function get_link_colors_string($organized_values, $prefix, $style)
{
    $response = '';

    if (isset($organized_values[$style]['color'])) {
        for ($i = 1; $i <= 8; $i++) {
            if (isset($organized_values[$style]['color'][$i])) {
                $color_number = $i;

                // Link color
                $response .= "$prefix .maxi-$style.maxi-sc-$style-link-color-$color_number.maxi-block--has-link { --maxi-$style-link-palette: var(--maxi-$style-color-$color_number);}";
                $response .= "$prefix .maxi-$style.maxi-sc-$style-link-color-$color_number a.maxi-block--has-link { --maxi-$style-link-palette: var(--maxi-$style-color-$color_number);}";
                $response .= "$prefix .maxi-$style .maxi-sc-$style-link-color-$color_number.maxi-block--has-link { --maxi-$style-link-palette: var(--maxi-$style-color-$color_number);}";
                $response .= "$prefix .maxi-$style .maxi-sc-$style-link-color-$color_number a.maxi-block--has-link { --maxi-$style-link-palette: var(--maxi-$style-color-$color_number);}";

                // Link hover color
                $response .= "$prefix .maxi-$style.maxi-sc-$style-link-hover-color-$color_number.maxi-block--has-link { --maxi-$style-link-hover-palette: var(--maxi-$style-color-$color_number);}";
                $response .= "$prefix .maxi-$style.maxi-sc-$style-link-hover-color-$color_number a.maxi-block--has-link { --maxi-$style-link-hover-palette: var(--maxi-$style-color-$color_number);}";
                $response .= "$prefix .maxi-$style .maxi-sc-$style-link-hover-color-$color_number.maxi-block--has-link { --maxi-$style-link-hover-palette: var(--maxi-$style-color-$color_number);}";
                $response .= "$prefix .maxi-$style .maxi-sc-$style-link-hover-color-$color_number a.maxi-block--has-link { --maxi-$style-link-hover-palette: var(--maxi-$style-color-$color_number);}";

                // Link active color
                $response .= "$prefix .maxi-$style.maxi-sc-$style-link-active-color-$color_number.maxi-block--has-link { --maxi-$style-link-active-palette: var(--maxi-$style-color-$color_number);}";
                $response .= "$prefix .maxi-$style.maxi-sc-$style-link-active-color-$color_number a.maxi-block--has-link { --maxi-$style-link-active-palette: var(--maxi-$style-color-$color_number);}";
                $response .= "$prefix .maxi-$style .maxi-sc-$style-link-active-color-$color_number.maxi-block--has-link { --maxi-$style-link-active-palette: var(--maxi-$style-color-$color_number);}";
                $response .= "$prefix .maxi-$style .maxi-sc-$style-link-active-color-$color_number a.maxi-block--has-link { --maxi-$style-link-active-palette: var(--maxi-$style-color-$color_number);}";

                // Link visited color
                $response .= "$prefix .maxi-$style.maxi-sc-$style-link-visited-color-$color_number.maxi-block--has-link { --maxi-$style-link-visited-palette: var(--maxi-$style-color-$color_number);}";
                $response .= "$prefix .maxi-$style.maxi-sc-$style-link-visited-color-$color_number a.maxi-block--has-link { --maxi-$style-link-visited-palette: var(--maxi-$style-color-$color_number);}";
                $response .= "$prefix .maxi-$style .maxi-sc-$style-link-visited-color-$color_number.maxi-block--has-link { --maxi-$style-link-visited-palette: var(--maxi-$style-color-$color_number);}";
                $response .= "$prefix .maxi-$style .maxi-sc-$style-link-visited-color-$color_number a.maxi-block--has-link { --maxi-$style-link-visited-palette: var(--maxi-$style-color-$color_number);}";
            }
        }
    }

    return $response;
}

function add_styles_by_breakpoints($add_styles_by_breakpoint, $is_backend)
{
    $added_response = '';

    // General
    $added_response .= $add_styles_by_breakpoint('general');

    // Media queries
    foreach (BREAKPOINTS as $breakpoint => $breakpoint_value) {
        if ($is_backend) {
            $added_response .= $add_styles_by_breakpoint(
                $breakpoint,
                ".edit-post-visual-editor[maxi-blocks-responsive=\"$breakpoint\"]"
            );
        } else {
            $media_query_type = $breakpoint !== 'xxl' ? 'max' : 'min';
            $added_response .= "@media ($media_query_type-width: {$breakpoint_value}px) {";
            $added_response .= $add_styles_by_breakpoint($breakpoint);
            $added_response .= '}';
        }
    }

    return $added_response;
}

function get_sentences_by_breakpoint($organized_values, $style, $breakpoint, $targets)
{
    $sentences = [];

    foreach ($targets as $target) {
        foreach (SETTINGS as $setting) {
            $value = $organized_values[$style][$target][$breakpoint][$setting] ?? null;

            if ($value) {
                $sentences[$target][] = "$setting: var(--maxi-$style-$target-$setting-$breakpoint);";
            }
        }

        // Ensure the target key exists even if there are no sentences
        if (!isset($sentences[$target])) {
            $sentences[$target] = [];
        }
    }

    return $sentences;
}

function get_maxi_sc_styles($args)
{
    $organized_values = $args['organized_values'];
    $prefix = $args['prefix'];
    $style = $args['style'];
    $is_backend = $args['is_backend'];

    $response = '';

    /**
     * Add styles by breakpoint.
     *
     * @param string $breakpoint   Breakpoint.
     * @param string $second_prefix Second prefix.
     *
     * @return string The added styles.
     */
    $add_styles_by_breakpoint = function ($breakpoint, $second_prefix = '') use ($organized_values, $style, $prefix) {
        $added_response = '';
        $breakpoint_level_sentences = get_sentences_by_breakpoint(
            $organized_values,
            $style,
            $breakpoint,
            LEVELS,
        );

        foreach ($breakpoint_level_sentences as $level => $sentences) {
            $targets = [
                "$prefix $second_prefix .maxi-$style.maxi-block.maxi-text-block",
                "$prefix $second_prefix .maxi-$style .maxi-block.maxi-text-block",
                "$prefix $second_prefix .maxi-$style.maxi-map-block__popup__content",
                "$prefix $second_prefix .maxi-$style .maxi-map-block__popup__content",
                "$prefix $second_prefix .maxi-$style .maxi-pane-block .maxi-pane-block__header",
            ];

            // Remove margin-bottom sentences
            $margin_sentence = array_search('margin-bottom', $sentences);
            if ($margin_sentence !== false) {
                unset($sentences[$margin_sentence]);
            }

            foreach ($targets as $target) {
                $added_response .= "$target $level {" . implode(' ', $sentences) . "}";
            }

            if ($margin_sentence !== false) {
                // margin-bottom for Text Maxi
                $added_response .= "$prefix $second_prefix .maxi-$style.maxi-block.maxi-text-block $level {$margin_sentence}";
                $added_response .= "$prefix $second_prefix .maxi-$style .maxi-block.maxi-text-block $level {$margin_sentence}";
            }
        }

        // Text Maxi list styles
        $list_targets = [
            "$prefix $second_prefix .maxi-{$style}maxi-list-block ul.maxi-text-block__content",
            "$prefix $second_prefix .maxi-$style .maxi-list-block ul.maxi-text-block__content",
            "$prefix $second_prefix .maxi-{$style}maxi-list-block ol.maxi-text-block__content",
            "$prefix $second_prefix .maxi-$style .maxi-list-block ol.maxi-text-block__content",
        ];

        foreach ($list_targets as $target) {
            $sentences = $breakpoint_level_sentences['p'];
            $margin_sentence = array_search('margin-bottom', $sentences);
            if ($margin_sentence !== false) {
                $added_response .= "$target $margin_sentence";
            }
        }

        $li_targets = [
            "$prefix $second_prefix .maxi-$style.maxi-block.maxi-text-block li",
            "$prefix $second_prefix .maxi-$style .maxi-block.maxi-text-block li",
            "$prefix $second_prefix .maxi-$style .maxi-pagination a",
        ];

        foreach ($li_targets as $target) {
            $sentences = $breakpoint_level_sentences['p'];
            // Remove margin-bottom sentences
            $margin_sentence = array_search('margin-bottom', $sentences);
            if ($margin_sentence !== false) {
                unset($sentences[$margin_sentence]);
            }
            $added_response .= "$target {" . implode(' ', $sentences) . "}";
        }

        // Text Maxi when has link
        $text_maxi_link_prefix = "$prefix $second_prefix .maxi-$style.maxi-block.maxi-block--has-link > .maxi-text-block__content:not(p)";
        $added_response .= "$text_maxi_link_prefix { color: var(--maxi-$style-link); }";
        $added_response .= "$text_maxi_link_prefix:hover { color: var(--maxi-$style-link-hover); }";
        $added_response .= "$text_maxi_link_prefix:focus { color: var(--maxi-$style-link-hover); }";
        $added_response .= "$text_maxi_link_prefix:active { color: var(--maxi-$style-link-active); }";
        $added_response .= "$text_maxi_link_prefix:visited { color: var(--maxi-$style-link-visited); }";

        $text_block_link_targets = [
            "$prefix $second_prefix .maxi-$style.maxi-block.maxi-text-block a.maxi-block--has-link",
            "$prefix $second_prefix .maxi-$style.maxi-block .maxi-text-block a.maxi-block--has-link",
        ];

        foreach ($text_block_link_targets as $target) {
            $added_response .= "$target { color: var(--maxi-$style-link); }";
            $added_response .= "$target:hover { color: var(--maxi-$style-link-hover); }";
            $added_response .= "$target:hover span { color: var(--maxi-$style-link-hover); }";
            $added_response .= "$target:focus { color: var(--maxi-$style-link-hover); }";
            $added_response .= "$target:focus span { color: var(--maxi-$style-link-hover); }";
            $added_response .= "$target:active { color: var(--maxi-$style-link-active); }";
            $added_response .= "$target:active span { color: var(--maxi-$style-link-active); }";
            $added_response .= "$target:visited { color: var(--maxi-$style-link-visited); }";
            $added_response .= "$target:visited span { color: var(--maxi-$style-link-visited); }";
        }

        // Image Maxi
        $image_maxi_targets = [
            "$prefix $second_prefix .maxi-$style.maxi-image-block .maxi-hover-details",
            "$prefix $second_prefix .maxi-$style .maxi-image-block .maxi-hover-details",
        ];

        foreach ($image_maxi_targets as $target) {
            $image_sentences = [
                'h4' => $breakpoint_level_sentences['h4'],
                'p' => $breakpoint_level_sentences['p'],
            ];

            foreach ($image_sentences as $level => $sentences) {
                if ($level !== 'p') {
                    // Remove margin-bottom sentences
                    $margin_sentence = array_search('margin-bottom', $sentences);
                    if ($margin_sentence !== false) {
                        unset($sentences[$margin_sentence]);
                    }
                }
                $added_response .= "$target $level {" . implode(' ', $sentences) . "}";
            }
        }

        // Image Maxi caption
        $image_caption_targets = [
            "$prefix $second_prefix .maxi-$style.maxi-image-block figcaption",
            "$prefix $second_prefix .maxi-$style .maxi-image-block figcaption",
        ];

        foreach ($image_caption_targets as $target) {
            $sentences = $breakpoint_level_sentences['p'];
            // Remove margin-bottom sentences
            $margin_sentence = array_search('margin-bottom', $sentences);
            if ($margin_sentence !== false) {
                unset($sentences[$margin_sentence]);
            }
            $added_response .= "$target {" . implode(' ', $sentences) . "}";
        }

        // Search Maxi
        $search_maxi_targets = [
            "$prefix $second_prefix .maxi-$style.maxi-search-block .maxi-search-block__input",
            "$prefix $second_prefix .maxi-$style .maxi-search-block .maxi-search-block__input",
            "$prefix $second_prefix .maxi-$style.maxi-search-block .maxi-search-block__button__content",
            "$prefix $second_prefix .maxi-$style .maxi-search-block .maxi-search-block__button__content",
        ];

        foreach ($search_maxi_targets as $target) {
            $sentences = $breakpoint_level_sentences['p'];
            // Remove margin-bottom sentences
            $margin_sentence = array_search('margin-bottom', $sentences);
            if ($margin_sentence !== false) {
                unset($sentences[$margin_sentence]);
            }
            $added_response .= "$target {" . implode(' ', $sentences) . "}";
        }

        // Button Maxi
        $button_sentences = get_sentences_by_breakpoint(
            $organized_values,
            $style,
            $breakpoint,
            ['button'],
        );

        $button_maxi_targets = [
            "$prefix $second_prefix .maxi-$style.maxi-block.maxi-button-block .maxi-button-block__content",
            "$prefix $second_prefix .maxi-$style.maxi-block .maxi-button-block .maxi-button-block__content",
        ];

        foreach ($button_maxi_targets as $target) {
            $sentences = $button_sentences['button'];
            // Set font-family paragraph variable as backup for the button font-family variables
            foreach ($sentences as &$sentence) {
                if (strpos($sentence, 'font-family') !== false) {
                    $p_var = str_replace(['font-family: ', 'button', ';'], ['', 'p', ''], $sentence);
                    $sentence = str_replace(')', ", $p_var)", $sentence);
                }
            }
            unset($sentence);

            if (!in_array('font-family', $sentences)) {
                // $p_font_family_var = array_filter($breakpoint_level_sentences['p'], function ($sentence) {
                //     return strpos($sentence, 'font-family') !== false;
                // })[0];
                // undefined array key 0,
                $p_font_family_filtered = array_filter($breakpoint_level_sentences['p'], function ($sentence) {
                    return strpos($sentence, 'font-family') !== false;
                });
                $p_font_family_var = array_shift($p_font_family_filtered);
                if ($p_font_family_var) {
                    $sentences[] = $p_font_family_var;
                }
            }

            // Remove margin-bottom sentences
            $margin_sentence = array_search('margin-bottom', $sentences);
            if ($margin_sentence !== false) {
                unset($sentences[$margin_sentence]);
            }
            $added_response .= "$target {" . implode(' ', $sentences) . "}";
        }

        // Navigation inside Maxi Container
        $navigation_sentences = get_sentences_by_breakpoint(
            $organized_values,
            $style,
            $breakpoint,
            ['navigation'],
        );

        $target_item = "$prefix $second_prefix .maxi-$style.maxi-container-block .wp-block-navigation .wp-block-navigation__container .wp-block-navigation-item";
        $sentences = $navigation_sentences['navigation'];
        // Remove margin-bottom sentences
        $margin_sentence = array_search('margin-bottom', $sentences);
        if ($margin_sentence !== false) {
            unset($sentences[$margin_sentence]);
        }
        $added_response .= "$target_item {" . implode(' ', $sentences) . "}";

        $target_link = "$target_item a";
        $target_button = "$target_item button";

        foreach ([$target_link, $target_button] as $target) {
            $added_response .= "$target { color: var(--maxi-$style-menu-item); transition: color 0.3s 0s ease;}";
            $added_response .= "$target span { color: var(--maxi-$style-menu-item); transition: color 0.3s 0s ease; }";
            $added_response .= "$target + span { color: var(--maxi-$style-menu-item); transition: color 0.3s 0s ease;}";
            $added_response .= "$target + button { color: var(--maxi-$style-menu-item); transition: color 0.3s 0s ease;}";
            $added_response .= "$target:hover { color: var(--maxi-$style-menu-item-hover); }";
            $added_response .= "$target:hover span { color: var(--maxi-$style-menu-item-hover); }";
            $added_response .= "$target:hover + span { color: var(--maxi-$style-menu-item-hover); }";
            $added_response .= "$target:hover + button { color: var(--maxi-$style-menu-item-hover); }";
        }

        $added_response .= "$target_link:focus { color: var(--maxi-$style-menu-item-hover); }";
        $added_response .= "$target_link:focus span { color: var(--maxi-$style-menu-item-hover); }";
        $added_response .= "$target_link:focus + span { color: var(--maxi-$style-menu-item-hover); }";
        $added_response .= "$target_link:focus + button { color: var(--maxi-$style-menu-item-hover); }";
        $added_response .= "$target_link:visited { color: var(--maxi-$style-menu-item-visited); }";
        $added_response .= "$target_link:visited span { color: var(--maxi-$style-menu-item-visited); }";
        $added_response .= "$target_link:visited + span { color: var(--maxi-$style-menu-item-visited); }";
        $added_response .= "$target_link:visited + button { color: var(--maxi-$style-menu-item-visited); }";
        $added_response .= "$target_link:visited:hover { color: var(--maxi-$style-menu-item-hover); }";
        $added_response .= "$target_link:visited:hover span { color: var(--maxi-$style-menu-item-hover); }";
        $added_response .= "$target_link:visited:hover + span { color: var(--maxi-$style-menu-item-hover); }";
        $added_response .= "$target_link:visited:hover + button { color: var(--maxi-$style-menu-item-hover); }";

        $target_link_current = "$target_item.current-menu-item > a";
        $added_response .= "$target_link_current { color: var(--maxi-$style-menu-item-current); }";
        $added_response .= "$target_link_current span { color: var(--maxi-$style-menu-item-current); }";
        $added_response .= "$target_link_current + span { color: var(--maxi-$style-menu-item-current); }";
        $added_response .= "$target_link_current + button { color: var(--maxi-$style-menu-item-current); }";
        $added_response .= "$target_link_current:hover { color: var(--maxi-$style-menu-item-hover); }";
        $added_response .= "$target_link_current:hover span { color: var(--maxi-$style-menu-item-hover); }";
        $added_response .= "$target_link_current:hover + span { color: var(--maxi-$style-menu-item-hover); }";
        $added_response .= "$target_link_current:hover + button { color: var(--maxi-$style-menu-item-hover); }";
        $added_response .= "$target_link_current:focus { color: var(--maxi-$style-menu-item-hover); }";
        $added_response .= "$target_link_current:focus span { color: var(--maxi-$style-menu-item-hover); }";
        $added_response .= "$target_link_current:focus + span { color: var(--maxi-$style-menu-item-hover); }";
        $added_response .= "$target_link_current:focus + button { color: var(--maxi-$style-menu-item-hover); }";

        // mobile menu icon / text
        $burger_item = "$prefix $second_prefix .maxi-$style.maxi-container-block .wp-block-navigation button.wp-block-navigation__responsive-container-open";
        $burger_item_close = "$prefix $second_prefix .maxi-$style.maxi-container-block .wp-block-navigation button.wp-block-navigation__responsive-container-close";

        foreach ([$burger_item, $burger_item_close] as $target) {
            $added_response .= "$target { color: var(--maxi-$style-menu-burger); }";
            foreach ($sentences as $i => $sentence) {
                if (strpos($sentence, 'font-family') !== false) {
                    $added_response .= "$target { font-family: var(--maxi-$style-navigation-font-family-general); }";
                }
            }
        }

        // mobile menu background
        $mobile_menu_bg_target = "$prefix $second_prefix .maxi-$style.maxi-container-block .wp-block-navigation .wp-block-navigation__responsive-container.has-modal-open";
        $added_response .= "$mobile_menu_bg_target { background-color: var(--maxi-$style-menu-mobile-bg) !important; }";

        // sub-menus
        $sub_menu_target = "$prefix $second_prefix .maxi-$style.maxi-container-block .wp-block-navigation .wp-block-navigation__container ul li";
        $sub_menu_target_editor = "$prefix $second_prefix .maxi-$style.maxi-container-block .wp-block-navigation .wp-block-navigation__container .wp-block-navigation__submenu-container > div";
        $added_response .= "$sub_menu_target { background-color: var(--maxi-$style-menu-item-sub-bg); }";
        $added_response .= "$sub_menu_target:hover { background-color: var(--maxi-$style-menu-item-sub-bg-hover); }";
        $added_response .= "$sub_menu_target_editor { background-color: var(--maxi-$style-menu-item-sub-bg) !important; }";
        $added_response .= "$sub_menu_target_editor:hover { background-color: var(--maxi-$style-menu-item-sub-bg-hover) !important; }";

        foreach ([$sub_menu_target, $sub_menu_target_editor] as $target) {
            $added_response .= "$target.current-menu-item { background-color: var(--maxi-$style-menu-item-sub-bg-current); }";
            $added_response .= "$target.current-menu-item:hover { background-color: var(--maxi-$style-menu-item-sub-bg-hover); }";
        }

        return $added_response;
    };

    $response .= add_styles_by_breakpoints($add_styles_by_breakpoint, $is_backend);

    return $response;
}

/**
 * Get WordPress native styles.
 *
 * @param array $args {
 *     An array of arguments.
 *
 *     @type array  $organized_values Organized values.
 *     @type array  $style_card       Style card.
 *     @type string $prefix           Prefix.
 *     @type string $style            Style.
 *     @type bool   $is_backend       Whether it's backend or not.
 * }
 *
 * @return string The generated CSS styles.
 */
function get_wp_native_styles($args)
{
    $organized_values = $args['organized_values'];
    $style_card = $args['style_card'];
    $prefix = $args['prefix'];
    $style = $args['style'];
    $is_backend = $args['is_backend'];

    $response = '';
    $native_wp_prefix = $is_backend ? 'wp-block[data-type^="core/"]' : 'maxi-block--use-sc';

    /**
     * Add styles by breakpoint.
     *
     * @param string $breakpoint   Breakpoint.
     * @param string $second_prefix Second prefix.
     *
     * @return string The added styles.
     */
    $add_styles_by_breakpoint = function ($breakpoint, $second_prefix = '') use ($organized_values, $style, $prefix, $native_wp_prefix, $style_card) {
        $added_response = '';
        $breakpoint_level_sentences = get_sentences_by_breakpoint(
            $organized_values,
            $style,
            $breakpoint,
            LEVELS,
        );

        foreach ($breakpoint_level_sentences as $level => $sentences) {
            // Remove margin-bottom sentences
            $margin_sentence = array_search('margin-bottom', $sentences);
            if ($margin_sentence) {
                $index = array_search($margin_sentence, $sentences);
                array_splice($sentences, $index, 1);
            }

            $selectors = [
                "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} {$level}",
                "{$prefix} {$second_prefix} .maxi-{$style} {$level}.{$native_wp_prefix}",
                "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} {$level} a",
                "{$prefix} {$second_prefix} .maxi-{$style} {$level}.{$native_wp_prefix} a",
                $level === 'p' ? "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} div:has(> a, > time > a):not(.wp-element-button):not(.wp-block-navigation-item)" : '',
                $level === 'p' ? "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-block-post-comments-form .comment-form textarea" : '',
                $level === 'p' ? "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-block-post-comments-form .comment-reply-title small a" : '',
            ];
            $selectors = array_filter($selectors);
            $selectors = implode(', ', $selectors);

            $added_response .= "{$selectors} {" . implode(' ', $sentences) . "}";

            // In case the level is paragraph, we add the same styles for lists
            if ($level === 'p') {
                $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} li.{$native_wp_prefix} {" . implode(' ', $sentences) . "}";
            }

            // Adds margin-bottom sentence to all elements except the last one
            if ($margin_sentence) {
                $added_response .= ":is({$selectors}):not(:last-child) {{$margin_sentence}}";
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
            }
        }

        // Button Maxi
        $button_sentences = get_sentences_by_breakpoint(
            $organized_values,
            $style,
            $breakpoint,
            ['button'],
        )['button'];

        // Set font-family paragraph variable as backup for the button font-family variables
        foreach ($button_sentences as $i => $sentence) {
            if (strpos($sentence, 'font-family') !== false) {
                $p_var = str_replace(['font-family: ', 'button', ';'], ['', 'p', ''], $sentence);
                $new_sentence = str_replace(')', ", {$p_var})", $sentence);
                $button_sentences[$i] = $new_sentence;
            }
        }

        foreach ($button_sentences as $sentence) {
            if (strpos($sentence, 'font-family') !== false) {
                $p_font_family_var = array_filter($breakpoint_level_sentences['p'], function ($sentence) {
                    return strpos($sentence, 'font-family') !== false;
                })[0];
                $button_sentences[] = $p_font_family_var;
                break;
            }
        }

        // Remove margin-bottom sentences
        $margin_sentence = array_search('margin-bottom', $button_sentences);
        if ($margin_sentence) {
            $index = array_search($margin_sentence, $button_sentences);
            array_splice($button_sentences, $index, 1);
        }

        $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-element-button {" . implode(' ', [
            ...$button_sentences,
            isset($style_card["--maxi-{$style}-button-color"]) ? "color: var(--maxi-{$style}-button-color);" : "color: var(--maxi-{$style}-p-color,rgba(var(--maxi-{$style}-color-3,155,155,155),1));",
        ]) . "}";

        if (isset($style_card["--maxi-{$style}-button-color-hover"])) {
            $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-element-button:hover {color: var(--maxi-{$style}-button-color-hover);}";
        }

        // General color
        $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix}, {$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-block-post-comments-form .comment-reply-title small {color: var(--maxi-{$style}-p-color,rgba(var(--maxi-{$style}-color-3,155,155,155),1));}";

        // Headings color
        foreach (HEADINGS as $heading) {
            $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} {$heading}.{$native_wp_prefix}, {$prefix} .maxi-{$style} .{$native_wp_prefix} {$heading} {color: var(--maxi-{$style}-{$heading}-color,rgba(var(--maxi-{$style}-color-5,0,0,0),1));}";
        }

        // Button color
        $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-element-button {background: var(--maxi-{$style}-button-background-color,rgba(var(--maxi-{$style}-color-4,255,74,23),1));}";

        // Button color hover
        if (isset($style_card["--maxi-{$style}-button-background-color-hover"])) {
            $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-element-button:hover {background: var(--maxi-{$style}-button-background-color-hover);}";
        }

        // Remove form textarea background
        $added_response .= "{$prefix} {$second_prefix} .maxi-{$style} .{$native_wp_prefix} .wp-block-post-comments-form .comment-form textarea {background: transparent; color: inherit;}";

        return $added_response;
    };

    $response .= add_styles_by_breakpoints($add_styles_by_breakpoint, $is_backend);

    return $response;
}

/**
 * Gives a style card object and returns the CSS styles for SC for each block.
 *
 * @param array $raw_style_card The raw style card object.
 * @param bool $gutenberg_blocks_status The status of Gutenberg blocks.
 * @param bool $is_backend Indicates if it's the backend (default: false).
 * @return string The CSS styles for SC.
 */
function get_sc_styles($raw_style_card, $gutenberg_blocks_status, $is_backend = false)
{
    $style_card = array_merge([], $raw_style_card);
    $response = '';
    $prefix = 'body.maxi-blocks--active';
    $organized_values = get_organized_values($style_card);

    // Create styles
    foreach (STYLES as $style) {
        // Link colors
        $response .= get_link_colors_string(
            $organized_values,
            $prefix,
            $style,
        );

        // Maxi styles
        $response .= get_maxi_sc_styles([
            'organized_values' => $organized_values,
            'prefix' => $prefix,
            'style' => $style,
            'is_backend' => $is_backend,
        ]);

        // WP native blocks styles
        if ($gutenberg_blocks_status) {
            $response .= get_wp_native_styles([
                'organized_values' => $organized_values,
                'style_card' => $style_card,
                'prefix' => $prefix,
                'style' => $style,
                'is_backend' => $is_backend,
            ]);
        }
    }

    return process_css($response);
}
