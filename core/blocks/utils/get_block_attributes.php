<?php

function get_block_attributes($block_name)
{
    $path = MAXI_PLUGIN_DIR_PATH . 'build/blocks/' . $block_name . '/block.json';

    if (!file_exists($path)) {
        return null;
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
