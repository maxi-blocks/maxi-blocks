<?php

if (!defined('ABSPATH')) {
    exit;
}

if (!defined('MAXI_ADVANCED_CSS_MEDIA_QUERY_SEPARATOR')) {
    define('MAXI_ADVANCED_CSS_MEDIA_QUERY_SEPARATOR', '___MAXI_ADVANCED_CSS_MEDIA_QUERY___');
}

function build_advanced_css_media_query_target($media_query, $selector)
{
    return $media_query . MAXI_ADVANCED_CSS_MEDIA_QUERY_SEPARATOR . $selector;
}

function is_advanced_css_media_query_target($target)
{
    return is_string($target) && strpos($target, MAXI_ADVANCED_CSS_MEDIA_QUERY_SEPARATOR) !== false;
}

function split_advanced_css_media_query_target($target)
{
    $parts = explode(MAXI_ADVANCED_CSS_MEDIA_QUERY_SEPARATOR, $target, 2);

    return [
        'media_query' => $parts[0],
        'selector' => $parts[1] ?? '',
    ];
}
