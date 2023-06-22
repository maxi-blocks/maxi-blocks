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
    $cleaned = false
) {
    if (!$target) {
        return null;
    }

    $response = array();
    //$defaults = json_decode(file_get_contents(MAXI_PLUGIN_DIR_PATH . "core/blocks/utils/default-group-attributes.json"), true);

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
        //$default_attributes = json_decode(file_get_contents(MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/defaults/'.$target . ($is_hover ? 'Hover' : '').'.json'), true);
        // $default_attributes =
        //     $defaults[$target . ($is_hover ? 'Hover' : '')] ??
        //     $defaults[$target];

        if (isset($default_attributes) && is_array($default_attributes)) {
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
            $default_attributes = json_file_to_array($el, $is_hover);
            // $default_attributes =
            //     $defaults[$el . ($is_hover ? 'Hover' : '')] ??
            //     $defaults[$el];

            if (isset($default_attributes) && is_array($default_attributes)) {
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
