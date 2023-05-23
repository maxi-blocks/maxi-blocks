<?php

function get_shape_styles($obj, $target, $blockStyle) {
	$response = [
		'label' => 'Shape',
		'general' => []
	];

	if ($target === 'svg' && isset($obj['shape-width'])) {
		$response['general']['max-width'] = $obj['shape-width'] . $obj['shape-width-unit'];
		$response['general']['max-height'] = $obj['shape-width'] . $obj['shape-width-unit'];
	}

	if ($target === 'path') {
		$palette_attributes = get_palette_attributes(
             $obj,
             'shape-fill-',
		);

		$palette_status = $palette_attributes['paletteStatus'];
		$palette_color = $palette_attributes['paletteColor'];
		$palette_opacity = $palette_attributes['paletteOpacity'];
		$color = $palette_attributes['color'];

		if ($palette_status && $palette_color) {
			$response['general']['fill'] = get_color_rgba_string(
                "color-$palette_color",
                $palette_opacity,
                $blockStyle
			);
		} else if (!$palette_status && isset($color)) {
			$response['general']['fill'] = $color;
		}
	}

	return $response;
}
