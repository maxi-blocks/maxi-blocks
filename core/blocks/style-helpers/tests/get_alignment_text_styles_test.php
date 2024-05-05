<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Alignment_Text_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_get_a_correct_alignment_text_styles()
    {
        $object = [
            'text-alignment-general' => 'right',
            'text-alignment-xxl' => 'left',
            'text-alignment-xl' => 'right',
            'text-alignment-l' => 'left',
            'text-alignment-m' => 'right',
            'text-alignment-s' => 'left',
            'text-alignment-xs' => 'right',
        ];

        $result = get_alignment_text_styles($object);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }
}
