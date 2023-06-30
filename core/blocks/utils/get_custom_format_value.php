<?php
/**
 * Returns if is a valid value
 *
 * @param mixed $val
 * @return boolean
 */
function get_is_valid_value($val)
{
    return $val || is_bool($val) || is_numeric($val);
}

/**
 * Get custom format
 *
 * @param array $typography Typography attributes
 * @param string $class_name Class name
 * @param boolean $is_hover Is hover state
 * @return array Custom format for given class name
 */
function get_custom_format($typography, $class_name, $is_hover = false)
{
    $key = 'custom-formats' . ($is_hover ? '-hover' : '');
    $custom_formats = isset($typography[$key]) ? $typography[$key] : [];
    $current_custom_format = isset($custom_formats[$class_name]) ? $custom_formats[$class_name] : [];

    return $current_custom_format;
}

/**
 * Retrieves the current className of the 'maxi
 *
 * @param array $format_value RichText format value
 * @param boolean $is_hover Is the requested typography under hover state
 * @return string Current className for Maxi Custom format
 */
function get_current_format_class_name($format_value, $is_hover = false)
{
    if (!isset($format_value['formats']) || empty($format_value['formats'])) {
        return false;
    }

    $is_whole_content = false;

    if (!empty($format_value)) {
        $start = $format_value['start'];
        $end = $format_value['end'];

        $is_whole_content = $start === $end;
    }

    $format_value_temp = $format_value;
    if ($is_whole_content) {
        $format_value_temp['start'] = 1;
        $format_value_temp['end'] = 1;
    }

    $format_options = get_active_format($format_value_temp, !$is_hover ? 'maxi-blocks/text-custom' : 'maxi-blocks/text-custom-hover');

    $current_class_name = isset($format_options['attributes']['className']) ? $format_options['attributes']['className'] : false;

    return $current_class_name;
}

function get_custom_format_value($args)
{
    $format_value = $args['formatValue'] ?? null;
    $typography = $args['typography'] ?? null;
    $prop = $args['prop'] ?? null;
    $breakpoint = $args['breakpoint'] ?? null;
    $is_hover = $args['isHover'] ?? false;
    $text_level = $args['textLevel'] ?? 'p';
    $block_style = $args['blockStyle'] ?? 'light';
    $style_card = $args['styleCard'] ?? null;
    $style_card_prefix = $args['styleCardPrefix'] ?? null;
    $avoid_xxl = $args['avoidXXL'] ?? false;
    $avoid_sc = $args['avoidSC'] ?? false;

    // Custom format value
    if ($format_value) {
        $current_class_name = get_current_format_class_name($format_value, $is_hover);

        if ($current_class_name) {
            $custom_format = get_custom_format($typography, $current_class_name, $is_hover);

            if ($custom_format) {
                $responsive_value = get_last_breakpoint_attribute([
                'target' => $prop,
                'breakpoint' => $breakpoint,
                'attributes' => $custom_format
                ]);

                if ($responsive_value || is_bool($responsive_value) || is_numeric($responsive_value)) {
                    return $responsive_value;
                }
            }
        }
    }

    // General format value
    $value = get_last_breakpoint_attribute([
    'target' => $prop,
    'breakpoint' => $breakpoint,
    'attributes' => $typography,
    'isHover' => $is_hover,
    'avoidXXL' => $avoid_xxl
    ]);

    if (get_is_valid_value($value) || $avoid_sc) {
        return $value;
    }

    // Style Cards value
    $sc_style = in_array($block_style, ['light', 'dark']) ? $block_style : get_block_style();
    $sc_level = $style_card_prefix ?: $text_level;
    $active_style_card = $style_card ?: get_active_style_card()['value'];
    $current_sc = get_typography_from_sc($active_style_card[$sc_style], $sc_level);

    $current_sc_value = get_last_breakpoint_attribute([
    'target' => $prop,
    'breakpoint' => $breakpoint,
    'attributes' => $current_sc,
    'isHover' => $is_hover,
    'avoidXXL' => $avoid_xxl
    ]);

    if (get_is_valid_value($current_sc_value)) {
        return $current_sc_value;
    }

    $default_sc = get_typography_from_sc($active_style_card[$sc_style], $sc_level);

    $default_sc_value = get_last_breakpoint_attribute([
    'target' => $prop,
    'breakpoint' => $breakpoint,
    'attributes' => $default_sc,
    'isHover' => $is_hover,
    'avoidXXL' => $avoid_xxl
    ]);

    if (get_is_valid_value($default_sc_value)) {
        return $default_sc_value;
    }

    return null;
}