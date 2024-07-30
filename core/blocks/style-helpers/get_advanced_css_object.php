<?php

/**
 * Trims unmatched brace from the code.
 *
 * @param string $code The code to trim.
 * @return string The trimmed code.
 */
function trim_unmatched_brace(string $code)
{
    $brace_index = strpos($code, '{');
    if ($brace_index !== false) {
        $last_semicolon_before_brace = strrpos(substr($code, 0, $brace_index), ';');
        return trim(substr($code, 0, $last_semicolon_before_brace + 1));
    }
    return $code;
}

/**
 * Sets advanced CSS for a selector and breakpoint in the given object.
 *
 * @param array  $obj        The object to set the advanced CSS in.
 * @param string $selector   The CSS selector.
 * @param string $breakpoint The breakpoint.
 * @param string $css        The CSS code.
 */
function set_advanced_css(array &$obj, string $selector, string $breakpoint, string $css)
{
    $trimmed_css = preg_replace('/\s+/', ' ', $css);
    $trimmed_css = trim($trimmed_css);

    if (isset($obj[$selector])) {
        $obj[$selector]['advancedCss'][$breakpoint] = [
            'css' => $trimmed_css,
        ];
    } else {
        $obj[$selector] = [
            'advancedCss' => [
                $breakpoint => [
                    'css' => $trimmed_css,
                ],
            ],
        ];
    }
}

/**
 * Retrieves the advanced CSS object from the given object.
 *
 * @param array $obj The object to retrieve the advanced CSS from.
 * @return array The advanced CSS object.
 */
function get_advanced_css_object($obj)
{
    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    $response = [];
    $selector_regex = '/([a-zA-Z0-9\-_\s.,#:*[\]="\']*?)\s*{([^}]*)}/';

    foreach ($breakpoints as $breakpoint) {
        $code = get_attribute_value(
            'advanced-css',
            $obj,
            false,
            $breakpoint,
        );

        if (!$code) {
            continue;
        }

        $remaining_code = $code;
        preg_match_all($selector_regex, $code, $matches, PREG_SET_ORDER);

        foreach ($matches as $match) {
            $raw_selectors = trim($match[1] ?? '');
            $properties = trim_unmatched_brace(trim($match[2] ?? ''));

            if ($properties && strpos($properties, '{') === false) {
                // Split selectors by comma and create separate response entries for each selector
                $selectors = explode(',', $raw_selectors);
                foreach ($selectors as $raw_selector) {
                    $selector = ' ' . trim($raw_selector);
                    set_advanced_css($response, $selector, $breakpoint, $properties);
                }
                $remaining_code = trim(str_replace($match[0], '', $remaining_code)); // Remove the parsed segment from the remaining code
            } else {
                // If unmatched brace is found, stop the loop to prevent endless loop scenario
                break;
            }
        }

        // Add the remaining part as general CSS
        if ($remaining_code) {
            $remaining_code = trim_unmatched_brace($remaining_code);
            set_advanced_css($response, '', $breakpoint, $remaining_code);
        }
    }

    return $response;
}
