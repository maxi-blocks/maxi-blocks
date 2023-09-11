<?php
/**
 * MaxiBlocks Pane Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block.php';


if (!class_exists('MaxiBlocks_Pane_Maxi_Block')):
    class MaxiBlocks_Pane_Maxi_Block extends MaxiBlocks_Block
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Pane_Maxi_Block
         */
        private static $instance;

        /**
         * Block name
         */
        protected $block_name = 'pane-maxi';

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
                self::$instance = new MaxiBlocks_Pane_Maxi_Block();
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
                    '' => self::get_normal_object($props),
                    ':hover' => self::get_hover_object($props),
                    ' .maxi-pane-block__header' => self::get_normal_styles($props, 'header-'),
                    ' .maxi-pane-block__content' => self::get_normal_styles($props, 'content-'),
                    '[aria-expanded] .maxi-pane-block__header:hover' => self::get_hover_styles($props, 'header-'),
                    '[aria-expanded] .maxi-pane-block__content:hover' => self::get_hover_styles($props, 'content-'),
                    '[aria-expanded="true"] .maxi-pane-block__header' => self::get_active_styles($props, 'header-'),
                    '[aria-expanded="true"] .maxi-pane-block__content' => self::get_active_styles($props, 'content-'),
                ],
            ];

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
                    'overflow' => get_overflow_styles(array_merge(get_group_attributes($props, 'overflow'))),
                    'margin' => get_margin_padding_styles([
                        'obj' => get_group_attributes($props, 'margin'),
                    ]),
                    'padding' => get_margin_padding_styles([
                        'obj' => get_group_attributes($props, 'padding'),
                    ]),
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

        public static function get_normal_styles($props, $prefix)
        {
            $response = array(
                ...get_background_styles(
                    array_merge(
                        get_group_attributes(
                            $props,
                            array('background', 'backgroundColor', 'backgroundGradient'),
                            false,
                            $prefix
                        ),
                        [
                            'block_style' => $props['blockStyle'],
                            'prefix' => $prefix
                        ]
                    )
                ),
                'border' => get_border_styles(
                    array(
                        'obj' => get_group_attributes(
                            $props,
                            array('border', 'borderWidth', 'borderRadius'),
                            false,
                            $prefix
                        ),
                        'block_style' => $props['blockStyle'],
                        'prefix' => $prefix
                    )
                ),
                'size' => get_size_styles(
                    get_group_attributes($props, 'size', false, $prefix),
                    $prefix
                ),
                'boxShadow' => get_box_shadow_styles(
                    array(
                        'obj' => get_group_attributes($props, 'boxShadow', false, $prefix),
                        'block_style' => $props['blockStyle'],
                        'prefix' => $prefix
                    )
                ),
                'padding' => get_margin_padding_styles(
                    array(
                        'obj' => get_group_attributes($props, 'padding', false, $prefix),
                        'prefix' => $prefix
                    )
                )
            );

            return $response;
        }

        public static function get_hover_styles($props, $prefix)
        {
            $block_style = $props['blockStyle'];

            $response = [
                'border' => array_key_exists('border-status-hover', $props) && $props['border-status-hover'] ? get_border_styles([
                    'obj' => get_group_attributes($props, ['border', 'borderWidth', 'borderRadius'], true),
                    'is_hover' => true,
                    'block_style' => $block_style,
                    'prefix' => $prefix
                ]) : null,
                'boxShadow' => array_key_exists('box-shadow-status-hover', $props) && $props['box-shadow-status-hover'] ? get_box_shadow_styles([
                    'obj' => get_group_attributes($props, 'boxShadow', true),
                    'is_hover' => true,
                    'block_style' => $block_style,
                    'prefix' => $prefix
                ]) : null,
            ];

            if(isset($props[$prefix . "background-status-hover"])) {
                $response['background'] = get_background_styles(
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
                            'is_hover' => true
                        ]
                    )
                );
            }

            return $response;
        }

        public static function get_active_styles($props, $prefix)
        {
            $block_style = $props['blockStyle'];

            $response = [
                'border' => array_key_exists('border-status-active', $props) && $props['border-status-hover'] ? get_border_styles([
                    'obj' => get_group_attributes($props, ['border', 'borderWidth', 'borderRadius'], true),
                    'block_style' => $block_style,
                    'prefix' => $prefix
                ]) : null,
                'boxShadow' => array_key_exists('box-shadow-status-active', $props) && $props['box-shadow-status-hover'] ? get_box_shadow_styles([
                    'obj' => get_group_attributes($props, 'boxShadow', true),
                    'block_style' => $block_style,
                    'prefix' => $prefix
                ]) : null,
            ];

            if(isset($props[$prefix . "background-status-active"])) {
                $response['background'] = get_background_styles(
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
                );
            }



            return $response;
        }
    }

endif;
