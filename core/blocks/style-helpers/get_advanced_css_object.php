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

function get_advanced_css_object($obj)
{
    $response = [];
    $code = $obj['advanced-css'];

    if(!$code) {
        return $response;
    }

    $selector_regex = '/([a-zA-Z0-9\-_\s.,#:*[\]="\']*?)\s*{([^}]*)}/';

    $remaining_code = $code;
    preg_match_all($selector_regex, $code, $matches, PREG_SET_ORDER);

    foreach ($matches as $match) {
        $raw_selectors = trim($match[1]);
        $properties = trim_unmatched_brace(trim($match[2]));

        if ($properties && strpos($properties, '{') === false) {
            // Split selectors by comma and create separate response entries for each selector
            $selectors = explode(',', $raw_selectors);
            foreach ($selectors as $raw_selector) {
                $selector = ' ' . trim($raw_selector);
                $response[$selector] = [
                    'advancedCss' => [
                        'general' => [
                            'css' => $properties
                        ]
                    ]
                ];
            }

            $remaining_code = trim(str_replace($match[0], '', $remaining_code));
        } else {
            // if unmatched brace is found, stop the loop to prevent endless loop scenario
            break;
        }
    }

    // Add the remaining part as general CSS
    if ($remaining_code) {
        $remaining_code = trim_unmatched_brace($remaining_code);

        if (isset($response[''])) {
            $response['']['advancedCss']['general']['css'] .= "\n" . $remaining_code;
        } else {
            $response[''] = [
                'advancedCss' => [
                    'general' => [
                        'css' => $remaining_code
                    ]
                ]
            ];
        }
    }

    return $response;
}
