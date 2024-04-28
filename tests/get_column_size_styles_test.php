<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Column_Size_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_get_a_correct_column_size_styles()
    {
        $row_gap_props = [
            'row_elements' => ['', ''],
            'column_num' => 2,
        ];

        $object = [
            'column-size-general' => 1,
            'column-size-xxl' => 2,
            'column-size-xl' => 3,
            'column-size-l' => 4,
            'column-size-m' => 1,
            'column-size-s' => 2,
            'column-size-xs' => 3,
        ];

        $result = get_column_size_styles($object, $row_gap_props);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_a_correct_column_size_styles_with_some_fit_content()
    {
        $row_gap_props = [
            'row_elements' => ['', ''],
            'column_num' => 2,
        ];

        $object = [
            'column-size-general' => 1,
            'column-size-xxl' => 2,
            'column-size-xl' => 3,
            'column-fit-content-l' => true,
            'column-size-s' => 2,
            'column-fit-content-xs' => true,
            'column-size-xs' => 3,
        ];

        $result = get_column_size_styles($object, $row_gap_props);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_a_correct_column_size_styles_with_some_fullwidth_columns()
    {
        $row_gap_props = [
            'row_elements' => ['', ''],
            'column_num' => 2,
        ];

        $object = [
            'column-size-general' => 100,
            'column-size-xxl' => 2,
            'column-size-xl' => 3,
            'column-fit-content-l' => true,
            'column-size-s' => 100,
            'column-fit-content-xs' => true,
            'column-size-xs' => 3,
        ];

        $result = get_column_size_styles($object, $row_gap_props);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_a_correct_column_size_styles_with_gap_options()
    {
        $row_gap_props = [
            'row-gap-general' => 20,
            'row-gap-unit-general' => 'px',
            'column-gap-general' => 2.5,
            'column-gap-unit-general' => '%',
            'row-gap-xxl' => 10,
            'row-gap-unit-xxl' => 'px',
            'column-gap-xxl' => 2.5,
            'column-gap-unit-xxl' => 'px',
            'row_elements' => ['', ''],
            'column_num' => 2,
            'column_size' => [
                'ca79af62-a8ec-4322-a6e5-85861647ced4' => [
                    'column-size-general' => 61,
                    'column-size-m' => 100,
                ],
                '4b275169-92b5-44b0-a383-306b068e2fc8' => [
                    'column-size-general' => 22,
                    'column-size-m' => 100,
                ],
                '6caa0813-684c-4a21-b089-d5c72ff4c859' => [
                    'column-size-general' => 12.5,
                    'column-size-m' => 100,
                ],
                '511c51a1-8cf4-4548-82cc-11cde70bc420' => [
                    'column-size-general' => 12.5,
                    'column-size-m' => 100,
                ],
                'dfc75990-0f18-4a6e-8cc8-4b92cdd79405' => [
                    'column-size-general' => 12.5,
                    'column-size-m' => 100,
                ],
                '816620f6-6ca7-4b67-a653-6af89d6e3c52' => [
                    'column-size-general' => 37,
                    'column-size-m' => 100,
                ],
                'ce524232-68bf-4480-8f43-42e6ca779349' => [
                    'column-size-general' => 41,
                    'column-size-m' => 100,
                ],
                '02b0ceb5-42b9-443d-bd86-67e35f59419b' => [
                    'column-size-general' => 12.5,
                    'column-size-m' => 100,
                ],
            ],
        ];

        $object = [
            'column-size-general' => 1,
            'column-size-xxl' => 2,
            'column-size-xl' => 3,
            'column-size-m' => 100,
            'column-fit-content-l' => true,
            'column-size-s' => 2,
            'column-fit-content-xs' => true,
            'column-size-xs' => 3,
        ];

        $result = get_column_size_styles($object, $row_gap_props, '816620f6-6ca7-4b67-a653-6af89d6e3c52');

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_return_number_of_columns()
    {
        $column_size = [
            'ca79af62-a8ec-4322-a6e5-85861647ced4' => [
                'column-size-general' => 61,
                'column-size-m' => 100,
            ],
            '4b275169-92b5-44b0-a383-306b068e2fc8' => [
                'column-size-general' => 22,
                'column-size-m' => 100,
            ],
            '6caa0813-684c-4a21-b089-d5c72ff4c859' => [
                'column-size-general' => 12.5,
                'column-size-m' => 100,
            ],
            '511c51a1-8cf4-4548-82cc-11cde70bc420' => [
                'column-size-general' => 12.5,
                'column-size-m' => 100,
            ],
            'dfc75990-0f18-4a6e-8cc8-4b92cdd79405' => [
                'column-size-general' => 12.5,
                'column-size-m' => 100,
            ],
            '816620f6-6ca7-4b67-a653-6af89d6e3c52' => [
                'column-size-general' => 37,
                'column-size-m' => 100,
            ],
            'ce524232-68bf-4480-8f43-42e6ca779349' => [
                'column-size-general' => 41,
                'column-size-m' => 100,
            ],
            '02b0ceb5-42b9-443d-bd86-67e35f59419b' => [
                'column-size-general' => 12.5,
                'column-size-m' => 100,
            ],
        ];

        $this->assertEquals(3, get_column_num($column_size, 'ca79af62-a8ec-4322-a6e5-85861647ced4', 'general'));
        $this->assertEquals(3, get_column_num($column_size, 'dfc75990-0f18-4a6e-8cc8-4b92cdd79405', 'general'));
        $this->assertEquals(2, get_column_num($column_size, 'ce524232-68bf-4480-8f43-42e6ca779349', 'general'));
    }

    public function test_return_number_of_columns_2()
    {
        $column_size = [
            '1b8793cf-fcdd-4a14-970e-a550c086a503' => [
                'column-size-general' => 22,
                'column-size-m' => 100,
            ],
            '81e92657-84b9-479e-b6ed-543612721d63' => [
                'column-size-general' => 12.5,
                'column-size-m' => 100,
            ],
            '709ba962-da7f-458f-88bd-131e05c363b5' => [
                'column-size-general' => 12.5,
                'column-size-m' => 100,
            ],
            '7e43ba0c-a05a-4249-b324-bab10c00e7cf' => [
                'column-size-general' => 61,
                'column-size-m' => 100,
            ],
            'dd70b92d-37df-4f85-87f3-ae53eb3f0656' => [
                'column-size-general' => 12.5,
                'column-size-m' => 100,
            ],
            'b9b9085a-ade1-4d29-850b-e9ecbaf35bbd' => [
                'column-size-general' => 37,
                'column-size-m' => 100,
            ],
            'fa9ea412-1ce6-477f-bc3e-c07bfe7d6367' => [
                'column-size-general' => 41,
                'column-size-m' => 100,
            ],
            '009d8de6-61fe-4441-b940-c64196b73be4' => [
                'column-size-general' => 12.5,
                'column-size-m' => 100,
            ],
        ];

        $this->assertEquals(3, get_column_num($column_size, '81e92657-84b9-479e-b6ed-543612721d63', 'general'));
        $this->assertEquals(2, get_column_num($column_size, '7e43ba0c-a05a-4249-b324-bab10c00e7cf', 'general'));
        $this->assertEquals(3, get_column_num($column_size, '009d8de6-61fe-4441-b940-c64196b73be4', 'general'));
    }
}