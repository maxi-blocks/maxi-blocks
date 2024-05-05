<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Number_Counter_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_returns_correct_styles()
    {
        $obj = [
            'number-counter-status' => true,
            'number-counter-preview' => true,
            'number-counter-percentage-sign-status' => false,
            'number-counter-percentage-sign-position-status' => false,
            'number-counter-rounded-status' => false,
            'number-counter-circle-status' => false,
            'number-counter-start' => 0,
            'number-counter-end' => 100,
            'number-counter-radius' => 200,
            'number-counter-stroke' => 20,
            'number-counter-duration' => 1,
            'number-counter-start-animation' => 'page-load',
            'number-counter-text-palette-status-general' => true,
            'number-counter-text-palette-color-general' => 5,
            'number-counter-circle-background-palette-status' => true,
            'number-counter-circle-background-palette-color' => 2,
            'number-counter-circle-bar-palette-status-general' => true,
            'number-counter-circle-bar-palette-color-general' => 4,
            'number-counter-title-font-size-general' => 40,
            'font-family-general' => 'Roboto',
        ];

        $target = '.maxi-number-counter__box';
        $blockStyle = 'light';

        $result = get_number_counter_styles($obj, $target, $blockStyle);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }
}
