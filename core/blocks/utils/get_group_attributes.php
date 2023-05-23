<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_is_valid.php';

function get_group_attributes(
    $attributes,
    $target,
    $is_hover = false,
    $prefix = '',
    $cleaned = false
) {
    if (!$target) {
        return null;
    }

    $response = array();
    $defaults = json_decode(file_get_contents(MAXI_PLUGIN_DIR_PATH . "core/blocks/utils/default-group-attributes.json"), true);

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
        $default_attributes =
            $defaults[$target . ($is_hover ? 'Hover' : '')] ??
            $defaults[$target];

        if (isset($default_attributes)) {
            foreach (array_keys($default_attributes) as $key) {
                if (isset($attributes[$prefix . $key]) && get_is_valid($attributes[$prefix . $key], $cleaned)) {
                    $response[$prefix . $key] = $attributes[$prefix . $key];
                } elseif (isset($default_attributes[$prefix . $key]['default']) && get_is_valid($default_attributes[$prefix . $key]['default'])) {
                    $response[$prefix . $key] = $default_attributes[$prefix . $key]['default'];
                }
            }
        }
    } else {
        foreach ($target as $el) {
            $default_attributes =
                $defaults[$el . ($is_hover ? 'Hover' : '')] ??
                $defaults[$el];

            if (isset($default_attributes)) {
                foreach (array_keys($default_attributes) as $key) {
                    if (isset($attributes[$prefix . $key]) && get_is_valid($attributes[$prefix . $key], $cleaned)) {
                        $response[$prefix . $key] = $attributes[$prefix . $key];
                    } elseif (isset($default_attributes[$prefix . $key]['default']) && get_is_valid($default_attributes[$prefix . $key]['default'])) {
                        $response[$prefix . $key] = $default_attributes[$prefix . $key]['default'];
                    }
                }
            }
        }
    }

    return $response;
}
