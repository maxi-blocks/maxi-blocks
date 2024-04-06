<?php

class Get_Advanced_Css_Object_Test extends WP_UnitTestCase
{
    public function test_should_handle_basic_css_correctly()
    {
        $input = [
            'advanced-css-general' => '
				background: red;
				.maxi-block-button {
					color: yellow;
				}
			',
        ];

        $result = get_advanced_css_object($input);

        $this->assertEquals($result, [
            '' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'background: red;',
                    ],
                ],
            ],
            ' .maxi-block-button' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'color: yellow;',
                    ],
                ],
            ],
        ]);

    }

    public function test_should_handle_css_with_no_selectors()
    {
        $input = [
            'advanced-css-general' => 'background: blue;',
        ];

        $result = get_advanced_css_object($input);

        $this->assertEquals($result, [
            '' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'background: blue;',
                    ],
                ],
            ],
        ]);
    }

    public function test_should_handle_css_with_selectors_with_spaces()
    {
        $input = [
            'advanced-css-general' => '
                background: green;
                .maxi-block-button button .maxi-block-button__content {
                    color: yellow;
                }
            ',
        ];

        $result = get_advanced_css_object($input);

        $this->assertEquals($result, [
            '' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'background: green;',
                    ],
                ],
            ],
            ' .maxi-block-button button .maxi-block-button__content' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'color: yellow;',
                    ],
                ],
            ],
        ]);
    }

    public function test_should_handle_css_with_multiple_selectors()
    {
        $input = [
            'advanced-css-general' => '
                background: green;
                .maxi-block-button {
                    color: yellow;
                }
                .maxi-block-button,
                .maxi-block-button:hover {
                    color: red;
                }
            ',
        ];

        $result = get_advanced_css_object($input);

        $this->assertEquals($result, [
            '' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'background: green;',
                    ],
                ],
            ],
            ' .maxi-block-button' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'color: red;',
                    ],
                ],
            ],
            ' .maxi-block-button:hover' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'color: red;',
                    ],
                ],
            ],
        ]);
    }

    public function test_should_handle_css_with_pseudo_selectors()
    {
        $input = [
            'advanced-css-general' => '
                background: green;
                .maxi-block-button {
                    color: yellow;
                }
                .maxi-block-button:hover {
                    color: red;
                }
                .maxi-block-button::before {
                    content: \'before\';
                }
            ',
        ];

        $result = get_advanced_css_object($input);

        $this->assertEquals($result, [
            '' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'background: green;',
                    ],
                ],
            ],
            ' .maxi-block-button' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'color: yellow;',
                    ],
                ],
            ],
            ' .maxi-block-button::before' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'content: \'before\';',
                    ],
                ],
            ],
            ' .maxi-block-button:hover' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'color: red;',
                    ],
                ],
            ],
        ]);
    }

    public function test_should_handle_all_responsive_breakpoints_correctly()
    {
        $input = [
            'advanced-css-general' => '
                .maxi-block-button {
                    background: white;
                }
            ',
            'advanced-css-xxl' => '
                .maxi-block-button {
                    font-size: 24px;
                }
            ',
            'advanced-css-xl' => '
                .maxi-block-button {
                    font-size: 22px;
                }
            ',
            'advanced-css-l' => '
                .maxi-block-button {
                    font-size: 20px;
                }
            ',
            'advanced-css-m' => '
                .maxi-block-button {
                    font-size: 18px;
                }
            ',
            'advanced-css-s' => '
                .maxi-block-button {
                    font-size: 16px;
                }
            ',
            'advanced-css-xs' => '
                .maxi-block-button {
                    font-size: 14px;
                }
            ',
        ];

        $result = get_advanced_css_object($input);

        $this->assertEquals($result, [
            ' .maxi-block-button' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'background: white;',
                    ],
                    'l' => [
                        'css' => 'font-size: 20px;',
                    ],
                    'm' => [
                        'css' => 'font-size: 18px;',
                    ],
                    's' => [
                        'css' => 'font-size: 16px;',
                    ],
                    'xl' => [
                        'css' => 'font-size: 22px;',
                    ],
                    'xs' => [
                        'css' => 'font-size: 14px;',
                    ],
                    'xxl' => [
                        'css' => 'font-size: 24px;',
                    ],
                ],
            ],
        ]);
    }

    public function test_should_handle_a_subset_of_responsive_breakpoints_correctly()
    {
        $input = [
            'advanced-css-general' => '
                .maxi-block-button {
                    background: white;
                }
            ',
            'advanced-css-xxl' => '
                .maxi-block-button {
                    font-size: 24px;
                }
            ',
            'advanced-css-m' => '
                .maxi-block-button {
                    font-size: 18px;
                }
            ',
            'advanced-css-s' => '
                .maxi-block-button {
                    font-size: 16px;
                }
            ',
        ];

        $result = get_advanced_css_object($input);

        $this->assertEquals($result, [
            ' .maxi-block-button' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'background: white;',
                    ],
                    'm' => [
                        'css' => 'font-size: 18px;',
                    ],
                    's' => [
                        'css' => 'font-size: 16px;',
                    ],
                    'xxl' => [
                        'css' => 'font-size: 24px;',
                    ],
                ],
            ],
        ]);
    }

    public function test_should_handle_complex_css_structures_across_breakpoints()
    {
        $input = [
            'advanced-css-general' => '
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                .maxi-block-button {
                    display: block;
                    margin: 10px 0;
                    text-align: center;
                    transition: background-color 0.3s ease;
                }
            ',
            'advanced-css-xxl' => '
                font-size: 18px;
                .maxi-block-button {
                    padding: 15px 25px;
                    border-radius: 5px;
                }
                .maxi-block-button:hover {
                    background-color: #eee;
                }
            ',
            'advanced-css-xl' => '
                font-size: 16px;
                .maxi-block-button {
                    padding: 14px 23px;
                }
                .maxi-block-button::before {
                    content: \'XL\';
                }
            ',
            'advanced-css-l' => '
                font-size: 15px;
                .maxi-block-button {
                    padding: 13px 21px;
                }
                nav ul li {
                    display: inline-block;
                    margin-right: 20px;
                }
            ',
            'advanced-css-m' => '
                font-size: 14px;
                .maxi-block-button {
                    padding: 12px 20px;
                }
                nav ul li {
                    display: block;
                    margin-bottom: 10px;
                }
            ',
            'advanced-css-s' => '
                .maxi-block-button {
                    padding: 11px 18px;
                }
            ',
            'advanced-css-xs' => '
                .maxi-block-button {
                    padding: 10px 15px;
                    font-size: 12px;
                }
            ',
        ];

        $result = get_advanced_css_object($input);

        $this->assertEquals($result, [
            '' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'font-family: Arial, sans-serif; background-color: #f4f4f4;',
                    ],
                    'l' => [
                        'css' => 'font-size: 15px;',
                    ],
                    'm' => [
                        'css' => 'font-size: 14px;',
                    ],
                    'xl' => [
                        'css' => 'font-size: 16px;',
                    ],
                    'xxl' => [
                        'css' => 'font-size: 18px;',
                    ],
                ],
            ],
            ' .maxi-block-button' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'display: block; margin: 10px 0; text-align: center; transition: background-color 0.3s ease;',
                    ],
                    'l' => [
                        'css' => 'padding: 13px 21px;',
                    ],
                    'm' => [
                        'css' => 'padding: 12px 20px;',
                    ],
                    's' => [
                        'css' => 'padding: 11px 18px;',
                    ],
                    'xl' => [
                        'css' => 'padding: 14px 23px;',
                    ],
                    'xs' => [
                        'css' => 'padding: 10px 15px; font-size: 12px;',
                    ],
                    'xxl' => [
                        'css' => 'padding: 15px 25px; border-radius: 5px;',
                    ],
                ],
            ],
            ' .maxi-block-button::before' => [
                'advancedCss' => [
                    'xl' => [
                        'css' => 'content: \'XL\';',
                    ],
                ],
            ],
            ' .maxi-block-button:hover' => [
                'advancedCss' => [
                    'xxl' => [
                        'css' => 'background-color: #eee;',
                    ],
                ],
            ],
            ' nav ul li' => [
                'advancedCss' => [
                    'l' => [
                        'css' => 'display: inline-block; margin-right: 20px;',
                    ],
                    'm' => [
                        'css' => 'display: block; margin-bottom: 10px;',
                    ],
                ],
            ],
        ]);
    }

	public function test_should_handle_css_with_missing_closing_brace()
    {
        $input = [
            'advanced-css-general' => '
                background: yellow;
                p {
                    text-align: center;
            ',
        ];

        $result = get_advanced_css_object($input);

        $this->assertEquals($result, [
            '' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'background: yellow;',
                    ],
                ],
            ],
        ]);
    }

    public function test_should_handle_css_with_missing_closing_brace_in_nested_braces()
    {
        $input = [
            'advanced-css-general' => '
                background: yellow;
                p {
                    text-align: center;
                    div {
                        color: red;
                    }
            ',
        ];

        $result = get_advanced_css_object($input);

        $this->assertEquals($result, [
            '' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'background: yellow;',
                    ],
                ],
            ],
            ' p' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'text-align: center;',
                    ],
                ],
            ],
        ]);
    }

    public function test_should_handle_css_with_multiple_unmatched_braces()
    {
        $input = [
            'advanced-css-general' => '
                background: teal;
                div {
                    padding: 10px;
                    p {
                        margin: 5px;
            ',
        ];

        $result = get_advanced_css_object($input);

        $this->assertEquals($result, [
            '' => [
                'advancedCss' => [
                    'general' => [
                        'css' => 'background: teal;',
                    ],
                ],
            ],
        ]);
    }

	public function test_should_handle_empty_css_correctly()
	{
		$input = [
			'advanced-css-general' => '',
		];

		$result = get_advanced_css_object($input);

		$this->assertEquals($result, []);
	}
}
