<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_ZIndex_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_get_a_correct_z_index_style()
    {
        $object = [
            'z-index-general' => 1,
            'z-index-xxl' => 2,
            'z-index-xl' => 3,
            'z-index-l' => 4,
            'z-index-m' => 5,
            'z-index-s' => 6,
            'z-index-xs' => 7,
        ];

        $result = get_zindex_styles($object);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }
}
