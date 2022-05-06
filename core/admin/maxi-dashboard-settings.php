<?php


/**
 * SVG and JSON upload option
 * @uses upload_mimes filter
 *
 **/

function svg_json_upload($mimes)
{
    $mimes['json'] = 'text/plain';
    $mimes['svg'] = 'image/svg+xml';
    return $mimes;
}

if (get_option('allow_svg_json_uploads')) {
    add_filter('upload_mimes', 'svg_json_upload');
}