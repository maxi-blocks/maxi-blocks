<?php

function get_divider_styles($obj, $target, $block_style, $is_hover = false, $prefix = '', $use_bottom_border = false)
{
    $response = [
        'label' => 'Divider',
        'general' => [],
    ];

    $get_color = function ($breakpoint, $obj, $prefix, $is_hover) use ($block_style) {
        $palette_attributes = get_palette_attributes([
            'obj' => $obj,
            'prefix' => $prefix . "divider-border-",
            'breakpoint' => $breakpoint,
            'is_hover' => $is_hover,
        ]);

        $palette_status = $palette_attributes['palette_status'];
        $palette_sc_status = $palette_attributes['palette_sc_status'];
        $palette_color = $palette_attributes['palette_color'];
        $palette_opacity = $palette_attributes['palette_opacity'];
        $color = $palette_attributes['color'];

        if ($palette_status && is_numeric($palette_color)) {
            $border_color = $palette_sc_status ? get_color_rgba_string([
                'first_var' => "color-$palette_color",
                'opacity' => $palette_opacity,
                'block_style' => $block_style,
            ]) : get_color_rgba_string([
                'first_var' => $prefix . "divider-color",
                'second_var' => "color-$palette_color",
                'opacity' => $palette_opacity,
                'block_style' => $block_style,
            ]);

            return ['border-color' => $border_color];
        }

        return ['border-color' => $color];
    };

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        if ($target === 'line') {
            $is_horizontal = get_last_breakpoint_attribute([
                'target' => $prefix . "line-orientation",
                'breakpoint' => $breakpoint,
                'attributes' => $obj,
                'is_hover' => $is_hover,
            ]) === 'horizontal';

            $divider_border_style = get_last_breakpoint_attribute([
                'target' => $prefix . "divider-border-style",
                'breakpoint' => $breakpoint,
                'attributes' => $obj,
                'is_hover' => $is_hover,
            ]);

            $position_horizontal = $use_bottom_border ? 'bottom' : 'top';
            $position_vertical = 'right';

            $divider_line_weight = $is_horizontal ? get_last_breakpoint_attribute([
                'target' => $prefix . "divider-border-top-width",
                'breakpoint' => $breakpoint,
                'attributes' => $obj,
                'is_hover' => $is_hover,
            ]) : get_last_breakpoint_attribute([
                'target' => $prefix . "divider-border-$position_vertical-width",
                'breakpoint' => $breakpoint,
                'attributes' => $obj,
                'is_hover' => $is_hover,
            ]);

            $divider_line_weight_unit = get_last_breakpoint_attribute([
                'target' => $is_horizontal ? $prefix . "divider-border-top-unit" : $prefix . "divider-border-$position_vertical-unit",
                'breakpoint' => $breakpoint,
                'attributes' => $obj,
                'is_hover' => $is_hover,
            ]) ?? 'px';

            $divider_size = $is_horizontal ? get_last_breakpoint_attribute([
                'target' => $prefix . "divider-width",
                'breakpoint' => $breakpoint,
                'attributes' => $obj,
                'is_hover' => $is_hover,
            ]) : get_last_breakpoint_attribute([
                'target' => $prefix . "divider-height",
                'breakpoint' => $breakpoint,
                'attributes' => $obj,
                'is_hover' => $is_hover,
            ]);

            $divider_size_unit = get_last_breakpoint_attribute([
                'target' => $prefix . "divider-width-unit",
                'breakpoint' => $breakpoint,
                'attributes' => $obj,
                'is_hover' => $is_hover,
            ]) ?? 'px';

            $divider_border_radius = get_last_breakpoint_attribute([
                'target' => $prefix . "divider-border-radius",
                'breakpoint' => $breakpoint,
                'attributes' => $obj,
                'is_hover' => $is_hover,
            ]);

            $styles = [];

            if ($is_horizontal) {
                $styles = [
                    "border-$position_horizontal-style" => $divider_border_style,
                    "border-$position_vertical-style" => 'none',
                ];

                if (!is_null($divider_line_weight)) {
                    $styles["border-$position_horizontal-width"] = "$divider_line_weight$divider_line_weight_unit";
                    $styles['height'] = "$divider_line_weight$divider_line_weight_unit";
                }
                if (!is_null($divider_size)) {
                    $styles['width'] = "$divider_size$divider_size_unit";
                }
            } else {
                $styles = [
                    "border-$position_horizontal-style" => 'none',
                    "border-$position_vertical-style" => $divider_border_style,
                ];

                if (!is_null($divider_line_weight)) {
                    $style["border-$position_vertical-width"] = "$divider_line_weight$divider_line_weight_unit";
                    $style['width'] = "$divider_line_weight$divider_line_weight_unit";
                }
                if (!is_null($divider_size)) {
                    $styles['height'] = "$divider_size%";
                }
            }

            if ($divider_border_style === 'solid') {
                if ($divider_border_radius) {
                    $styles['border-radius'] = "20px";
                } elseif (get_last_breakpoint_attribute([
                    'target' => $prefix . "divider-border-radius",
                    'breakpoint' => get_prev_breakpoint($breakpoint),
                    'attributes' => $obj,
                    'is_hover' => $is_hover,
                ])) {
                    $styles['border-radius'] = "0px";
                }
            }

            $response[$breakpoint] = array_merge(
                $get_color($breakpoint, $obj, $prefix, $is_hover),
                $styles
            );
        } else {
            $response[$breakpoint] = [
                'flex-direction' => 'row',
                'align-items' => $obj["line-vertical-$breakpoint"] ?? get_last_breakpoint_attribute([
                    'target' => $prefix . "line-vertical",
                    'breakpoint' => $breakpoint,
                    'attributes' => $obj,
                    'is_hover' => $is_hover,
                ]),
                'justify-content' => $obj["line-horizontal-$breakpoint"] ?? get_last_breakpoint_attribute([
                    'target' => $prefix . "line-horizontal",
                    'breakpoint' => $breakpoint,
                    'attributes' => $obj,
                    'is_hover' => $is_hover,
                ]),
            ];
        }
    }

    return $response;
}
