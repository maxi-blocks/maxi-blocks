<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/defaults/styles_defaults.php';

function get_transition_styles($props, $transition_obj)
{

    if(empty($transition_obj)) {
        $defaults = new StylesDefaults();
        $transition_obj = $defaults->transitionDefault;
    }

    $transition = $props['transition'] ?? null;

    if (empty($transition)) {
        return null;
    }

    $response = [];
    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($transition_obj as $type => $obj) {
        foreach ($obj as $key => $value) {
            $raw_hover_prop = $value['hoverProp'] ?? false;
            $is_transform = $value['isTransform'] ?? false;
            $hover_prop = !$raw_hover_prop || is_array($raw_hover_prop)
                ? $raw_hover_prop
                : [$raw_hover_prop];

            if ($hover_prop && array_reduce($hover_prop, function ($carry, $prop) use ($props) {
                return $carry && empty($props[$prop]);
            }, true) && !$is_transform) {
                continue;
            }

            $raw_target = $value['target'];
            $raw_property = $value['property'];
            $targets = is_array($raw_target) ? $raw_target : [$raw_target];
            $properties = is_array($raw_property) ? $raw_property : [$raw_property];

            foreach ($targets as $target) {
                $hover_target = $target . ':hover';

                foreach ($breakpoints as $breakpoint) {
                    if ($is_transform && array_reduce(['scale', 'rotate', 'translate', 'origin'], function ($carry, $prop) use ($breakpoint, $props, $key) {
                        return $carry && empty(get_last_breakpoint_attribute(array(
                            'target' => 'transform-' . $prop,
                            'breakpoint' => $breakpoint,
                            'attributes' => $props,
                            'keys' => [$key, 'hover-status']
                        )));
                    }, true)) {
                        continue;
                    }

                    if (!isset($response[$target])) {
                        $response[$target] = ['transition' => []];
                    }

                    $generate_transition_string = function ($target, $is_hover = false) use ($breakpoint, $transition, $type, $key, $properties, &$response) {
                        // Check for keys before access
                        $last_transition_split = isset($transition[$type][$key]) ? get_last_breakpoint_attribute(array(
                            'target' => 'split',
                            'breakpoint' => $breakpoint,
                            'attributes' => $transition[$type][$key]
                        )) : null;

                        $transition_split = isset($transition[$type][$key]['split-' . $breakpoint]) ? $transition[$type][$key]['split-' . $breakpoint] : null;

                        $is_new_transition_split = ($transition_split === $last_transition_split) && !is_null($transition_split);

                        if ($is_hover && !isset($response[$target])) {
                            if (!$is_new_transition_split) {
                                return;
                            }

                            $response[$target] = ['transition' => []];
                        }

                        $transition_content = $is_hover || !$last_transition_split ? $transition[$type][$key] : $transition[$type][$key]['out'];

                        $transition_string = '';
                        $get_last_transition_attribute = function ($target) use ($breakpoint, $transition_content) {
                            return get_last_breakpoint_attribute(array(
                                'target' => $target,
                                'breakpoint' => $breakpoint,
                                'attributes' => $transition_content
                            ));
                        };

                        $get_transition_attribute = function ($target) use ($breakpoint, $transition_content) {
                            return $transition_content[$target . '-' . $breakpoint] ?? null;
                        };

                        $last_transition_duration = $get_last_transition_attribute('transition-duration');
                        $transition_duration = $get_transition_attribute('transition-duration');

                        $last_transition_delay = $get_last_transition_attribute('transition-delay');
                        $transition_delay = $get_transition_attribute('transition-delay');

                        $last_transition_timing_function = $get_last_transition_attribute('easing');
                        $transition_timing_function = $get_transition_attribute('easing');

                        $last_transition_status = $get_last_transition_attribute('transition-status');
                        $transition_status = $get_transition_attribute('transition-status');

                        $is_some_value = ($transition_duration === $last_transition_duration) || ($transition_delay === $last_transition_delay) || ($transition_timing_function === $last_transition_timing_function) || ($transition_status === $last_transition_status) || ($is_hover && $is_new_transition_split);

                        if ($is_some_value) {
                            foreach ($properties as $property) {
                                $transition_property = $property ?? 'all';

                                if (!$last_transition_status) {
                                    $transition_string .= $transition_property . ' 0s 0s, ';
                                } elseif ($last_transition_status) {
                                    $transition_string .= $transition_property . ' ' . $last_transition_duration . 's ' . $last_transition_delay . 's ' . $last_transition_timing_function . ', ';
                                }
                            }
                        }

                        $transition_string = preg_replace('/,\s*$/', '', $transition_string);

                        if ($transition_string) {
                            if (!isset($response[$target]['transition'][$breakpoint])) {
                                $response[$target]['transition'][$breakpoint] = ['transition' => $transition_string];
                            } else {
                                $response[$target]['transition'][$breakpoint]['transition'] .= ', ' . $transition_string;
                            }
                        }
                    };

                    $generate_transition_string($target);
                    $generate_transition_string($hover_target, true);
                }
            }
        }
    }

    return $response;
}
