<?php

function get_styles($content)
{
    if (empty($content)) {
        return false;
    }

    $response = '';

    foreach ($content as $key => $val) {
        if (strpos($key, 'css') !== false) {
            $response .= $val;
        } else {
            if (is_array($val)) {
                $val = implode(", ", $val);
            }
            $response .= "{$key}:{$val};";
        }
    }

    return $response;
}

function get_media_query_string($breakpoint, $media)
{
    $max_width = $breakpoint !== 'xxl' ? 'max-width' : 'min-width';
    $value = $breakpoint !== 'xxl' ? $media : $media + 1;

    return "@media only screen and ({$max_width}:{$value}px){";
}

function frontend_style_generator($styles, $style_id)
{
    if (is_null($styles) || empty($styles)) {
        return false;
    }
    $response = '';

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        foreach ($styles as $target => $value) {
            $breakpointResponse = '';
            $content = $value['content'];

            foreach ($content as $suffix => $props) {
                if (isset($props[$breakpoint]) && !empty($props[$breakpoint])) {
                    $breakpointResponse .= "body.maxi-blocks--active #{$target}{$suffix}{";
                    $breakpointResponse .= get_styles($props[$breakpoint]);
                    $breakpointResponse .= '}';
                }
            }

            if (!empty($breakpointResponse)) {
                if ($breakpoint === 'xxl') {
                    $response .= get_media_query_string($breakpoint, $value['breakpoints']['xl']);
                } elseif ($breakpoint !== 'general') {
                    $response .= get_media_query_string($breakpoint, $value['breakpoints'][$breakpoint]);
                }

                $response .= $breakpointResponse;
                if ($breakpoint !== 'general') {
                    $response .= '}';
                }
            }
        }
    }

    return $response;
}
