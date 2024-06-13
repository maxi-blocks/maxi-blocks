<?php

/**
 * Get the unique keys from both 'background hover' and 'background'.
 *
 * @param array $bg_layers_selectors An associative array with 'background hover' and 'background' as keys.
 *
 * @return array Unique keys from both 'background hover' and 'background'.
 */
function get_bg_layers_selectors_keys($bg_layers_selectors)
{
    if (!is_array($bg_layers_selectors)) {
        return [];
    }

    $hover_keys = array_keys($bg_layers_selectors['background hover'] ?? []);
    $background_keys = array_keys($bg_layers_selectors['background'] ?? []);

    return array_unique(array_merge($hover_keys, $background_keys));
}


/**
 * Retrieve the appropriate key based on a provided key.
 *
 * @param string $key The original key to transform.
 *
 * @return string The transformed key.
 */
function get_key($key)
{
    switch ($key) {
        case 'background-displayer':
            // Exception for background wrapper, as it existed before with the label 'background'
            return 'background';
        default:
            return $key;
    }
}

/**
 * Transform selectors based on the given selectors and attributes.
 *
 * @param array $selectors An associative array containing selectors.
 * @param array $attributes An associative array containing attributes.
 *
 * @return array The transformed selectors.
 */
function get_transform_selectors($selectors, $attributes = [])
{
    $bg_layers = isset($attributes['background-layers']) ? $attributes['background-layers'] : [];
    $bg_layers_hover = isset($attributes['background-layers-hover']) ? $attributes['background-layers-hover'] : [];

    $bg_layers_selectors = get_bg_layers_selectors_css(
        array_merge($bg_layers, $bg_layers_hover),
        false,
        false
    );

    $result = [];

    if (!empty($selectors)) {
        foreach ($selectors as $key => $obj) {
            $result[$key] = array_reduce(
                ['normal', 'hover'],
                function ($acc, $type) use ($obj, $key) {
                    return array_merge($acc, [
                        $type => array_merge($obj[$type], ['label' => $key])
                    ]);
                },
                []
            );
        }
    }

    foreach (get_bg_layers_selectors_keys($bg_layers_selectors) as $key) {
        $bg_layer_selectors = isset($bg_layers_selectors['background'][$key]) ? $bg_layers_selectors['background'][$key] : null;
        $bg_layer_hover_selectors = isset($bg_layers_selectors['background hover'][$key]) ? $bg_layers_selectors['background hover'][$key] : null;

        if (!empty($bg_layer_selectors) || !empty($bg_layer_hover_selectors)) {
            $result[get_key($key)] = array_filter(
                [
                    'normal' => $bg_layer_selectors,
                    'hover' => $bg_layer_hover_selectors,
                ],
                function ($value) {
                    return !empty($value);
                }
            );
        }
    }

    return $result;
}
