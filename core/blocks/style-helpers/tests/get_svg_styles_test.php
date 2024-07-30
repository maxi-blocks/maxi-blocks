<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_SVG_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_returns_correct_styles()
    {
        $obj = [
            'svg-fill-palette-status' => true,
            'svg-fill-palette-color' => 4,
            'svg-line-palette-status' => true,
            'svg-line-palette-color' => 7,
            'svg-stroke-general' => 2,
            'svg-width-general' => '64',
            'svg-width-unit-general' => 'px',
            'svg-stroke-m' => 20,
            'svg-width-m' => '640',
            'svg-width-unit-m' => 'vw',
        ];
        $target = ' .maxi-svg-icon-block__icon';
        $block_style = 'light';

        $result = get_svg_styles(['obj' => $obj, 'target' => $target, 'block_style' => $block_style]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_should_return_correct_icon_size()
    {
        $attributes = [
            'svg-width-general' => '32',
            'svg-width-unit-general' => 'px',
            'svg-width-fit-content-general' => false,
            'svg-icon-width-general' => '71',
            'svg-icon-width-unit-general' => '%',
        ];

        $result = get_svg_width_styles(['obj' => $attributes, 'prefix' => 'svg-']);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_should_return_correct_icon_size_with_disable_height_false()
    {
        $attributes = [
            'svg-width-general' => '32',
            'svg-width-unit-general' => 'px',
            'svg-width-fit-content-general' => false,
            'svg-icon-width-general' => '71',
            'svg-icon-width-unit-general' => '%',
        ];

        $result = get_svg_width_styles(['obj' => $attributes, 'prefix' => 'svg-', 'disable_height' => false]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_should_work_on_responsive()
    {
        $prefix = 'any-prefix-';

        $attributes = [
            $prefix . 'icon-height-general' => '32',
            $prefix . 'icon-height-unit-general' => 'px',
            $prefix . 'icon-height-m' => '12',
            $prefix . 'icon-height-unit-m' => 'em',
        ];

        $result = get_svg_width_styles(['obj' => $attributes, 'prefix' => $prefix]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_should_return_right_styles_with_height_fit_content_width_height_ratio_greater_than_1_with_disable_height_true()
    {
        $attributes = [
            'icon-width-general' => '36',
            'icon-width-unit-general' => '%',
            'icon-width-fit-content-general' => true,
            'icon-width-l' => '32',
            'icon-width-fit-content-l' => false,
            'icon-width-m' => '36',
            'icon-width-fit-content-m' => true,
            'icon-stroke-general' => '1',
            'icon-stroke-l' => '3',
            'icon-stroke-m' => '4',
        ];

        $result = get_svg_width_styles([
            'obj' => $attributes,
            'icon_width_height_ratio' => 3,
            'disable_height' => true,
        ]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_should_return_right_styles_with_height_fit_content_width_height_ratio_less_than_1_with_disable_height_true()
    {
        $attributes = [
            'icon-width-general' => '36',
            'icon-width-unit-general' => '%',
            'icon-width-fit-content-general' => true,
            'icon-width-l' => '32',
            'icon-width-fit-content-l' => false,
            'icon-width-m' => '36',
            'icon-width-fit-content-m' => true,
            'icon-stroke-general' => '1',
            'icon-stroke-l' => '3',
            'icon-stroke-m' => '4',
        ];

        $result = get_svg_width_styles([
            'obj' => $attributes,
            'icon_width_height_ratio' => 0.5,
            'disable_height' => true,
        ]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }
}
