<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_value_from_keys.php';

function get_last_breakpoint_attribute(
    $args
) {
    $target = $args['target'];
    $breakpoint = $args['breakpoint'];
    $attributes = $args['attributes'];
    $is_hover = $args['is_hover'] ?? false;
    $avoid_xxl = $args['avoid_xxl'] ?? true;
    $keys = $args['keys'] ?? [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    if (!isset($attributes)) {
        return false;
    }

    if (!isset($breakpoint)) {
        return get_value_from_keys(
            get_attributes_value(
                $target,
                $attributes,
                $is_hover,
                $breakpoint,
            ),
            $keys
        );
    }

    $current_breakpoint = 'general';
    $base_breakpoint = 'xl';

    $attr_filter = function ($attributes) {
        return isset($attributes) &&
            (is_int($attributes) || is_bool($attributes) || is_string($attributes) || !empty($attributes));
    };

    if ($breakpoint === 'general' &&
        ($current_breakpoint === 'general' ||
            ($base_breakpoint !== 'xxl' && $current_breakpoint !== $base_breakpoint))
    ) {

        $base_breakpoint_attr = get_last_breakpoint_attribute([
            'target' => $target,
            'breakpoint' => $base_breakpoint,
            'attributes' => $attributes,
            'is_hover' => $is_hover,
            'avoid_xxl' => $avoid_xxl,
            'keys' => $keys,
        ]);

        if ($attr_filter($base_breakpoint_attr)) {

            return $base_breakpoint_attr;
        }
    }

    $current_attr = isset($attributes[
        (!empty($target) ? $target . '-' : '') .
        $breakpoint .
        ($is_hover ? '-hover' : '')
    ]) ? get_value_from_keys(
        $attributes[
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

            $current_attr = isset($attributes[
                (!empty($target) ? $target . '-' : '') .
                $breakpoints[$breakpoint_position] .
                ($is_hover ? '-hover' : '')
            ]) ? get_value_from_keys(
                $attributes[
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
            ['target' => $target,
            'breakpoint' => $breakpoint,
            'attributes' => $attributes,
            'is_hover' => false,
            'avoid_xxl' => $avoid_xxl,
            'keys' => $keys]
        );
    }

    if (!$current_attr && $breakpoint === 'general' && $base_breakpoint) {

        $current_attr = get_last_breakpoint_attribute([
            'target' => $target,
            'breakpoint' => $base_breakpoint,
            'attributes' => $attributes,
            'is_hover' => $is_hover,
            'avoid_xxl' => $base_breakpoint === 'xxl' ? false : $avoid_xxl,
            'keys' => $keys,
        ]);
    }

    return $current_attr;
}
