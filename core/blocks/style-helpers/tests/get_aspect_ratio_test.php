<?php

class Get_Aspect_Ratio_Test extends WP_UnitTestCase
{
    public function test_should_return_null_for_input_original()
    {
        $this->assertNull(get_aspect_ratio('original'));
    }

    public function test_should_return_1_1_for_input_ar11()
    {
        $result = get_aspect_ratio('ar11');
        $this->assertEquals('1 / 1', $result['ratio']['general']['aspect-ratio']);
    }

    public function test_should_return_2_3_for_input_ar23()
    {
        $result = get_aspect_ratio('ar23');
        $this->assertEquals('2 / 3', $result['ratio']['general']['aspect-ratio']);
    }

    public function test_should_return_custom_aspect_ratio_for_input_custom_with_1_7778()
    {
        $customRatio = '1.7778';
        $result = get_aspect_ratio('custom', $customRatio);
        $this->assertEquals('1.7778', $result['ratio']['general']['aspect-ratio']);
    }

    public function test_should_return_custom_aspect_ratio_for_input_custom_with_16_9()
    {
        $customRatio = '16/9';
        $result = get_aspect_ratio('custom', $customRatio);
        $this->assertEquals('1.7778', $result['ratio']['general']['aspect-ratio']);
    }

    public function test_should_return_custom_aspect_ratio_for_input_custom_with_32_18()
    {
        $customRatio = '32/18';
        $result = get_aspect_ratio('custom', $customRatio);
        $this->assertEquals('1.7778', $result['ratio']['general']['aspect-ratio']);
    }

    public function test_should_return_custom_aspect_ratio_for_input_custom_with_1_()
    {
        $customRatio = '1/';
        $result = get_aspect_ratio('custom', $customRatio);
        $this->assertEquals('1', $result['ratio']['general']['aspect-ratio']);
    }

    public function test_should_return_custom_aspect_ratio_for_input_custom_with_16_0()
    {
        $customRatio = '16/0';
        $result = get_aspect_ratio('custom', $customRatio);
        $this->assertEquals('1', $result['ratio']['general']['aspect-ratio']);
    }

    public function test_should_return_empty_string_for_unsupported_ratio()
    {
        $result = get_aspect_ratio('unsupported');
        $this->assertEquals('', $result['ratio']['general']['aspect-ratio']);
    }
}
