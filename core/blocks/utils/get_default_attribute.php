<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_block_attributes.php';

function get_default_attribute($prop, $block_name = null) {
    $response = null;

    // TODO: in case there's no block_name, we can't access the unique block attributes
    // so we need to get the default attributes from the block.json file, maybe merging
    // and combining all together
    if($block_name) {
        $response = get_block_attributes($block_name)[$prop];

        return $response;
    }

    // TODO: set block data support
    // if (get_block_data($block_name)['maxi_attributes'][$prop]) {
    //     $response = get_block_data($block_name)['maxi_attributes'][$prop];
    // }

    $defaults = json_decode(file_get_contents(MAXI_PLUGIN_DIR_PATH . "core/blocks/utils/default-group-attributes.json"), true);

    foreach (array_keys($defaults) as $key) {
        if (isset($defaults[$key][$prop]['default'])) {
            $response = $defaults[$key][$prop]['default'];
        }
    }

    return $response;
}
