<?php

function get_aspect_ratio($ratio)
{
    if ($ratio === 'original') {
        return null;
    }

    $aspectRatio = null;

    $aspectRatios = [
        'ar11' => '1 / 1',
        'ar23' => '2 / 3',
        'ar32' => '3 / 2',
        'ar43' => '4 / 3',
        'ar169' => '16 / 9'
     ];

    $aspectRatio = $aspectRatios[$ratio] ?? '';

    return [
        'ratio' => [
            'general' => [
                'aspect-ratio' => $aspectRatio
            ]
        ]
    ];
}
