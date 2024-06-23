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
    $available_scroll_types = [];

    foreach ($scroll as $key => $value) {
        if(str_ends_with($key, '-status-general') && $value) {
            $parts = explode('-', $key);
            $available_scroll_types[] = $parts[1];
        }
    }

    $available_scroll_types = array_unique($available_scroll_types);
    $response = [];

    foreach ($scroll as $key => $value) {
        $scroll_type = array_filter($available_scroll_types, function ($type) use ($key) {
            return strpos($key, "-{$type}-") !== false;
        });

        if (empty($scroll_type)) {
            continue;
        }

        $scroll_type = reset($scroll_type); // Get the first matched type

        if (!isset($response[$scroll_type])) {
            $response[$scroll_type] = [];
        }
        $response[$scroll_type][$key] = $value;
    }

    if (empty($response)) {
        return null;
    }

    $response['scroll_effects'] = true;
    return $response;
}


function get_has_video($unique_id, $bg_layers)
{
    return !empty(get_video_layers($unique_id, $bg_layers));
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
