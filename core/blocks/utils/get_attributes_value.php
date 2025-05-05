<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_attribute_key.php';

function get_attribute_value(string $target, array $props, bool $isHover, ?string $breakpoint = null, string $prefix = '', bool $allow_nil = false) {
	$attributes_key = get_attribute_key($target, $isHover, $prefix, $breakpoint);

	$value = null;

	if(array_key_exists($attributes_key, $props)) {
		$value = $props[$attributes_key];
	}

	if (($value || is_int($value) || is_bool($value) || empty($value)) && isset($value))
		return $value;

	if (!$allow_nil && (!isset($breakpoint) || $breakpoint === 'general') && $isHover && !isset($value))
		return get_attribute_value($target, $props, false, $breakpoint, $prefix);

	$attributes_key = get_attribute_key($target, false, $prefix);

	if(array_key_exists($attributes_key, $props)) {
		$value = $props[$attributes_key];
	}

	return $value;
}

function get_attributes_value(array $args) {
	$target = $args['target'];
	$props = $args['props'];
	$isHover = $args['isHover'] ?? false;
	$breakpoint = $args['breakpoint'] ?? null;
	$prefix = $args['prefix'] ?? '';
	$allow_nil = $args['allow_nil'] ?? false;
	$return_obj = $args['return_obj'] ?? false;

	if (is_array($target)) {
		if ($return_obj) {
			$acc = array();
			foreach ($target as $item) {
				$acc[$item] = get_attribute_value($item, $props, $isHover, $breakpoint, $prefix, $allow_nil);
			}
			return $acc;
		} else {
			return array_map(function ($item) use ($props, $isHover, $breakpoint, $prefix, $allow_nil) {
				return get_attribute_value($item, $props, $isHover, $breakpoint, $prefix, $allow_nil);
			}, $target);
		}
	}

	return get_attribute_value($target, $props, $isHover, $breakpoint, $prefix, $allow_nil);
}
