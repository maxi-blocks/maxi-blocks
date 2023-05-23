<?php

function get_alignment_text_styles($obj, $type = 'text') {
    $response = [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        if (!empty($obj["text-alignment-{$breakpoint}"])) {
            switch ($obj["text-alignment-{$breakpoint}"]) {
                case 'left':
                    $response[$breakpoint] = [
                        'text-align' => 'left',
                    ];
                    break;
                case 'center':
                    $response[$breakpoint] = [
                        $type === 'list' ? 'list-style-position' : 'text-align' =>
                            $type === 'list' ? 'inside' : 'initial',
                    ];
                    break;
                case 'justify':
                    $response[$breakpoint] = [
                        'text-align' => 'justify',
                    ];
                    break;
                case 'right':
                    $response[$breakpoint] = [
                        $type === 'list' ? 'list-style-position' : 'text-align' =>
                            $type === 'list' ? 'inside' : 'initial',
                    ];
                    break;
                default:
                    return false;
            }
        }
    }

    return $response;
}
