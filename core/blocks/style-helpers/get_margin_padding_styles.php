<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_last_breakpoint_attribute.php';

function get_margin_padding_styles($args)
{
    if (!isset($args['obj'])) {
        return [];
    }
    $obj = $args['obj'];
    $prefix = $args['prefix'] ?? '';

    $key_words = ['top', 'right', 'bottom', 'left'];
    $response = array();

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $response[$breakpoint] = array();

        foreach (['margin', 'padding'] as $type) {
            foreach ($key_words as $key) {
                $attribute_name = $prefix . $type . '-' . $key;

                $last_value = get_last_breakpoint_attribute([
                    'target' => $attribute_name,
                    'breakpoint' => $breakpoint,
                    'attributes' => $obj,
                ]);
                $last_unit = get_last_breakpoint_attribute([
                    'target' => $attribute_name . '-unit',
                    'breakpoint' => $breakpoint,
                    'attributes' => $obj,
                ]);
                $value = isset($obj["$attribute_name-$breakpoint"]) ? $obj["$attribute_name-$breakpoint"] : null;
                $unit = isset($obj["$attribute_name-unit-$breakpoint"]) ? $obj["$attribute_name-unit-$breakpoint"] : null;

                if (isset($last_value) && ($last_value === $value || $last_unit === $unit)) {
                    $response[$breakpoint][$type . '-' . $key] = $last_value === 'auto' ? 'auto' : $last_value . $last_unit;
                }

                if ($value === '') {
                    unset($response[$breakpoint][$type . '-' . $key]);
                }
            }
        }
    }

    return $response;
}
