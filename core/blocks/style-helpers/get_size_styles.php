<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_last_breakpoint_attribute.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_default_attribute.php';

/**
 * Get styles for various size properties across different breakpoints.
 *
 * @param array  $obj    Array of block attributes
 * @param string $prefix Prefix for the block attribute keys
 * @return array         Associative array of styles for different breakpoints
 */
function get_size_styles($obj, $prefix = '')
{
    $response = [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    write_log('$obj');
    write_log($obj);
    foreach ($breakpoints as $breakpoint) {
        $get_value = function ($target) use ($obj, $prefix, $breakpoint, $breakpoints) {
            $full_width_normal_styles = [];

            if (in_array($target, ['width', 'max-width', 'min-width'])) {
                $full_width = get_last_breakpoint_attribute([
                    'target' => $prefix . 'full-width',
                    'breakpoint' => $breakpoint,
                    'attributes' => $obj,
                ]);

                if (($target === 'width' || $target === 'min-width') && $full_width) {
                    return null;
                }

                if ($target === 'max-width') {
                    if ($full_width) {
                        return [
                            'min-width' => '100%',
                        ];
                    }

                    $is_min_width_needed = array_reduce(
                        array_slice($breakpoints, 0, array_search($breakpoint, $breakpoints) + 1),
                        function ($carry, $bp) use ($obj, $prefix) {
                            $val = $obj[$prefix . 'full-width-' . $bp] ?? null;
                            $default_val = get_default_attribute($prefix . 'full-width-' . $bp);

                            return $carry || $val !== $default_val;
                        },
                        false
                    );

                    if (!$full_width && $is_min_width_needed) {
                        $full_width_normal_styles = [
                            'min-width' => 'initial',
                        ];
                    }
                }
            }

            if (isset($obj[$prefix . 'size-advanced-options']) && !$obj[$prefix . 'size-advanced-options']) {
                if (strpos($target, 'min') !== false) {
                    return null;
                }
                if (strpos($target, 'max') !== false) {
                    return $full_width_normal_styles;
                }
            }

            if ($target === 'height') {
                $force_aspect_ratio = get_last_breakpoint_attribute([
                    'target' => $prefix . 'force-aspect-ratio',
                    'breakpoint' => $breakpoint,
                    'attributes' => $obj,
                ]);

                if ($force_aspect_ratio) {
                    return ['aspect-ratio' => 1, 'height' => 'auto'];
                }
                if (isset($obj['fitParentSize'])) {
                    return ['height' => '100% !important'];
                }
            }

            if ($target === 'width') {
                $fitContent = get_last_breakpoint_attribute([
                    'target' => $prefix . 'width-fit-content',
                    'breakpoint' => $breakpoint,
                    'attributes' => $obj,
                ]);

                if ($fitContent) {
                    return ['width' => 'fit-content'];
                }
            }

            $num_val = isset($obj[$prefix . $target . '-' . $breakpoint]) ? $obj[$prefix . $target . '-' . $breakpoint] : null;
            $is_numeric = $num_val !== null && is_numeric(filter_var($num_val, FILTER_SANITIZE_NUMBER_INT));
            if (
                $is_numeric ||
                isset($obj[$prefix . $target . '-unit-' . $breakpoint])
            ) {
                $num = get_last_breakpoint_attribute([
                    'target' => $prefix . $target,
                    'breakpoint' => $breakpoint,
                    'attributes' => $obj,
                ]);

                write_log('$prefix . $target');
                write_log($prefix . $target);

                write_log('$breakpoint');
                write_log($breakpoint);

                write_log('$obj');
                write_log($obj);

                write_log('$num');
                write_log($num);

                $unit = get_last_breakpoint_attribute([
                    'target' => $prefix . $target . '-unit',
                    'breakpoint' => $breakpoint,
                    'attributes' => $obj,
                ]);

                write_log('$unit');
                write_log($unit);

                $auto = $prefix === 'number-counter-' && $target === 'width' && isset($obj['number-counter-circle-status'])
                    ? 'auto'
                    : (get_last_breakpoint_attribute([
                        'target' => $prefix . $target . '-auto',
                        'breakpoint' => $breakpoint,
                        'attributes' => $obj,
                    ]) && '100%');

                if (!is_null($num) && !is_null($unit)) {
                    return array_merge(
                        $full_width_normal_styles,
                        [$target => $auto ? $auto : $num . $unit]
                    );
                }
            }

            return $full_width_normal_styles;
        };

        // Simulate array destructuring in JS
        $response[$breakpoint] = array_merge(
            $get_value('max-width') ?? [],
            $get_value('width') ?? [],
            $get_value('min-width') ?? [],
            $get_value('max-height') ?? [],
            $get_value('height') ?? [],
            $get_value('min-height') ?? []
        );
        write_log('$response[$breakpoint]');
        write_log($response[$breakpoint]);
    }

    return $response;
}
