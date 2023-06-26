<?php
function objects_cleaner($obj)
{
    if(is_null($obj)) {
        return false;
    }


    $response = $obj;

    foreach ($response as $key => $val) {
        if (!is_array($val) || empty($val)) {
            unset($response[$key]);
        }
    }

    return $response;
}

function repeated_breakpoint_cleaner($obj)
{
    $response = $obj;

    $breakpoints = ['xs', 's', 'm', 'l', 'xl', 'xxl', 'general'];

    foreach ($breakpoints as $i => $breakpoint) {
        if (!isset($obj[$breakpoint])) {
            continue;
        }

        foreach ($obj[$breakpoint] as $key => $val) {
            $prev_breakpoint = ($breakpoint !== 'xl' && $breakpoint !== 'general') ? $breakpoints[$i + 1] : 'general';

            if (isset($obj[$prev_breakpoint][$key]) && $obj[$prev_breakpoint][$key] === $val) {
                unset($response[$breakpoint][$key]);
            }
        }
    }

    return $response;
}

function general_breakpoint_cleaner($obj)
{
    $response = $obj;

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
    foreach ($response as $key => $val) {
        if ($key === 'general') {
            continue;
        }

        $breakpoint_index = array_search($key, $breakpoints);
        $is_last = true;

        foreach (array_slice($breakpoints, $breakpoint_index) as $breakpoint) {
            if ($breakpoint === 'general' || $breakpoint === $key) {
                continue;
            }

            if (!isset($response[$breakpoint]) || empty($response[$breakpoint])) {
                continue;
            }

            $is_last = false;
            break;
        }

        if ($is_last && isset($val) && is_array($val) && !empty($val)) {
            foreach ($val as $prop => $value) {
                if ($prop !== 'label' && isset($response['general'][$prop]) && $value === $response['general'][$prop]) {
                    unset($response[$key][$prop]);
                }
            }
        }
    }

    return $response;
}

function hover_styles_cleaner($normal_obj, $hover_obj)
{
    if (!empty($normal_obj)) {
        foreach ($normal_obj as $key => $val) {
            if (isset($hover_obj[$key])) {
                foreach ($val as $breakpoint => $breakpoint_val) {
                    if (isset($hover_obj[$key][$breakpoint])) {
                        foreach ($breakpoint_val as $attr_key => $attr_val) {
                            $prev_breakpoint = null;
                            foreach (array_slice(array_keys($hover_obj[$key]), array_search($breakpoint, array_keys($hover_obj[$key])) + 1) as $higher_breakpoint) {
                                if (isset($hover_obj[$key][$higher_breakpoint][$attr_key])) {
                                    $prev_breakpoint = $higher_breakpoint;
                                    break;
                                }
                            }

                            if ($prev_breakpoint && $hover_obj[$key][$prev_breakpoint][$attr_key] !== $hover_obj[$key][$breakpoint][$attr_key]) {
                                continue;
                            }

                            if (isset($hover_obj[$key][$breakpoint][$attr_key]) && $hover_obj[$key][$breakpoint][$attr_key] === $attr_val && $attr_key !== 'transition') {
                                unset($hover_obj[$key][$breakpoint][$attr_key]);
                            }
                        }
                    }
                }
            }
        }
    }

    return $hover_obj;
}

function style_cleaner($styles)
{
    foreach ($styles as $target => $raw_val) {
        // Clean non-object and empty targets
        // First clean, avoids unnecessary work on next loops
        $val = objects_cleaner($raw_val);

        if (empty($val)) {
            unset($styles[$target]);

            continue;
        }

        $styles[$target] = $val;

        // Clean breakpoint repeated values
        foreach ($val as $type_key => $type_val) {
            if (count(array_keys($type_val)) > 1) {
                $styles[$target][$type_key] = repeated_breakpoint_cleaner($type_val);
            }
        }

        // Clean non-necessary breakpoint values when is same than general
        foreach ($val as $type_key => $type_val) {
            if (count(array_keys($type_val)) > 1) {
                $styles[$target][$type_key] = general_breakpoint_cleaner($type_val);
            }
        }

        // Clean hover values
        if (strpos($target, ':hover') !== false) {
            $normal_key = str_replace(':hover', '', $target);

            if(isset($styles[$normal_key])) {
                $styles[$target] = hover_styles_cleaner($styles[$normal_key], $val);
            }
        }

        // Clean empty breakpoints
        foreach ($val as $type_key => $type_val) {
            foreach ($type_val as $breakpoint => $breakpoint_val) {
                if (!is_array($breakpoint_val) || empty($breakpoint_val)) {
                    unset($styles[$target][$type_key][$breakpoint]);
                }
            }
        }

        // Clean non-object and empty targets
        // Second clean before returning
        $cleaned_val = objects_cleaner($styles[$target]);

        if (empty($cleaned_val)) {
            unset($styles[$target]);

            continue;
        }

        $styles[$target] = $cleaned_val;
    }

    return $styles;
}

function write_log($log)
{
    if (is_array($log) || is_object($log)) {
        error_log(print_r($log, true));
    } else {
        error_log($log);
    }
}

function style_processor($obj, $data, $props)
{
    $selectors = $data['custom_css']['selectors'] ?? null;
    $transition_selectors = $data['transition'] ?? null;

    $styles = $obj;

    // TODO: migrate functions to php
    // $transition_object = get_transition_styles($props, $transition_selectors);
    // if (!empty($transition_object)) {
    //     $styles = array_merge($styles, $transition_object);
    // }

    // // Process custom styles if they exist
    // $new_css_selectors = get_selectors_css($selectors, $props);
    // $new_transform_selectors = get_transform_selectors($selectors, $props);

    // if (!empty($new_css_selectors)) {
    //     $custom_css_object = get_custom_css_object($new_css_selectors, $props);
    //     if (!empty($custom_css_object)) {
    //         $styles = array_merge($styles, $custom_css_object);
    //     }
    // }
    // if (!empty($new_transform_selectors)) {
    //     $transform_object = get_transform_styles($props, $new_transform_selectors);

    //     if (!empty($transform_object)) {
    //         $is_transform_string = function ($string) {
    //             return is_string($string) && in_array($string, array('rotate', 'scale', 'translate'));
    //         };

    //         $merge_callback = function ($obj_value, $src_value) use ($is_transform_string) {
    //             if ($is_transform_string($obj_value) && $is_transform_string($src_value)) {
    //                 return $obj_value . ' ' . $src_value;
    //             }
    //         };

    //         array_merge_recursive_with($styles, $transform_object, $merge_callback);
    //     }
    // }

    return style_cleaner($styles);
}
