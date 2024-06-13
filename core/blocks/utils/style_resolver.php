<?php

function clean_content($content)
{
    $new_content = $content;
    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($new_content as $prop => $value) {
        if ((empty($new_content[$prop]) &&
                !is_numeric($new_content[$prop]) &&
                !is_bool($new_content[$prop])) || $prop === 'label') {
            unset($new_content[$prop]);
        } elseif (is_array($new_content[$prop])) {
            if (in_array($prop, $breakpoints)) {
                $new_content[$prop] = clean_content($new_content[$prop]);
            } else {
                $new_content = array_merge_recursive($new_content, clean_content($new_content[$prop]));
                unset($new_content[$prop]);
            }
        }
    }

    return $new_content;
}

function get_clean_content($content)
{
    $new_content = $content;

    foreach ($new_content as $target => $value) {
        if (is_array($new_content[$target])) {
            $new_content[$target] = clean_content($new_content[$target]);
        }

        if (empty($new_content[$target])) {
            unset($new_content[$target]);

            continue;
        }

        if (wp_json_encode($new_content[$target]) === wp_json_encode([ 'general' => [] ])) {
            unset($new_content[$target]);
        }
    }

    return $new_content;
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
