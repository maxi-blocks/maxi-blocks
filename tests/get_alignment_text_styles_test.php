<?php

class Get_Alignment_Text_Styles_Test extends WP_UnitTestCase
{
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

        $this->assertEquals($result, [
            'general' => [
                'text-align' => 'right',
            ],
            'xxl' => [
                'text-align' => 'left',
            ],
            'xl' => [
                'text-align' => 'right',
            ],
            'l' => [
                'text-align' => 'left',
            ],
            'm' => [
                'text-align' => 'right',
            ],
            's' => [
                'text-align' => 'left',
            ],
            'xs' => [
                'text-align' => 'right',
            ],
        ]);
    }
}
