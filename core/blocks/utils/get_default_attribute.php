<?php
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_block_attributes.php';

function get_default_attribute(string $prop, ?string $block_name = null)
{
    $response = null;

    // TODO: in case there's no block_name, we can't access the unique block attributes
    // so we need to get the default attributes from the block.json file, maybe merging
    // and combining all together
    if ($block_name) {
        $response = get_block_attributes($block_name)[$prop];
        return $response;
    }

    // TODO: set block data support

    $blocks = [
        'accordion-maxi',
        'container-maxi',
        'image-maxi',
        'row-maxi',
        'svg-icon-maxi',
        'button-maxi',
        'map-maxi',
        'search-maxi',
        'text-maxi',
        'divider-maxi',
        'number-counter-maxi',
        'slide-maxi',
        'video-maxi',
        'column-maxi',
        'group-maxi',
        'pane-maxi',
        'slider-maxi',
    ];

    foreach ($blocks as $block) {
        $block_json_path = MAXI_PLUGIN_DIR_PATH . "build/blocks/" . $block . "/block.json";

        if (file_exists($block_json_path)) {
            // Try direct file reading first
            if (is_readable($block_json_path)) {
                $block_json = file_get_contents($block_json_path);
                if ($block_json !== false) {
                    $block_data = json_decode($block_json, true);
                    $block_defaults = $block_data['attributes'];

                    if (array_key_exists($prop, $block_defaults) && isset($block_defaults[$prop]['default'])) {
                        $response = $block_defaults[$prop]['default'];
                    }

                    if (isset($response)) {
                        return $response;
                    }
                    continue;
                }
            }

            // Fallback to WP_Filesystem if direct reading fails
            global $wp_filesystem;
            if (empty($wp_filesystem)) {
                require_once ABSPATH . '/wp-admin/includes/file.php';
                WP_Filesystem(false, false, true);
            }

            if (empty($wp_filesystem)) {
                continue;
            }

            $block_json = $wp_filesystem->get_contents($block_json_path);
            if (!$block_json) {
                continue;
            }

            $block_data = json_decode($block_json, true);
            $block_defaults = $block_data['attributes'];

            if (array_key_exists($prop, $block_defaults) && isset($block_defaults[$prop]['default'])) {
                $response = $block_defaults[$prop]['default'];
            }

            if (isset($response)) {
                return $response;
            }
        }
    }

    return $response;
}
