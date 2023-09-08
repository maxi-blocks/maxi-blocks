<?php
/**
 * MaxiBlocks Map Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block.php';


if (!class_exists('MaxiBlocks_Map_Maxi_Block')):
    class MaxiBlocks_Map_Maxi_Block extends MaxiBlocks_Block
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Map_Maxi_Block
         */
        private static $instance;

        /**
         * Block name
         */
        protected $block_name = 'map-maxi';

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
                self::$instance = new MaxiBlocks_Map_Maxi_Block();
            }
        }

        /**
         * Get instance
         */
        public static function get_instance()
        {
            return self::$instance;
        }

        public function get_styles($props, $customCss)
        {
            $uniqueID = $props['uniqueID'];
            $blockStyle = $props['blockStyle'];

            $data = [
                'customCss' => $customCss,
            ];


            $response = array(
                $uniqueID => style_processor(
                    array(
                        '' => self::get_normal_object($props),
                        ':hover' => self::get_hover_object($props),
                        ' .maxi-map-block__popup__content__title' => self::get_popup_typography_styles($props, true),
                        ' .maxi-map-block__popup__content__description' => self::get_popup_typography_styles($props),
                        ' .maxi-map-block__popup' => array_merge(
                            array(
                                'boxShadow' => get_box_shadow_styles(
                                    array(
                                        'obj' => get_group_attributes($props, 'boxShadow', false, 'popup-'),
                                        'block_style' => $blockStyle,
                                        'prefix' => 'popup-',
                                    )
                                )
                            ),
                            get_background_styles(
                                array_merge(
                                    get_group_attributes($props, array('background', 'backgroundColor'), false, 'popup-'),
                                    array(
                                        'block_style' => $blockStyle,
                                        'prefix' => 'popup-',
                                    )
                                )
                            )
                        ),
                        ' .maxi-map-block__popup:before' => get_background_styles(
                            array_merge(
                                get_group_attributes($props, array('background', 'backgroundColor'), false, 'popup-'),
                                array(
                                    'block_style' => $blockStyle,
                                    'prefix' => 'popup-',
                                    'background_color_property' => 'border-top-color',
                                )
                            )
                        ),
                        ' .leaflet-marker-icon' => get_svg_width_styles(
                            array(
                                'obj' => get_group_attributes($props, 'svg'),
                                'prefix' => 'svg-',
                            )
                        ),
                        ' .leaflet-popup-content-wrapper' => self::get_adjusted_position_popup_styles($props),
                        get_svg_styles(
                            array(
                                'obj' => get_group_attributes($props, 'svg'),
                                'target' => ' .leaflet-marker-icon',
                                'block_style' => $blockStyle,
                            )
                        ),
                    ),
                    $data,
                    $props
                )
            );

            return $response;
        }


        public static function get_normal_object($props)
        {

            $blockStyle = $props['blockStyle'];

            $response = array(
                'border' => get_border_styles(
                    array(
                        'obj' => get_group_attributes($props, array('border', 'borderWidth', 'borderRadius')),
                        'block_style' => $blockStyle,
                    )
                ),
                'boxShadow' => get_box_shadow_styles(
                    array(
                        'obj' => get_group_attributes($props, 'boxShadow'),
                        'block_style' => $blockStyle,
                    )
                ),
                'size' => get_size_styles(get_group_attributes($props, 'size')),
                'margin' => get_margin_padding_styles(
                    array(
                        'obj' => get_group_attributes($props, 'margin'),
                    )
                ),
                'padding' => get_margin_padding_styles(
                    array(
                        'obj' => get_group_attributes($props, 'padding'),
                    )
                ),
                'opacity' => get_opacity_styles(get_group_attributes($props, 'opacity')),
                'zIndex' => get_zindex_styles(get_group_attributes($props, 'zIndex')),
                'position' => get_position_styles(get_group_attributes($props, 'position')),
                'display' => get_display_styles(get_group_attributes($props, 'display')),
                'overflow' => get_overflow_styles(get_group_attributes($props, 'overflow')),
                'flex' => get_flex_styles(get_group_attributes($props, 'flex')),
            );

            return $response;
        }

        public static function get_hover_object($props)
        {
            $blockStyle = $props['blockStyle'] ?? null;

            $response = array(
                'border' => isset($props['border-status-hover']) ?
                    get_border_styles(array(
                        'obj' => array_merge(get_group_attributes($props, array('border', 'borderWidth', 'borderRadius'), true)),
                        'is_hover' => true,
                        'block_style' => $blockStyle,
                    )) : null,
                'boxShadow' => isset($props['box-shadow-status-hover']) ?
                    get_box_shadow_styles(array(
                        'obj' => array_merge(get_group_attributes($props, 'boxShadow', true)),
                        'is_hover' => true,
                        'block_style' => $blockStyle,
                    )) : null,
                'opacity' => isset($props['opacity-status-hover']) ?
                    get_opacity_styles(array_merge(get_group_attributes($props, 'opacity', true)), true) : null,
            );

            return $response;
        }

        public static function get_popup_typography_styles($props, $isTitle = false)
        {
            $blockStyle = $props['blockStyle'];
            $prefix = $isTitle ? '' : 'description-';

            $textLevel = $isTitle
                ? (isset($props['map-marker-heading-level']) ? $props['map-marker-heading-level'] : null)
                : 'p';

            $response = array(
                $isTitle ? 'typography' : 'typographyDescription' => get_typography_styles(
                    array(
                        'obj' => array_merge(get_group_attributes($props, 'typography', false, $prefix)),
                        'block_style' => $blockStyle,
                        'prefix' => $prefix,
                        'text_level' => $textLevel,
                    )
                )
            );

            return $response;
        }

        public function get_adjusted_position_popup_styles($props)
        {
            $response = array();
            $breakpoints = array('general', 'xxl', 'xl', 'l', 'm', 's', 'xs');

            foreach ($breakpoints as $breakpoint) {
                $response[$breakpoint] = array(
                    'margin-left' => get_last_breakpoint_attribute(array(
                        'target' => 'svg-width',
                        'breakpoint' => $breakpoint,
                        'attributes' => $props,
                    )) * 0.85 . 'px',
                );
            }

            return array(
                'popup_position' => $response,
            );
        }


    }

endif;
