<?php

function get_icon_path_styles($obj, $is_hover = false, $prefix = '') {
	$response = [
		'label' => 'Icon path',
		'general' => [],
	];

	$breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	foreach ($breakpoints as $breakpoint) {
		$response[$breakpoint] = [];

		$iconStroke = $obj[get_attribute_key('icon-stroke', $is_hover, $prefix, $breakpoint)];

		if (!is_null($iconStroke)) {
			$response[$breakpoint]['stroke-width'] = $iconStroke;
		}

		if (empty($response[$breakpoint]) && $breakpoint !== 'general') {
			unset($response[$breakpoint]);
		}
	}

	return ['iconPath' => $response];
}
