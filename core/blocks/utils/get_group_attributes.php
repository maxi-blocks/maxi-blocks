<?php
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_is_valid.php';

function json_file_to_array($item, $is_hover)
{
    static $cache = [];
    $cache_key = $item . ($is_hover ? 'Hover' : '');

    $file_path = MAXI_PLUGIN_DIR_PATH . 'group-attributes/' . $cache_key . '.json';
    if (!file_exists($file_path) && !$is_hover) {
        $file_path = MAXI_PLUGIN_DIR_PATH . 'group-attributes/' . $item . '.json';
    }

    if (!file_exists($file_path)) {
        return null;
    }

    $file_mtime = filemtime($file_path);

    if (isset($cache[$cache_key]) && $cache[$cache_key]['mtime'] === $file_mtime) {
        return $cache[$cache_key]['data'];
    }

    global $wp_filesystem;
    if (empty($wp_filesystem)) {
        require_once ABSPATH . '/wp-admin/includes/file.php';
        WP_Filesystem();
    }

    $file_contents = $wp_filesystem->get_contents($file_path);
    if (!$file_contents) {
        return null;
    }

    $result = json_decode($file_contents, true);
    $cache[$cache_key] = [
        'mtime' => $file_mtime,
        'data' => $result
    ];

    return $result;
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

    $process_target = function ($target) use ($attributes, $is_hover, $prefix, $cleaned, $add_default_attributes, &$response) {
        $default_attributes = json_file_to_array($target, $is_hover);

        if (isset($default_attributes) && is_array($default_attributes)) {
            foreach (array_keys($default_attributes) as $key) {
                if (isset($attributes[$prefix . $key]) && get_is_valid($attributes[$prefix . $key], $cleaned)) {
                    $response[$prefix . $key] = $attributes[$prefix . $key];
                } elseif ($add_default_attributes) {
                    $default_attribute = $default_attributes[$prefix . $key]['default'] ?? null;
                    if(get_is_valid($default_attribute, $cleaned)) {
                        $response[$prefix . $key] = $default_attributes[$prefix . $key]['default'] ?? null;
                    }
                }
            }
        }
    };

    if (is_string($target)) {
        $process_target($target);
    } else {
        foreach ($target as $el) {
            $process_target($el);
        }
    }

    return $response;
}
