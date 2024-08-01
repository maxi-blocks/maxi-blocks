<?php

/**
 * Get the attributes of a block.
 *
 * @param string $block_name The name of the block, e.g. 'accordion-maxi'.
 *
 * @return array The attributes of the block.
 */
function get_block_attributes(string $block_name): array
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
        throw new Error('Failed to read block.json file for ' . $block_name . ' block.');
    }

    $block = json_decode($file_contents, true);

    if (!isset($block['attributes'])) {
        return [];
    }

    $attributes = $block['attributes'];
    $response = [];

    foreach ($attributes as $key => $attribute) {
        if (isset($attribute['default'])) {
            $response[$key] = $attribute['default'];
        }
    }

    $response = array_merge($response);

    return $response;
}
