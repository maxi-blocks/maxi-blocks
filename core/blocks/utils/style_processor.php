<?php

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

/**
 * Generate CSS selectors for background layers.
 *
 * @param array $bg_layers Background layers data.
 * @param bool $add_on_hover_to_label Whether to append "on hover" to label.
 * @param bool $add_background_wrapper Whether to add a background wrapper.
 *
 * @return array Generated CSS selectors for background layers.
 */
function get_bg_layers_selectors_css($bg_layers, $add_on_hover_to_label = true, $add_background_wrapper = true)
{
    // Define on hover label
    $on_hover_string = $add_on_hover_to_label ? ' on hover' : '';

    // Initialize selectors for background wrapper if needed
    $bg_layers_selectors = $add_background_wrapper
        ? array(
            'background' => array(
                'background-displayer' => array(
                    'label' => 'background wrapper',
                    'target' => ' > .maxi-background-displayer',
                ),
            ),
            'background hover' => array(
                'background-displayer' => array(
                    'label' => 'background wrapper' . $on_hover_string,
                    'target' => ':hover > .maxi-background-displayer',
                ),
            ),
        )
        : array();
    $bg_layers_showed_order = 1;
    $bg_hover_layers_showed_order = 1;

    // Sort and process each background layer
    usort($bg_layers, function ($a, $b) {
        return $a['order'] - $b['order'];
    });

    foreach ($bg_layers as $bg_layer) {
        // Define selectors for this background layer
        $new_bg_layers_selectors = array_merge(
            $bg_layers_selectors['background'] ?? [],
            array(
                "_{$bg_layer['id']}" => array(
                    'label' => "background {$bg_layer['type']} {$bg_layers_showed_order}",
                    'target' => " > .maxi-background-displayer .maxi-background-displayer__{$bg_layer['order']}",
                ),
            )
        );

        // Define hover selectors for this background layer
        $new_bg_hover_selectors = array_merge(
            $bg_layers_selectors['background hover'] ?? [],
            array(
                "_{$bg_layer['id']}" => array(
                    'label' => "background {$bg_layer['type']} {$bg_hover_layers_showed_order}{$on_hover_string}",
                    'target' => ":hover > .maxi-background-displayer .maxi-background-displayer__{$bg_layer['order']}",
                ),
            )
        );

        $bg_layers_selectors['background hover'] = $new_bg_hover_selectors;
        $bg_hover_layers_showed_order += 1;

        if (!isset($bg_layer['isHover']) || !$bg_layer['isHover']) {
            $bg_layers_selectors['background'] = $new_bg_layers_selectors;
            $bg_layers_showed_order += 1;
        }
    }

    return $bg_layers_selectors;
}

/**
 * Generate CSS selectors from the provided attributes.
 *
 * @param array $selectors Current CSS selectors.
 * @param array $attributes Attributes to extract the values from.
 *
 * @return array|null Generated CSS selectors, or null if attributes are not provided.
 */
function get_selectors_css($selectors, $attributes)
{
    if (is_null($attributes)) {
        return null;
    }

    // Extract values from attributes
    $bg_layers = isset($attributes['background-layers']) ? $attributes['background-layers'] : array();
    $bg_layers_hover = isset($attributes['background-layers-hover']) ? $attributes['background-layers-hover'] : array();
    $block_background_hover_status = isset($attributes['block-background-status-hover']) ? $attributes['block-background-status-hover'] : false;

    // Merge selectors and generated background layers selectors
    $new_selectors = array_merge(
        $selectors,
        get_bg_layers_selectors_css(array_merge($bg_layers, $bg_layers_hover))
    );

    // Remove background hover selectors if not needed
    if (!$block_background_hover_status) {
        unset($new_selectors['background hover']);
    }

    return $new_selectors;
}


/**
 * Clean objects by removing properties that are either not an array or are empty.
 *
 * @param array $obj The object to be cleaned.
 *
 * @return array|false The cleaned object, or false if the input was null.
 */
function objects_cleaner($obj)
{
    if(is_null($obj)) {
        return false;
    }

    $response = $obj;

    foreach ($response as $key => $val) {
        // If the property is not an array or is empty, remove it from the object
        if (!is_array($val) || empty($val)) {
            unset($response[$key]);
        }
    }

    return $response;
}

/**
 * Clean objects by removing properties that are repeated in successive breakpoints.
 *
 * @param array $obj The object to be cleaned.
 *
 * @return array The cleaned object.
 */
function repeated_breakpoint_cleaner($obj)
{
    $response = $obj;

    $breakpoints = ['xs', 's', 'm', 'l', 'xl', 'xxl', 'general'];

    foreach ($breakpoints as $i => $breakpoint) {
        if (!isset($obj[$breakpoint])) {
            continue;
        }

        foreach ($obj[$breakpoint] as $key => $val) {
            // Define the previous breakpoint
            $prev_breakpoint = ($breakpoint !== 'xl' && $breakpoint !== 'general') ? $breakpoints[$i + 1] : 'general';

            // If the property is the same as in the previous breakpoint, remove it
            if (isset($obj[$prev_breakpoint][$key]) && $obj[$prev_breakpoint][$key] === $val) {
                unset($response[$breakpoint][$key]);
            }
        }
    }

    return $response;
}

/**
 * Clean objects by removing properties that are the same as in the 'general' breakpoint.
 *
 * @param array $obj The object to be cleaned.
 *
 * @return array The cleaned object.
 */
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

        // If the property is the same as in the 'general' breakpoint, remove it
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


/**
 * Clean hover styles by comparing with normal styles and removing the same styles.
 *
 * @param array $normal_obj The object containing normal styles.
 * @param array $hover_obj The object containing hover styles.
 *
 * @return array The cleaned object containing hover styles.
 */
function hover_styles_cleaner($normal_obj, $hover_obj)
{
    // If the normal object is not empty, loop over it
    if (!empty($normal_obj)) {
        foreach ($normal_obj as $key => $val) {
            // If the key exists in the hover object, loop over the value
            if (isset($hover_obj[$key])) {
                foreach ($val as $breakpoint => $breakpoint_val) {
                    // If the breakpoint exists in the hover object, loop over the breakpoint value
                    if (isset($hover_obj[$key][$breakpoint])) {
                        foreach ($breakpoint_val as $attr_key => $attr_val) {
                            $prev_breakpoint = null;

                            // Loop over the higher breakpoints
                            foreach (array_slice(array_keys($hover_obj[$key]), array_search($breakpoint, array_keys($hover_obj[$key])) + 1) as $higher_breakpoint) {
                                // If the attribute key exists in the higher breakpoint, set it as the previous breakpoint and break the loop
                                if (isset($hover_obj[$key][$higher_breakpoint][$attr_key])) {
                                    $prev_breakpoint = $higher_breakpoint;
                                    break;
                                }
                            }

                            // If the previous breakpoint exists and the attribute value is different in it, continue to the next iteration
                            if ($prev_breakpoint && $hover_obj[$key][$prev_breakpoint][$attr_key] !== $hover_obj[$key][$breakpoint][$attr_key]) {
                                continue;
                            }

                            // If the attribute key exists in the hover object and the values are the same in both objects and the key is not 'transition', unset it from the hover object
                            if (isset($hover_obj[$key][$breakpoint][$attr_key]) && $hover_obj[$key][$breakpoint][$attr_key] === $attr_val && $attr_key !== 'transition') {
                                unset($hover_obj[$key][$breakpoint][$attr_key]);
                            }
                        }
                    }
                }
            }
        }
    }

    // Return the cleaned hover object
    return $hover_obj;
}


/**
 * Clean the styles object by removing unnecessary styles and breakpoints.
 *
 * @param array $styles The object containing styles.
 *
 * @return array The cleaned object containing styles.
 */
function style_cleaner($styles)
{
    // Loop over the styles
    foreach ($styles as $target => $raw_val) {

        // Clean non-object and empty targets - First clean, avoids unnecessary work on next loops
        $val = objects_cleaner($raw_val);

        // If the cleaned value is empty, remove it from the styles and continue to the next iteration
        if (empty($val)) {
            unset($styles[$target]);
            continue;
        }

        // Set the cleaned value back in the styles
        $styles[$target] = $val;

        // Clean breakpoint repeated values
        foreach ($val as $type_key => $type_val) {
            // If the type has more than one breakpoint, clean the repeated values
            if (count(array_keys($type_val)) > 1) {
                $styles[$target][$type_key] = repeated_breakpoint_cleaner($type_val);
            }
        }

        // Clean non-necessary breakpoint values when is same than general
        foreach ($val as $type_key => $type_val) {
            // If the type has more than one breakpoint, clean the non-necessary values
            if (count(array_keys($type_val)) > 1) {
                $styles[$target][$type_key] = general_breakpoint_cleaner($type_val);
            }
        }

        // Clean hover values
        if (strpos($target, ':hover') !== false) {
            // If the target is a hover effect, get the equivalent non-hover target
            $normal_key = str_replace(':hover', '', $target);

            // If the non-hover target exists, clean the hover values
            if(isset($styles[$normal_key])) {
                $styles[$target] = hover_styles_cleaner($styles[$normal_key], $val);
            }
        }

        // Clean empty breakpoints
        foreach ($val as $type_key => $type_val) {
            foreach ($type_val as $breakpoint => $breakpoint_val) {
                // If the breakpoint is empty, remove it from the styles
                if (!is_array($breakpoint_val) || empty($breakpoint_val)) {
                    unset($styles[$target][$type_key][$breakpoint]);
                }
            }
        }

        // Clean non-object and empty targets - Second clean before returning
        $cleaned_val = objects_cleaner($styles[$target]);

        // If the cleaned value is empty, remove it from the styles and continue to the next iteration
        if (empty($cleaned_val)) {
            unset($styles[$target]);
            continue;
        }

        // Set the cleaned value back in the styles
        $styles[$target] = $cleaned_val;
    }

    // Return the cleaned styles
    return $styles;
}

/**
 * Get the unique keys from both 'background hover' and 'background'.
 *
 * @param array $bg_layers_selectors An associative array with 'background hover' and 'background' as keys.
 *
 * @return array Unique keys from both 'background hover' and 'background'.
 */
function get_bg_layers_selectors_keys($bg_layers_selectors)
{
    if (!is_array($bg_layers_selectors)) {
        return [];
    }

    $hover_keys = array_keys($bg_layers_selectors['background hover'] ?? []);
    $background_keys = array_keys($bg_layers_selectors['background'] ?? []);

    return array_unique(array_merge($hover_keys, $background_keys));
}


/**
 * Retrieve the appropriate key based on a provided key.
 *
 * @param string $key The original key to transform.
 *
 * @return string The transformed key.
 */
function get_key($key)
{
    switch ($key) {
        case 'background-displayer':
            // Exception for background wrapper, as it existed before with the label 'background'
            return 'background';
        default:
            return $key;
    }
}

/**
 * Transform selectors based on the given selectors and attributes.
 *
 * @param array $selectors An associative array containing selectors.
 * @param array $attributes An associative array containing attributes.
 *
 * @return array The transformed selectors.
 */
function get_transform_selectors($selectors, $attributes = [])
{
    $bg_layers = isset($attributes['background-layers']) ? $attributes['background-layers'] : [];
    $bg_layers_hover = isset($attributes['background-layers-hover']) ? $attributes['background-layers-hover'] : [];

    $bg_layers_selectors = get_bg_layers_selectors_css(
        array_merge($bg_layers, $bg_layers_hover),
        false,
        false
    );

    $result = [];

    if (!empty($selectors)) {
        foreach ($selectors as $key => $obj) {
            $result[$key] = array_reduce(
                ['normal', 'hover'],
                function ($acc, $type) use ($obj, $key) {
                    return array_merge($acc, [
                        $type => array_merge($obj[$type], ['label' => $key])
                    ]);
                },
                []
            );
        }
    }

    foreach (get_bg_layers_selectors_keys($bg_layers_selectors) as $key) {
        $bg_layer_selectors = isset($bg_layers_selectors['background'][$key]) ? $bg_layers_selectors['background'][$key] : null;
        $bg_layer_hover_selectors = isset($bg_layers_selectors['background hover'][$key]) ? $bg_layers_selectors['background hover'][$key] : null;

        if (!empty($bg_layer_selectors) || !empty($bg_layer_hover_selectors)) {
            $result[get_key($key)] = array_filter(
                [
                    'normal' => $bg_layer_selectors,
                    'hover' => $bg_layer_hover_selectors,
                ],
                function ($value) {
                    return !empty($value);
                }
            );
        }
    }

    return $result;
}

function array_merge_recursive_with($arr1, $arr2, $customizer)
{
    $merged = $arr1;

    foreach ($arr2 as $key => $value) {
        // If key exists in both arrays and is an array in both
        if (isset($arr1[$key]) && is_array($arr1[$key]) && is_array($arr2[$key])) {
            $merged[$key] = $customizer($arr1[$key], $arr2[$key]);
        } else {
            $merged[$key] = $value;
        }
    }

    return $merged;
}

function deepMergeArrays($arr1, $arr2)
{
    foreach ($arr2 as $key => $value) {
        if (isset($arr1[$key]) && is_array($value)) {
            $arr1[$key] = deepMergeArrays($arr1[$key], $value);
        } else {
            $arr1[$key] = $value;
        }
    }

    return $arr1;
}

function style_processor($obj, $data, $props)
{


    $selectors = $data['customCss']['selectors'] ?? null;
    $transition_selectors = $data['transition'] ?? null;

    $styles = $obj;

    $transition_object = get_transition_styles($props, $transition_selectors);
    if (!empty($transition_object)) {
        foreach ($styles as $key => &$value) {
            if (is_array($value)) {
                $value = deepMergeArrays($value, $transition_object);
            }
        }

        unset($value);  // Unset reference to avoid unexpected behavior
    }

    $advanced_css_object = get_advanced_css_object($props);
    if(!empty($advanced_css_object)) {
        foreach ($styles as $key => &$value) {
            if (is_array($value)) {
                $value = deepMergeArrays($value, $advanced_css_object);
            }
        }
    }


    // Process custom styles if they exist
    $new_css_selectors = get_selectors_css($selectors, $props);
    $new_transform_selectors = get_transform_selectors($selectors, $props);

    if (!empty($new_css_selectors)) {
        $custom_css_object = get_custom_css_object($new_css_selectors, $props);
        if (!empty($custom_css_object)) {
            foreach ($styles as $key => &$value) {
                if (is_array($value)) {
                    $value = deepMergeArrays($value, $custom_css_object);
                }
            }

            unset($value);  // Unset reference to avoid unexpected behavior
        }
    }
    if (!empty($new_transform_selectors)) {
        $transform_object = get_transform_styles($props, $new_transform_selectors);

        if (!empty($transform_object)) {
            $is_transform_string = function ($string) {
                return is_string($string) && in_array($string, array('rotate', 'scale', 'translate'));
            };

            $merge_callback = function ($obj_value, $src_value) use ($is_transform_string) {
                if ($is_transform_string($obj_value) && $is_transform_string($src_value)) {
                    return $obj_value . ' ' . $src_value;
                }
            };



            //array_merge_recursive_with($styles, $transform_object, $merge_callback);
            // $styles = deepMergeArrays($styles, $transform_object);

            foreach ($styles as $key => &$value) {
                if (is_array($value)) {
                    $value = deepMergeArrays($value, $transform_object);
                }
            }

            unset($value);  // Unset reference to avoid unexpected behavior

        }
    }



    return style_cleaner($styles);
}
