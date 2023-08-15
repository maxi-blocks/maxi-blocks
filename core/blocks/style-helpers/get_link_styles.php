<?php

function get_link_styles(array $obj, string $target, array $blockStyle)
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
        "{$target}:visited:hover" => ['link' => []],
    ];

    $getTextDecoration = function ($breakpoint, $isHover = false) use ($obj) {
        $hoverStatus = $obj['typography-status-hover'] ?? false;
        $value = $obj[get_attribute_key('text-decoration', $isHover, '', $breakpoint)] ?? null;
        return isset($value) && ($hoverStatus || !$isHover) && $value;
    };

    foreach ($breakpoints as $breakpoint) {
        $response[$target]['link'][$breakpoint] = [];

        $decoration = $getTextDecoration($breakpoint);
        if ($decoration) {
            $response[$target]['link'][$breakpoint]['text-decoration'] = $decoration;
        }

        $paletteAttributes = get_palette_attributes([
            'obj' => $obj,
            'prefix' => 'link-',
            'breakpoint' => $breakpoint
        ]);

        $linkPaletteStatus = $paletteAttributes['palette_status'];
        $linkPaletteSCStatus = $paletteAttributes['palette_sc_status'];
        $linkPaletteColor = $paletteAttributes['palette_color'];
        $linkPaletteOpacity = $paletteAttributes['palette_opacity'];
        $linkColor = $paletteAttributes['color'];


        if (is_bool($linkPaletteStatus) && !$linkPaletteStatus) {
            $response[".block-editor-block-list__block {$target}:visited"]['link'][$breakpoint] = [];

            $response[$target]['link'][$breakpoint]['color'] = $linkColor;
            $response[".block-editor-block-list__block {$target}:visited"]['link'][$breakpoint]['color'] = $linkColor;
        } elseif ($linkPaletteColor) {
            $response[".block-editor-block-list__block {$target}:visited"]['link'][$breakpoint] = [];

            $colorString = get_color_rgba_string(
                $linkPaletteSCStatus
                    ? [
                        'first_var' => "color-{$linkPaletteColor}",
                        'opacity' => $linkPaletteOpacity,
                        'block_style' => $blockStyle,
                    ]
                    : [
                        'first_var' => 'link',
                        'second_var' => "color-{$linkPaletteColor}",
                        'opacity' => $linkPaletteOpacity,
                        'block_style' => $blockStyle,
                    ]
            );

            $response[$target]['link'][$breakpoint]['color'] = $colorString;
            $response[".block-editor-block-list__block {$target}:visited"]['link'][$breakpoint]['color'] = $colorString;
        }

        $response["{$target}:hover"]['link'][$breakpoint] = [];
        $hoverDecoration = $getTextDecoration($breakpoint);
        if ($hoverDecoration) {
            $response[$target]['link'][$breakpoint]['text-decoration'] = $hoverDecoration;
        }

        $hoverPaletteAttributes = get_palette_attributes([
            'obj' => $obj,
            'prefix' => 'link-hover-',
            'breakpoint' => $breakpoint
        ]);

        $linkHoverPaletteStatus = $hoverPaletteAttributes['palette_status'];
        $linkHoverPaletteSCStatus = $hoverPaletteAttributes['palette_sc_status'];
        $linkHoverPaletteColor = $hoverPaletteAttributes['palette_color'];
        $linkHoverPaletteOpacity = $hoverPaletteAttributes['palette_opacity'];
        $linkHoverColor = $hoverPaletteAttributes['color'];

        if (is_bool($linkHoverPaletteStatus) && !$linkHoverPaletteStatus) {
            $response["{$target}:visited:hover"]['link'][$breakpoint] = [];

            $response["{$target}:hover"]['link'][$breakpoint]['color'] = $linkHoverColor;
            $response["{$target}:visited:hover"]['link'][$breakpoint]['color'] = $linkHoverColor;
        } elseif ($linkHoverPaletteColor) {
            $color = get_color_rgba_string(
                $linkHoverPaletteSCStatus
                    ? [
                        'first_var' => "color-{$linkHoverPaletteColor}",
                        'opacity' => $linkHoverPaletteOpacity,
                        'block_style' => $blockStyle,
                    ]
                    : [
                        'first_var' => 'link-hover',
                        'second_var' => "color-{$linkHoverPaletteColor}",
                        'opacity' => $linkHoverPaletteOpacity,
                        'block_style' => $blockStyle,
                    ]
            );

            $response["{$target}:hover"]['link'][$breakpoint]['color'] = $color;

            $response["{$target}:visited:hover"]['link'][$breakpoint] = ['color' => $color];
        }

        $activePaletteAttributes = get_palette_attributes([
            'obj' => $obj,
            'prefix' => 'link-active-',
            'breakpoint' => $breakpoint
        ]);

        $linkActivePaletteStatus = $activePaletteAttributes['palette_status'];
        $linkActivePaletteSCStatus = $activePaletteAttributes['palette_sc_status'];
        $linkActivePaletteColor = $activePaletteAttributes['palette_color'];
        $linkActivePaletteOpacity = $activePaletteAttributes['palette_opacity'];
        $linkActiveColor = $activePaletteAttributes['color'];

        if (is_bool($linkActivePaletteStatus) && !$linkActivePaletteStatus) {
            $response["{$target}:active"]['link'][$breakpoint] = [];
            $response["{$target}:active span"]['link'][$breakpoint] = [];

            $response["{$target}:active"]['link'][$breakpoint]['color'] = $linkActiveColor;
            $response["{$target}:active span"]['link'][$breakpoint]['color'] = $linkActiveColor;
        } elseif ($linkActivePaletteColor) {
            $color = get_color_rgba_string(
                $linkActivePaletteSCStatus
                    ? [
                        'first_var' => "color-{$linkActivePaletteColor}",
                        'opacity' => $linkActivePaletteOpacity,
                        'block_style' => $blockStyle,
                    ]
                    : [
                        'first_var' => 'link-active',
                        'second_var' => "color-{$linkActivePaletteColor}",
                        'opacity' => $linkActivePaletteOpacity,
                        'block_style' => $blockStyle,
                    ]
            );

            $response["{$target}:active"]['link'][$breakpoint] = ['color' => $color];
            $response["{$target}:active span"]['link'][$breakpoint] = ['color' => $color];
        }

        $visitedPaletteAttributes = get_palette_attributes([
            'obj' => $obj,
            'prefix' => 'link-visited-',
            'breakpoint' => $breakpoint
        ]);

        $linkVisitedPaletteStatus = $visitedPaletteAttributes['palette_status'];
        $linkVisitedPaletteSCStatus = $visitedPaletteAttributes['palette_sc_status'];
        $linkVisitedPaletteColor = $visitedPaletteAttributes['palette_color'];
        $linkVisitedPaletteOpacity = $visitedPaletteAttributes['palette_opacity'];
        $linkVisitedColor = $visitedPaletteAttributes['color'];

        if (is_bool($linkVisitedPaletteStatus) && !$linkVisitedPaletteStatus) {
            $response["{$target}:visited"]['link'][$breakpoint] = [];
            $response["{$target}:visited span"]['link'][$breakpoint] = [];

            $response["{$target}:visited"]['link'][$breakpoint]['color'] = $linkVisitedColor;
            $response["{$target}:visited span"]['link'][$breakpoint]['color'] = $linkVisitedColor;
        } elseif ($linkVisitedPaletteColor) {
            $color = get_color_rgba_string(
                $linkVisitedPaletteSCStatus
                    ? [
                        'first_var' => "color-{$linkVisitedPaletteColor}",
                        'opacity' => $linkVisitedPaletteOpacity,
                        'block_style' => $blockStyle,
                    ]
                    : [
                        'first_var' => 'link-visited',
                        'second_var' => "color-{$linkVisitedPaletteColor}",
                        'opacity' => $linkVisitedPaletteOpacity,
                        'block_style' => $blockStyle,
                    ]
            );

            $response["{$target}:visited"]['link'][$breakpoint] = ['color' => $color];
            $response["{$target}:visited span"]['link'][$breakpoint] = ['color' => $color];
        }
    }

    return $response;
}
