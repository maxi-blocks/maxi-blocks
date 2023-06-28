<?php
/**
 * MaxiBlocks Slider Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block.php';


if (!class_exists('MaxiBlocks_Slide_Maxi_Block')):
    class MaxiBlocks_Slide_Maxi_Block extends MaxiBlocks_Block
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Slide_Maxi_Block
         */
        private static $instance;

        /**
         * Block name
         */
        protected $block_name = 'slide-maxi';

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
                self::$instance = new MaxiBlocks_Slide_Maxi_Block();
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

            $data = [
                'customCss' => $customCss,
            ];


            $slideStyles = style_processor(
                array(
                    '' => self::get_normal_object($props),
                    ':hover' => self::get_hover_object($props)
                ) + get_block_background_styles(array_merge(
                    get_group_attributes($props, array('blockBackground', 'border', 'borderWidth', 'borderRadius')),
                    array('block_style' => $props['blockStyle'])
                )) + get_block_background_styles(array_merge(
                    get_group_attributes($props, array('blockBackground', 'border', 'borderWidth', 'borderRadius'), true),
                    array('is_hover' => true, 'block_style' => $props['blockStyle'])
                )),
                $data,
                $props
            );

            $response = array(
                $uniqueID => $slideStyles,
                // On frontend styles are applied by id of the block,
                // this makes clones of the block have the same style as the block, while having different id
                $uniqueID . '-clone' => $slideStyles
            );

            return $response;
        }

        public static function get_normal_object($props)
        {
            $response = array(
                'boxShadow' => get_box_shadow_styles(array(
                    'obj' => get_group_attributes($props, 'boxShadow'),
                    'block_style' => $props['blockStyle']
                )),
                'border' => get_border_styles(array(
                    'obj' => get_group_attributes($props, array('border', 'borderWidth', 'borderRadius')),
                    'block_style' => $props['blockStyle']
                )),
                'padding' => get_margin_padding_styles(array(
                    'obj' => get_group_attributes($props, 'padding')
                )),
                'margin' => get_margin_padding_styles(array(
                    'obj' => get_group_attributes($props, 'margin')
                )),
                'opacity' => get_opacity_styles(get_group_attributes($props, 'opacity')),
                'zIndex' => get_zindex_styles(get_group_attributes($props, 'zIndex')),
                'display' => get_display_styles(get_group_attributes($props, 'display')),
                'size' => get_size_styles(get_group_attributes($props, 'size')),
                'overflow' => get_overflow_styles(get_group_attributes($props, 'overflow')),
                'flex' => get_flex_styles(get_group_attributes($props, 'flex'))
            );

            return $response;
        }

        public static function get_hover_object($props)
        {
            $response = array(
                'border' => !empty($props['border-status-hover']) ? get_border_styles(array(
                    'obj' => get_group_attributes($props, array('border', 'borderWidth', 'borderRadius'), true),
                    'is_hover' => true,
                    'block_style' => $props['blockStyle']
                )) : null,
                'boxShadow' => !empty($props['box-shadow-status-hover']) ? get_box_shadow_styles(array(
                    'obj' => get_group_attributes($props, 'boxShadow', true),
                    'is_hover' => true,
                    'block_style' => $props['blockStyle']
                )) : null,
            );

            return $response;
        }

    }

endif;
