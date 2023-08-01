<?php
/**
 * MaxiBlocks Text Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block.php';



if (!class_exists('MaxiBlocks_Text_Maxi_Block')):
    class MaxiBlocks_Text_Maxi_Block extends MaxiBlocks_Block
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Text_Maxi_Block
         */
        private static $instance;

        /**
         * Block name
         */
        protected $block_name = 'text-maxi';

        /**
         * Block
         *
         * WP Block Type object
         */
        protected $block;

        /**
         * Block custom css
         */
        protected $block_custom_css = [];

        /**
         * Registers the plugin.
         */
        public static function register()
        {
            if (null === self::$instance) {
                self::$instance = new MaxiBlocks_Text_Maxi_Block();
            }
        }

        /**
         * Get instance
         */
        public static function get_instance()
        {
            return self::$instance;
        }

        public static function get_styles($props, $customCss, $sc_props)
        {

            $uniqueID = $props['uniqueID'];
            $block_style = $props['blockStyle'];
            $is_list = $props['isList'];
            $text_level = $props['textLevel'];
            $type_of_list = $props['typeOfList'];
            $element = $is_list ? $type_of_list : $text_level;
            $is_rtl = is_rtl();


            // transition
            $defaults = new StylesDefaults();
            $transition_default_canvas = $defaults->transitionDefault['canvas'];

            $block_class = ' .maxi-text-block';
            $content_class = $block_class . '__content';
            $link_class = $block_class . '--link';

            $transition = [
                'canvas' => array_merge($transition_default_canvas, [
                    'typography' => [
                        'title' => 'Typography',
                        'target' => [$content_class, $content_class . ' li', $content_class . ' ol'],
                        'property' => false,
                        'hoverProp' => 'typography-status-hover',
                    ],
                    'link' => [
                        'title' => 'Link',
                        'target' => [$link_class, $link_class . ' span'],
                        'property' => 'color',
                    ],
                ]),
            ];

            $data = [
                'customCss' => $customCss,
                'transition' => $transition,
            ];

            $styles_obj = [
                $uniqueID => [
                    '' => self::get_normal_object($props),
                    ':hover' => self::get_hover_object($props),
                ],
            ];

            if($is_list) {
                $styles_obj[$uniqueID] = array_merge(
                    $styles_obj[$uniqueID],
                    [
                        " $element.maxi-text-block__content" => self::get_list_object(
                            array_merge($props, [$is_rtl => $is_rtl])
                        ),
                        " $element.maxi-text-block__content li" => array_merge(
                            self::get_typography_object($props),
                            self::get_list_item_object($props),
                        ),
                        " $element.maxi-text-block__content li:not(:first-child)" =>
                            self::get_list_paragraph_object($props),
                        " $element.maxi-text-block__content li:hover" =>
                            self::get_typography_hover_object($props),
                        " $element.maxi-text-block__content li::before" =>
                            self::get_marker_object(array_merge($props, [$is_rtl => $is_rtl])),
                    ]
                );
            } else {
                $styles_obj[$uniqueID] = array_merge(
                    $styles_obj[$uniqueID],
                    [
                        " $element.maxi-text-block__content" => self::get_typography_object($props, $is_list),
                        " $element.maxi-text-block__content:hover" => self::get_typography_hover_object($props),
                    ]
                );
            }

            $background_styles = get_block_background_styles(
                array_merge(
                    get_group_attributes($props, [
                        'blockBackground',
                        'border',
                        'borderWidth',
                        'borderRadius',
                    ]),
                    [ 'block_style' => $block_style,]
                )
            );
            $background_hover_styles = get_block_background_styles(
                array_merge(
                    get_group_attributes(
                        $props,
                        [
                            'blockBackground',
                            'border',
                            'borderWidth',
                            'borderRadius',
                        ],
                        true
                    ),
                    [
                        'block_style' => $block_style,
                        'is_hover' => true,
                    ]
                )
            );
            $custom_formats_styles = get_custom_formats_styles(
                !$is_list
                        ? ' .maxi-text-block__content'
                        : ' .maxi-text-block__content li',
                $props['custom-formats'] ?? [],
                $block_style,
                get_group_attributes($props, 'typography'),
                $text_level,
                false,
            );
            $hover_custom_formats_styles = get_custom_formats_styles(
                !$is_list
                ? ':hover .maxi-text-block__content'
                : ':hover .maxi-text-block__content li',
                $props['custom-formats'] ?? [],
                $block_style,
                get_group_attributes($props, 'typography'),
                $text_level,
                true,
            );
            $link_styles = array_merge(
                get_link_styles(
                    get_group_attributes($props, 'link'),
                    ' a '.$element.'.maxi-text-block__content',
                    $block_style,
                ),
                get_link_styles(
                    get_group_attributes($props, 'link'),
                    ' '.$element.'.maxi-text-block__content a',
                    $block_style,
                ),
            );

            $styles_obj[$uniqueID] = array_merge(
                $styles_obj[$uniqueID],
                $background_styles,
                $background_hover_styles,
                $custom_formats_styles,
                $hover_custom_formats_styles,
                $link_styles,
            );

            $response = style_processor(
                $styles_obj,
                $data,
                $props,
            );

            return $response;
        }

        public static function get_normal_object($props)
        {
            $block_style = $props['blockStyle'];

            $response =
                [
                    'border' => get_border_styles(array(
                        'obj' => array_merge(get_group_attributes($props, array(
                            'border',
                            'borderWidth',
                            'borderRadius',
                        ))),
                        'block_style' => $block_style,
                    )),
                    'size' => get_size_styles(array_merge(get_group_attributes($props, 'size'))),
                    'boxShadow' => get_box_shadow_styles(array(
                        'obj' => array_merge(get_group_attributes($props, 'boxShadow')),
                        'block_style' => $block_style,
                    )),
                    'opacity' => get_opacity_styles(array_merge(get_group_attributes($props, 'opacity'))),
                    'zIndex' => get_zindex_styles(array_merge(get_group_attributes($props, 'zIndex'))),
                    'position' => get_position_styles(array_merge(get_group_attributes($props, 'position'))),
                    'display' => get_display_styles(array_merge(get_group_attributes($props, 'display'))),
                    'margin' => get_margin_padding_styles([
                        'obj' => get_group_attributes($props, 'margin'),
                    ]),
                    'padding' => get_margin_padding_styles([
                        'obj' => get_group_attributes($props, 'padding'),
                    ]),
                    "textAlignment" => get_alignment_text_styles(get_group_attributes($props, 'textAlignment')),
                    'overflow' => get_overflow_styles(array_merge(get_group_attributes($props, 'overflow'))),
                    'flex' => get_flex_styles(array_merge(get_group_attributes($props, 'flex'))),
                ];

            return $response;
        }

        public static function get_hover_object($props)
        {
            $block_style = $props['blockStyle'];

            $response = [
                'border' => array_key_exists('border-status-hover', $props) && $props['border-status-hover'] ? get_border_styles([
                    'obj' => [
                        ...get_group_attributes($props, ['border', 'borderWidth', 'borderRadius'], true)
                    ],
                    'is_hover' => true,
                    'block_style' => $block_style
                ]) : null,
                'boxShadow' => array_key_exists('box-shadow-status-hover', $props) && $props['box-shadow-status-hover'] ? get_box_shadow_styles([
                    'obj' => [
                        ...get_group_attributes($props, 'boxShadow', true)
                    ],
                    'is_hover' => true,
                    'block_style' => $block_style
                ]) : null,
                'opacity' => array_key_exists('opacity-status-hover', $props) && $props['opacity-status-hover'] ? get_opacity_styles(
                    get_group_attributes($props, 'opacity', true),
                    true
                ) : null,
            ];

            return $response;
        }

        public static function get_typography_object($props)
        {
            $response = [
            'typography' => get_typography_styles([
                    'obj' => get_group_attributes($props, 'typography'),
                    'block_style' => $props['blockStyle'],
                    'text_level' => $props['textLevel']
                ])
            ];

            return $response;
        }

        public static function get_typography_hover_object($props)
        {
            $response = [
            'typography' => get_typography_styles([
                    'obj' => get_group_attributes($props, 'typography', true),
                    'is_hover' => true,
                    'block_style' => $props['blockStyle'],
                    'text_level' => $props['textLevel'],
                    'normal_typography' => get_group_attributes($props, 'typography'),
                ])
            ];

            return $response;
        }

        public static function get_list_object($props)
        {
            $listStyle = $props['listStyle'] ?? false;
            $listStart = $props['listStart'] ?? false;
            $listReversed = $props['listReversed'] ?? false;


            $content = $props['content'];

            $counterReset = null;
            if (is_int($listStart)) {
                $counterReset =
                    $listStart < 0 &&
                    (in_array($listStyle, ['decimal', 'details']) || !$listStyle)
                        ? $listStart
                        : 0;
                $counterReset += $listStart > 0 ? $listStart : 0;
                $counterReset +=
                    $listReversed && parse($content).length ? parse($content).length : 1;
                $counterReset += $listReversed ? 1 : -1;
                $counterReset -= 1;
            } elseif ($listReversed) {
                $counterReset = parse($content).length ? parse($content).length + 1 : 2;
            } else {
                $counterReset = 0;
            }

            $response = [
                'listStart' => [
                    'general' => [
                        'counter-reset' => "li $counterReset"
                    ]
                ],
                'listGap' => [],
                'bottomGap' => []
            ];

            $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

            foreach ($breakpoints as $breakpoint) {
                $isRTL = ($props['isRTL'] ?? false) ||
                (get_last_breakpoint_attribute([
                    'target' => 'text-direction',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]) === 'rtl' ? true : false);

                $gapNum = get_last_breakpoint_attribute([
                    'target' => 'list-gap',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]);
                $gapUnit = get_last_breakpoint_attribute([
                    'target' => 'list-gap-unit',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]);

                $listStylePosition = get_last_breakpoint_attribute([
                    'target' => 'list-style-position',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]);

                $sizeNum = get_last_breakpoint_attribute([
                    'target' => 'list-marker-size',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]) || 0;
                $sizeUnit = get_last_breakpoint_attribute([
                    'target' => 'list-marker-size-unit',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]) || 'px';

                $indentMarkerNum = get_last_breakpoint_attribute([
                    'target' => 'list-marker-indent',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]) || 0;
                $indentMarkerUnit = get_last_breakpoint_attribute([
                    'target' => 'list-marker-indent-unit',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]) || 'px';

                $indentMarkerSum = $indentMarkerNum + $indentMarkerUnit;

                $padding =
                    $listStylePosition === 'inside'
                        ? $gapNum + $gapUnit
                        : "calc($gapNum + $gapUnit + $sizeNum + $sizeUnit + $indentMarkerSum)";

                if (!is_null($gapNum) && !is_null($gapUnit)) {
                    $response['listGap'][$breakpoint] = [
                        "padding-" . ($isRTL ? 'right' : 'left') => $padding
                    ];
                }

                $bottomGapNum = get_last_breakpoint_attribute([
                    'target' => 'bottom-gap',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]);
                $bottomGapUnit = get_last_breakpoint_attribute([
                    'target' => 'bottom-gap-unit',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]);

                if (!is_null($bottomGapNum) && !is_null($bottomGapUnit)) {
                    $response['bottomGap'][$breakpoint] = [
                        'margin-bottom' => $bottomGapNum . $bottomGapUnit
                    ];
                }
            }

            return $response;
        }

        public static function get_list_item_object($props)
        {


            $listReversed = $props['listReversed'] ?? false;



            $response = [];

            if ($listReversed) {
                $response['listReversed'] = [
                    'general' => [
                        'counter-increment' => 'li -1'
                    ]
                ];
            }

            $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

            foreach ($breakpoints as $breakpoint) {
                $indentNum = get_last_breakpoint_attribute([
                    'target' => 'list-indent',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]);
                $indentUnit = get_last_breakpoint_attribute([
                    'target' => 'list-indent-unit',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]);

                if (!is_null($indentNum) && !is_null($indentUnit)) {
                    $response['textIndent'][$breakpoint] = [
                        'text-indent' => $indentNum . $indentUnit
                    ];
                }
            }

            return $response;
        }

        public static function get_list_paragraph_object($props)
        {
            $response = [];

            $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

            foreach ($breakpoints as $breakpoint) {
                $paragraphSpacingNum = get_last_breakpoint_attribute([
                    'target' => 'list-paragraph-spacing',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]);
                $paragraphSpacingUnit = get_last_breakpoint_attribute([
                    'target' => 'list-paragraph-spacing-unit',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]);

                if (!is_null($paragraphSpacingNum) && !is_null($paragraphSpacingUnit)) {
                    $response['paragraphSpacing'][$breakpoint] = [
                        'margin-top' => $paragraphSpacingNum . $paragraphSpacingUnit
                    ];
                }
            }

            return $response;
        }

        public static function get_svg_list_style($svg)
        {
            if (!$svg) {
                return '';
            }

            $cleaned_svg = str_replace('"', "'", $svg);
            $cleaned_svg = preg_replace('/>\s{1,}</', '><', $cleaned_svg);
            $cleaned_svg = preg_replace('/\s{2,}/', ' ', $cleaned_svg);

            if (strpos($cleaned_svg, 'http://www.w3.org/2000/svg') === false) {
                $cleaned_svg = str_replace('<svg', "<svg xmlns='http://www.w3.org/2000/svg'", $cleaned_svg);
            }

            return preg_replace_callback('/[\r\n%#()<>?[\\\]^`{|}]/', 'urlencode', $cleaned_svg);
        }

        public static function get_marker_object($props)
        {

            $response = [];
            $list_style = $props['listStyle'] ?? false;
            $type_of_list = $props['typeOfList'] ?? false;
            $list_style_custom = $props['listStyleCustom'] ?? false;
            $block_style = $props['blockStyle'];

            $palette_attributes = get_palette_attributes([
                'obj' => $props,
                'prefix' => 'list-'
            ]);

            $palette_status = $palette_attributes['palette_status'];
            $palette_color = $palette_attributes['palette_color'];
            $palette_opacity = $palette_attributes['palette_opacity'];
            $color = $palette_attributes['color'];

            $response['color'] = [
                'general' => [
                    'color' => $palette_status
                        ? get_color_rgba_string([
                                'first_var' => 'color-'.$palette_color,
                                'opacity' => $palette_opacity,
                                'block_style' => $block_style
                            ])
                        : $color
                ]
            ];

            if ($type_of_list === 'ol') {
                $response['listContent'] = [
                    'general' => [
                        'content' => 'counters(li, "."'.($list_style ? ', '.$list_style : '').')'
                    ]
                ];
            } elseif ($type_of_list === 'ul') {
                $response['listContent'] = [
                    'general' => [
                        'content' => 'counter(li'.($list_style && $list_style === 'custom' && $list_style_custom
                            ? ', '.$list_style_custom
                            : ', '.($list_style ?? 'disc')).')'
                    ]
                ];
            }

            if ($list_style && $type_of_list === 'ol') {
                $response['listStyle'] = [
                    'general' => [
                        'list-style-type' => $list_style
                    ]
                ];
            }

            if ($list_style && $type_of_list === 'ul') {
                $general_list_style = [];

                if($list_style === 'custom' && $list_style_custom && is_link($list_style_custom)) {
                    $general_list_style['content'] = "url('".$list_style_custom."')";
                } elseif ($list_style_custom && strpos($list_style_custom, '</svg>') !== false) {
                    $general_list_style['content'] = "url(\"data:image/svg+xml,".self::get_svg_list_style($list_style_custom)."\")";
                } elseif (!is_link($list_style_custom) && !strpos($list_style_custom, '</svg>')) {
                    $general_list_style['content'] = "\"".$list_style_custom."\"";
                }

                $response['listContent']['general'] = $general_list_style;

            }



            $response_list_size = [];

            $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

            foreach ($breakpoints as $breakpoint) {
                $is_rtl = ($props['isRTL'] ??
                    (get_last_breakpoint_attribute([
                        'target' => 'text-direction',
                        'breakpoint' => $breakpoint,
                        'attributes' => $props
                    ]) === 'rtl')) ? true : false;


                $list_style_position = get_last_breakpoint_attribute([
                    'target' => 'list-style-position',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                ]);

                $size_num = get_last_breakpoint_attribute([
                    'target' => 'list-marker-size',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                    ]) ?? 0;

                $size_unit = get_last_breakpoint_attribute([
                    'target' => 'list-marker-size-unit',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                    ]) ?? 'px';

                $text_position = get_last_breakpoint_attribute([
                    'target' => 'list-text-position',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                    ]) ?? false;

                $indent_marker_num = get_last_breakpoint_attribute([
                    'target' => 'list-marker-indent',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                    ]) ?? 0;

                $indent_marker_unit = get_last_breakpoint_attribute([
                    'target' => 'list-marker-indent-unit',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                    ]) ?? 'px';

                $indent_marker_sum = $indent_marker_num . $indent_marker_unit;
                $marker_position = $list_style_position === 'inside' ? 0 : 'calc(-'.$indent_marker_num . $indent_marker_unit.')';

                $line_height_marker_num = get_last_breakpoint_attribute([
                    'target' => 'list-marker-line-height',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                    ]) ?? 0;

                $line_height_marker_unit = get_last_breakpoint_attribute([
                    'target' => 'list-marker-line-height-unit',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props
                    ]) ?? 'px';

                $response[$breakpoint] = [];
                if($type_of_list === 'ul'
                && $list_style === 'custom'
                && $list_style_custom
                && strpos($list_style_custom, '</svg>') !== false) {
                    $response[$breakpoint]['width'] = $size_num . $size_unit;
                } else {
                    $response[$breakpoint]['font-size'] = $size_num . $size_unit;
                }

                if($is_rtl) {
                    $response[$breakpoint]['right'] = $marker_position;
                } else {
                    $response[$breakpoint]['left'] = $marker_position;
                }

                if($list_style_position === 'outside' && $list_style !== 'custom') {
                    $response[$breakpoint]['width'] = '1em';
                    $response[$breakpoint]['margin-left'] = '-1em';
                } elseif($list_style_position === 'outside' && $list_style === 'custom') {
                    $response[$breakpoint]['margin-left'] = '-'.$size_num . $size_unit;
                }

                if($list_style_position === 'inside') {
                    $response[$breakpoint]['padding-left'] = $indent_marker_sum;
                } else {
                    $response[$breakpoint]['text-indent'] = $indent_marker_sum;
                }
            }

            $response['listSize'] = $response_list_size;

            return $response;
        }
    }

endif;
