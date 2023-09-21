<?php

function get_image_shape_styles($obj, $target = 'svg', $prefix = '', $ignore_general_omit = false, $is_hover = false)
{
    if (!is_array($obj)) {
        return [];
    }
    $response = [];
    $omit_transform_scale = true;

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $transform_string = '';

        $scale = get_last_breakpoint_attribute([
            'target' => $prefix . 'image-shape-scale',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
            'is_hover' => $is_hover,
        ]);
        $rotate = get_last_breakpoint_attribute([
            'target' => $prefix . 'image-shape-rotate',
            'breakpoint' => $breakpoint,
            'is_hover' => $is_hover,
            'attributes' => $obj,
        ]);
        $flip_x = get_last_breakpoint_attribute([
            'target' => $prefix . 'image-shape-flip-x',
            'breakpoint' => $breakpoint,
            'is_hover' => $is_hover,
            'attributes' => $obj,
        ]);
        $flip_y = get_last_breakpoint_attribute([
            'target' => $prefix . 'image-shape-flip-y',
            'breakpoint' => $breakpoint,
            'is_hover' => $is_hover,
            'attributes' => $obj,
        ]);

        if (is_numeric($scale)) {
            $omit_transform_scale = $omit_transform_scale && $scale === 100;
            $calculation_numbers = $target === 'svg' ? [$scale, 100] : [100, $scale];

            if ($breakpoint === 'general' && $ignore_general_omit || $scale !== 100 || !$omit_transform_scale) {
                $transform_string .= 'scale(' . ($calculation_numbers[0] / $calculation_numbers[1]) . ') ';
            }
        }

        if (is_numeric($rotate)) {
            if ($target === 'svg') {
                $transform_string .= 'rotate(' . $rotate . 'deg) ';
            } else {
                if (($flip_x && !$flip_y) || (!$flip_x && $flip_y)) {
                    $transform_string .= 'rotate(' . $rotate . 'deg) ';
                } else {
                    $transform_string .= 'rotate(' . (-$rotate) . 'deg) ';
                }
            }
        }

        if ($flip_x) {
            $transform_string .= 'scaleX(-1) ';
        }

        if ($flip_y) {
            $transform_string .= 'scaleY(-1) ';
        }

        $transform_obj = !empty($transform_string) ? ['transform' => $transform_string] : [];

        if (!empty($transform_obj)) {
            $response[$breakpoint] = $transform_obj;
        }
    }

    return $response;
}
