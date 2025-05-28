<?php
function validate_origin_value($val)
{
    $is_numeric = function ($val) {
        if (!is_string($val)) {
            return false;
        }
        return !is_nan($val) && !is_nan(floatval($val));
    };

    $words = ['top', 'bottom', 'left', 'right', 'center', 'middle'];

    if ($is_numeric($val)) {
        return floatval($val);
    }

    if (in_array($val, $words)) {
        return $val;
    }

    return false;
}

function get_transform_strings(string $category, string $breakpoint, string $index, array $obj)
{
    $get_last_breakpoint_transform_attribute = function ($target, $key, $hover_selected, $keys = null) use ($breakpoint, $obj, $category) {

        return get_last_breakpoint_attribute(
            array(
            'target' => $target,
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
            'keys' => $keys ?? [$category, $hover_selected, $key])
        );
    };

    $origin_value_to_number = function ($value) {
        switch (validate_origin_value($value)) {
            case 'top':
            case 'left':
                return 0;
            case 'middle':
            case 'center':
                return 50;
            case 'bottom':
            case 'right':
                return 100;
            default:
                return $value;
        }
    };

    $get_scale_string = function ($index) use ($obj, $breakpoint, $get_last_breakpoint_transform_attribute, $category) {
        $scale_string = '';
        if (isset($obj['transform-scale-'.$breakpoint])) {
            if (
                $index === 'hover' &&
                !$get_last_breakpoint_transform_attribute('transform-scale', null, 'hover-status', [$category, 'hover-status'])
            ) {
                $index = 'normal';
            }

            [$x, $y] = array_map(function ($key) use ($get_last_breakpoint_transform_attribute, $index) {
                return $get_last_breakpoint_transform_attribute('transform-scale', $key, $index);
            }, ['x', 'y']);

            if (is_int($x)) {
                $scale_string .= 'scaleX(' . ($x / 100) . ') ';
            }
            if (is_int($y)) {
                $scale_string .= 'scaleY(' . ($y / 100) . ') ';
            }
        }

        return $scale_string;
    };

    $get_translate_string = function ($index) use ($obj, $breakpoint, $get_last_breakpoint_transform_attribute, $category) {
        $translate_string = '';
        if (isset($obj['transform-translate-'.$breakpoint])) {
            if (
                $index === 'hover' &&
                !$get_last_breakpoint_transform_attribute('transform-translate', null, 'hover-status', [$category, 'hover-status'])
            ) {
                $index = 'normal';
            }

            [$x, $y, $x_unit, $y_unit] = array_map(function ($key) use ($get_last_breakpoint_transform_attribute, $index) {
                return $get_last_breakpoint_transform_attribute('transform-translate', $key, $index);
            }, ['x', 'y', 'x-unit', 'y-unit']);

            if (is_int($x)) {
                $translate_string .= 'translateX(' . $x . ($x_unit ?? '%') . ') ';
            }
            if (is_int($y)) {
                $translate_string .= 'translateY(' . $y . ($y_unit ?? '%') . ') ';
            }
        }

        return $translate_string;
    };

    $get_rotate_string = function ($index) use ($obj, $breakpoint, $get_last_breakpoint_transform_attribute, $category) {
        $rotate_string = '';
        if (isset($obj['transform-rotate-'.$breakpoint])) {

            if (
                $index === 'hover' &&
                !$get_last_breakpoint_transform_attribute('transform-rotate', null, 'hover-status', [$category, 'hover-status'])
            ) {
                $index = 'normal';
            }

            [$x, $y, $z] = array_map(function ($key) use ($get_last_breakpoint_transform_attribute, $index) {
                return $get_last_breakpoint_transform_attribute('transform-rotate', $key, $index);
            }, ['x', 'y', 'z'], );

            if (is_int($x)) {
                $rotate_string .= 'rotateX(' . $x . 'deg) ';
            }
            if (is_int($y)) {
                $rotate_string .= 'rotateY(' . $y . 'deg) ';
            }
            if (is_int($z)) {
                $rotate_string .= 'rotateZ(' . $z . 'deg) ';
            }
        }

        return $rotate_string;
    };

    $get_origin_string = function ($index) use ($obj, $breakpoint, $get_last_breakpoint_transform_attribute, $origin_value_to_number, $category) {
        $origin_string = '';
        if (isset($obj['transform-origin-'.$breakpoint])) {
            if (
                $index === 'hover' &&
                !$get_last_breakpoint_transform_attribute('transform-origin', null, 'hover-status', [$category, 'hover-status'])
            ) {
                return $origin_string;
            }

            [$x, $y, $x_unit, $y_unit]= array_map(function ($key) use ($get_last_breakpoint_transform_attribute, $index) {
                return $get_last_breakpoint_transform_attribute('transform-origin', $key, $index);
            }, ['x', 'y', 'x-unit', 'y-unit']);

            if (is_string(validate_origin_value($x))) {
                $origin_string .= $origin_value_to_number($x) . '% ';
            }
            if (is_string(validate_origin_value($y))) {
                $origin_string .= $origin_value_to_number($y) . '% ';
            }

            if (is_int(validate_origin_value($x))) {
                $origin_string .= $x . ($x_unit ?? '%') . ' ';
            }
            if (is_int(validate_origin_value($y))) {
                $origin_string .= $y . ($y_unit ?? '%') . ' ';
            }
        }

        return $origin_string;
    };

    $transform_string = $get_scale_string($index) . $get_translate_string($index) . $get_rotate_string($index);
    $transform_origin_string = $get_origin_string($index);

    return [$transform_string, $transform_origin_string];
}

function get_transform_value(array $obj, string $category, string $index)
{
    $response = [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        [$transform_string, $transform_origin_string] = get_transform_strings($category, $breakpoint, $index, $obj);

        $transform_obj = [];

        if (!empty($transform_string)) {
            $transform_obj['transform'] = $transform_string;
        }
        if (!empty($transform_origin_string)) {
            $transform_obj['transform-origin'] = $transform_origin_string;
        }

        if (!empty($transform_obj)) {
            $response[$breakpoint] = $transform_obj;
        }
    }

    return $response;
}

function get_transform_styles(array $obj, array $selectors)
{
    $response = [];

    foreach ($selectors as $category => $targets) {
        foreach ($targets as $index => $targetObj) {
            $target = $targetObj['target'];
            $transform_obj = get_transform_value($obj, $category, $index);
            if (!empty($transform_obj)) {
                $response[$target] = ['transform' => $transform_obj];
            }
        }
    }
    return $response;
}
