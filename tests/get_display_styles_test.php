<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Display_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_get_a_correct_display_styles()
    {
        $object = [
            'display-general' => 'block',
            'display-xxl' => 'block',
            'display-xl' => 'block',
            'display-l' => 'block',
            'display-m' => 'flex',
            'display-s' => 'flex',
            'display-xs' => 'flex',
        ];

        $result = get_display_styles($object);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }
}
