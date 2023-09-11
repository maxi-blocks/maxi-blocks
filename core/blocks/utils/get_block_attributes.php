<?php

function get_block_attributes($block_name)
{
    $path = MAXI_PLUGIN_DIR_PATH . './build/blocks/' . $block_name . '/block.json';

    if (!file_exists($path)) {
        return null;
    }

    $block = json_decode(file_get_contents($path), true);

    if (!isset($block['attributes'])) {
        return null;
    }

    $attributes = $block['attributes'];

    $response = array();

    foreach ($attributes as $key => $attribute) {
        if (isset($attribute['default'])) {
            $response[$key] = $attribute['default'];
        }
    }

    return $response;
}
