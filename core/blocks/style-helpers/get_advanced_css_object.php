<?php

function trim_unmatched_brace($code)
{
    $brace_index = strpos($code, '{');
    if ($brace_index !== false) {
        $last_semicolon_before_brace = strrpos($code, ';', $brace_index - strlen($code));
        return trim(substr($code, 0, $last_semicolon_before_brace + 1));
    }
    return $code;
}

function set_advanced_css(&$obj, $selector, $breakpoint, $css)
{
    if (isset($obj[$selector])) {
        $obj[$selector]['advanced_css'][$breakpoint] = ['css' => $css];
    } else {
        $obj[$selector] = [
            'advanced_css' => [
                $breakpoint => ['css' => $css]
            ]
        ];
    }
}

// TODO: ensure it works
function get_advanced_css_object($obj)
{
    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    $response = [];
    $selector_regex = '/([a-zA-Z0-9\-_\s.,#:*[\]="\']*?)\s*{([^}]*)}/';

    $remaining_code = $code;
    preg_match_all($selector_regex, $code, $matches, PREG_SET_ORDER);

    foreach ($breakpoints as $breakpoint) {
        $code = get_attribute_value(
            'advanced-css',
            $obj,
            false,
            $breakpoint
        );

        if (!$code) {
            continue;
        }

        $remaining_code = $code;
        preg_match_all($selector_regex, $code, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            $raw_selectors = trim($match[1]);
            $properties = trim_unmatched_brace(trim($match[2]));

            if ($properties && strpos($properties, '{') === false) {
                $selectors = explode(',', $raw_selectors);
                foreach ($selectors as $raw_selector) {
                    $selector = ' ' . trim($raw_selector);
                    set_advanced_css($response, $selector, $breakpoint, $properties);
                }

                $remaining_code = trim(str_replace($match[0], '', $remaining_code));
            } else {
                break;
            }
        }

        if ($remaining_code) {
            $remaining_code = trim_unmatched_brace($remaining_code);
            set_advanced_css($response, '', $breakpoint, $remaining_code);
        }
    }

    return $response;
}
