<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_attribute_key.php';

function get_attribute_value($target, $props, $is_hover, $breakpoint = null, $prefix = '', $allow_nil = false)
{
    $attributes_key = get_attribute_key($target, $is_hover, $prefix, $breakpoint);

    if (isset($props[$attributes_key])) {
        $value = $props[$attributes_key];
        if ($value !== null || is_int($value) || is_bool($value)) {
            return $value;
        }
    }

    if (!$allow_nil && (!isset($breakpoint) || $breakpoint === 'general') && $is_hover) {
        return get_attribute_value($target, $props, false, $breakpoint, $prefix);
    }

    $attributes_key = get_attribute_key($target, false, $prefix);
    return $props[$attributes_key] ?? null;
}

function get_attributes_value(array $args)
{
    $target = $args['target'];
    $props = $args['props'];
    $is_hover = $args['is_hover'] ?? false;
    $breakpoint = $args['breakpoint'] ?? null;
    $prefix = $args['prefix'] ?? '';
    $allow_nil = $args['allow_nil'] ?? false;
    $return_obj = $args['return_obj'] ?? false;

    if (is_array($target)) {
        $result = [];
        foreach ($target as $item) {
            $value = get_attribute_value($item, $props, $is_hover, $breakpoint, $prefix, $allow_nil);
            if ($return_obj) {
                $result[$item] = $value;
            } else {
                $result[] = $value;
            }
        }
        return $result;
    }

    return get_attribute_value($target, $props, $is_hover, $breakpoint, $prefix, $allow_nil);
}
