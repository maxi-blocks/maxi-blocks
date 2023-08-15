<?php

function get_position_styles(array $obj)
{
    $key_words = ['top', 'right', 'bottom', 'left'];
    $response = [];
    $omit_position_style = true;

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $position = get_last_breakpoint_attribute([
            'target' => 'position',
            'breakpoint' => $breakpoint,
            'attributes' => $obj
        ]);

        $omit_position_style = $omit_position_style ? $position === 'inherit' : false;

        $response[$breakpoint] = [];

        if (isset($position) && !$omit_position_style) {
            $response[$breakpoint]['position'] = $position;
        }

        foreach ($key_words as $key_word) {
            $last_breakpoint_value = get_last_breakpoint_attribute([
                'target' => "position-$key_word",
                'breakpoint' => $breakpoint,
                'attributes' => $obj
            ]);

            $value = $position !== 'inherit' ? $last_breakpoint_value : null;

            $unit = get_last_breakpoint_attribute([
                'target' => "position-$key_word-unit",
                'breakpoint' => $breakpoint,
                'attributes' => $obj
            ]);

            if (isset($value) && isset($unit) && !$omit_position_style) {
                $response[$breakpoint][$key_word] = $value !== 'auto' ? $value . $unit : $value;
            }
        }

        if (empty($response[$breakpoint])) {
            unset($response[$breakpoint]);
        }
    }

    return $response;
}
