<?php
/**
 * MaxiBlocks Text Maxi Block Class
 *
 * @since   1.8.3
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block.php';



if (!class_exists('MaxiBlocks_List_Item_Maxi_Block')):
    class MaxiBlocks_List_Item_Maxi_Block extends MaxiBlocks_Block
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_List_Item_Maxi_Block
         */
        private static $instance;

        /**
         * Block name
         */
        protected $block_name = 'list-item-maxi';

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
                self::$instance = new MaxiBlocks_List_Item_Maxi_Block();
            }
        }

        /**
         * Get instance
         */
        public static function get_instance()
        {
            return self::$instance;
        }

        public static function get_styles($props, $customCss)
        {
            $uniqueID = $props['uniqueID'];
            $block_style = $props['blockStyle'];

            // transition
            $defaults = new StylesDefaults();
            $transition_default_canvas = $defaults->transitionDefault['canvas'];

            $block_class = ' .maxi-list-item-block';
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
                    $content_class => self::get_typography_object($props),
                    " $content_class:hover" => self::get_typography_hover_object($props),
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
            $custom_formats_styles = get_custom_formats_styles(
                $content_class,
                $props['custom-formats'] ?? [],
                get_group_attributes($props, 'typography'),
                null,
                $block_style,
                true,
            );
            $hover_custom_formats_styles = get_custom_formats_styles(
                ":hover $content_class",
                $props['custom-formats'] ?? [],
                get_group_attributes($props, ['typography', 'typographyHover']),
                null,
                $block_style,
                true,
            );
            $link_styles = array_merge(
                get_link_styles(
                    get_group_attributes($props, 'link'),
                    ' a ' . $content_class,
                    $block_style,
                ),
                get_link_styles(
                    get_group_attributes($props, 'link'),
                    $content_class . ' a',
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
            $block_name = (new self())->get_block_name();

            $response = [
                'border'    => get_border_styles([
                    'obj'         => get_group_attributes($props, [ 'border', 'borderWidth', 'borderRadius' ]),
                    'block_style' => $props['blockStyle'],
                ]),
                'size'      => get_size_styles(get_group_attributes($props, 'size'), $block_name),
                'boxShadow' => get_box_shadow_styles([
                    'obj'         => get_group_attributes($props, 'boxShadow'),
                    'block_style' => $props['blockStyle'],
                    'block_name'  => $block_name,
                ]),
                'opacity'   => get_opacity_styles(get_group_attributes($props, 'opacity')),
                'zIndex'    => get_zindex_styles(get_group_attributes($props, 'zIndex')),
                'position'  => get_position_styles(get_group_attributes($props, 'position')),
                'display'   => get_display_styles(get_group_attributes($props, 'display')),
                'margin'    => get_margin_padding_styles([
                    'obj' => get_group_attributes($props, 'margin'),
                ]),
                'padding'   => get_margin_padding_styles([
                    'obj' => get_group_attributes($props, 'padding'),
                ]),
                'overflow'  => get_overflow_styles(get_group_attributes($props, 'overflow')),
                'flex'      => get_flex_styles(get_group_attributes($props, 'flex')),
            ];

            return $response;
        }

        public static function get_hover_object($props)
        {
            $response = [
                'border'    => isset($props['border-status-hover']) && $props['border-status-hover'] ? get_border_styles([
                    'obj'         => get_group_attributes($props, [ 'border', 'borderWidth', 'borderRadius' ], true),
                    'is_hover'    => true,
                    'block_style' => $props['blockStyle'],
                ]) : null,
                'boxShadow' => isset($props['box-shadow-status-hover']) && $props['box-shadow-status-hover'] ? get_box_shadow_styles([
                    'obj'         => get_group_attributes($props, 'boxShadow', true),
                    'is_hover'    => true,
                    'block_style' => $props['blockStyle'],
                    'block_name'  => (new self())->get_block_name(),
                ]) : null,
                'opacity'   => isset($props['opacity-status-hover']) && $props['opacity-status-hover'] ? get_opacity_styles(get_group_attributes($props, 'opacity', true), true) : null,
            ];

            return $response;
        }

        public static function get_typography_object($props)
        {
            $response = [
                'typography' => get_typography_styles([
                    'obj'                    => get_group_attributes($props, 'typography'),
                    'block_style'            => $props['blockStyle'],
                    'disable_palette_defaults' => true,
                    'block_name'             => 'maxi-blocks/list-item-maxi',
                ]),
            ];

            return $response;
        }

        public static function get_typography_hover_object($props)
        {
            $response = [
                'typography' => get_typography_styles([
                    'obj'               => get_group_attributes($props, 'typographyHover'),
                    'is_hover'          => true,
                    'block_style'       => $props['blockStyle'],
                    'normal_typography' => get_group_attributes($props, 'typography'),
                ]),
            ];

            return $response;
        }
    }

endif;
