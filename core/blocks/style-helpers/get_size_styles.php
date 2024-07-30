<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_last_breakpoint_attribute.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_default_attribute.php';

function get_size_styles($obj, $block_name = null, $prefix = '')
{
    $response = [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $get_value = function ($target) use ($obj, $prefix, $breakpoint, $breakpoints, $block_name) {
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

                    $is_min_width_needed = false;
                    foreach ($breakpoints as $bp) {
                        $val = $obj[$prefix . 'full-width-' . $bp] ?? null;
                        $default_val = get_default_attribute($prefix . 'full-width-' . $bp, $block_name);
                        if ($val !== $default_val) {
                            $is_min_width_needed = true;
                            break;
                        }
                        if($breakpoint === $bp) {
                            break;
                        }
                    }

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
                    return ['aspect-ratio' => 1, 'height' => 'auto !important'];
                }
                if (isset($obj['fitParentSize']) && $obj['fitParentSize']) {
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

            if (
                (array_key_exists($prefix . $target . '-' . $breakpoint, $obj) && is_numeric($obj[$prefix . $target . '-' . $breakpoint])) ||
                isset($obj[$prefix . $target . '-unit-' . $breakpoint])
            ) {
                $num = get_last_breakpoint_attribute([
                    'target' => $prefix . $target,
                    'breakpoint' => $breakpoint,
                    'attributes' => $obj,
                ]);

                $unit = get_last_breakpoint_attribute([
                    'target' => $prefix . $target . '-unit',
                    'breakpoint' => $breakpoint,
                    'attributes' => $obj,
                ]);

                $auto = $prefix === 'number-counter-'
                    && $target === 'width'
                    && isset($obj['number-counter-circle-status'])
                    && $obj['number-counter-circle-status']
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

        $response[$breakpoint] = array_merge(
            $get_value('max-width') ?? [],
            $get_value('width') ?? [],
            $get_value('min-width') ?? [],
            $get_value('max-height') ?? [],
            $get_value('height') ?? [],
            $get_value('min-height') ?? []
        );
    }

    return $response;
}
