<?php

if ( ! defined( 'ABSPATH' ) ) exit;

function trim_unmatched_brace($code)
{
    $brace_index = strpos($code, '{');
    if ($brace_index !== false) {
        $last_semicolon_before_brace = strrpos($code, ';', $brace_index - strlen($code));
        return trim(substr($code, 0, $last_semicolon_before_brace + 1));
    }
    return $code;
}

function find_advanced_css_matching_brace($code, $open_index)
{
    $depth = 0;
    $length = strlen($code);

    for ($index = $open_index; $index < $length; $index++) {
        if ($code[$index] === '{') {
            $depth++;
        }

        if ($code[$index] === '}') {
            $depth--;
        }

        if ($depth === 0) {
            return $index;
        }
    }

    return -1;
}

function extract_advanced_css_media_queries($code)
{
    $media_blocks = [];
    $remaining_code = '';
    $cursor = 0;

    while ($cursor < strlen($code)) {
        $slice = substr($code, $cursor);

        if (!preg_match('/@media\b/i', $slice, $media_match, PREG_OFFSET_CAPTURE)) {
            $remaining_code .= substr($code, $cursor);
            break;
        }

        $media_index = $cursor + $media_match[0][1];
        $open_brace_index = strpos($code, '{', $media_index);

        if ($open_brace_index === false) {
            $remaining_code .= substr($code, $cursor);
            break;
        }

        $close_brace_index = find_advanced_css_matching_brace($code, $open_brace_index);

        if ($close_brace_index === -1) {
            $remaining_code .= substr($code, $cursor);
            break;
        }

        $remaining_code .= substr($code, $cursor, $media_index - $cursor);
        $media_blocks[] = [
            'media_query' => trim(substr($code, $media_index, $open_brace_index - $media_index)),
            'code' => substr($code, $open_brace_index + 1, $close_brace_index - $open_brace_index - 1),
        ];

        $cursor = $close_brace_index + 1;
    }

    return [
        'media_blocks' => $media_blocks,
        'remaining_code' => $remaining_code,
    ];
}

function set_advanced_css(&$obj, $selector, $breakpoint, $css)
{
    $trimmed_css = preg_replace('/\t/', '', $css);
    $trimmed_css = preg_replace('/\n/', ' ', $trimmed_css);
    $trimmed_css = preg_replace('/\s\s+/', ' ', $trimmed_css);
    $trimmed_css = trim($trimmed_css);

    if (isset($obj[$selector])) {
        $obj[$selector]['advanced_css'][$breakpoint] = [
            'css' => $trimmed_css,
        ];
    } else {
        $obj[$selector] = [
            'advanced_css' => [
                $breakpoint => [
                    'css' => $trimmed_css,
                ],
            ],
        ];
    }
}

function get_advanced_css_block_class_names($obj)
{
    if (empty($obj['extraClassName']) || !is_string($obj['extraClassName'])) {
        return [];
    }

    return array_values(array_filter(preg_split('/\s+/', $obj['extraClassName'])));
}

function is_advanced_css_block_class_selector($selector, $class_name)
{
    $class_selector = '.' . $class_name;

    if (strpos($selector, $class_selector) !== 0) {
        return false;
    }

    $next_character = substr($selector, strlen($class_selector), 1);

    return $next_character === '' || preg_match('/[:.#\[\s>+~,]/', $next_character) === 1;
}

function get_advanced_css_scoped_selector($selector, $block_class_names)
{
    $trimmed_selector = trim($selector);

    foreach ($block_class_names as $class_name) {
        if (is_advanced_css_block_class_selector($trimmed_selector, $class_name)) {
            return $trimmed_selector;
        }
    }

    return ' ' . $trimmed_selector;
}

function parse_advanced_css_code(&$response, $code, $breakpoint, $block_class_names, $media_query = null)
{
    $selector_regex = '/([a-zA-Z0-9\-_\s.,#:*\[\]="\'>+~()|^$!\/%]*?)\s*{([^}]*)}/';
    $remaining_code = $code;

    preg_match_all($selector_regex, $code, $matches, PREG_SET_ORDER);

    foreach ($matches as $match) {
        $raw_selectors = trim($match[1]);
        $properties = trim_unmatched_brace(trim($match[2]));

        if ($properties && strpos($properties, '{') === false) {
            $selectors = explode(',', $raw_selectors);

            foreach ($selectors as $raw_selector) {
                $selector = get_advanced_css_scoped_selector($raw_selector, $block_class_names);
                $target = $media_query
                    ? build_advanced_css_media_query_target($media_query, $selector)
                    : $selector;

                set_advanced_css($response, $target, $breakpoint, $properties);
            }

            $remaining_code = preg_replace('/' . preg_quote($match[0], '/') . '/', '', $remaining_code, 1);
        } else {
            break;
        }
    }

    if ($remaining_code) {
        $remaining_code = trim_unmatched_brace($remaining_code);

        if (!trim($remaining_code)) {
            return;
        }

        $target = $media_query
            ? build_advanced_css_media_query_target($media_query, '')
            : '';

        set_advanced_css($response, $target, $breakpoint, $remaining_code);
    }
}

function get_advanced_css_object($obj)
{
    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    $response = [];
    $block_class_names = get_advanced_css_block_class_names($obj);

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

        $parsed_code = extract_advanced_css_media_queries($code);

        foreach ($parsed_code['media_blocks'] as $media_block) {
            parse_advanced_css_code(
                $response,
                $media_block['code'],
                $breakpoint,
                $block_class_names,
                $media_block['media_query']
            );
        }

        parse_advanced_css_code(
            $response,
            $parsed_code['remaining_code'],
            $breakpoint,
            $block_class_names
        );
    }

    return $response;
}
