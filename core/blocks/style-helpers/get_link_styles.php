<?php

function get_link_styles($obj, $target, $blockStyle)
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

        $linkPaletteStatus = $linkPaletteSCStatus = $linkPaletteColor = $linkPaletteOpacity = $linkColor = null;
        get_palette_attributes([
            'obj' => $obj,
            'prefix' => 'link-',
            'breakpoint' => $breakpoint,
            'linkPaletteStatus' => $linkPaletteStatus,
            'linkPaletteSCStatus' => $linkPaletteSCStatus,
            'linkPaletteColor' => $linkPaletteColor,
            'linkPaletteOpacity' => $linkPaletteOpacity,
            'linkColor' => $linkColor,
        ]);

        if (is_bool($linkPaletteStatus) && !$linkPaletteStatus) {
            $response[".block-editor-block-list__block {$target}:visited"]['link'][$breakpoint] = [];

            $response[$target]['link'][$breakpoint]['color'] = $linkColor;
            $response[".block-editor-block-list__block {$target}:visited"]['link'][$breakpoint]['color'] = $linkColor;
        } elseif ($linkPaletteColor) {
            $response[".block-editor-block-list__block {$target}:visited"]['link'][$breakpoint] = [];

            $colorString = get_color_rgba_string(
                $linkPaletteSCStatus
                    ? [
                        'firstVar' => "color-{$linkPaletteColor}",
                        'opacity' => $linkPaletteOpacity,
                        'block_style' => $blockStyle,
                    ]
                    : [
                        'firstVar' => 'link',
                        'secondVar' => "color-{$linkPaletteColor}",
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

        $linkHoverPaletteStatus = $linkHoverPaletteSCStatus = $linkHoverPaletteColor = $linkHoverPaletteOpacity = $linkHoverColor = null;
        get_palette_attributes([
            'obj' => $obj,
            'prefix' => 'link-hover-',
            'breakpoint' => $breakpoint,
            'linkPaletteStatus' => $linkHoverPaletteStatus,
            'linkPaletteSCStatus' => $linkHoverPaletteSCStatus,
            'linkPaletteColor' => $linkHoverPaletteColor,
            'linkPaletteOpacity' => $linkHoverPaletteOpacity,
            'linkColor' => $linkHoverColor,
        ]);

        if (is_bool($linkHoverPaletteStatus) && !$linkHoverPaletteStatus) {
            $response["{$target}:visited:hover"]['link'][$breakpoint] = [];

            $response["{$target}:hover"]['link'][$breakpoint]['color'] = $linkHoverColor;
            $response["{$target}:visited:hover"]['link'][$breakpoint]['color'] = $linkHoverColor;
        } elseif ($linkHoverPaletteColor) {
            $color = get_color_rgba_string(
                $linkHoverPaletteSCStatus
                    ? [
                        'firstVar' => "color-{$linkHoverPaletteColor}",
                        'opacity' => $linkHoverPaletteOpacity,
                        'block_style' => $blockStyle,
                    ]
                    : [
                        'firstVar' => 'link-hover',
                        'secondVar' => "color-{$linkHoverPaletteColor}",
                        'opacity' => $linkHoverPaletteOpacity,
                        'block_style' => $blockStyle,
                    ]
            );

            $response["{$target}:hover"]['link'][$breakpoint]['color'] = $color;

            $response["{$target}:visited:hover"]['link'][$breakpoint] = ['color' => $color];
        }

        $linkActivePaletteStatus = $linkActivePaletteSCStatus = $linkActivePaletteColor = $linkActivePaletteOpacity = $linkActiveColor = null;
        get_palette_attributes([
            'obj' => $obj,
            'prefix' => 'link-active-',
            'breakpoint' => $breakpoint,
            'linkPaletteStatus' => $linkActivePaletteStatus,
            'linkPaletteSCStatus' => $linkActivePaletteSCStatus,
            'linkPaletteColor' => $linkActivePaletteColor,
            'linkPaletteOpacity' => $linkActivePaletteOpacity,
            'linkColor' => $linkActiveColor,
        ]);

        if (is_bool($linkActivePaletteStatus) && !$linkActivePaletteStatus) {
            $response["{$target}:active"]['link'][$breakpoint] = [];
            $response["{$target}:active span"]['link'][$breakpoint] = [];

            $response["{$target}:active"]['link'][$breakpoint]['color'] = $linkActiveColor;
            $response["{$target}:active span"]['link'][$breakpoint]['color'] = $linkActiveColor;
        } elseif ($linkActivePaletteColor) {
            $color = get_color_rgba_string(
                $linkActivePaletteSCStatus
                    ? [
                        'firstVar' => "color-{$linkActivePaletteColor}",
                        'opacity' => $linkActivePaletteOpacity,
                        'block_style' => $blockStyle,
                    ]
                    : [
                        'firstVar' => 'link-active',
                        'secondVar' => "color-{$linkActivePaletteColor}",
                        'opacity' => $linkActivePaletteOpacity,
                        'block_style' => $blockStyle,
                    ]
            );

            $response["{$target}:active"]['link'][$breakpoint] = ['color' => $color];
            $response["{$target}:active span"]['link'][$breakpoint] = ['color' => $color];
        }

        $linkVisitedPaletteStatus = $linkVisitedPaletteSCStatus = $linkVisitedPaletteColor = $linkVisitedPaletteOpacity = $linkVisitedColor = null;
        get_palette_attributes([
            'obj' => $obj,
            'prefix' => 'link-visited-',
            'breakpoint' => $breakpoint,
            'linkPaletteStatus' => $linkVisitedPaletteStatus,
            'linkPaletteSCStatus' => $linkVisitedPaletteSCStatus,
            'linkPaletteColor' => $linkVisitedPaletteColor,
            'linkPaletteOpacity' => $linkVisitedPaletteOpacity,
            'linkColor' => $linkVisitedColor,
        ]);

        if (is_bool($linkVisitedPaletteStatus) && !$linkVisitedPaletteStatus) {
            $response["{$target}:visited"]['link'][$breakpoint] = [];
            $response["{$target}:visited span"]['link'][$breakpoint] = [];

            $response["{$target}:visited"]['link'][$breakpoint]['color'] = $linkVisitedColor;
            $response["{$target}:visited span"]['link'][$breakpoint]['color'] = $linkVisitedColor;
        } elseif ($linkVisitedPaletteColor) {
            $color = get_color_rgba_string(
                $linkVisitedPaletteSCStatus
                    ? [
                        'firstVar' => "color-{$linkVisitedPaletteColor}",
                        'opacity' => $linkVisitedPaletteOpacity,
                        'block_style' => $blockStyle,
                    ]
                    : [
                        'firstVar' => 'link-visited',
                        'secondVar' => "color-{$linkVisitedPaletteColor}",
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
