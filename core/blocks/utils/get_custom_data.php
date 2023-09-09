<?php

function get_parallax_layers($unique_id, $bg_layers)
{
    if (!isset($bg_layers) || empty($bg_layers)) {
        return null;
    }

    $response = array_filter($bg_layers, function ($layer) {
        return $layer['type'] === 'image' && isset($layer['background-image-parallax-status']);
    });

    if (empty($response)) {
        return null;
    }

    return [$unique_id => $response];
}

function get_has_parallax($bg_layers)
{
    return !empty(get_parallax_layers($bg_layers));
}

function get_video_layers($unique_id, $bg_layers)
{
    if (!isset($bg_layers) || empty($bg_layers)) {
        return null;
    }

    $response = array_filter($bg_layers, function ($layer) {
        return $layer['type'] === 'video';
    });

    if (empty($response)) {
        return null;
    }

    return [$unique_id => $response];
}

function get_scroll_effects($unique_id, $scroll)
{
    if (!isset($scroll) || empty($scroll)) {
        return null;
    }

    $response = array_filter($scroll, function ($key) use ($scroll) {
        return strpos($key, '-status-') !== false &&
               strpos($key, 'reverse') === false &&
               strpos($key, 'preview') === false &&
               $scroll[$key];
    }, ARRAY_FILTER_USE_KEY);

    if (empty($response)) {
        return null;
    }

    return [$unique_id => $response];
}

function get_has_video($unique_id, $bg_layers)
{
    return !empty(get_video_layers($unique_id, $bg_layers));
}

function get_has_scroll_effects($unique_id, $scroll)
{
    return !empty(get_scroll_effects($unique_id, $scroll));
}

function split_value_and_unit($val)
{
    preg_match('/(\d+)(.*)/', $val, $matches);
    $value = (int)$matches[1];
    $unit = trim($matches[2]);

    return ['value' => $value, 'unit' => $unit];
}

function get_relations($unique_id, $relations)
{
    if (empty($relations)) {
        return null;
    }

    $new_relations = $relations;
    foreach ($new_relations as &$relation) {
        $relation['trigger'] = $unique_id .
            ($relation['isButton'] ? ' .maxi-button-block__button' : '');
    }

    return $new_relations;
}
