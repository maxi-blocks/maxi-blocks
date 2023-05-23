<?php

function get_hover_effects_background_styles($props, $blockStyle) {
	$response = [
		'general' => [],
	];

	$breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	foreach ($breakpoints as $breakpoint) {
		$currentActiveMedia = get_last_breakpoint_attribute('hover-background-active-media', $breakpoint, $props);

		if (!$currentActiveMedia) {
			continue;
		}

		if ($currentActiveMedia === 'color') {
			$response = array_merge($response, [
				'background' => get_color_background_object(
                    array_merge(
                        get_group_attributes($props, 'backgroundColor', false, 'hover-'), 
                            $blockStyle,
                            $breakpoint,
                            'hover-',
                    )
                ),
			]);
		} elseif ($currentActiveMedia === 'gradient') {
			$response = array_merge($response, [
				'background' => get_gradient_background_object(
                    array_merge(
                        get_group_attributes($props, 'backgroundGradient', false, 'hover-'), 
                            $breakpoint,
                            'hover-',
                    )
                ),
			]);
		}

		if ($currentActiveMedia === 'gradient' && !empty($response['background'][$breakpoint]['background'])) {
			$response['background'][$breakpoint]['background'] = preg_replace_callback('/rgb\(/', function ($matches) use ($props) {
				return 'rgba(';
			}, $response['background'][$breakpoint]['background']);

			$response['background'][$breakpoint]['background'] = preg_replace_callback('/\((\d+),(\d+),(\d+)\)/', function ($matches) use ($props) {
                $val = $props['hover-background-gradient-opacity'] ?? 1;

				return "({$matches[1]},{$matches[2]},{$matches[3]},{$val})";
			}, $response['background'][$breakpoint]['background']);
		}
	}

	return $response;
}
