<?php

function get_link_styles(array $obj, string $target, string $block_style)
{
    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
    $response = [
        "$target" => ['link' => []],
        "{$target}:hover" => ['link' => []],
        "{$target}:active" => ['link' => []],
        "{$target}:active span" => ['link' => []],
        "{$target}:visited" => ['link' => []],
        "{$target}:visited span" => ['link' => []],
        ".block-editor-block-list__block {$target}:visited" => ['link' => []],
        ".block-editor-block-list__block {$target}:visited:hover" => ['link' => []],
        "{$target}:visited:hover" => ['link' => []],
        "{$target}:visited:hover span" => ['link' => []],
    ];

    $get_text_decoration = function ($breakpoint, $isHover = false) use ($obj) {
        $hoverStatus = $obj['typography-status-hover'] ?? false;
        $value = $obj[get_attribute_key('text-decoration', $isHover, '', $breakpoint)] ?? null;
        return isset($value) && ($hoverStatus || !$isHover) && $value;
    };

    foreach ($breakpoints as $breakpoint) {
        $response[$target]['link'][$breakpoint] = [];

        $decoration = $get_text_decoration($breakpoint);
        if ($decoration) {
            $response[$target]['link'][$breakpoint]['text-decoration'] = $decoration;
        }

        $palette_attributes = get_palette_attributes([
            'obj' => $obj,
            'prefix' => 'link-',
            'breakpoint' => $breakpoint,
        ]);

        $link_palette_status = $palette_attributes['palette_status'];
        $link_palette_sc_status = $palette_attributes['palette_sc_status'];
        $link_palette_color = $palette_attributes['palette_color'];
        $link_palette_opacity = $palette_attributes['palette_opacity'];
        $link_color = $palette_attributes['color'];

        if (is_bool($link_palette_status) && !$link_palette_status) {
            $response[".block-editor-block-list__block {$target}:visited"]['link'][$breakpoint] = [];

            $response[$target]['link'][$breakpoint]['color'] = $link_color;
            $response[".block-editor-block-list__block {$target}:visited"]['link'][$breakpoint]['color'] = $link_color;
        } elseif ($link_palette_color) {
            $response[".block-editor-block-list__block {$target}:visited"]['link'][$breakpoint] = [];

            $color_string = get_color_rgba_string(
                $link_palette_sc_status
                    ? [
                        'first_var' => "color-{$link_palette_color}",
                        'opacity' => $link_palette_opacity,
                        'block_style' => $block_style,
                    ]
                    : [
                        'first_var' => 'link',
                        'second_var' => "color-{$link_palette_color}",
                        'opacity' => $link_palette_opacity,
                        'block_style' => $block_style,
                    ]
            );

            $response[$target]['link'][$breakpoint]['color'] = $color_string;
            $response[".block-editor-block-list__block {$target}:visited"]['link'][$breakpoint]['color'] = $color_string;
        }

        $response["{$target}:hover"]['link'][$breakpoint] = [];
        $hover_decoration = $get_text_decoration($breakpoint);
        if ($hover_decoration) {
            $response[$target]['link'][$breakpoint]['text-decoration'] = $hover_decoration;
        }

        $hover_palette_attributes = get_palette_attributes([
            'obj' => $obj,
            'prefix' => 'link-hover-',
            'breakpoint' => $breakpoint
        ]);

        $link_hover_palette_status = $hover_palette_attributes['palette_status'];
        $link_hover_palette_sc_status = $hover_palette_attributes['palette_sc_status'];
        $link_hover_palette_color = $hover_palette_attributes['palette_color'];
        $link_hover_palette_opacity = $hover_palette_attributes['palette_opacity'];
        $link_hover_color = $hover_palette_attributes['color'];

        if (is_bool($link_hover_palette_status) && !$link_hover_palette_status) {
            $response["{$target}:visited:hover"]['link'][$breakpoint] = [];
            $response[".block-editor-block-list__block {$target}:visited:hover"]['link'][$breakpoint] = [];
            $response["{$target}:visited:hover span"]['link'][$breakpoint] = [];

            $response["{$target}:hover"]['link'][$breakpoint]['color'] = $link_hover_color;
            $response["{$target}:visited:hover"]['link'][$breakpoint]['color'] = $link_hover_color;
            $response[".block-editor-block-list__block {$target}:visited:hover"]['link'][$breakpoint]['color'] = $link_hover_color;
            $response["{$target}:visited:hover span"]['link'][$breakpoint]['color'] = $link_hover_color;
        } elseif ($link_hover_palette_color) {
            $color = get_color_rgba_string(
                $link_hover_palette_sc_status
                    ? [
                        'first_var' => "color-{$link_hover_palette_color}",
                        'opacity' => $link_hover_palette_opacity,
                        'block_style' => $block_style,
                    ]
                    : [
                        'first_var' => 'link-hover',
                        'second_var' => "color-{$link_hover_palette_color}",
                        'opacity' => $link_hover_palette_opacity,
                        'block_style' => $block_style,
                    ]
            );

            $response["{$target}:hover"]['link'][$breakpoint]['color'] = $color;

            $response["{$target}:visited:hover"]['link'][$breakpoint] = ['color' => $color];
            $response[".block-editor-block-list__block {$target}:visited:hover"]['link'][$breakpoint] = ['color' => $color];
            $response["{$target}:visited:hover span"]['link'][$breakpoint] = ['color' => $color];
        }

        $active_palette_attributes = get_palette_attributes([
            'obj' => $obj,
            'prefix' => 'link-active-',
            'breakpoint' => $breakpoint
        ]);

        $link_active_palette_status = $active_palette_attributes['palette_status'];
        $link_active_palette_sc_status = $active_palette_attributes['palette_sc_status'];
        $link_active_palette_color = $active_palette_attributes['palette_color'];
        $link_active_palette_opacity = $active_palette_attributes['palette_opacity'];
        $link_active_color = $active_palette_attributes['color'];

        if (is_bool($link_active_palette_status) && !$link_active_palette_status) {
            $response["{$target}:active"]['link'][$breakpoint] = [];
            $response["{$target}:active span"]['link'][$breakpoint] = [];

            $response["{$target}:active"]['link'][$breakpoint]['color'] = $link_active_color;
            $response["{$target}:active span"]['link'][$breakpoint]['color'] = $link_active_color;
        } elseif ($link_active_palette_color) {
            $color = get_color_rgba_string(
                $link_active_palette_sc_status
                    ? [
                        'first_var' => "color-{$link_active_palette_color}",
                        'opacity' => $link_active_palette_opacity,
                        'block_style' => $block_style,
                    ]
                    : [
                        'first_var' => 'link-active',
                        'second_var' => "color-{$link_active_palette_color}",
                        'opacity' => $link_active_palette_opacity,
                        'block_style' => $block_style,
                    ]
            );

            $response["{$target}:active"]['link'][$breakpoint] = ['color' => $color];
            $response["{$target}:active span"]['link'][$breakpoint] = ['color' => $color];
        }

        $visited_palette_attributes = get_palette_attributes([
            'obj' => $obj,
            'prefix' => 'link-visited-',
            'breakpoint' => $breakpoint
        ]);

        $link_visited_palette_status = $visited_palette_attributes['palette_status'];
        $link_visited_palette_sc_status = $visited_palette_attributes['palette_sc_status'];
        $link_visited_palette_color = $visited_palette_attributes['palette_color'];
        $link_visited_palette_opacity = $visited_palette_attributes['palette_opacity'];
        $link_visited_color = $visited_palette_attributes['color'];

        if (is_bool($link_visited_palette_status) && !$link_visited_palette_status) {
            $response["{$target}:visited"]['link'][$breakpoint] = [];
            $response["{$target}:visited span"]['link'][$breakpoint] = [];

            $response["{$target}:visited"]['link'][$breakpoint]['color'] = $link_visited_color;
            $response["{$target}:visited span"]['link'][$breakpoint]['color'] = $link_visited_color;
        } elseif ($link_visited_palette_color) {
            $color = get_color_rgba_string(
                $link_visited_palette_sc_status
                    ? [
                        'first_var' => "color-{$link_visited_palette_color}",
                        'opacity' => $link_visited_palette_opacity,
                        'block_style' => $block_style,
                    ]
                    : [
                        'first_var' => 'link-visited',
                        'second_var' => "color-{$link_visited_palette_color}",
                        'opacity' => $link_visited_palette_opacity,
                        'block_style' => $block_style,
                    ]
            );

            $response["{$target}:visited"]['link'][$breakpoint] = ['color' => $color];
            $response["{$target}:visited span"]['link'][$breakpoint] = ['color' => $color];
        }
    }

    return $response;
}
