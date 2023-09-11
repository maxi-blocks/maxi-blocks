<?php
/**
 * MaxiBlocks Divider Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block.php';


if (!class_exists('MaxiBlocks_Divider_Maxi_Block')):
    class MaxiBlocks_Divider_Maxi_Block extends MaxiBlocks_Block
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Divider_Maxi_Block
         */
        private static $instance;

        /**
         * Block name
         */
        protected $block_name = 'divider-maxi';

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
                self::$instance = new MaxiBlocks_Divider_Maxi_Block();
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
                    ' hr.maxi-divider-block__divider:hover' => self::get_hover_object($props),
                    ' hr.maxi-divider-block__divider' => self::get_divider_object($props),
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

        public static function get_wrapper_object($props)
        {
            $block_style = $props['blockStyle'];

            $response =
                [
                    'border' => get_border_styles(array(
                        'obj' => get_group_attributes($props, array(
                            'border',
                            'borderWidth',
                            'borderRadius',
                        )),
                        'block_style' => $block_style,
                    )),
                    'boxShadow' => get_box_shadow_styles(array(
                        'obj' => get_group_attributes($props, 'boxShadow'),
                        'block_style' => $block_style,
                    )),
                    'size' => get_size_styles(get_group_attributes($props, 'size')),
                    'margin' => get_margin_padding_styles([
                        'obj' => get_group_attributes($props, 'margin'),
                    ]),
                    'padding' => get_margin_padding_styles([
                        'obj' => get_group_attributes($props, 'padding'),
                    ]),
                    'zIndex' => get_zindex_styles(get_group_attributes($props, 'zIndex')),
                    'position' => get_position_styles(get_group_attributes($props, 'position')),
                    'display' => get_display_styles(get_group_attributes($props, 'display')),
                    'opacity' => get_opacity_styles(get_group_attributes($props, 'opacity')),
                    'divider' => get_divider_styles(get_group_attributes($props, 'divider'), null, $block_style),
                    'overflow' => get_overflow_styles(get_group_attributes($props, 'overflow')),
                    'flex' => get_flex_styles(get_group_attributes($props, 'flex')),
                ];

            return $response;
        }

        public static function get_hover_wrapper_object($props)
        {
            $block_style = $props['blockStyle'];

            $response = [
                'border' => array_key_exists('border-status-hover', $props) && $props['border-status-hover'] ? get_border_styles([
                    'obj' => get_group_attributes($props, ['border', 'borderWidth', 'borderRadius'], true),
                    'is_hover' => true,
                    'block_style' => $block_style
                ]) : null,
                'boxShadow' => array_key_exists('box-shadow-status-hover', $props) && $props['box-shadow-status-hover'] ? get_box_shadow_styles([
                    'obj' => get_group_attributes($props, 'boxShadow', true),
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
        
        public static function get_divider_object($props)
        {
            $block_style = $props['blockStyle'];
    
            $response = [
                'boxShadow' => get_box_shadow_styles(array(
                    'obj' => get_group_attributes($props, 'boxShadow', false, 'divider-'),
                    'block_style' => $block_style,
                    'prefix' => 'divider-',
                )),
                'divider' => get_divider_styles(get_group_attributes($props, 'divider'), 'line', $block_style),
            ];
    
            return $response;
        }

        public static function get_hover_object($props)
        {
            $block_style = $props['blockStyle'];

            $response = [
                'boxShadow' => array_key_exists('box-shadow-status-hover', $props) && $props['box-shadow-status-hover'] ? get_box_shadow_styles([
                    'obj' => get_group_attributes($props, 'boxShadow', true, 'divider-'),
                    'is_hover' => true,
                    'block_style' => $block_style,
                    'prefix' => 'divider-',
                ]) : null,
            ];

            return $response;
        }
    }


endif;
