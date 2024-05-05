<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Overflow_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_get_correct_overflow_styles_with_default_values()
    {
        $object = [
            'overflow-x-general' => 'visible',
            'overflow-y-general' => 'visible',
        ];

        $result = get_overflow_styles($object);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_overflow_styles_when_all_values_visible()
    {
        $object = [
            'overflow-x-general' => 'visible',
            'overflow-y-general' => 'visible',
            'overflow-x-xxl' => 'visible',
            'overflow-y-xxl' => 'visible',
            'overflow-x-xl' => 'visible',
            'overflow-y-xl' => 'visible',
            'overflow-x-l' => 'visible',
            'overflow-y-l' => 'visible',
            'overflow-x-m' => 'visible',
            'overflow-y-m' => 'visible',
            'overflow-x-s' => 'visible',
            'overflow-y-s' => 'visible',
            'overflow-x-xs' => 'visible',
            'overflow-y-xs' => 'visible',
        ];

        $result = get_overflow_styles($object);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_overflow_styles()
    {
        $object = [
            'overflow-x-general' => 'visible',
            'overflow-y-general' => 'hidden',
            'overflow-x-xxl' => 'hidden',
            'overflow-y-xxl' => 'visible',
            'overflow-x-xl' => 'auto',
            'overflow-y-xl' => 'clip',
            'overflow-x-l' => 'clip',
            'overflow-y-l' => 'auto',
            'overflow-x-m' => 'scroll',
            'overflow-y-m' => 'scroll',
            'overflow-x-s' => 'auto',
            'overflow-y-s' => 'auto',
            'overflow-x-xs' => 'visible',
            'overflow-y-xs' => 'visible',
        ];

        $result = get_overflow_styles($object);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }
}
