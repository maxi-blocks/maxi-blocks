<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_attribute_key.php';

function get_attribute_value($target, $props, $isHover, $breakpoint, $prefix = '', $allowNil = false) {
	$value = $props[get_attribute_key($target, $isHover, $prefix, $breakpoint)];

	if (($value || is_int($value) || is_bool($value) || empty($value)) && isset($value))
		return $value;

	if (!$allowNil && (!isset($breakpoint) || $breakpoint === 'general') && $isHover && !isset($value))
		return get_attribute_value($target, $props, false, $breakpoint, $prefix);

	return $props[get_attribute_key($target, false, $prefix)];
}

function get_attributes_value($target, $props, $isHover, $breakpoint, $prefix = '', $allowNil = false, $returnObj = false) {
	if (is_array($target)) {
		if ($returnObj) {
			$acc = array();
			foreach ($target as $item) {
				$acc[$item] = get_attribute_value($item, $props, $isHover, $breakpoint, $prefix, $allowNil);
			}
			return $acc;
		} else {
			return array_map(function ($item) use ($props, $isHover, $breakpoint, $prefix, $allowNil) {
				return get_attribute_value($item, $props, $isHover, $breakpoint, $prefix, $allowNil);
			}, $target);
		}
	}

	return get_attribute_value($target, $props, $isHover, $breakpoint, $prefix, $allowNil);
}