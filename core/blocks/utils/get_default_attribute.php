<?php
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_block_attributes.php';

function get_default_attribute($prop, $block_name = null)
{
    static $cache = [];

    if ($block_name) {
        if (!isset($cache[$block_name])) {
            $cache[$block_name] = get_block_attributes($block_name);
        }
        return $cache[$block_name][$prop] ?? null;
    }

    static $all_blocks_cache = null;
    static $blocks_last_modified = null;

    $blocks = [
        'accordion-maxi', 'container-maxi', 'image-maxi', 'row-maxi',
        'svg-icon-maxi', 'button-maxi', 'map-maxi', 'search-maxi',
        'text-maxi', 'list-item-maxi', 'divider-maxi', 'number-counter-maxi',
        'slide-maxi', 'video-maxi', 'column-maxi', 'group-maxi',
        'pane-maxi', 'slider-maxi',
    ];

    $current_last_modified = max(array_map(function ($block) {
        $path = MAXI_PLUGIN_DIR_PATH . "metadata/blocks/" . $block . ".json";
        return file_exists($path) ? filemtime($path) : 0;
    }, $blocks));

    if ($all_blocks_cache === null || $blocks_last_modified !== $current_last_modified) {
        $all_blocks_cache = [];
        $blocks_last_modified = $current_last_modified;

        global $wp_filesystem;
        if (empty($wp_filesystem)) {
            require_once ABSPATH . '/wp-admin/includes/file.php';
            WP_Filesystem();
        }

        foreach ($blocks as $block) {
            $block_json_path = MAXI_PLUGIN_DIR_PATH . "metadata/blocks/" . $block . ".json";

            if (!file_exists($block_json_path)) {
                throw new Error(
                    'Missing block metadata file for ' . $block . ' block. Run `npm update-blocks-json` to generate it.'
                );
            }

            $block_json = $wp_filesystem->get_contents($block_json_path);
            if (!$block_json) {
                continue;
            }

            $block_data = json_decode($block_json, true);
            $all_blocks_cache = array_merge($all_blocks_cache, $block_data['attributes']);
        }
    }

    return $all_blocks_cache[$prop]['default'] ?? null;
}
