<?php

function get_link_styles($obj, $target, $blockStyle) {
	$breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
	$response = [
		$target => ['link' => []],
		"{$target}:hover" => ['link' => []],
		"{$target}:active" => ['link' => []],
		"{$target}:active span" => ['link' => []],
		"{$target}:visited" => ['link' => []],
		"{$target}:visited span" => ['link' => []],
		".block-editor-block-list__block {$target}:visited" => ['link' => []],
		"{$target}:visited:hover" => ['link' => []]
	];

	$get_text_decoration = function($breakpoint, $isHover = false) use ($obj) {
		$hoverStatus = $obj['typography-status-hover'];
		$value = $obj[get_attribute_key('text-decoration', $isHover, '', $breakpoint)];
		return isset($value) && ($hoverStatus || !$isHover) && $value;
	};

	foreach ($breakpoints as $breakpoint) {
		$response[$target]['link'][$breakpoint] = [];

		$decoration = $get_text_decoration($breakpoint);
		if ($decoration) {
			$response[$target]['link'][$breakpoint]['text-decoration'] = $decoration;
		}

		$linkPalette = get_palette_attributes([
			'obj' => $obj,
			'prefix' => 'link-',
			'breakpoint' => $breakpoint
		]);
		
		if (is_bool($linkPalette['paletteStatus']) && !$linkPalette['paletteStatus']) {
			$response[".block-editor-block-list__block {$target}:visited"]['link'][$breakpoint] = [];
			$response[$target]['link'][$breakpoint]['color'] = $linkPalette['color'];
			$response[".block-editor-block-list__block {$target}:visited"]['link'][$breakpoint]['color'] = $linkPalette['color'];
		} else if (isset($linkPalette['paletteColor'])) {
			$colorString = $linkPalette['paletteSCStatus'] ?
                get_color_rgba_string(
                        "color-{$linkPalette['paletteColor']}",
                        $linkPalette['paletteOpacity'],
                        $blockStyle
                ) :
               get_color_rgba_string(
					'link',
					"color-{$linkPalette['paletteColor']}",
                    $linkPalette['paletteOpacity'],
                    $blockStyle
			);
			$response[$target]['link'][$breakpoint]['color'] = $colorString;
			$response[".block-editor-block-list__block {$target}:visited"]['link'][$breakpoint] = ['color' => $colorString];
		}

		$response["{$target}:hover"]['link'][$breakpoint] = [];
		$hoverDecoration = $get_text_decoration($breakpoint);
		if ($hoverDecoration) {
			$response[$target]['link'][$breakpoint]['text-decoration'] = $hoverDecoration;
		}

		$linkHoverPalette = get_palette_attributes([
			'obj' => $obj,
			'prefix' => 'link-hover-',
			'breakpoint' => $breakpoint
		]);

		if (is_bool($linkHoverPalette['paletteStatus']) && !$linkHoverPalette['paletteStatus']) {
			$response["{$target}:visited:hover"]['link'][$breakpoint] = [];
			$response["{$target}:hover"]['link'][$breakpoint]['color'] = $linkHoverPalette['color'];
			$response["{$target}:visited:hover"]['link'][$breakpoint]['color'] = $linkHoverPalette['color'];
		} else if (isset($linkHoverPalette['paletteColor'])) {
			$color = $linkHoverPalette['paletteSCStatus'] ?
                get_color_rgba_string(
                        "color-{$linkHoverPalette['paletteColor']}",
                        $linkHoverPalette['paletteOpacity'],
                        $blockStyle
                ) :
                get_color_rgba_string(
                        'link-hover',
                        "color-{$linkHoverPalette['paletteColor']}",
                        $linkHoverPalette['paletteOpacity'],
                        $blockStyle
                );
			$response["{$target}:hover"]['link'][$breakpoint]['color'] = $color;
			$response["{$target}:visited:hover"]['link'][$breakpoint] = ['color' => $color];
		}

		$linkActivePalette = get_palette_attributes([
			'obj' => $obj,
			'prefix' => 'link-active-',
			'breakpoint' => $breakpoint
		]);

		if (is_bool($linkActivePalette['paletteStatus']) && !$linkActivePalette['paletteStatus']) {
			$response["{$target}:active"]['link'][$breakpoint] = [];
			$response["{$target}:active span"]['link'][$breakpoint] = [];
			$response["{$target}:active"]['link'][$breakpoint]['color'] = $linkActivePalette['color'];
			$response["{$target}:active span"]['link'][$breakpoint]['color'] = $linkActivePalette['color'];
		} else if (isset($linkActivePalette['paletteColor'])) {
			$color = $linkActivePalette['paletteSCStatus'] ?
                get_color_rgba_string(
                        "color-{$linkActivePalette['paletteColor']}",
                        $linkActivePalette['paletteOpacity'],
                        $blockStyle
                ) :
				get_color_rgba_string(
					'link-active',
					"color-{$linkActivePalette['paletteColor']}",
					$linkActivePalette['paletteOpacity'],
                    $blockStyle
			);
			$response["{$target}:active"]['link'][$breakpoint] = ['color' => $color];
			$response["{$target}:active span"]['link'][$breakpoint] = ['color' => $color];
		}

		$linkVisitedPalette = get_palette_attributes([
			'obj' => $obj,
			'prefix' => 'link-visited-',
			'breakpoint' => $breakpoint
		]);

		if (is_bool($linkVisitedPalette['paletteStatus']) && !$linkVisitedPalette['paletteStatus']) {
			$response["{$target}:visited"]['link'][$breakpoint] = [];
			$response["{$target}:visited span"]['link'][$breakpoint] = [];
			$response["{$target}:visited"]['link'][$breakpoint]['color'] = $linkVisitedPalette['color'];
			$response["{$target}:visited span"]['link'][$breakpoint]['color'] = $linkVisitedPalette['color'];
		} else if (isset($linkVisitedPalette['paletteColor'])) {
			$color = $linkVisitedPalette['paletteSCStatus'] ?
                get_color_rgba_string(
                        "color-{$linkVisitedPalette['paletteColor']}",
                        $linkVisitedPalette['paletteOpacity'],
                        $blockStyle
                ) :
				get_color_rgba_string(
					'link-visited',
					"color-{$linkVisitedPalette['paletteColor']}",
					$linkVisitedPalette['paletteOpacity'],
                    $blockStyle
			);
			$response["{$target}:visited"]['link'][$breakpoint] = ['color' => $color];
			$response["{$target}:visited span"]['link'][$breakpoint] = ['color' => $color];
		}
	}

	return $response;
}
