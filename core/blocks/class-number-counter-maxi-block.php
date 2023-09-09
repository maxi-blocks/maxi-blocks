<?php
/**
 * MaxiBlocks Number_Counter Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block.php';


if (!class_exists('MaxiBlocks_Number_Counter_Maxi_Block')):
    class MaxiBlocks_Number_Counter_Maxi_Block extends MaxiBlocks_Block
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Number_Counter_Maxi_Block
         */
        private static $instance;

        /**
         * Block name
         */
        protected $block_name = 'number-counter-maxi';

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
                self::$instance = new MaxiBlocks_Number_Counter_Maxi_Block();
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

            $styles_obj = [
                $uniqueID => [
                    '' => self::get_wrapper_object($props),
                    ':hover' => self::get_hover_wrapper_object($props),
                    ':hover .maxi-number-counter__box' => self::get_hover_box_object($props),
                    ' .maxi-number-counter__box'=> self::get_box_object($props),
                ],
            ];

            $number_counter_styles = get_number_counter_styles(get_group_attributes($props, 'numberCounter'), '.maxi-number-counter__box', $block_style);

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

            $styles_obj[$uniqueID] = array_merge_recursive(
                $styles_obj[$uniqueID],
                $number_counter_styles,
                $background_styles,
                $background_hover_styles,
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

            $response = [
                'alignment' => get_alignment_flex_styles(get_group_attributes($props, 'alignment')),
                'opacity' => get_opacity_styles(get_group_attributes($props, 'opacity')),
                'zIndex' => get_zindex_styles(get_group_attributes($props, 'zIndex')),
                'position' => get_position_styles(get_group_attributes($props, 'position')),
                'display' => get_display_styles(get_group_attributes($props, 'display')),
                'overflow' => get_overflow_styles(get_group_attributes($props, 'overflow')),
                'margin' => get_margin_padding_styles([
                    'obj' => get_group_attributes($props, 'margin')
                ]),
                'padding' => get_margin_padding_styles([
                    'obj' => get_group_attributes($props, 'padding')
                ]),
                'border' => get_border_styles([
                    'obj' => get_group_attributes($props, [
                        'border',
                        'borderWidth',
                        'borderRadius'
                    ]),
                    'block_style' => $block_style
                ]),
                'boxShadow' => get_box_shadow_styles([
                    'obj' => get_group_attributes($props, 'boxShadow'),
                    'block_style' => $block_style
                ]),
                'size' => get_size_styles(get_group_attributes($props, 'size')),
                'flex' => get_flex_styles(get_group_attributes($props, 'flex'))
            ];

            return $response;
        }

        public static function get_hover_wrapper_object($props)
        {
            $block_style = $props['blockStyle'];

            $response = [
                'border' => isset($props['border-status-hover']) ?
                            get_border_styles([
                                'obj' => get_group_attributes($props, [
                                    'border',
                                    'borderWidth',
                                    'borderRadius'
                                ], true),
                                'isHover' => true,
                                'block_style' => $block_style
                            ]) : null,
                'boxShadow' => isset($props['box-shadow-status-hover']) ?
                               get_box_shadow_styles([
                                   'obj' => get_group_attributes($props, 'boxShadow', true),
                                   'isHover' => true,
                                   'block_style' => $block_style
                               ]) : null,
                'opacity' => isset($props['opacity-status-hover']) ?
                             get_opacity_styles(get_group_attributes($props, 'opacity', true), true) : null
            ];

            return $response;
        }

        public static function get_box_object($props)
        {
            $end_count_value = ceil(($props['number-counter-end'] * 360) / 100);

            $size = array_merge(
                get_size_styles(
                    get_group_attributes($props, 'size', false, 'number-counter-'),
                    'number-counter-'
                ),
                get_group_attributes($props, 'numberCounter')
            );


            $block_style = $props['blockStyle'];

            $response = [
                'size' => $size,
                'margin' => get_margin_padding_styles([
                    'obj' => get_group_attributes(
                        $props,
                        'margin',
                        false,
                        'number-counter-'
                    ),
                    'prefix' => 'number-counter-',
                ]),
                'padding' => get_margin_padding_styles([
                    'obj' => get_group_attributes(
                        $props,
                        'padding',
                        false,
                        'number-counter-'
                    ),
                    'prefix' => 'number-counter-',
        ]),
                'boxShadow' => get_box_shadow_styles([
                    'obj' => get_group_attributes(
                        $props,
                        'boxShadow',
                        false,
                        'number-counter-'
                    ),
                    'block_style' => $block_style,
                    'prefix' => 'number-counter-',
        ]),
                'border' => get_border_styles([
                    'obj' => get_group_attributes(
                        $props,
                        ['border', 'borderWidth', 'borderRadius'],
                        false,
                        'number-counter-'
                    ),
                    'block_style' => $block_style,
                    'prefix' => 'number-counter-',
        ]),
            ];

            return $response;
        }

        public static function get_hover_box_object($props)
        {
            $block_style = $props['blockStyle'];

            $response = [
                'border' => isset($props['number-counter-border-status-hover']) ?
                            get_border_styles([
                                'obj' => get_group_attributes(
                                    $props,
                                    ['border', 'borderWidth', 'borderRadius'],
                                    true,
                                    'number-counter-'
                                ),
                                'isHover' => true,
                                'block_style' => $block_style,
                                'prefix' => 'number-counter-',
                            ]) : null,
                'boxShadow' => isset($props['number-counter-box-shadow-status-hover']) ?
                               get_box_shadow_styles([
                                   'obj' => get_group_attributes(
                                       $props,
                                       'boxShadow',
                                       true,
                                       'number-counter-'
                                   ),
                                   'isHover' => true,
                                   'block_style' => $block_style,
                                   'prefix' => 'number-counter-',
                       ]) : null,
            ];

            return $response;
        }

    }


endif;
