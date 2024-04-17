<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_is_valid.php';

function json_file_to_array($item, $is_hover)
{
    $file_path = MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/defaults/'.$item . ($is_hover ? 'Hover' : '').'.json';
    if ($is_hover && file_exists($file_path)) {
        return json_decode(file_get_contents($file_path), true);
    } else {
        $file_path = MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/defaults/'.$item.'.json';
        if (file_exists($file_path)) {
            return json_decode(file_get_contents($file_path), true);
        }
    }
    return null;
}

function get_group_attributes(
    $attributes,
    $target,
    $is_hover = false,
    $prefix = '',
    $cleaned = false,
    $add_default_attributes = true
) {
    if (!$target) {
        return null;
    }

    $response = array();

    if ($is_hover) {
        $hover_attributes = get_group_attributes(
            $attributes,
            $target,
            false,
            $prefix,
            $cleaned
        );

        if (isset($hover_attributes)) {
            $response = array_merge($response, $hover_attributes);
        }
    }

    if (is_string($target)) {
        $default_attributes = json_file_to_array($target, $is_hover);

        if (isset($default_attributes) && is_array($default_attributes)) {
            foreach (array_keys($default_attributes) as $key) {
                if (isset($attributes[$prefix . $key]) && get_is_valid($attributes[$prefix . $key], $cleaned)) {
                    $response[$prefix . $key] = $attributes[$prefix . $key];
                } elseif ($add_default_attributes) {
                    $response[$prefix . $key] = $default_attributes[$prefix . $key]['default'] ?? null;
                }
            }
        }
    } else {
        foreach ($target as $el) {
            $default_attributes = json_file_to_array($el, $is_hover);

            if (isset($default_attributes) && is_array($default_attributes)) {

                foreach (array_keys($default_attributes) as $key) {

                    if (isset($attributes[$prefix . $key]) && get_is_valid($attributes[$prefix . $key], $cleaned)) {
                        $response[$prefix . $key] = $attributes[$prefix . $key];
                    } elseif ($add_default_attributes) {
                        $response[$prefix . $key] = $default_attributes[$prefix . $key]['default'] ?? null;
                    }
                }
            }
        }
    }

    return $response;
}
