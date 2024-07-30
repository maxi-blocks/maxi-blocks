<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_color_rgba_string.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_group_attributes.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_last_breakpoint_attribute.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/style-cards/utils.php';


function get_color_string($obj, $target, $style)
{
    $prefix = $target ? "{$target}-" : '';
    $palette_status = $obj["{$prefix}palette-status"];
    $palette_color = $obj["{$prefix}palette-color"];
    $palette_opacity = $obj["{$prefix}palette-opacity"];
    $color = $obj["{$prefix}color"] ?? null;

    if ($palette_status) {
        return get_color_rgba_string([
            'first_var' => "color-{$palette_color}",
            'block_style' => $style,
            'opacity' => $palette_opacity,
        ]);
    } else {
        return $color;
    }
}

function get_parsed_obj($obj)
{
    $new_obj = $obj ? array_merge([], $obj) : [];
    $typography_obj = get_group_attributes(
        $new_obj,
        'typography',
        false,
        '',
        true
    );
    foreach (array_keys($typography_obj) as $key) {
        unset($new_obj[$key]);
    }
    foreach (get_typography_styles([
        'obj' => $typography_obj,
        'disable_globals' => true,
        'is_style_cards' => true,
    ]) as $breakpoint => $value) {
        foreach ($value as $key => $val) {
            $new_obj[$key . '-' . $breakpoint] = $val;
        }
    }
    return $new_obj;
}

/**
 * Get the SC variables object.
 *
 * @param array $style_cards The style cards array.
 * @param string|null $raw_active_sc_colour The raw active SC colour.
 * @param bool $clean_response Whether to return a clean response.
 * @return array The SC variables object.
 */
function get_sc_variables_object($style_cards, $raw_active_sc_colour = null, $clean_response = false)
{
    $response = [];
    $styles = ['light', 'dark'];
    $elements = [
        'button',
        'p',
        'h1',
        'h2',
        'h3',
        'h4',
        'h5',
        'h6',
        'icon',
        'divider',
        'link',
        'navigation',
    ];
    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
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
        'margin-bottom',
        'text-indent',
        'padding-bottom',
        'padding-top',
        'padding-left',
        'padding-right',
    ];
    $sc = [
        'dark' => array_merge(
            $style_cards['dark']['defaultStyleCard'] ?? [],
            $style_cards['dark']['styleCard'] ?? []
        ),
        'light' => array_merge(
            $style_cards['light']['defaultStyleCard'] ?? [],
            $style_cards['light']['styleCard'] ?? []
        ),
    ];
    $elements_for_color = ['divider', 'icon', 'link'];
    $active_sc_colour = $raw_active_sc_colour ?? get_active_colour_from_sc($style_cards, 4);

    foreach ($styles as $style) {
        foreach ($elements as $element) {
            $obj = get_parsed_obj(isset($sc[$style][$element]) ? $sc[$style][$element] : array());
            if (!in_array($element, $elements_for_color)) {
                foreach ($settings as $setting) {
                    $is_font_family = $setting === 'font-family';
                    foreach ($breakpoints as $breakpoint) {
                        if (!$clean_response) {
                            if (!str_contains($setting, 'padding')) {
                                $response["--maxi-{$style}-{$element}-{$setting}-{$breakpoint}"] = get_last_breakpoint_attribute([
                                    'target' => $setting,
                                    'breakpoint' => $breakpoint,
                                    'attributes' => $obj,
                                ]);
                            } else {
                                $unit_setting = "{$setting}-unit";
                                $unit_value = get_last_breakpoint_attribute([
                                    'target' => $unit_setting,
                                    'breakpoint' => $breakpoint,
                                    'attributes' => $obj,
                                ]);
                                if ($unit_value) {
                                    $response["--maxi-{$style}-{$element}-{$setting}-{$breakpoint}"] = get_last_breakpoint_attribute([
                                        'target' => $setting,
                                        'breakpoint' => $breakpoint,
                                        'attributes' => $obj,
                                    ]) . $unit_value;
                                } else {
                                    $response["--maxi-{$style}-{$element}-{$setting}-{$breakpoint}"] = get_last_breakpoint_attribute([
                                        'target' => $setting,
                                        'breakpoint' => $breakpoint,
                                        'attributes' => $obj,
                                    ]) . 'px';
                                }
                            }
                        } elseif(isset($obj["{$setting}-{$breakpoint}"]) && $obj["{$setting}-{$breakpoint}"]) {
                            $value = $obj["{$setting}-{$breakpoint}"];
                            if (get_is_valid($value, true)) {
                                if (!str_contains($setting, 'padding')) {
                                    $response["--maxi-{$style}-{$element}-{$setting}-{$breakpoint}"] = $value;
                                } else {
                                    // Padding
                                    $unit_setting = "{$setting}-unit";
                                    $unit_value = isset($obj["{$unit_setting}-{$breakpoint}"]) ? $obj["{$unit_setting}-{$breakpoint}"] : null;
                                    if ($unit_value) {
                                        $response["--maxi-{$style}-{$element}-{$setting}-{$breakpoint}"] = $value . $unit_value;
                                    } else {
                                        $response["--maxi-{$style}-{$element}-{$setting}-{$breakpoint}"] = $value . 'px';
                                    }
                                }
                            }
                        }
                        // Font family needs quotes for values that have space in the middle
                        if (
                            $is_font_family &&
                            isset($response["--maxi-{$style}-{$element}-{$setting}-{$breakpoint}"]) &&
                            $response["--maxi-{$style}-{$element}-{$setting}-{$breakpoint}"] &&
                            get_is_valid(
                                $response["--maxi-{$style}-{$element}-{$setting}-{$breakpoint}"],
                                true
                            )
                        ) {
                            // In case there's no button font-family, use the paragraph one
                            if (
                                $element === 'button' &&
                                empty(
                                    str_replace('"', '', $response["--maxi-{$style}-{$element}-{$setting}-{$breakpoint}"])
                                )
                            ) {
                                $p_obj = get_parsed_obj($sc[$style]['p']);
                                if (!$clean_response) {
                                    $response["--maxi-{$style}-{$element}-{$setting}-{$breakpoint}"] = get_last_breakpoint_attribute([
                                        'target' => $setting,
                                        'breakpoint' => $breakpoint,
                                        'attributes' => $p_obj,
                                    ]);
                                } else {
                                    $value = $p_obj["{$setting}-{$breakpoint}"];
                                    if (get_is_valid($value, true)) {
                                        $response["--maxi-{$style}-{$element}-{$setting}-{$breakpoint}"] = $value;
                                    }
                                }
                            } else {
                                $response["--maxi-{$style}-{$element}-{$setting}-{$breakpoint}"] = '"' . str_replace('""', '"', $response["--maxi-{$style}-{$element}-{$setting}-{$breakpoint}"]) . '"';
                            }
                        }
                    }
                }
            }
            if (isset($obj['color-global']) && $obj['color-global']) {
                $response["--maxi-{$style}-{$element}-color"] = get_color_string($obj, null, $style);
            }
            switch ($element) {
                case 'button':
                    if (isset($obj['background-color-global']) && $obj['background-color-global']) {
                        $response["--maxi-{$style}-{$element}-background-color"] = get_color_string($obj, 'background', $style);
                    }
                    if (isset($obj['hover-background-color-global']) && $obj['hover-background-color-global']) {
                        $response["--maxi-{$style}-{$element}-background-color-hover"] = get_color_string($obj, 'hover-background', $style);
                    }
                    if (isset($obj['hover-color-global']) && $obj['hover-color-global']) {
                        $response["--maxi-{$style}-{$element}-color-hover"] = get_color_string($obj, 'hover', $style);
                    }
                    if (isset($obj['border-color-global']) && $obj['border-color-global']) {
                        $response["--maxi-{$style}-{$element}-border-color"] = get_color_string($obj, 'border', $style);
                    }
                    if (isset($obj['hover-border-color-global']) && $obj['hover-border-color-global']) {
                        $response["--maxi-{$style}-{$element}-border-color-hover"] = get_color_string($obj, 'hover-border', $style);
                    }
                    break;
                case 'icon':
                    if (isset($obj['line-color-global']) && $obj['line-color-global']) {
                        $response["--maxi-{$style}-{$element}-stroke"] = get_color_string($obj, 'line', $style);
                    }
                    if (isset($obj['fill-color-global']) && $obj['fill-color-global']) {
                        $response["--maxi-{$style}-{$element}-fill"] = get_color_string($obj, 'fill', $style);
                    }
                    if (isset($obj['hover-line-color-global']) && $obj['hover-line-color-global']) {
                        $response["--maxi-{$style}-{$element}-stroke-hover"] = get_color_string($obj, 'hover-line', $style);
                    }
                    if (isset($obj['hover-fill-color-global']) && $obj['hover-fill-color-global']) {
                        $response["--maxi-{$style}-{$element}-fill-hover"] = get_color_string($obj, 'hover-fill', $style);
                    }
                    break;
                case 'link':
                    if (isset($obj['link-color-global']) && $obj['link-color-global']) {
                        $response["--maxi-{$style}-link"] = get_color_string($obj, 'link', $style);
                    }
                    if (isset($obj['hover-color-global']) && $obj['hover-color-global']) {
                        $response["--maxi-{$style}-link-hover"] = get_color_string($obj, 'hover', $style);
                    }
                    if (isset($obj['active-color-global']) && $obj['active-color-global']) {
                        $response["--maxi-{$style}-link-active"] = get_color_string($obj, 'active', $style);
                    }
                    if (isset($obj['visited-color-global']) && $obj['visited-color-global']) {
                        $response["--maxi-{$style}-link-visited"] = get_color_string($obj, 'visited', $style);
                    }
                    break;
                case 'navigation':
                    if (isset($obj['menu-item-color-global']) && $obj['menu-item-color-global']) {
                        $response["--maxi-{$style}-menu-item"] = get_color_string($obj, 'menu-item', $style);
                    }
                    if (isset($obj['menu-burger-color-global']) && $obj['menu-burger-color-global']) {
                        $response["--maxi-{$style}-menu-burger"] = get_color_string($obj, 'menu-burger', $style);
                    }
                    if (isset($obj['menu-item-hover-color-global']) && $obj['menu-item-hover-color-global']) {
                        $response["--maxi-{$style}-menu-item-hover"] = get_color_string($obj, 'menu-item-hover', $style);
                    }
                    if (isset($obj['menu-item-current-color-global']) && $obj['menu-item-current-color-global']) {
                        $response["--maxi-{$style}-menu-item-current"] = get_color_string($obj, 'menu-item-current', $style);
                    }
                    if (isset($obj['menu-item-visited-color-global']) && $obj['menu-item-visited-color-global']) {
                        $response["--maxi-{$style}-menu-item-visited"] = get_color_string($obj, 'menu-item-visited', $style);
                    } elseif (isset($obj['menu-item-color-global']) && $obj['menu-item-color-global']) {
                        $response["--maxi-{$style}-menu-item-visited"] = get_color_string($obj, 'menu-item', $style);
                    }
                    if (isset($obj['menu-item-sub-bg-color-global']) && $obj['menu-item-sub-bg-color-global']) {
                        $response["--maxi-{$style}-menu-item-sub-bg"] = get_color_string($obj, 'menu-item-sub-bg', $style);
                    }
                    if (isset($obj['menu-item-sub-bg-hover-color-global']) && $obj['menu-item-sub-bg-hover-color-global']) {
                        $response["--maxi-{$style}-menu-item-sub-bg-hover"] = get_color_string($obj, 'menu-item-sub-bg-hover', $style);
                    }
                    if (isset($obj['menu-item-sub-bg-current-color-global']) && $obj['menu-item-sub-bg-current-color-global']) {
                        $response["--maxi-{$style}-menu-item-sub-bg-current"] = get_color_string($obj, 'menu-item-sub-bg-current', $style);
                    }
                    if (isset($obj['menu-mobile-bg-color-global']) && $obj['menu-mobile-bg-color-global']) {
                        $response["--maxi-{$style}-menu-mobile-bg"] = get_color_string($obj, 'menu-mobile-bg', $style);
                    }
                    break;
                default:
                    break;
            }
        }
        if (isset($sc[$style]['color']) && $sc[$style]['color']) {
            for ($n = 1; $n <= 8; $n++) {
                if (isset($sc[$style]['color'][$n])) {
                    $response["--maxi-{$style}-color-{$n}"] = $sc[$style]['color'][$n];
                }
            }
        }
    }
    $response['--maxi-active-sc-color'] = $active_sc_colour;
    return $response;
}
