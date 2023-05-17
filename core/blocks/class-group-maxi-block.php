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
require_once MAXI_PLUGIN_DIR_PATH .
    'core/blocks/utils/get_group_attributes.php';
require_once MAXI_PLUGIN_DIR_PATH .
    'core/blocks/style-helpers/get_margin_padding_styles.php';
require_once MAXI_PLUGIN_DIR_PATH .
    'core/blocks/utils/style_processor.php';

if (!class_exists('MaxiBlocks_Group_Maxi_Block')):
    class MaxiBlocks_Group_Maxi_Block extends MaxiBlocks_Block
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Group_Maxi_Block
         */
        private static $instance;

        /**
         * Block name
         */
        protected $block_name = 'group-maxi';

        /**
         * Registers the plugin.
         */
        public static function register()
        {
            if (null === self::$instance) {
                self::$instance = new MaxiBlocks_Group_Maxi_Block();
            }
        }
        
        public static function get_styles($props)
        {
            $uniqueID = $props['uniqueID'];

            $data = [
                'customCss' => [
                    'selectors' => [
                        'group' => [
                            'normal' => ['label' => 'group', 'target' => ''],
                            'hover' => [
                                'label' => 'group on hover',
                                'target' => ':hover',
                            ],
                        ],
                        'before group' => [
                            'normal' => [
                                'label' => 'group ::before',
                                'target' => '::before',
                            ],
                            'hover' => [
                                'label' => 'group ::before on hover',
                                'target' => ':hover::before',
                            ],
                        ],
                        'after group' => [
                            'normal' => [
                                'label' => 'group ::after',
                                'target' => '::after',
                            ],
                            'hover' => [
                                'label' => 'group ::after on hover',
                                'target' => ':hover::after',
                            ],
                        ],
                    ],
                    'categories' => [
                        'group',
                        'before group',
                        'after group',
                        'background',
                        'background hover',
                    ],
                ],
            ];

            $response = style_processor(
                [
                    $uniqueID => [
                        '' => self::get_normal_styles($props),
                    ],
                ],
                $data,
                $props,
            );

            return $response;
        }

        public static function get_normal_styles($props)
        {
            $response =
                [
                    'margin' => get_margin_padding_styles([
                        'obj' => get_group_attributes($props, 'margin'),
                    ]),
                    'padding' => get_margin_padding_styles([
                        'obj' => get_group_attributes($props, 'padding'),
                    ]),
                    // 'border' => get_border_styles(array(
                    //     'obj' => array_merge(get_group_attributes($props, array(
                    //         'border',
                    //         'borderWidth',
                    //         'borderRadius',
                    //     ))),
                    //     'blockStyle' => $props['blockStyle'],
                    // )),
                    // 'size' => get_size_styles(array_merge(get_group_attributes($props, 'size'))),
                    // 'boxShadow' => get_box_shadow_styles(array(
                    //     'obj' => array_merge(get_group_attributes($props, 'boxShadow')),
                    //     'blockStyle' => $props['blockStyle'],
                    // )),
                    // 'opacity' => get_opacity_styles(array_merge(get_group_attributes($props, 'opacity'))),
                    // 'zIndex' => get_z_index_styles(array_merge(get_group_attributes($props, 'zIndex'))),
                    // 'position' => get_position_styles(array_merge(get_group_attributes($props, 'position'))),
                    // 'display' => get_display_styles(array_merge(get_group_attributes($props, 'display'))),
                    // 'overflow' => get_overflow_styles(array_merge(get_group_attributes($props, 'overflow'))),
                    // 'flex' => get_flex_styles(array_merge(get_group_attributes($props, 'flex'))),
                ];

            return $response;
        }
    }

endif;