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


if (!class_exists('MaxiBlocks_Slider_Maxi_Block')):
    class MaxiBlocks_Slider_Maxi_Block extends MaxiBlocks_Block
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Slider_Maxi_Block
         */
        private static $instance;

        /**
         * Block name
         */
        protected $block_name = 'slider-maxi';

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
                self::$instance = new MaxiBlocks_Slider_Maxi_Block();
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
            $block_style = $props['blockStyle'];
            $arrow_icon_hover_status = $props['navigation-arrow-both-icon-status-hover'];


            $data = [
                'customCss' => $customCss,
            ];

            $styles_obj = [
                $uniqueID => [
                    '' => self::get_normal_object($props),
                    ':hover' => self::get_hover_object($props),
                ],
            ];

            $background_styles = get_block_background_styles(array_merge(
                get_group_attributes($props, ['blockBackground', 'border', 'borderWidth', 'borderRadius']),
                ['block_style' => $block_style]
            ));

            $background_hover_styles = get_block_background_styles(array_merge(
                get_group_attributes($props, ['blockBackground', 'border', 'borderWidth', 'borderRadius'], true),
                ['is_hover' => true, 'block_style' => $block_style]
            ));

            $styles_obj[$uniqueID] = array_merge_recursive(
                $styles_obj[$uniqueID],
                $background_styles,
                $background_hover_styles,
                self::get_dots_icon_object($props),
                self::get_arrow_icon_object($props),
                $arrow_icon_hover_status ? self::get_arrow_icon_object($props, true) : [],
            );


            $response = style_processor(
                $styles_obj,
                $data,
                $props
            );


            return $response;
        }

        public static function get_normal_object($props)
        {
            $response = [
                'boxShadow' => get_box_shadow_styles([
                    'obj' => array_merge(get_group_attributes($props, 'boxShadow')),
                    'block_style' => $props['blockStyle'],
                ]),
                'border' => get_border_styles([
                    'obj' => array_merge(get_group_attributes($props, ['border', 'borderWidth', 'borderRadius'])),
                    'block_style' => $props['blockStyle'],
                ]),
                'size' => get_size_styles(array_merge(get_group_attributes($props, 'size'))),
                'margin' => get_margin_padding_styles([
                    'obj' => array_merge(get_group_attributes($props, 'margin')),
                ]),
                'padding' => get_margin_padding_styles([
                    'obj' => array_merge(get_group_attributes($props, 'padding')),
                ]),
                'opacity' => get_opacity_styles(array_merge(get_group_attributes($props, 'opacity'))),
                'zIndex' => get_zindex_styles(array_merge(get_group_attributes($props, 'zIndex'))),
                'position' => get_position_styles(array_merge(get_group_attributes($props, 'position'))),
                'display' => get_display_styles(array_merge(get_group_attributes($props, 'display'))),
                'overflow' => get_overflow_styles(array_merge(get_group_attributes($props, 'overflow'))),
                'flex' => get_flex_styles(array_merge(get_group_attributes($props, 'flex'))),
            ];

            return $response;
        }

        public static function get_hover_object($props)
        {
            $response = array(
                'border' =>
                    array_key_exists('border-status-hover', $props) &&
                    get_border_styles(array(
                        'obj' => array_merge(
                            get_group_attributes($props, array('border', 'borderWidth', 'borderRadius'), true)
                        ),
                        'is_hover' => true,
                        'block_style' => $props['blockStyle']
                    )),
                'boxShadow' =>
                    array_key_exists('box-shadow-status-hover', $props) &&
                    get_box_shadow_styles(array(
                        'obj' => array_merge(
                            get_group_attributes($props, 'boxShadow', true)
                        ),
                        'is_hover' => true,
                        'block_style' => $props['blockStyle']
                    ))
            );

            return $response;
        }

        public static function get_icon_styles($props, $prefix = 'navigation-arrow-both-')
        {
            $iconPrefix = $prefix . 'icon-';

            $response = array(
                'background' =>
                    array_key_exists($iconPrefix . 'status-background', $props) &&
                    $props[$iconPrefix . 'background-active-media-general'] === 'color' ? array_merge(
                        get_color_background_object(array_merge(
                            get_group_attributes($props, array('icon', 'iconBackgroundColor'), false, $prefix),
                            get_group_attributes($props, array('background', 'backgroundColor')),
                            array(
                                'prefix' => $iconPrefix,
                                'block_style' => $props['blockStyle'],
                                'is_icon' => true
                            )
                        ))
                    ) : null,
                'gradient' =>
                    array_key_exists($iconPrefix . 'status-background', $props) &&
                    $props[$iconPrefix . 'background-active-media-general'] === 'gradient' ? array_merge(
                        get_gradient_background_object(array_merge(
                            get_group_attributes($props, array('icon', 'iconBackground', 'iconBackgroundGradient'), false, $prefix),
                            array(
                                'prefix' => $iconPrefix,
                                'is_icon' => true
                            )
                        ))
                    ) : null,
                'boxShadow' =>
                    array_key_exists($iconPrefix . 'status-shadow', $props) ?
                    get_box_shadow_styles(array(
                        'obj' => array_merge(
                            get_group_attributes($props, 'iconBoxShadow', false, $prefix)
                        ),
                        'prefix' => $iconPrefix,
                        'block_style' => $props['blockStyle']
                    )) : null,
                'border' =>
                    array_key_exists($iconPrefix . 'status-border', $props) ?
                    get_border_styles(array(
                        'obj' => array_merge(
                            get_group_attributes($props, array('iconBorder', 'iconBorderWidth', 'iconBorderRadius'), false, $prefix)
                        ),
                        'prefix' => $iconPrefix,
                        'block_style' => $props['blockStyle']
                    )) : null,
                'padding' => get_margin_padding_styles(array(
                    'obj' => array_merge(
                        get_group_attributes($props, 'iconPadding', false, $prefix)
                    ),
                    'prefix' => $iconPrefix
                ))
            );

            return $response;
        }

        public static function get_icon_hover_styles($props, $prefix)
        {
            $iconPrefix = $prefix . 'icon-';
            $iconHoverStatus = isset($props[$iconPrefix . 'status-hover']) ? $props[$iconPrefix . 'status-hover'] : null;
            $iconHoverActiveMedia = isset($props[$iconPrefix . 'background-active-media-general-hover']) ? $props[$iconPrefix . 'background-active-media-general-hover'] : null;

            if($iconHoverStatus) {
                $response = array(
                    'background' => $iconHoverActiveMedia === 'color' ? array_merge(
                        get_color_background_object(array_merge(
                            get_group_attributes($props, array('icon', 'iconBackgroundColor'), true, $prefix),
                            get_group_attributes($props, array('background', 'backgroundColor'), true),
                            array(
                                'prefix' => $iconPrefix,
                                'block_style' => $props['blockStyle'],
                                'is_hover' => true,
                                'is_icon' => true
                            )
                        ))
                    ) : null,
                    'gradient' => $iconHoverActiveMedia === 'gradient' ? array_merge(
                        get_gradient_background_object(array_merge(
                            get_group_attributes($props, array('icon', 'iconBackground', 'iconBackgroundGradient'), true, $prefix),
                            array(
                                'prefix' => $iconPrefix,
                                'is_hover' => true,
                                'is_icon' => true
                            )
                        ))
                    ) : null,
                    'border' => get_border_styles(array(
                        'obj' => array_merge(
                            get_group_attributes($props, array('iconBorder', 'iconBorderWidth', 'iconBorderRadius'), true, $prefix)
                        ),
                        'prefix' => $iconPrefix,
                        'block_style' => $props['blockStyle'],
                        'is_hover' => true
                    ))
                );
            } else {
                $response = array();
            }

            return $response;
        }

        public static function get_icon_spacing($props, $icon, $isHover = false, $prefix = 'navigation-arrow-both-')
        {
            $response = array(
                'padding' => get_margin_padding_styles(array(
                    'obj' => get_group_attributes($props, 'padding', $isHover, $prefix),
                    'prefix' => $prefix . 'icon-'
                ))
            );

            $responsive = array(
                'label' => 'Icon responsive',
                'general' => array()
            );

            $breakpoints = array('general', 'xxl', 'xl', 'l', 'm', 's', 'xs');

            foreach($breakpoints as $breakpoint) {
                $responsive[$breakpoint] = array();

                $horizontalSpacing = get_last_breakpoint_attribute(array(
                    'target' => $prefix . 'icon-spacing-horizontal',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props,
                    'is_hover' => $isHover
                ));

                $verticalSpacing = get_last_breakpoint_attribute(array(
                    'target' => $prefix . 'icon-spacing-vertical',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props,
                    'is_hover' => $isHover
                ));

                if(!is_null($horizontalSpacing)) {
                    if($icon === 'prev') {
                        $responsive[$breakpoint]['left'] =  -(float)$horizontalSpacing . 'px';
                    }
                    if($icon === 'next') {
                        $responsive[$breakpoint]['right'] =  -(float)$horizontalSpacing . 'px';
                    }
                    if($icon === 'dots') {
                        $responsive[$breakpoint]['left'] = $horizontalSpacing . '%';
                    }
                }

                if(!is_null($verticalSpacing)) {
                    $responsive[$breakpoint]['top'] = $verticalSpacing . '%';
                }
            }

            $response['iconResponsive'] = $responsive;



            return $response;
        }

        public static function get_icon_spacing_between($props, $prefix = 'navigation-dot-', $isHover = false)
        {
            $response = array();

            $responsive = array(
                'label' => 'Icon responsive',
                'general' => array()
            );

            $breakpoints = array('general', 'xxl', 'xl', 'l', 'm', 's', 'xs');

            foreach($breakpoints as $breakpoint) {
                $responsive[$breakpoint] = array();

                $attributeName = $prefix . 'icon-spacing-between-' . $breakpoint . ($isHover ? '-hover' : '');

                if(isset($props[$attributeName])) {
                    $responsive[$breakpoint]['margin-right'] = get_last_breakpoint_attribute(array(
                        'target' => $prefix . 'icon-spacing-between',
                        'breakpoint' => $breakpoint,
                        'attributes' => $props,
                        'is_hover' => $isHover
                    )) . 'px';
                }
            }

            $response['iconResponsive'] = $responsive;

            return $response;
        }

        public static function get_disabled_styles($props, $prefix)
        {
            $response = array(
                'iconDisplay' => array()
            );

            $breakpoints = array('general', 'xxl', 'xl', 'l', 'm', 's', 'xs');

            foreach($breakpoints as $breakpoint) {
                $response['iconDisplay'][$breakpoint] = array();

                $isEnabled = get_last_breakpoint_attribute(array(
                    'target' => $prefix . 'status',
                    'breakpoint' => $breakpoint,
                    'attributes' => $props,
                    'force_single' => true
                ));

                if(!is_null($isEnabled) && !$isEnabled) {
                    $response['iconDisplay'][$breakpoint] = array('display' => 'none');
                }
            }

            return $response;
        }

        public static function get_icon_object($props, $prefix, $target, $is_hover = false)
        {
            $hover_flag = $is_hover ? ':hover' : '';
            $full_target = $target . $hover_flag;
            $is_active = strpos($prefix, 'active') !== false;

            $response = array_merge(
                get_svg_styles(array(
                    'obj' => $props,
                    'target' => $full_target,
                    'block_style' => $props['blockStyle'],
                    'prefix' => $prefix . 'icon-',
                    'is_hover' => $is_hover
                )),
                array($full_target . ' svg path' => get_icon_path_styles($props, $is_hover, $prefix))
            );

            if(!$is_hover) {
                $response[$full_target] = array_merge(
                    self::get_icon_styles($props, $prefix),
                    self::get_disabled_styles(
                        get_group_attributes($props, 'navigation'),
                        $prefix
                    )
                );
            }

            if($is_hover) {
                $response[$full_target] = self::get_icon_hover_styles($props, $prefix);
            }

            if(!$is_active) {
                $response[$full_target . ' svg'] = get_icon_size($props, $is_hover, $prefix);
            }

            return $response;
        }

        public static function get_arrow_icon_object($props, $is_hover = false)
        {
            $hover_flag = $is_hover ? ':hover' : '';
            $prefix = 'navigation-arrow-both-';
            $target = ' .maxi-slider-block__arrow';

            $response = array();

            foreach(array('prev', 'next') as $curr) {
                $response[$target . '--' . $curr . $hover_flag] = self::get_icon_spacing($props, $curr, $is_hover, $prefix);
            }

            $response[$target . $hover_flag . ' > div > div'] = get_icon_size($props, $is_hover, $prefix);

            return array_merge($response, self::get_icon_object($props, $prefix, $target, $is_hover));
        }

        public static function get_dots_icon_object($props)
        {
            $prefix = 'navigation-dot-';
            $dot_icon_hover_status = $props['navigation-dot-icon-status-hover'];
            $dot_icon_active_status = $props['active-navigation-dot-icon-status'];



            $response = array(
                ' .maxi-navigation-dot-icon-block__icon' => get_icon_size($props, false, $prefix),
                ' .maxi-navigation-dot-icon-block__icon > div' => get_icon_size($props, false, $prefix),
                ' .maxi-slider-block__dot:not(:last-child)' => self::get_icon_spacing_between($props, 'navigation-dot-', false),
                ' .maxi-slider-block__dots' => self::get_icon_spacing($props, 'dots', false, $prefix)
            );

            $response = array_merge($response, self::get_icon_object($props, $prefix, ' .maxi-slider-block__dot'));

            if ($dot_icon_hover_status) {
                $response = array_merge($response, self::get_icon_object($props, $prefix, ' .maxi-slider-block__dot:not(.maxi-slider-block__dot--active)', true));
            }

            if ($dot_icon_active_status) {
                $response = array_merge($response, self::get_icon_object($props, 'active-' . $prefix, ' .maxi-slider-block__dot--active'));
            }

            return $response;
        }

    }

endif;
