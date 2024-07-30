<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Icon_Size_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_should_return_correct_icon_size()
    {
        $attributes = [
            'icon-height-general' => '32',
            'icon-height-unit-general' => 'px',
            'icon-width-fit-content-general' => false,
            'icon-width-general' => '71',
            'icon-width-general-hover' => '123',
            'icon-width-unit-general' => '%',
        ];

        // Normal state
        $this->assertMatchesJsonSnapshot(json_encode(get_icon_size($attributes, false)));

        // Hover state
        $this->assertMatchesJsonSnapshot(json_encode(get_icon_size($attributes, true)));
    }

    public function test_should_use_height_when_width_is_not_specified()
    {
        $attributes = [
            'icon-height-general' => '32',
            'icon-height-unit-general' => 'px',
            'icon-height-general-hover' => '50',
            'icon-height-unit-general-hover' => '%',
        ];

        // Normal state
        $this->assertMatchesJsonSnapshot(json_encode(get_icon_size($attributes, false)));

        // Hover state
        $this->assertMatchesJsonSnapshot(json_encode(get_icon_size($attributes, true)));
    }

    public function test_should_work_with_prefixes()
    {
        $prefix = 'any-prefix-';
        $attributes = [
            $prefix . 'icon-height-general' => '32',
            $prefix . 'icon-height-unit-general' => 'px',
            $prefix . 'icon-height-general-hover' => '50',
            $prefix . 'icon-height-unit-general-hover' => '%',
        ];

        // Normal state
        $this->assertMatchesJsonSnapshot(json_encode(get_icon_size($attributes, false, $prefix)));

        // Hover state
        $this->assertMatchesJsonSnapshot(json_encode(get_icon_size($attributes, true, $prefix)));
    }

    public function test_should_work_on_responsive()
    {
        $prefix = 'any-prefix-';
        $attributes = [
            $prefix . 'icon-height-general' => '32',
            $prefix . 'icon-height-unit-general' => 'px',
            $prefix . 'icon-height-general-hover' => '50',
            $prefix . 'icon-height-unit-general-hover' => '%',
            $prefix . 'icon-height-m' => '12',
            $prefix . 'icon-height-unit-m' => 'em',
            $prefix . 'icon-height-m-hover' => '15',
            $prefix . 'icon-height-unit-m-hover' => 'px',
        ];

        // Normal state
        $this->assertMatchesJsonSnapshot(json_encode(get_icon_size($attributes, false, $prefix)));

        // Hover state
        $this->assertMatchesJsonSnapshot(json_encode(get_icon_size($attributes, true, $prefix)));
    }

    public function test_should_return_right_hover_styles_with_only_value_specified_on_hover()
    {
        $attributes = [
            'icon-width-general' => '32',
            'icon-width-unit-general' => '%',
            'icon-width-general-hover' => '64',
        ];

        $this->assertMatchesJsonSnapshot(json_encode(get_icon_size($attributes, true)));
    }

    public function test_should_return_right_hover_styles_with_only_unit_specified_on_hover()
    {
        $attributes = [
            'icon-width-general' => '32',
            'icon-width-unit-general' => '%',
            'icon-width-unit-general-hover' => 'em',
        ];

        $this->assertMatchesJsonSnapshot(json_encode(get_icon_size($attributes, true)));
    }

    public function test_should_return_right_styles_with_only_unit_specified_on_responsive()
    {
        $attributes = [
            'icon-width-general' => '32',
            'icon-width-unit-general' => '%',
            'icon-width-unit-l' => 'em',
        ];

        $this->assertMatchesJsonSnapshot(json_encode(get_icon_size($attributes, true)));
    }

    public function test_should_return_right_styles_with_height_fit_content_and_width_height_ratio_greater_than_1()
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

        $this->assertMatchesJsonSnapshot(json_encode(get_icon_size($attributes, false, '', 3)));
    }

    public function test_should_return_right_styles_with_height_fit_content_and_width_height_ratio_less_than_1()
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

        $this->assertMatchesJsonSnapshot(json_encode(get_icon_size($attributes, false, '', 0.5)));
    }
}
