<?php

function get_alignment_text_styles($obj, $type = 'text')
{
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
                    if ($type === 'list') {
                        $response[$breakpoint] = [
                            'list-style-position' => $type === 'list' ? 'inside' : 'initial',
                        ];
                    } else {
                        $response[$breakpoint] = [
                            'text-align' => 'center',
                        ];
                    }
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
                    return false;
            }
        }
    }

    return $response;
}
