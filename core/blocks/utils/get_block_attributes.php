<?php

function get_block_attributes($block_name)
{
    $path = MAXI_PLUGIN_DIR_PATH . 'build/blocks/' . $block_name . '/block.json';

    if (!file_exists($path)) {
        throw new Error(
            'Missing block.json file for ' . $block_name . ' block. Run `npm update-blocks-json` to generate it.'
        );
    }

    global $wp_filesystem;
    if (empty($wp_filesystem)) {
        require_once ABSPATH . '/wp-admin/includes/file.php';
        WP_Filesystem();
    }

    $file_contents = $wp_filesystem->get_contents($path);
    if (!$file_contents) {
        return null;
    }

    $block = json_decode($file_contents, true);

    if (!isset($block['attributes'])) {
        return [];
    }

    $attributes = $block['attributes'];
    $response = array();

    foreach ($attributes as $key => $attribute) {
        if (isset($attribute['default'])) {
            $response[$key] = $attribute['default'];
        }
    }

    $response = array_merge($response);

    return $response;
}
