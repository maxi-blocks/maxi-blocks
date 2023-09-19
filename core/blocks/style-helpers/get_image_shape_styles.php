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

        $getLastBreakpointAttribute = function($target) use ($prefix, $breakpoint, $obj, $is_hover) {
            return get_last_breakpoint_attribute([
                'target' => $prefix . $target,
                'breakpoint' => $breakpoint,
                'attributes' => $obj,
                'is_hover' => $is_hover,
            ]);
        };
            
        $scale = $getLastBreakpointAttribute('image-shape-scale');
        $rotate = $getLastBreakpointAttribute('image-shape-rotate');
        $flip_x = $getLastBreakpointAttribute('image-shape-flip-x');
        $flip_y = $getLastBreakpointAttribute('image-shape-flip-y');

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
                $shouldRotatePositively = ($flip_x xor $flip_y);
                $rotationDegree = $shouldRotatePositively ? $rotate : -$rotate;
                $transform_string .= "rotate($rotationDegree" . 'deg) ';
            }
        }

        if ($flip_x) {
            $transform_string .= 'scaleX(-1) ';
        }

        if ($flip_y) {
            $transform_string .= 'scaleY(-1) ';
        }

        if (!empty($transform_string)) {
            $response[$breakpoint] = ['transform' => $transform_string];
        }
    }

    return $response;
}