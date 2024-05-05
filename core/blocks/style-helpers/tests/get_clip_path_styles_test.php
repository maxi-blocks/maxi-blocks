<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Clip_Path_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_get_correct_clip_path_styles()
    {
        $object = [
            'clip-path-status-general' => true,
            'clip-path-general' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            'clip-path-status-l' => true,
            'clip-path-l' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            'clip-path-status-xl' => true,
            'clip-path-xl' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            'clip-path-status-xxl' => true,
            'clip-path-xxl' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            'clip-path-status-m' => true,
            'clip-path-m' => 'none',
            'clip-path-status-s' => false,
            'clip-path-s' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            'clip-path-status-xs' => true,
            'clip-path-xs' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            // hover attributes
            'clip-path-status-hover' => true,
            'clip-path-general-hover' => 'none',
            'clip-path-l-hover' => 'circle(50% at 50% 50%)',
            'clip-path-xl-hover' => 'polygon(0% 75%, 100% 25%, 62.5% 75%)',
            'clip-path-xxl-hover' => 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)',
            'clip-path-s-hover' => 'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)',
        ];

        $result = get_clip_path_styles(['obj' => $object]);
        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_hover_clip_path_styles()
    {
        $object = [
            'clip-path-status-general' => true,
            'clip-path-general' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            'clip-path-status-l' => true,
            'clip-path-l' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            'clip-path-status-xl' => true,
            'clip-path-xl' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            'clip-path-status-xxl' => true,
            'clip-path-xxl' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            'clip-path-status-m' => true,
            'clip-path-m' => 'none',
            'clip-path-status-s' => false,
            'clip-path-s' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            'clip-path-status-xs' => true,
            'clip-path-xs' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            // hover attributes
            'clip-path-status-hover' => true,
            'clip-path-general-hover' => 'none',
            'clip-path-l-hover' => 'circle(50% at 50% 50%)',
            'clip-path-xl-hover' => 'polygon(0% 75%, 100% 25%, 62.5% 75%)',
            'clip-path-xxl-hover' => 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)',
            'clip-path-s-hover' => 'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)',
        ];

        $result = get_clip_path_styles(['obj' => $object, 'is_hover' => true]);
        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_empty_hover_clip_path_styles_when_hover_status_is_false()
    {
        $object = [
            'clip-path-status-general' => true,
            'clip-path-general' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            'clip-path-status-l' => true,
            'clip-path-l' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            'clip-path-status-xl' => true,
            'clip-path-xl' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            'clip-path-status-xxl' => true,
            'clip-path-xxl' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            'clip-path-status-m' => true,
            'clip-path-m' => 'none',
            'clip-path-status-s' => false,
            'clip-path-s' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            'clip-path-status-xs' => true,
            'clip-path-xs' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
            // hover attributes
            'clip-path-status-hover' => false,
            'clip-path-general-hover' => 'none',
            'clip-path-l-hover' => 'circle(50% at 50% 50%)',
            'clip-path-xl-hover' => 'polygon(0% 75%, 100% 25%, 62.5% 75%)',
            'clip-path-xxl-hover' => 'polygon(0% 0%, 100% 0%, 100% 75%, 75% 75%, 75% 100%, 50% 75%, 0% 75%)',
            'clip-path-s-hover' => 'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)',
        ];

        $result = get_clip_path_styles(['obj' => $object, 'is_hover' => true]);
        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_empty_clip_path_styles_when_clip_path_is_none()
    {
        $object = [
            'clip-path-general' => 'none',
            'clip-path-status-general' => true,
        ];

        $result = get_clip_path_styles(['obj' => $object]);
        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_none_hover_clip_path_styles_when_clip_path_is_none()
    {
        $object = [
            'clip-path-general-hover' => 'none',
            'clip-path-status-hover' => true,
        ];

        $result = get_clip_path_styles(['obj' => $object, 'is_hover' => true]);
        $this->assertMatchesJsonSnapshot(json_encode($result));
    }
}
