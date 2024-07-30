<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Transition_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function test_get_a_correct_transition_styles()
    {
        $object = [
            'border-status-hover' => true,
            'box-shadow-status-hover' => false,
            'block-background-status-hover' => true,
            'transition' => [
                'block' => [],
                'canvas' => [
                    'border' => [
                        'transition-duration-general' => 0.3,
                        'transition-delay-general' => 0,
                        'easing-general' => 'ease',
                        'transition-status-general' => true,
                        'hoverProp' => 'border-status-hover',
                    ],
                    'box shadow' => [
                        'transition-duration-general' => 0.3,
                        'transition-delay-general' => 0,
                        'easing-general' => 'ease',
                        'transition-status-general' => true,
                        'hoverProp' => 'box-shadow-status-hover',
                    ],
                    'background / layer' => [
                        'transition-duration-general' => 0.3,
                        'transition-delay-general' => 0,
                        'easing-general' => 'ease',
                        'transition-status-general' => false,
                        'hoverProp' => 'block-background-status-hover',
                    ],
                ],
            ],
        ];

        $result = get_transition_styles($object);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    private $repeated_attributes = [
        'transition-duration-general' => 0.3,
        'transition-duration-l' => 0.4,
        'transition-duration-m' => 0.5,
        'transition-duration-s' => 0.6,
        'transition-duration-xs' => 0.7,
        'transition-duration-xxl' => 0.8,
        'transition-delay-general' => 0,
        'transition-delay-l' => 0.1,
        'transition-delay-m' => 0.2,
        'transition-delay-s' => 0.3,
        'transition-delay-xs' => 0.4,
        'transition-delay-xxl' => 0.5,
        'easing-general' => 'ease',
        'easing-l' => 'ease-in',
        'easing-m' => 'ease-out',
        'easing-s' => 'ease-in-out',
        'easing-xs' => 'linear',
        'easing-xxl' => 'ease-in-out',
    ];

    private $repeated_attributes_with_status;

    private $custom_transition_obj;

    public function __construct()
    {
        parent::__construct();

        $this->repeated_attributes_with_status = array_merge($this->repeated_attributes, [
            'transition-status-general' => true,
            'transition-status-l' => false,
            'transition-status-m' => true,
            'transition-status-s' => false,
            'transition-status-xs' => true,
            'transition-status-xxl' => false,
        ]);

        $this->custom_transition_obj = array_merge_recursive((new StylesDefaults())->transitionDefault, [
            'block' => [
                'typography' => [
                    'title' => 'Typography',
                    'target' => ' .maxi-button-block__content',
                    'property' => false,
                    'hoverProp' => 'typography-status-hover',
                ],
                'button background' => [
                    'title' => 'Button background',
                    'target' => ' .maxi-button-block__button',
                    'property' => 'background',
                    'hoverProp' => 'button-background-status-hover',
                ],
            ],
        ]);
    }

    public function test_get_a_correct_responsive_transition_styles()
    {
        $object = [
            'border-status-hover' => true,
            'box-shadow-status-hover' => true,
            'block-background-status-hover' => false,
            'transition' => [
                'block' => [],
                'canvas' => [
                    'border' => array_merge($this->repeated_attributes, [
                        'transition-status-general' => true,
                        'transition-status-l' => false,
                        'transition-status-m' => true,
                        'transition-status-s' => false,
                        'transition-status-xs' => true,
                        'transition-status-xxl' => false,
                        'hoverProp' => 'border-status-hover',
                    ]),
                    'box shadow' => array_merge($this->repeated_attributes, [
                        'transition-status-general' => false,
                        'transition-status-l' => true,
                        'transition-status-m' => false,
                        'transition-status-s' => true,
                        'transition-status-xs' => false,
                        'transition-status-xxl' => true,
                        'hoverProp' => 'box-shadow-status-hover',
                    ]),
                    'background / layer' => array_merge($this->repeated_attributes, [
                        'transition-status-general' => true,
                        'transition-status-l' => false,
                        'transition-status-m' => true,
                        'transition-status-s' => false,
                        'transition-status-xs' => true,
                        'transition-status-xxl' => false,
                        'hoverProp' => 'block-background-status-hover',
                    ]),
                ],
            ],
        ];

        $result = get_transition_styles($object);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_a_correct_responsive_transition_styles_with_custom_transition_obj()
    {
        $responsiveTransitionAttributes = [
            'border-status-hover' => true,
            'box-shadow-status-hover' => true,
            'block-background-status-hover' => false,
            'typography-status-hover' => true,
            'button-background-status-hover' => false,
            'transition' => [
                'block' => [
                    'typography' => $this->repeated_attributes_with_status,
                    'button background' => $this->repeated_attributes_with_status,
                ],
                'canvas' => [
                    'border' => $this->repeated_attributes_with_status,
                    'box shadow' => $this->repeated_attributes_with_status,
                    'background / layer' => $this->repeated_attributes_with_status,
                ],
            ],
        ];

        $result = get_transition_styles($responsiveTransitionAttributes, $this->custom_transition_obj);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_a_correct_in_out_transition_styles()
    {
        $object = [
            'border-status-hover' => true,
            'box-shadow-status-hover' => true,
            'block-background-status-hover' => true,
            'transition' => [
                'block' => [],
                'canvas' => [
                    'border' => [
                        'transition-duration-general' => 0.3,
                        'transition-delay-general' => 0,
                        'easing-general' => 'ease',
                        'transition-status-general' => true,
                        'out' => [
                            'transition-duration-general' => 0.9,
                            'transition-delay-general' => 0.2,
                            'easing-general' => 'ease-out',
                            'transition-status-general' => true,
                        ],
                        'split-general' => true,
                        'hoverProp' => 'border-status-hover',
                    ],
                    'box shadow' => [
                        'transition-duration-general' => 0.3,
                        'transition-delay-general' => 0,
                        'easing-general' => 'ease',
                        'transition-status-general' => true,
                        'out' => [
                            'transition-duration-general' => 0.9,
                            'transition-delay-general' => 0.2,
                            'easing-general' => 'ease-out',
                            'transition-status-general' => true,
                        ],
                        'split-general' => false,
                        'hoverProp' => 'box-shadow-status-hover',
                    ],
                    'background / layer' => [
                        'transition-duration-general' => 0.3,
                        'transition-delay-general' => 0,
                        'easing-general' => 'ease',
                        'transition-status-general' => false,
                        'hoverProp' => 'block-background-status-hover',
                    ],
                ],
            ],
        ];

        $result = get_transition_styles($object);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_a_correct_responsive_in_out_transition_styles()
    {
        $repeatedOutAttributes = [
            'transition-duration-general' => 1.8,
            'transition-duration-l' => 1.7,
            'transition-duration-m' => 1.6,
            'transition-duration-s' => 1.5,
            'transition-duration-xs' => 1.4,
            'transition-duration-xxl' => 1.3,
            'transition-delay-general' => 1,
            'transition-delay-l' => 0.9,
            'transition-delay-m' => 0.8,
            'transition-delay-s' => 0.7,
            'transition-delay-xs' => 0.6,
            'transition-delay-xxl' => 0.5,
            'easing-general' => 'ease-in-out',
            'easing-l' => 'ease-out',
            'easing-m' => 'ease-in',
            'easing-s' => 'linear',
            'easing-xs' => 'ease-in-out',
            'easing-xxl' => 'linear',
            'transition-status-general' => true,
        ];

        $object = [
            'border-status-hover' => true,
            'box-shadow-status-hover' => true,
            'block-background-status-hover' => false,
            'transition' => [
                'block' => [],
                'canvas' => [
                    'border' => array_merge($this->repeated_attributes, [
                        'out' => $repeatedOutAttributes,
                        'transition-status-general' => true,
                        'transition-status-l' => false,
                        'transition-status-m' => true,
                        'transition-status-s' => false,
                        'transition-status-xs' => true,
                        'transition-status-xxl' => false,
                        'split-general' => true,
                        'split-l' => true,
                        'split-m' => false,
                        'split-s' => true,
                        'split-xs' => true,
                        'split-xxl' => false,
                        'hoverProp' => 'border-status-hover',
                    ]),
                    'box shadow' => array_merge($this->repeated_attributes, [
                        'out' => $repeatedOutAttributes,
                        'transition-status-general' => false,
                        'transition-status-l' => true,
                        'transition-status-m' => false,
                        'transition-status-s' => true,
                        'transition-status-xs' => false,
                        'transition-status-xxl' => true,
                        'split-general' => false,
                        'split-l' => false,
                        'split-m' => true,
                        'split-s' => true,
                        'split-xs' => false,
                        'split-xxl' => true,
                        'hoverProp' => 'box-shadow-status-hover',
                    ]),
                    'background / layer' => array_merge($this->repeated_attributes, [
                        'out' => $repeatedOutAttributes,
                        'transition-status-general' => true,
                        'transition-status-l' => false,
                        'transition-status-m' => true,
                        'transition-status-s' => false,
                        'transition-status-xs' => true,
                        'transition-status-xxl' => false,
                        'split-general' => true,
                        'split-l' => true,
                        'split-m' => false,
                        'split-s' => true,
                        'split-xs' => true,
                        'split-xxl' => false,
                        'hoverProp' => 'block-background-status-hover',
                    ]),
                ],
            ],
        ];

        $result = get_transition_styles($object);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_a_correct_transform_transition_styles()
    {
        $repeatedGeneralAttributes = [
            'transition-duration-general' => 0.3,
            'transition-delay-general' => 0,
            'easing-general' => 'ease',
            'transition-status-general' => true,
        ];

        $transformTransitionObj = [
            'transform' => [
                'canvas' => [
                    'title' => 'Canvas',
                    'target' => '',
                    'property' => 'transform',
                    'isTransform' => true,
                ],
                'block' => [
                    'title' => 'Block',
                    'target' => ' .block-class',
                    'property' => 'transform',
                    'isTransform' => true,
                ],
                'button' => [
                    'title' => 'Button',
                    'target' => ' .button-class',
                    'property' => 'transform',
                    'isTransform' => true,
                ],
            ],
        ];

        $object = [
            'transform-scale-general' => [
                'canvas' => [
                    'hover-status' => true,
                ],
                'block' => [
                    'hover-status' => false,
                ],
            ],
            'transform-rotate-general' => [
                'canvas' => [
                    'hover-status' => false,
                ],
                'block' => [
                    'hover-status' => true,
                ],
            ],
            'transition' => [
                'transform' => [
                    'canvas' => $repeatedGeneralAttributes,
                    'block' => $repeatedGeneralAttributes,
                    'button' => $repeatedGeneralAttributes,
                ],
            ],
        ];

        $result = get_transition_styles($object, $transformTransitionObj);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_a_correct_responsive_transform_mixed_with_others_transition_styles()
    {
        $object = array_merge(
            [
                'transform-scale-general' => [
                    'canvas' => [
                        'hover-status' => true,
                    ],
                    'block' => [
                        'hover-status' => false,
                    ],
                ],
                'transform-rotate-general' => [
                    'canvas' => [
                        'hover-status' => false,
                    ],
                ],
                'transform-rotate-m' => [
                    'block' => [
                        'hover-status' => true,
                    ],
                ],
                'transform-scale-s' => [
                    'canvas' => [
                        'hover-status' => false,
                    ],
                ],
                'transition' => [
                    'transform' => [
                        'canvas' => $this->repeated_attributes_with_status,
                        'block' => $this->repeated_attributes_with_status,
                        'button' => $this->repeated_attributes_with_status,
                    ],
                ],
            ],
            $this->repeated_attributes_with_status
        );

        // TODO: maybe merge from $this->custom_transition_obj
        $custom_transition_obj = merge_with($this->custom_transition_obj, [
            'transform' => [
                'canvas' => [
                    'title' => 'Canvas',
                    'target' => '',
                    'property' => 'transform',
                    'isTransform' => true,
                ],
                'block' => [
                    'title' => 'Block',
                    'target' => ' .block-class',
                    'property' => 'transform',
                    'isTransform' => true,
                ],
                'button' => [
                    'title' => 'Button',
                    'target' => ' .button-class',
                    'property' => 'transform',
                    'isTransform' => true,
                ],
            ],
        ]);

        $result = get_transition_styles($object, $custom_transition_obj);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }
}
