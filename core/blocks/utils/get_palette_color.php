<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-style-cards.php';

function get_palette_color($color, $block_style = 'light') {
    if (class_exists('MaxiBlocks_StyleCards')) {
        $sc_value = MaxiBlocks_StyleCards::get_instance()->get_maxi_blocks_active_style_card();

        if (!isset($sc_value)) {
            return false;
        }
        
        return $sc_value[$block_style]['styleCard']['color'][$color] 
            ?? $sc_value[$block_style]['defaultStyleCard']['color'][$color];
    }

    return false;
}

?>
