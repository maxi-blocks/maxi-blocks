<?php

function clean_content($content)
{
    $newContent = $content;
    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($newContent as $prop => $value) {
        if ((empty($newContent[$prop]) &&
                !is_numeric($newContent[$prop]) &&
                !is_bool($newContent[$prop])) || $prop === 'label') {
            unset($newContent[$prop]);
        } elseif (is_array($newContent[$prop])) {
            if (in_array($prop, $breakpoints)) {
                $newContent[$prop] = clean_content($newContent[$prop]);
            } else {
                $newContent = array_merge($newContent, clean_content($newContent[$prop]));
                unset($newContent[$prop]);
            }
        }
    }

    return $newContent;
}

function get_clean_content($content)
{
    $newContent = $content;

    foreach ($newContent as $target => $value) {
        if (is_array($newContent[$target])) {
            $newContent[$target] = clean_content($newContent[$target]);
        }

        if (empty($newContent[$target])) {
            unset($newContent[$target]);
        }

        if (json_encode($newContent[$target]) === json_encode([ 'general' => [] ])) {
            unset($newContent[$target]);
        }
    }

    return $newContent;
}

function style_resolver($styles)
{
    if (!$styles) {
        return array();
    }

    $response = array();
    $breakpoints = [
        "xxl" => 1920,
        "xl" => 1920,
        "l" => 1366,
        "m" => 1024,
        "s" => 767,
        "xs" => 480
    ];

    foreach ($styles as $target => $props) {
        if (!isset($response[$target])) {
            $response[$target] = array(
                'breakpoints' => $breakpoints,
                'content' => array()
            );
        }

        $response[$target]['content'] = $props;

        if (isset($response[$target]['content'])) {
            $response[$target]['content'] = get_clean_content($response[$target]['content']);
        }
    }

    return $response;
}
