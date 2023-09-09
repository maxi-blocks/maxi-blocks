<?php
/**
 * MaxiBlocks Search Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block.php';


if (!class_exists('MaxiBlocks_Search_Maxi_Block')):
    class MaxiBlocks_Search_Maxi_Block extends MaxiBlocks_Block
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Search_Maxi_Block
         */
        private static $instance;

        /**
         * Block name
         */
        protected $block_name = 'search-maxi';

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
                self::$instance = new MaxiBlocks_Search_Maxi_Block();
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

            $data = [
                'customCss' => $customCss,
            ];


            $styles_obj = array(
                '' => self::get_normal_object($props),
                ' .maxi-search-block__input' => self::get_search_input_styles($props),
                ' .maxi-search-block__input::placeholder' => self::get_search_input_placeholder_styles($props),
                ' .maxi-search-block__button' => self::get_search_button_styles($props),
                ' .maxi-search-block__button__content' => self::get_search_button_content_styles($props),
                // Hover styles
                ':hover' => self::get_hover_object($props),
                ' .maxi-search-block__input:hover' => self::get_search_input_styles($props, true),
                ' .maxi-search-block__button:hover' => self::get_search_button_styles($props, true),
            );

            $styles_obj = array_merge($styles_obj, self::get_search_button_icon_styles($props));

            $button_hover = array(' .maxi-search-block__button:hover .maxi-search-block__button__content' => self::get_search_button_content_styles($props, true));

            $styles_obj = array_merge($styles_obj, $button_hover);

            $response = array(
                $uniqueID => style_processor($styles_obj, $data, $props)
            );

            return $response;
        }


        public static function get_normal_object($props)
        {
            $blockStyle = $props['blockStyle'] ?? null;

            $response = array(
                'border' => get_border_styles(array(
                    'obj' => array_merge(get_group_attributes($props, array('border', 'borderWidth', 'borderRadius'))),
                    'block_style' => $blockStyle,
                )),
                'margin' => get_margin_padding_styles(array(
                    'obj' => array_merge(get_group_attributes($props, 'margin')),
                )),
                'padding' => get_margin_padding_styles(array(
                    'obj' => array_merge(get_group_attributes($props, 'padding')),
                )),
                'size' => get_size_styles(array_merge(get_group_attributes($props, 'size'))),
                'boxShadow' => get_box_shadow_styles(array(
                    'obj' => array_merge(get_group_attributes($props, 'boxShadow')),
                    'block_style' => $blockStyle,
                )),
                'opacity' => get_opacity_styles(array_merge(get_group_attributes($props, 'opacity'))),
                'zIndex' => get_zindex_styles(array_merge(get_group_attributes($props, 'zIndex'))),
                'position' => get_position_styles(array_merge(get_group_attributes($props, 'position'))),
                'display' => get_display_styles(array_merge(get_group_attributes($props, 'display'))),
                'overflow' => get_overflow_styles(array_merge(get_group_attributes($props, 'overflow'))),
                'flex' => get_flex_styles(array_merge(get_group_attributes($props, 'flex'))),
            );

            return $response;
        }


        public static function get_hover_object($props)
        {
            $blockStyle = isset($props['blockStyle']) ? $props['blockStyle'] : null;

            $response = array(
                'border' => isset($props['border-status-hover'])
                    ? get_border_styles(
                        array(
                            'obj' => array_merge(get_group_attributes($props, array('border', 'borderWidth', 'borderRadius'), true)),
                            'is_hover' => true,
                            'block_style' => $blockStyle,
                        )
                    )
                    : null,
                'boxShadow' => isset($props['box-shadow-status-hover'])
                    ? get_box_shadow_styles(
                        array(
                            'obj' => array_merge(get_group_attributes($props, 'boxShadow', true)),
                            'is_hover' => true,
                            'block_style' => $blockStyle,
                        )
                    )
                    : null,
                'opacity' => isset($props['opacity-status-hover'])
                    ? get_opacity_styles(array_merge(get_group_attributes($props, 'opacity', true)), true)
                    : null,
            );

            return $response;
        }


        public static function get_search_button_styles($props, $isHover = false)
        {
            $blockStyle = $props['blockStyle'] ?? null;
            $buttonPrefix = 'button-';

            $response = array_merge(
                get_background_styles(array_merge(
                    get_group_attributes($props, array('background', 'backgroundColor'), $isHover, $buttonPrefix),
                    array('is_hover' => $isHover, 'block_style' => $blockStyle, 'prefix' => $buttonPrefix)
                )),
                array(
                    'border' => get_border_styles(array(
                        'obj' => array_merge(get_group_attributes($props, array('border', 'borderWidth', 'borderRadius'), $isHover, $buttonPrefix)),
                        'is_hover' => $isHover,
                        'prefix' => $buttonPrefix,
                        'block_style' => $blockStyle
                    ))
                ),
                $isHover ? array() : array(
                    'margin' => get_margin_padding_styles(array(
                        'obj' => array_merge(get_group_attributes($props, 'margin', false, $buttonPrefix)),
                        'prefix' => $buttonPrefix
                    )),
                    'padding' => get_margin_padding_styles(array(
                        'obj' => array_merge(get_group_attributes($props, 'padding', false, $buttonPrefix)),
                        'prefix' => $buttonPrefix
                    ))
                )
            );

            return $response;
        }


        public static function get_search_button_icon_styles($props)
        {
            $blockStyle = $props['blockStyle'] ?? null;
            $buttonSkin = $props['buttonSkin'] ?? null;
            $skin = $props['skin'] ?? null;
            $closeIconPrefix = 'close-';

            $searchButtonIsIcon = $buttonSkin === 'icon';

            $defaultIconHelperProps = array(
                'obj' => $props,
                'block_style' => $blockStyle,
                'target' => ' .maxi-search-block__button__default-icon',
                'wrapper_target' => ' .maxi-search-block__button',
            );

            $closeIconHelperProps = array(
                'obj' => $props,
                'block_style' => $blockStyle,
                'target' => ' .maxi-search-block__button__close-icon',
                'wrapper_target' => ' .maxi-search-block__button',
                'prefix' => $closeIconPrefix,
            );

            $response = $searchButtonIsIcon ? array_merge(
                get_button_icon_styles($defaultIconHelperProps),
                get_button_icon_styles(array_merge($defaultIconHelperProps, array('is_hover' => true))),
                $skin === 'icon-reveal' ? array_merge(
                    get_button_icon_styles($closeIconHelperProps),
                    get_button_icon_styles(array_merge($closeIconHelperProps, array('is_hover' => true)))
                ) : array()
            ) : array();

            return $response;
        }

        public static function get_search_button_content_styles($props, $isHover = false)
        {
            $blockStyle = $props['blockStyle'] ?? null;
            $buttonPrefix = 'button-';

            $response = array(
                'typography' => get_typography_styles(array(
                    'obj' => array_merge(get_group_attributes($props, 'typography', $isHover, $buttonPrefix)),
                    'is_hover' => $isHover,
                    'block_style' => $blockStyle,
                    'prefix' => $buttonPrefix,
                ))
            );

            return $response;
        }

        public static function get_search_input_styles($props, $isHover = false)
        {
            $blockStyle = $props['blockStyle'] ?? null;
            $inputPrefix = 'input-';

            $response = array_merge(
                get_background_styles(array_merge(
                    get_group_attributes($props, array('background', 'backgroundColor'), $isHover, $inputPrefix),
                    array('is_hover' => $isHover, 'prefix' => $inputPrefix, 'block_style' => $blockStyle)
                )),
                array(
                    'border' => get_border_styles(array(
                        'obj' => array_merge(get_group_attributes($props, array('border', 'borderWidth', 'borderRadius'), $isHover, $inputPrefix)),
                        'is_hover' => $isHover,
                        'prefix' => $inputPrefix,
                        'block_style' => $blockStyle
                    ))
                ),
                $isHover ? array() : array(
                    'padding' => get_margin_padding_styles(array(
                        'obj' => array_merge(get_group_attributes($props, 'padding', false, $inputPrefix)),
                        'prefix' => $inputPrefix
                    )),
                ),
                array(
                    'typography' => get_typography_styles(array(
                        'obj' => array_merge(get_group_attributes($props, 'typography', $isHover, $inputPrefix)),
                        'block_style' => $blockStyle,
                        'is_hover' => $isHover,
                        'prefix' => $inputPrefix,
                    ))
                )
            );

            return $response;
        }

        public static function get_search_input_placeholder_styles($props)
        {
            $blockStyle = $props['blockStyle'] ?? null;
            $breakpoints = array('general', 'xxl', 'xl', 'l', 'm', 's', 'xs');
            $response = array();

            foreach ($breakpoints as $breakpoint) {
                $paletteStatus = get_last_breakpoint_attribute(array(
                    'target' => 'placeholder-palette-status',
                    'attributes' => $props,
                    'breakpoint' => $breakpoint
                ));

                $paletteColor = get_last_breakpoint_attribute(array(
                    'target' => 'placeholder-palette-color',
                    'attributes' => $props,
                    'breakpoint' => $breakpoint
                ));

                $paletteOpacity = get_last_breakpoint_attribute(array(
                    'target' => 'placeholder-palette-opacity',
                    'attributes' => $props,
                    'breakpoint' => $breakpoint
                ));

                $color = get_last_breakpoint_attribute(array(
                    'target' => 'placeholder-color',
                    'attributes' => $props,
                    'breakpoint' => $breakpoint
                ));

                if ($paletteStatus) {
                    $response[$breakpoint] = array(
                        'color' => get_color_rgba_string(array(
                            'first_var' => 'color-'.$paletteColor,
                            'opacity' => $paletteOpacity,
                            'block_style' => $blockStyle
                        ))
                    );
                } elseif ($color) {
                    $response[$breakpoint] = array(
                        'color' => $color
                    );
                }
            }

            return array(
                'placeholder' => $response
            );
        }


    }

endif;
