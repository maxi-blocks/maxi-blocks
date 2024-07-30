<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Image_Shape_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    private $object = [
        'background-svg-image-shape-scale-general' => 100,
        'background-svg-image-shape-scale-m' => 50,
        'background-svg-image-shape-scale-s' => 100,
    ];

    public function test_ensure_that_image_shape_scale_is_working_with_responsive()
    {
        $result = get_image_shape_styles('svg', $this->object, 'background-svg-');
        $this->assertMatchesJsonSnapshot(json_encode($result));

        $object2 = [
            'background-svg-image-shape-scale-general' => 50,
            'background-svg-image-shape-scale-m' => 100,
            'background-svg-image-shape-scale-s' => 50,
        ];

        $result2 = get_image_shape_styles('svg', $object2, 'background-svg-');
        $this->assertMatchesJsonSnapshot(json_encode($result2));
    }

    public function test_ensure_that_ignore_omit_is_working()
    {
        $result = get_image_shape_styles('svg', $this->object, 'background-svg-', true);
        $this->assertMatchesJsonSnapshot(json_encode($result));
    }
}
