<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Transform_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_get_correct_transform_styles()
    {
        $selectors = create_selectors([
            'canvas' => '',
        ]);

        $object = [
            'transform-origin-general' => [
                'canvas' => [
                    'normal' => [
                        'x' => 'left',
                        'y' => 'top',
                        'x-unit' => '%',
                        'y-unit' => '%',
                    ],
                ],
            ],
            'transform-rotate-general' => [
                'canvas' => [
                    'hover-status' => true,
                    'hover' => [
                        'z' => 90,
                    ],
                ],
            ],
            'transform-scale-general' => [
                'canvas' => [
                    'normal' => [
                        'y' => 200,
                    ],
                    'hover-status' => true,
                    'hover' => [
                        'x' => 200,
                    ],
                ],
            ],
            'transform-translate-general' => [
                'canvas' => [
                    'normal' => [
                        'x' => -20,
                        'y' => -10,
                        'x-unit' => '%',
                        'y-unit' => '%',
                    ],
                    'hover-status' => true,
                    'hover' => [
                        'x' => 20,
                        'y' => 10,
                        'x-unit' => '%',
                        'y-unit' => '%',
                    ],
                ],
            ],
        ];

        $result = get_transform_styles($object, $selectors);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_default_hover_transform_styles()
    {
        $selectors = create_selectors([
            'canvas' => '',
        ]);

        $object = [
            'transform-origin-general' => [
                'canvas' => [
                    'hover-status' => true,
                    'normal' => [
                        'x' => 'left',
                        'y' => 'top',
                        'x-unit' => '%',
                        'y-unit' => '%',
                    ],
                ],
            ],
            'transform-rotate-general' => [
                'canvas' => [
                    'hover-status' => true,
                    'normal' => [
                        'x' => 30,
                        'y' => 60,
                        'z' => 90,
                    ],
                ],
            ],
            'transform-scale-general' => [
                'canvas' => [
                    'hover-status' => true,
                    'normal' => [
                        'y' => 200,
                    ],
                ],
            ],
            'transform-translate-general' => [
                'canvas' => [
                    'hover-status' => true,
                    'normal' => [
                        'x' => -20,
                        'y' => -10,
                        'x-unit' => '%',
                        'y-unit' => '%',
                    ],
                ],
            ],
        ];

        $result = get_transform_styles($object, $selectors);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }
}
