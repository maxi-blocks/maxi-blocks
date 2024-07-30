<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Link_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_returns_correct_object()
    {
        $obj = [
            'link-palette-status-general' => true,
            'link-palette-color-general' => 4,
            'link-hover-palette-status-general' => true,
            'link-hover-palette-color-general' => 4,
            'link-hover-palette-opacity-general' => 0.2,
            'link-active-palette-status-general' => true,
            'link-active-palette-color-general' => 3,
            'link-visited-palette-status-general' => true,
            'link-visited-palette-color-general' => 3,
        ];
        $target = ' p.maxi-text-block__content a';
        $blockStyles = 'light';

        $result = get_link_styles($obj, $target, $blockStyles);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_returns_correct_object_with_custom_colors()
    {
        $obj = [
            'link-palette-status-general' => false,
            'link-palette-color-general' => 4,
            'link-color-general' => 'rgba(57,189,39,1)',
            'link-hover-palette-status-general' => false,
            'link-hover-palette-color-general' => 4,
            'link-hover-palette-opacity-general' => 0.2,
            'link-hover-color-general' => 'rgba(191,192,86,1)',
            'link-active-palette-status-general' => false,
            'link-active-palette-color-general' => 3,
            'link-active-color-general' => 'rgba(221,32,32,1)',
            'link-visited-palette-status-general' => false,
            'link-visited-palette-color-general' => 3,
            'link-visited-color-general' => 'rgba(27,109,168,1)',
        ];
        $target = ' p.maxi-text-block__content a';
        $blockStyles = 'light';

        $result = get_link_styles($obj, $target, $blockStyles);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }
}
