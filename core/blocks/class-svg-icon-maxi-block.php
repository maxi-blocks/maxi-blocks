<?php
/**
 * MaxiBlocks SVG_Icon Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block.php';


if (!class_exists('MaxiBlocks_SVG_Icon_Maxi_Block')):
    class MaxiBlocks_SVG_Icon_Maxi_Block extends MaxiBlocks_Block
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_SVG_Icon_Maxi_Block
         */
        private static $instance;

        /**
         * Block name
         */
        protected $block_name = 'svg-icon-maxi';

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
                self::$instance = new MaxiBlocks_SVG_Icon_Maxi_Block();
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

            $data = [
                'customCss' => $customCss,
            ];

            // TODO: get the correct value
            $icon_width_height_ratio = false;

            $styles_obj = [
                $uniqueID => [
                    '' => self::get_wrapper_object($props),
                    ':hover' => self::get_hover_wrapper_object($props),
                    ' .maxi-svg-icon-block__icon' => self::get_normal_object($props, $icon_width_height_ratio),
                    ' .maxi-svg-icon-block__icon:hover' => self::get_hover_object($props),
                ],
            ];

            $svg_styles = get_svg_styles([
                'obj' => get_group_attributes($props, 'svg'),
                'target' => ' .maxi-svg-icon-block__icon',
                'block_style' => $block_style,
            ]);
            $svg_hover_styles = isset($props['svg-status-hover']) && $props['svg-status-hover'] ? get_svg_styles([
                'obj' => get_group_attributes($props, 'svg', true),
                'target' => ' .maxi-svg-icon-block__icon:hover',
                'block_style' => $block_style,
                'is_hover' => true,
            ]) : [];


            $styles_obj[$uniqueID] = array_merge_recursive(
                $styles_obj[$uniqueID],
                $svg_styles,
                $svg_hover_styles,
            );

            $response = style_processor(
                $styles_obj,
                $data,
                $props,
            );

            return $response;
        }


        public static function get_wrapper_object($props)
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
                    'boxShadow' => get_box_shadow_styles(array(
                        'obj' => array_merge(get_group_attributes($props, 'boxShadow')),
                        'block_style' => $block_style,
                    )),
                    'opacity' => get_opacity_styles(array_merge(get_group_attributes($props, 'opacity'))),
                    'size' => get_size_styles(array_merge(get_group_attributes($props, 'size'))),
                    'margin' => get_margin_padding_styles([
                        'obj' => get_group_attributes($props, 'margin'),
                    ]),
                    'padding' => get_margin_padding_styles([
                        'obj' => get_group_attributes($props, 'padding'),
                    ]),
                    'zIndex' => get_zindex_styles(array_merge(get_group_attributes($props, 'zIndex'))),
                    'alignment' => get_alignment_flex_styles(array_merge(get_group_attributes($props, 'alignment'))),
                    'position' => get_position_styles(array_merge(get_group_attributes($props, 'position'))),
                    'display' => get_display_styles(array_merge(get_group_attributes($props, 'display'))),
                    'overflow' => get_overflow_styles(array_merge(get_group_attributes($props, 'overflow'))),
                    'flex' => get_flex_styles(array_merge(get_group_attributes($props, 'flex'))),
                ];

            return $response;
        }

        public static function get_hover_wrapper_object($props)
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

        public static function get_normal_object($props, $icon_width_height_ratio)
        {
            $block_style = $props['blockStyle'];

            $response = [
                'box_shadow' => get_box_shadow_styles([
                    'obj' => get_group_attributes($props, 'boxShadow', false, 'svg-'),
                    'block_style' => $block_style,
                    'prefix' => 'svg-'
                ]),
                'padding' => get_margin_padding_styles([
                    'obj' => get_group_attributes($props, 'margin', false, 'svg-'),
                    'prefix' => 'svg-'
                ]),
                'margin' => get_margin_padding_styles([
                    'obj' => get_group_attributes($props, 'padding', false, 'svg-'),
                    'prefix' => 'svg-'
                ]),
                'border' => get_border_styles([
                    'obj' => get_group_attributes(
                        $props,
                        ['border', 'borderWidth', 'borderRadius'],
                        false,
                        'svg-'
                    ),
                    'block_style' => $block_style,
                    'prefix' => 'svg-'
                ]),

            ];

            $response = array_merge(
                $response,
                get_svg_width_styles([
                    'obj' => get_group_attributes($props, 'svg'),
                    'prefix' => 'svg-',
                    'iconWidthHeightRatio' => $icon_width_height_ratio
                ]),
                get_background_styles(
                    array_merge(
                        get_group_attributes(
                            $props,
                            array('background', 'backgroundColor', 'backgroundGradient'),
                            false,
                            'svg-'
                        ),
                        [
                            'block_style' => $props['blockStyle'],
                            'prefix' => 'svg-'
                        ]
                    )
                )
            );

            return $response;
        }

        public static function get_hover_object($props)
        {
            $block_style = $props['blockStyle'];

            $response = [
                'border' => ($props['svg-border-status-hover']) ? get_border_styles([
                    'obj' => get_group_attributes(
                        $props,
                        ['border', 'borderWidth', 'borderRadius'],
                        true,
                        'svg-'
                    ),
                    'isHover' => true,
                    'block_style' => $block_style,
                    'prefix' => 'svg-'
                ]) : null,
                'boxShadow' => ($props['svg-box-shadow-status-hover']) ? get_box_shadow_styles([
                    'obj' => get_group_attributes($props, 'boxShadow', true, 'svg-'),
                    'isHover' => true,
                    'block_style' => $block_style,
                    'prefix' => 'svg-'
                ]) : null
            ];

            $response = array_merge(
                $response,
                get_background_styles(
                    array_merge(
                        get_group_attributes(
                            $props,
                            array('background', 'backgroundColor', 'backgroundGradient'),
                            true,
                            'svg-'
                        ),
                        [
                            'is_hover' => true,
                            'block_style' => $props['blockStyle'],
                            'prefix' => 'svg-'
                        ]
                    )
                )
            );


            return $response;
        }
    }

endif;
