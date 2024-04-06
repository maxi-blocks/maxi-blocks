<?php

class Get_Alignment_Flex_Styles_Test extends WP_UnitTestCase
{
    public function test_get_a_correct_alignment_flex_styles()
    {
        $object = [
            'alignment-general' => 'right',
            'alignment-xxl' => 'left',
            'alignment-xl' => 'right',
            'alignment-l' => 'left',
            'alignment-m' => 'right',
            'alignment-s' => 'left',
            'alignment-xs' => 'right',
        ];

        $result = get_alignment_flex_styles($object);

        $this->assertEquals($result, [
            'general' => [
                'justify-content' => 'flex-end',
            ],
            'xxl' => [
                'justify-content' => 'flex-start',
            ],
            'xl' => [
                'justify-content' => 'flex-end',
            ],
            'l' => [
                'justify-content' => 'flex-start',
            ],
            'm' => [
                'justify-content' => 'flex-end',
            ],
            's' => [
                'justify-content' => 'flex-start',
            ],
            'xs' => [
                'justify-content' => 'flex-end',
            ],
        ]);
    }
}
