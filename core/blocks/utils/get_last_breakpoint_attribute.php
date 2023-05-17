<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_value_from_keys.php';

function get_last_breakpoint_attribute(
    $target,
    $breakpoint,
    $attributes,
    $is_hover = false,
    $avoid_xxl = true,
    $keys = []
) {
    $attr = $attributes;
    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    if (!isset($attr)) {
        return false;
    }

    if (!isset($breakpoint)) {
        return get_value_from_keys(
            get_attribute_value(array(
                'target' => $target,
                'props' => $attr,
                'isHover' => $is_hover,
                'breakpoint' => $breakpoint,
            )),
            $keys
        );
    }

    $current_breakpoint = 'general';
    $base_breakpoint = 'xl';

    $attr_filter = function ($attr) {
        return isset($attr) &&
            (is_int($attr) || is_bool($attr) || is_string($attr) || !empty($attr));
    };

    if ($breakpoint === 'general' &&
        ($current_breakpoint === 'general' ||
            ($base_breakpoint !== 'xxl' && $current_breakpoint !== $base_breakpoint))
    ) {
        $base_breakpoint_attr = get_last_breakpoint_attribute(
            $target,
            $base_breakpoint,
            $attributes,
            $is_hover,
            $avoid_xxl,
            $keys
        );

        if ($attr_filter($base_breakpoint_attr)) {
            return $base_breakpoint_attr;
        }
    }

    $current_attr = isset($attr[
        (!empty($target) ? $target . '-' : '') .
        $breakpoint .
        ($is_hover ? '-hover' : '')
    ]) ? get_value_from_keys(
        $attr[
            (!empty($target) ? $target . '-' : '') .
            $breakpoint .
            ($is_hover ? '-hover' : '')
        ],
        $keys
    ) : null;

    if ($attr_filter($current_attr) &&
        ($base_breakpoint !== 'xxl' || $breakpoint === 'xxl')
    ) {
        return $current_attr;
    }

    $breakpoint_position = array_search($breakpoint, $breakpoints);

    while ($breakpoint_position > 0 &&
        !is_int($current_attr) &&
        !is_bool($current_attr) &&
        (empty($current_attr) || !isset($current_attr))
    ) {
        $breakpoint_position -= 1;

        if (!($avoid_xxl && $breakpoints[$breakpoint_position] === 'xxl')) {
            $current_attr = isset($attr[
                (!empty($target) ? $target . '-' : '') .
                $breakpoints[$breakpoint_position] .
                ($is_hover ? '-hover' : '')
            ]) ? get_value_from_keys(
                $attr[
                    (!empty($target) ? $target . '-' : '') .
                    $breakpoints[$breakpoint_position] .
                    ($is_hover ? '-hover' : '')
                ],
                $keys
            ) : null;
        }
    }

    if ($is_hover && !$attr_filter($current_attr)) {
        $current_attr = get_last_breakpoint_attribute(
            $target,
            $breakpoint,
            $attributes,
            false,
            $avoid_xxl,
            $keys
        );
    }

    if (!$current_attr && $breakpoint === 'general' && $base_breakpoint) {
        $current_attr = get_last_breakpoint_attribute(
            $target,
            $base_breakpoint,
            $attributes,
            $is_hover,
            $base_breakpoint === 'xxl' ? false : $avoid_xxl,
            $keys
        );
    }

    return $current_attr;
}
