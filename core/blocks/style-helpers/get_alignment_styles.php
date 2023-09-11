<?php

function get_alignment_flex_styles($obj) {
    $response = [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        if (!empty($obj["alignment-{$breakpoint}"])) {
            switch ($obj["alignment-{$breakpoint}"]) {
                case 'left':
                    $response[$breakpoint] = [
                        'justify-content' => 'flex-start',
                    ];
                    break;
                case 'center':
                case 'justify':
                    $response[$breakpoint] = [
                        'justify-content' => 'center',
                    ];
                    break;
                case 'right':
                    $response[$breakpoint] = [
                        'justify-content' => 'flex-end',
                    ];
                    break;
                default:
                    break;
            }
        }
    }

    return $response;
}
