<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Hover_Effects_Background_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_get_a_correct_hover_effects_color_background_style()
    {
        $object = [
            'hover-background-active-media-general' => 'color',
            'hover-background-color-general' => 'rgb(255,99,71)',
        ];

        $result = get_hover_effects_background_styles($object, 'light');

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_a_correct_hover_effects_gradient_background_style()
    {
        $objectGradient = [
            'hover-background-active-media-general' => 'gradient',
            'hover-background-gradient-opacity-general' => 0.8,
            'hover-background-gradient-general' => 'linear-gradient(135deg,rgba(6,147,200,0.5) 0%,rgb(224,82,100) 100%)',
        ];

        $resultGradient = get_hover_effects_background_styles($objectGradient, 'light');

        $this->assertMatchesJsonSnapshot(json_encode($resultGradient));
    }
}
