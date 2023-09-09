<?php
/**
 * Create icon transitions array.
 *
 * @param array $options Associative array containing target, title_prefix, prefix, disable_background, disable_border and disable_width.
 * @return array Returns an associative array with title, target, property, and hover_prop.
 */
function create_icon_transitions($options)
{
    if (!isset($options['target'])) {
        return false;
    }
    // Options from the argument
    $target = $options['target'];
    $title_prefix = $options['title_prefix'] ?? '';
    $prefix = $options['prefix'] ?? '';
    $disable_background = $options['disable_background'] ?? false;
    $disable_border = $options['disable_border'] ?? false;
    $disable_width = $options['disable_width'] ?? false;

    // Create a prefix hover status
    $icon_status_hover = $prefix . 'status-hover';

    // Function to get the key based on the title_prefix
    $get_key = function ($key) use ($title_prefix) {
        return $title_prefix ? $title_prefix . ' ' . $key : $key;
    };

    // Create keys for color, background, width, and border
    $color_key = $get_key('colour');
    $color_key_two = $color_key . ' two';
    $background_key = $get_key('background');
    $width_key = $get_key('width');
    $border_key = $get_key('border');

    // Initialize result with color keys
    $result = [
        $color_key => [
            'title' => ucwords($color_key),
            'target' => $target . ' svg > *:not(g)',
            'property' => false,
            'hover_prop' => $icon_status_hover
        ],
        $color_key_two => [
            'title' => ucwords($color_key_two),
            'target' => $target . ' svg g *:not(g)',
            'property' => false,
            'hover_prop' => $icon_status_hover
        ]
    ];

    // Add background, width, and border keys if they are not disabled
    if (!$disable_background) {
        $result[$background_key] = [
            'title' => ucwords($background_key),
            'target' => $target,
            'property' => 'background',
            'hover_prop' => $icon_status_hover
        ];
    }

    if (!$disable_width) {
        $result[$width_key] = [
            'title' => ucwords($width_key),
            'target' => $target . ' svg',
            'property' => ['width', 'height'],
            'hover_prop' => $icon_status_hover
        ];
    }

    if (!$disable_border) {
        $result[$border_key] = [
            'title' => ucwords($border_key),
            'target' => $target,
            'property' => 'border',
            'hover_prop' => $icon_status_hover
        ];
    }

    return $result;
}
