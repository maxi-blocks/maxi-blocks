<?php

/**
 * Get the last breakpoint attribute value.
 *
 * @param string $target The name of the attribute target.
 * @param string $breakpoint The name of the breakpoint.
 * @param array $attributes The attributes.
 * @return mixed
 */
// function get_last_breakpoint_attribute($target, $breakpoint, $attributes)
// {
// 	$breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

// 	if(property_exists($attributes, $target . '-' . $breakpoint))
// 		return $attributes->{$target . '-' . $breakpoint};

// 	$breakpoint_pos = array_search($breakpoint, $breakpoints);

// 	$attr = null;

// 	while (
// 		$breakpoint_pos >= 0 &&
// 		is_null($attr)
// 	) {
// 		if(property_exists($attributes, $target . '-' . $breakpoints[$breakpoint_pos]))
// 			$attr = $attributes->{$target . '-' . $breakpoints[$breakpoint_pos]};

// 		$breakpoint_pos -= 1;
// 	}

// 	return $attr;
// }
