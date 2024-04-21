<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Shape_Divider_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_get_a_correct_shape_divider_styles()
    {
        $object = [
            'shape-divider-top-status' => true,
            'shape-divider-top-height-general' => 1,
            'shape-divider-top-height-unit-general' => 'px',
            'shape-divider-top-opacity-general' => 1,
            'shape-divider-top-shape-style' => 'default',
            'shape-divider-top-effects-status' => true,
            'shape-divider-top-color-general' => 'rgb(255, 99, 71)',
            'shape-divider-bottom-status' => true,
            'shape-divider-bottom-height-general' => 3,
            'shape-divider-bottom-height-unit-general' => 'px',
            'shape-divider-bottom-opacity-general' => 0.51,
            'shape-divider-bottom-shape-style' => 'default',
            'shape-divider-bottom-effects-status' => true,
            'shape-divider-bottom-color-general' => 'rgb(255, 99, 71)',
        ];

        $objectSVGStyles = [
            'shape-divider-top-status' => true,
            'shape-divider-top-height-general' => 3,
            'shape-divider-top-height-unit-general' => 'px',
            'shape-divider-top-opacity-general' => 0.98,
            'shape-divider-top-shape-style' => 'default',
            'shape-divider-top-effects-status' => true,
            'shape-divider-top-color-general' => 'rgb(255, 99, 71)',
            'shape-divider-bottom-status' => true,
            'shape-divider-bottom-height-general' => 1,
            'shape-divider-bottom-height-unit-general' => 'px',
            'shape-divider-bottom-opacity-general' => 1,
            'shape-divider-bottom-shape-style' => 'default',
            'shape-divider-bottom-effects-status' => true,
            'shape-divider-bottom-color-general' => 'rgb(255, 99, 71)',
        ];

        $result = get_shape_divider_styles($object, 'top');
        $this->assertMatchesJsonSnapshot(json_encode($result));

        $resultSVGStyles = get_shape_divider_svg_styles($objectSVGStyles, 'bottom', 'light');
        $this->assertMatchesJsonSnapshot(json_encode($resultSVGStyles));
    }
}
