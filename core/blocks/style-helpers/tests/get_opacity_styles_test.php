<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Opacity_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_get_a_correct_opacity_styles()
    {
        $object = [
            'opacity-general' => 1,
            'opacity-xxl' => 0.56,
            'opacity-xl' => 0.77,
            'opacity-l' => 0.95,
            'opacity-m' => 0.85,
            'opacity-s' => 0.66,
            'opacity-xs' => 0.99,
        ];

        $result = get_opacity_styles($object);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }
}
