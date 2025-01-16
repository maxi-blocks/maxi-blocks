<?php
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_is_valid.php';

function json_file_to_array($item, $is_hover)
{
    $file_path = MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/defaults/' . $item . ($is_hover ? 'Hover' : '') . '.json';

    // Try direct file reading first
    if (file_exists($file_path) && is_readable($file_path)) {
        $file_contents = file_get_contents($file_path);
        if ($file_contents !== false) {
            $result = json_decode($file_contents, true);
            if ($result !== null) {
                return $result;
            }
        }
    }

    // Try alternate path with direct reading
    $alternate_path = MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/defaults/' . $item . '.json';
    if (file_exists($alternate_path) && is_readable($alternate_path)) {
        $file_contents = file_get_contents($alternate_path);
        if ($file_contents !== false) {
            $result = json_decode($file_contents, true);
            if ($result !== null) {
                return $result;
            }
        }
    }

    // Fallback to WP_Filesystem if direct reading fails
    global $wp_filesystem;
    if (empty($wp_filesystem)) {
        require_once ABSPATH . '/wp-admin/includes/file.php';
        WP_Filesystem(false, false, true);
    }

    if (empty($wp_filesystem)) {
        return null;
    }

    if ($wp_filesystem->exists($file_path)) {
        $file_contents = $wp_filesystem->get_contents($file_path);
        if ($file_contents) {
            return json_decode($file_contents, true);
        }
    }

    if ($wp_filesystem->exists($alternate_path)) {
        $file_contents = $wp_filesystem->get_contents($alternate_path);
        if ($file_contents) {
            return json_decode($file_contents, true);
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
                } elseif (isset($default_attributes[$prefix . $key]['default']) && get_is_valid($default_attributes[$prefix . $key]['default'])) {
                    $response[$prefix . $key] = $default_attributes[$prefix . $key]['default'];
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
                    } elseif (isset($default_attributes[$prefix . $key]['default']) && get_is_valid($default_attributes[$prefix . $key]['default'])) {
                        $response[$prefix . $key] = $default_attributes[$prefix . $key]['default'];
                    }
                }
            }
        }
    }

    return $response;
}
