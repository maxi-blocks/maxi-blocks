<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Divider_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_get_a_correct_divider_styles()
    {
        $obj = [
            'divider-border-top-width-general' => 38,
            'divider-border-top-width-s' => 149,
            'divider-border-top-unit-general' => 'px',
            'divider-border-right-width-general' => 2,
            'divider-border-right-width-l' => 14,
            'divider-border-right-unit-general' => 'px',
            'divider-border-radius-general' => false,
            'divider-width-general' => 79,
            'divider-width-s' => 23,
            'divider-width-unit-general' => '%',
            'divider-height-general' => 100,
            'divider-height-l' => 41,
            'line-align-general' => 'row',
            'line-vertical-general' => 'flex-end',
            'line-vertical-l' => 'flex-start',
            'line-vertical-s' => 'center',
            'line-horizontal-general' => 'flex-start',
            'line-horizontal-l' => 'center',
            'line-horizontal-s' => 'flex-start',
            'line-orientation-general' => 'horizontal',
            'line-orientation-l' => 'vertical',
            'line-orientation-s' => 'horizontal',
            'divider-border-palette-status-general' => true,
            'divider-border-palette-status-l' => true,
            'divider-border-palette-status-s' => true,
            'divider-border-palette-color-general' => 7,
            'divider-border-palette-color-l' => 4,
            'divider-border-palette-color-s' => 3,
            'divider-border-palette-opacity-l' => 0.56,
            'divider-border-palette-opacity-s' => 0.56,
            'divider-border-style-general' => 'dashed',
            'divider-border-style-l' => 'solid',
        ];

        $resultLine = get_divider_styles($obj, 'line', 'light');
        $this->assertMatchesJsonSnapshot(json_encode($resultLine));

        $resultAlign = get_divider_styles($obj, 'row', 'light');
        $this->assertMatchesJsonSnapshot(json_encode($resultAlign));
    }
}
