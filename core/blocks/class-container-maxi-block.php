<?php
/**
 * MaxiBlocks Group Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block.php';


if (!class_exists('MaxiBlocks_Container_Maxi_Block')):
    class MaxiBlocks_Container_Maxi_Block extends MaxiBlocks_Block
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Container_Maxi_Block
         */
        private static $instance;

        /**
         * Block name
         */
        protected $block_name = 'container-maxi';

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
                self::$instance = new MaxiBlocks_Container_Maxi_Block();
            }
        }

        /**
         * Get instance
         */
        public static function get_instance()
        {
            return self::$instance;
        }

        public function get_styles($props, $customCss, $sc_props)
        {

            $uniqueID = $props['uniqueID'];
            $block_style = $props['blockStyle'];

            $data = [
                'customCss' => $customCss,
            ];

            $styles_obj = [
                $uniqueID => [
                    '' => self::get_normal_object($props),
                    ':hover' => self::get_hover_object($props),
                ],
            ];

            $shape_divider_top_styles =
                array_key_exists('shape-divider-top-status', $props) &&
                $props['shape-divider-top-status'] ?
                    [
                        ' .maxi-shape-divider__top' => [
                            'shapeDivider' =>  get_shape_divider_styles(
                                get_group_attributes(
                                    $props,
                                    [
                                        'shapeDivider',
                                        'padding'
                                    ]
                                ),
                                'top'
                            ),
                        ' .maxi-shape-divider__top svg' => [
                            'shapeDivider' =>  get_shape_divider_svg_styles(
                                get_group_attributes(
                                    $props,
                                    [
                                        'shapeDivider',
                                        'padding'
                                    ]
                                ),
                                'top',
                                $block_style
                            ),
                        ]
                        ]
                    ] : [];
            $shape_divider_bottom_styles =
                array_key_exists('shape-divider-bottom-status', $props) &&
                $props['shape-divider-bottom-status'] ?
            [
                ' .maxi-shape-divider__bottom' => [
                    'shapeDivider' =>  get_shape_divider_styles(
                        get_group_attributes(
                            $props,
                            [
                                'shapeDivider',
                                'padding'
                            ]
                        ),
                        'bottom'
                    ),
                ' .maxi-shape-divider__bottom svg' => [
                    'shapeDivider' =>  get_shape_divider_svg_styles(
                        get_group_attributes(
                            $props,
                            [
                                'shapeDivider',
                                'padding'
                            ]
                        ),
                        'bottom',
                        $block_style
                    ),
                ]
                ]
            ] : [];


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

            $arrow_styles = get_arrow_styles(
                array_merge(
                    get_group_attributes($props, [
                        'arrow',
                        'border',
                        'borderWidth',
                        'borderRadius',
                        'blockBackground',
                        'boxShadow',
                    ]),
                    [ 'block_style' => $block_style,]
                )
            );

            $arrow_hover_styles =  get_arrow_styles(
                array_merge(
                    get_group_attributes(
                        $props,
                        [
                            'arrow',
                            'border',
                            'borderWidth',
                            'borderRadius',
                            'blockBackground',
                            'boxShadow',
                        ],
                        true
                    ),
                    get_group_attributes($props, ['arrow']),
                    [
                        'block_style' => $block_style,
                        'is_hover' => true,
                    ]
                )
            );

            $styles_obj[$uniqueID] = array_merge_recursive(
                $styles_obj[$uniqueID],
                $shape_divider_top_styles,
                $shape_divider_bottom_styles,
                $background_styles,
                $background_hover_styles,
                $arrow_styles,
                $arrow_hover_styles
            );

            $response = style_processor(
                $styles_obj,
                $data,
                $props,
            );

            return $response;
        }

        /**
         * Shipped container size defaults — used to detect unchanged attributes
         * so we can output SC CSS variable references instead of hard values.
         */
        private static $size_defaults = [
            'max-width-xxl' => '1690',
            'max-width-xl'  => '1170',
            'max-width-l'   => '90',
            'max-width-unit-xxl' => 'px',
            'max-width-unit-xl'  => 'px',
            'max-width-unit-l'   => '%',
            'width-l'  => '1170',
            'width-m'  => '1000',
            'width-s'  => '700',
            'width-xs' => '460',
            'width-unit-l' => 'px',
        ];

        /**
         * Replace default size/spacing CSS values with SC variable references.
         * When the attribute matches the shipped default, output
         * var(--maxi-{style}-container-{prop}-{bp}, {fallback}) so SC globals
         * flow through the higher-specificity per-block CSS.
         *
         * @param array  $style_obj  Breakpoint-keyed style array from get_size_styles / get_margin_padding_styles.
         * @param array  $attrs      Raw block attributes for this style group.
         * @param string $block_style  'light' or 'dark'.
         * @param array  $defaults   Shipped defaults to compare against.
         * @return array Modified style array.
         */
        private static function apply_sc_vars($style_obj, $attrs, $block_style, $defaults) {
            if (empty($block_style) || empty($defaults)) {
                return $style_obj;
            }
            foreach ($style_obj as $breakpoint => &$styles) {
                if (!is_array($styles)) {
                    continue;
                }
                foreach ($styles as $css_prop => &$css_value) {
                    $attr_key = "{$css_prop}-{$breakpoint}";
                    if (
                        isset($defaults[$attr_key]) &&
                        isset($attrs[$attr_key]) &&
                        (string) $attrs[$attr_key] === (string) $defaults[$attr_key]
                    ) {
                        $css_value = "var(--maxi-{$block_style}-container-{$css_prop}-{$breakpoint}, {$css_value})";
                    }
                }
            }
            return $style_obj;
        }

        public static function get_normal_object($props)
        {
            $block_style = $props['blockStyle'];
            $size_attrs = get_group_attributes($props, 'size');
            $margin_attrs = get_group_attributes($props, 'margin');
            $padding_attrs = get_group_attributes($props, 'padding');

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
                    'size' => self::apply_sc_vars(
                        get_size_styles(array_merge($size_attrs)),
                        $size_attrs,
                        $block_style,
                        self::$size_defaults
                    ),
                    'boxShadow' => get_box_shadow_styles(array(
                        'obj' => array_merge(get_group_attributes($props, 'boxShadow')),
                        'block_style' => $block_style,
                    )),
                    'opacity' => get_opacity_styles(array_merge(get_group_attributes($props, 'opacity'))),
                    'zIndex' => get_zindex_styles(array_merge(get_group_attributes($props, 'zIndex'))),
                    'position' => get_position_styles(array_merge(get_group_attributes($props, 'position'))),
                    'display' => get_display_styles(array_merge(get_group_attributes($props, 'display'))),
                    'overflow' => get_overflow_styles(array_merge(get_group_attributes($props, 'overflow'))),
                    'margin' => self::apply_sc_vars(
                        get_margin_padding_styles(['obj' => $margin_attrs]),
                        $margin_attrs,
                        $block_style,
                        self::$size_defaults
                    ),
                    'padding' => self::apply_sc_vars(
                        get_margin_padding_styles(['obj' => $padding_attrs]),
                        $padding_attrs,
                        $block_style,
                        self::$size_defaults
                    ),
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
    }

endif;
