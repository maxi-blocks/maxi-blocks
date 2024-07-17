<?php
/**
 * MaxiBlocks Row Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block.php';


if (!class_exists('MaxiBlocks_Row_Maxi_Block')):
    class MaxiBlocks_Row_Maxi_Block extends MaxiBlocks_Block
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Row_Maxi_Block
         */
        private static $instance;

        /**
         * Block name
         */
        protected $block_name = 'row-maxi';

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
                self::$instance = new MaxiBlocks_Row_Maxi_Block();
            }
        }

        /**
         * Get instance
         */
        public static function get_instance()
        {
            return self::$instance;
        }

        public function get_styles($props, $data)
        {
            $uniqueID = $props['uniqueID'];
            $block_style = $props['blockStyle'];

            $styles_obj = [
                '' => self::get_normal_object($props),
                ':hover' => self::get_hover_object($props),
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

            $pagination_styles = !empty($props['cl-pagination']) ? [
                ' .maxi-pagination' => get_pagination_styles($props),
                ' .maxi-pagination a' => get_pagination_links_styles($props),
                ' .maxi-pagination .maxi-pagination__pages > span' => get_pagination_links_styles($props),
                ' .maxi-pagination a:hover' => get_pagination_colours($props, 'hover'),
                ' .maxi-pagination .maxi-pagination__pages > span.maxi-pagination__link--current' => get_pagination_colours($props, 'current'),
            ] : [];

            $styles_obj = array_merge_recursive(
                $styles_obj,
                $background_styles,
                $background_hover_styles,
                $pagination_styles
            );

            $response = [
                $uniqueID => style_processor(
                    $styles_obj,
                    $data,
                    $props,
                ),
            ];

            return $response;
        }

        public static function get_normal_object($props)
        {
            $block_style = $props['blockStyle'];
            $block_name = (new self())->get_block_name();

            $response = [
                'boxShadow' => get_box_shadow_styles([
                    'obj' => get_group_attributes($props, 'boxShadow'),
                    'block_style' => $block_style,
                    'block_name' => $block_name,
                ]),
                'border' => get_border_styles([
                    'obj' => get_group_attributes($props, ['border', 'borderWidth', 'borderRadius']),
                    'block_style' => $block_style
                ]),
                'size' => get_size_styles(get_group_attributes($props, 'size'), $block_name),
                'margin' => get_margin_padding_styles([
                    'obj' => get_group_attributes($props, 'margin')
                ]),
                'padding' => get_margin_padding_styles([
                    'obj' => get_group_attributes($props, 'padding')
                ]),
                'opacity' => get_opacity_styles(get_group_attributes($props, 'opacity')),
                'zIndex' => get_zindex_styles(get_group_attributes($props, 'zIndex')),
                'position' => get_position_styles(get_group_attributes($props, 'position')),
                'display' => get_display_styles(get_group_attributes($props, 'display')),
                'row' => ['general' => []],
                'overflow' => get_overflow_styles(get_group_attributes($props, 'overflow')),
                'flex' => get_flex_styles(get_group_attributes($props, 'flex'))
            ];

            return $response;
        }

        public static function get_hover_object($props)
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
                    'block_style' => $block_style,
                    'block_name' => (new self())->get_block_name(),
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
