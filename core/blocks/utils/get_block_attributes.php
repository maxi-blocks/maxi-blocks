<?php

function get_block_attributes($block_name)
{
    $path = MAXI_PLUGIN_DIR_PATH . './src/blocks/' . $block_name . '/block.json';

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

    if(isset($block['maxiAttributes'])) {
        $block_maxi_attributes = $block['maxiAttributes'];
        if (isset($block_maxi_attributes) && isset($response)) {
            $response = array_merge($response, $block_maxi_attributes);
        }
    }

    write_log('get_block_attributes');
    write_log($block_name);
    write_log($response);

    return $response;
}
