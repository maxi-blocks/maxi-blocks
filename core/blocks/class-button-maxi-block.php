<?php
/**
 * MaxiBlocks Button Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block.php';


if (!class_exists('MaxiBlocks_Button_Maxi_Block')):
    class MaxiBlocks_Button_Maxi_Block extends MaxiBlocks_Block
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Button_Maxi_Block
         */
        private static $instance;

        /**
         * Block name
         */
        protected $block_name = 'button-maxi';

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
                self::$instance = new MaxiBlocks_Button_Maxi_Block();
            }
        }

        /**
         * Get instance
         */
        public static function get_instance()
        {
            return self::$instance;
        }

        public static function write_log($log)
        {
            if (is_array($log) || is_object($log)) {
                error_log(print_r($log, true));
            } else {
                error_log($log);
            }
        }

        public static function get_styles($props, $customCss, $sc_values)
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
                    ' .maxi-button-block__button' => self::get_normal_object($props),
                    ' .maxi-button-block__content'=> self::get_content_object($props),
                    // Hover
                    ' .maxi-button-block__button:hover' => self::get_hover_object($props, $sc_values),
                    ' .maxi-button-block__content:hover' => self::get_hover_content_object($props, $sc_values),
                ],
            ];

            $button_icon_styles = get_button_icon_styles([
                'obj' => $props,
                'block_style' => $block_style,
                'target' => '.maxi-button-block__icon',
                'wrapper_target' => '.maxi-button-block__button',
                // 'icon_width_height_ratio' = $icon_width_height_ratio,
            ]);

            $button_icon_hover_styles = get_button_icon_styles([
                'obj' => $props,
                'block_style' => $block_style,
                'target' => '.maxi-button-block__icon',
                'wrapper_target' => '.maxi-button-block__button',
                // 'icon_width_height_ratio' = $icon_width_height_ratio,
                'is_hover' => true,
            ]);

            $styles_obj[$uniqueID] = array_merge_recursive(
                $styles_obj[$uniqueID],
                $button_icon_styles,
                $button_icon_hover_styles
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
                    'alignment' => get_alignment_flex_styles(
                        get_group_attributes($props, 'alignment'),
                    ),
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
                    'flex' => get_flex_styles(array_merge(get_group_attributes($props, 'flex'))),
                    'margin' => get_margin_padding_styles([
                        'obj' => get_group_attributes($props, 'margin'),
                    ]),
                    'padding' => get_margin_padding_styles([
                        'obj' => get_group_attributes($props, 'padding'),
                    ]),
                    'display' => get_display_styles(array_merge(get_group_attributes($props, 'display'))),
                    'position' => get_position_styles(array_merge(get_group_attributes($props, 'position'))),
                    'overflow' => get_overflow_styles(array_merge(get_group_attributes($props, 'overflow'))),
                    'zIndex' => get_zindex_styles(array_merge(get_group_attributes($props, 'zIndex'))),
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

        public static function get_normal_object($props)
        {
            $block_style = $props['blockStyle'];
            $prefix = 'button-';

            $response = [
                'size' => get_size_styles(array_merge(get_group_attributes($props, 'size', false, $prefix)), $prefix),
                'border' => get_border_styles(array(
                    'obj' => array_merge(
                        get_group_attributes(
                            $props,
                            array(
                                'border',
                                'borderWidth',
                                'borderRadius',
                            ),
                            false,
                            $prefix
                        )
                    ),
                    'block_style' => $block_style,
                    'prefix' => $prefix,
                )),
                'boxShadow' => get_box_shadow_styles(array(
                    'obj' => array_merge(get_group_attributes($props, 'boxShadow', false, $prefix)),
                    'block_style' => $block_style,
                    'prefix' => $prefix,
                )),
                'textAlignment' => get_alignment_text_styles(get_group_attributes($props, 'textAlignment')),
                'margin' => get_margin_padding_styles([
                    'obj' => get_group_attributes($props, 'margin', false, $prefix),
                    'prefix' => $prefix,
                ]),
                'padding' => get_margin_padding_styles([
                    'obj' => get_group_attributes($props, 'padding', false, $prefix),
                    'prefix' => $prefix,
                ]),
            ];

            $response = array_merge(
                $response,
                get_background_styles(
                    array_merge(
                        get_group_attributes(
                            $props,
                            array('background', 'backgroundColor', 'backgroundGradient'),
                            false,
                            $prefix
                        ),
                        [
                            'block_style' => $props['blockStyle'],
                            'prefix' => $prefix,
                        ]
                    )
                )
            );

            // self::write_log('$response button-maxi-block');
            // self::write_log($response);
            // self::write_log('========================');

            return $response;
        }

        public static function get_hover_object($props, $sc_values)
        {
            $block_style = $props['blockStyle'];
            $prefix = 'button-';

            $response = [
                'border' => array_key_exists('button-border-status-hover', $props) && $props['border-status-hover'] ? get_border_styles([
                    'obj' => get_group_attributes($props, ['border', 'borderWidth', 'borderRadius'], true, $prefix),
                    'is_hover' => true,
                    'block_style' => $block_style,
                    'is_button' => true,
                    'prefix' => $prefix,
                    'sc_values' => $sc_values,
                ]) : null,
                'boxShadow' => array_key_exists('button-box-shadow-status-hover', $props) && $props['box-shadow-status-hover'] ? get_box_shadow_styles([
                    'obj' => get_group_attributes($props, 'boxShadow', true, $prefix),
                    'is_hover' => true,
                    'block_style' => $block_style,
                    'prefix' => $prefix,
                ]) : null,
            ];

            $response = array_merge(
                $response,
                get_background_styles(
                    array_merge(
                        get_group_attributes(
                            $props,
                            array('background', 'backgroundColor', 'backgroundGradient'),
                            false,
                            $prefix
                        ),
                        [
                            'is_hover' => true,
                            'block_style' => $block_style,
                            'is_button' => true,
                            'prefix' => $prefix,
                            'sc_values' => $sc_values,
                        ]
                    )
                )
            );


            return $response;
        }

        public static function get_content_object($props)
        {
            $block_style = $props['blockStyle'];

            $response = [
                'typography' => get_typography_styles([
                    'obj' => get_group_attributes($props, 'typography'),
                    'block_style' => $block_style,
                    'text_level' => 'button'
                ]),
            ];

            return $response;
        }

        public static function get_hover_content_object($props, $sc_values)
        {
            $block_style = $props['blockStyle'];

            $response = [
                'typography' => get_typography_styles([
                    'obj' => get_group_attributes($props, 'typography', true),
                    'block_style' => $block_style,
                    'text_level' => 'button',
                    'is_hover' => true,
                    'normal_typography' => get_group_attributes($props, 'typography'),
                    'sc_values' => $sc_values,
                ]),
            ];

            return $response;
        }
    }

endif;
