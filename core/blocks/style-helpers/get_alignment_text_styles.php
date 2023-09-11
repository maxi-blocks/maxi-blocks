<?php

function get_alignment_text_styles($obj, $type = 'text')
{
    if (!is_array($obj)) {
        return false;
    }

    $response = [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        if (isset($obj["text-alignment-{$breakpoint}"])) {
            switch ($obj["text-alignment-{$breakpoint}"]) {
                case 'left':
                    $response[$breakpoint] = [
                        'text-align' => 'left',
                    ];
                    break;
                case 'center':
                    $response[$breakpoint] = $type === 'list'
                       ? ['list-style-position' => 'inside']
                       : ['text-align' => 'center'];
                    break;
                case 'justify':
                    $response[$breakpoint] = [
                        'text-align' => 'justify',
                    ];
                    break;
                case 'right':
                    {
                        if($type === 'list') {
                            $response[$breakpoint] = [
                                $type === 'list' ? 'list-style-position' : 'text-align' =>
                                    $type === 'list' ? 'inside' : 'initial',
                            ];
                        } else {
                            $response[$breakpoint] = [
                                'text-align' => 'right',
                            ];
                        }

                        break;
                    }
                default:
                    continue 2;
            }
        }
    }

    return $response;
}
