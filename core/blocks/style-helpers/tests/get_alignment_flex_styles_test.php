<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Alignment_Flex_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_get_a_correct_alignment_flex_styles()
    {
        $object = [
            'alignment-general' => 'right',
            'alignment-xxl' => 'left',
            'alignment-xl' => 'right',
            'alignment-l' => 'left',
            'alignment-m' => 'right',
            'alignment-s' => 'left',
            'alignment-xs' => 'right',
        ];

        $result = get_alignment_flex_styles($object);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }
}
