<?php

function get_block_attributes($block_name)
{
    $cache_key = 'maxi_blocks_block_attributes_' . $block_name;
    $cached_attributes = get_transient($cache_key);

    if ($cached_attributes !== false) {
        return $cached_attributes;
    }

    $path = MAXI_PLUGIN_DIR_PATH . './build/blocks/' . $block_name . '/block.json';

    if (!file_exists($path)) {
        return [];
    }

    $block = json_decode(file_get_contents($path), true);

    if (!isset($block['attributes'])) {
        return [];
    }

    $attributes = $block['attributes'];
    $maxi_attributes = $block['maxiAttributes'] ?? [];

    $response = [];

    foreach ($attributes as $key => $attribute) {
        if (isset($attribute['default'])) {
            $response[$key] = $attribute['default'];
        }
    }

    $response = array_merge($response, $maxi_attributes);

    // Cache the result for 1 hour (3600 seconds)
    set_transient($cache_key, $response, 3600);

    return $response;
}
