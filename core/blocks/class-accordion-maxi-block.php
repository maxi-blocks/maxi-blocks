<?php
/**
 * MaxiBlocks Accordion Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/class-maxi-block.php';


if (!class_exists('MaxiBlocks_Accordion_Maxi_Block')):
    class MaxiBlocks_Accordion_Maxi_Block extends MaxiBlocks_Block
    {
        /**
         * Plugin's core instance.
         *
         * @var MaxiBlocks_Accordion_Maxi_Block
         */
        private static $instance;

        /**
         * Block name
         */
        protected $block_name = 'accordion-maxi';

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
                self::$instance = new MaxiBlocks_Accordion_Maxi_Block();
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

            $background_styles = get_block_background_styles(array_merge(
                get_group_attributes($props, [
                    'blockBackground',
                    'border',
                    'borderWidth',
                    'borderRadius',
                ]),
                ['block_style' => $block_style]
            ));

            $background_hover_styles = get_block_background_styles(array_merge(
                get_group_attributes($props, [
                    'blockBackground',
                    'border',
                    'borderWidth',
                    'borderRadius',
                ], true),
                [
                    'is_hover' => true,
                    'block_style' => $block_style,
                ]
            ));

            $icon_styles = self::get_icon_object($props, $uniqueID);

            $styles_obj = array_merge_recursive(
                $styles_obj,
                $background_styles,
                $background_hover_styles,
                $icon_styles
            );

            $response = [
                $uniqueID => style_processor($styles_obj, $data, $props),
                "{$uniqueID} .maxi-pane-block[data-accordion='{$uniqueID}']" => style_processor(
                    array_merge(
                        self::get_pane_header_object($props),
                        self::get_pane_content_object($props)
                    ),
                    $data,
                    $props
                ),
            ];

            return $response;
        }

        public static function get_normal_object($props)
        {
            $block_style = $props['blockStyle'];
            $block_name = (new self())->get_block_name();

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
                    'size' => get_size_styles(get_group_attributes($props, 'size'), $block_name),
                    'boxShadow' => get_box_shadow_styles(array(
                        'obj' => get_group_attributes($props, 'boxShadow'),
                        'block_style' => $block_style,
                        'block_name' => $block_name,
                    )),
                    'opacity' => get_opacity_styles(get_group_attributes($props, 'opacity')),
                    'zIndex' => get_zindex_styles(get_group_attributes($props, 'zIndex')),
                    'position' => get_position_styles(get_group_attributes($props, 'position')),
                    'display' => get_display_styles(get_group_attributes($props, 'display')),
                    'overflow' => get_overflow_styles(get_group_attributes($props, 'overflow')),
                    'margin' => get_margin_padding_styles([
                        'obj' => get_group_attributes($props, 'margin'),
                    ]),
                    'padding' => get_margin_padding_styles([
                        'obj' => get_group_attributes($props, 'padding'),
                    ]),
                    'flex' => get_flex_styles(get_group_attributes($props, 'flex')),
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

        public static function get_icon_object($props, $uniqueID)
        {
            $get_icon_styles = function ($is_hover = false, $is_active = false) use ($props, $uniqueID) {
                return get_button_icon_styles([
                    'obj' => $props,
                    'block_style' => $props['blockStyle'],
                    'target' => ' .maxi-pane-block__icon',
                    'wrapperTarget' => ".maxi-pane-block[data-accordion='{$uniqueID}'][aria-expanded=" . ($is_active ? 'true' : 'false') . "] .maxi-pane-block__header",
                    'prefix' => $is_active ? 'active-' : '',
                    'is_hover' => $is_hover,
                    'hover_on_icon' => true,
                ]);
            };

            $response = array_merge(
                $get_icon_styles(),
                (isset($props['icon-status-hover']) && $props['icon-status-hover'] ? $get_icon_styles(true) : []),
                $get_icon_styles(false, true),
                (isset($props['active-icon-status-hover']) && $props['active-icon-status-hover'] ? $get_icon_styles(true, true) : [])
            );

            return $response;
        }

        public static function get_color($params)
        {
            $props = $params['props'];
            $prefix = $params['prefix'];
            $is_hover = $params['is_hover'];
            $breakpoint = $params['breakpoint'];

            $palette_attributes = get_palette_attributes([
                'obj' => $props,
                ...(isset($prefix) ? ['prefix' => $prefix] : []),
                ...(isset($is_hover) ? ['is_hover' => $is_hover] : []),
                ...(isset($breakpoint) ? ['breakpoint' => $breakpoint] : []),
            ]);

            $palette_status = $palette_attributes['palette_status'];
            $palette_color = $palette_attributes['palette_color'];
            $palette_opacity = $palette_attributes['palette_opacity'];
            $color = $palette_attributes['color'];

            if (!$palette_status && !is_null($color)) {
                return $color;
            }

            if ($palette_status && $palette_color) {
                return get_color_rgba_string([
                    'first_var' => "color-{$palette_color}",
                    'opacity' => $palette_opacity,
                    'block_style' => $props['block_style'],
                ]);
            }

            return null;
        }

        private static function get_pane_content_transition($duration)
        {
            return "max-height {$duration}s, padding-top {$duration}s, padding-bottom {$duration}s";
        }

        public static function get_pane_content_wrapper_styles($props)
        {
            $animationDuration = $props['animationDuration'];

            $response = [
                'paneTransition' => [
                    'label' => 'Pane transition',
                    'general' => [
                        'transition' => self::get_pane_content_transition($animationDuration),
                    ],
                ],
            ];

            return $response;
        }

        public static function get_pane_title_styles($props, $prefix, $is_hover = false)
        {
            $accordion_title_attrs = get_group_attributes($props, 'accordionTitle');
            $normal_typography = get_group_attributes($props, 'typography', false, $prefix);
            $typography_styles_obj =[
                'is_hover' => $is_hover,
                'prefix' => $prefix,
                'block_style' => $props['blockStyle'],
                'textLevel' => $props['titleLevel'],
                'block_name' => (new self())->get_block_name(),
            ];
            $typography_styles_obj['obj'] = $accordion_title_attrs;

            if($is_hover) {
                $typography_styles_obj['normal_typography'] = $normal_typography;
            }

            $typography_styles = get_typography_styles($typography_styles_obj);

            $response = [
                'typography' => $typography_styles,
            ];

            return $response;
        }

        public static function get_pane_header_styles($props, $prefix, $is_hover = false)
        {

            $response = [];

            $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

            foreach ($breakpoints as $breakpoint) {
                $bgStatus = get_attributes_value([
                    'target' => 'title-background-status',
                    'props' => $props,
                    'is_hover' => $is_hover,
                    'prefix' => $prefix,
                ]);
                if ($bgStatus) {
                    $response[$breakpoint] = [
                        'background-color' => self::get_color([
                            'props' => $props,
                            'prefix' => $prefix . 'title-background-',
                            'is_hover' => $is_hover,
                            'breakpoint' => $breakpoint,
                        ]),
                    ];
                }
            }

            return $response;
        }

        public static function get_pane_header_object($props)
        {
            $block_style = $props['blockStyle'];

            $response = [
                ' .maxi-pane-block__header-content' => [
                    'paneHeader' => self::get_pane_header_styles($props, ''),
                    'paneHeaderIconPosition' => [
                        'general' => [
                            'flex-direction' => isset($props['icon-position']) && $props['icon-position'] === 'right' ? 'row' : 'row-reverse',
                        ],
                    ],
                ],
                ' .maxi-pane-block__header-line-container' => [
                    'headerLine' => get_divider_styles(
                        $props,
                        'container',
                        $block_style,
                        false,
                        'header-'
                    ),
                ],
                ' .maxi-pane-block__header-line' => [
                    'headerLine' => get_divider_styles(
                        $props,
                        'line',
                        $block_style,
                        false,
                        'header-',
                        true
                    ),
                ],
            ];

            if (isset($props['header-line-status-active']) && $props['header-line-status-active']) {
                $response['[aria-expanded=true] .maxi-pane-block__header-line'] = [
                    'headerLine' => get_divider_styles(
                        $props,
                        'line',
                        $block_style,
                        false,
                        'header-active-',
                        true
                    ),
                ];
            }

            if (isset($props['header-line-status-hover']) && $props['header-line-status-hover']) {
                $response['[aria-expanded] .maxi-pane-block__header:hover .maxi-pane-block__header-line'] = [
                    'headerLine' => get_divider_styles(
                        $props,
                        'line',
                        $block_style,
                        true,
                        'header-',
                        true
                    ),
                ];
            }

            $response['[aria-expanded=true] .maxi-pane-block__header-content'] = [
                'paneHeaderActive' => self::get_pane_header_styles($props, 'active-'),
            ];

            $response['[aria-expanded] .maxi-pane-block__header:hover .maxi-pane-block__header-content'] = [
                'paneHeaderHover' => self::get_pane_header_styles($props, '', true),
            ];

            $response[' .maxi-pane-block__title'] = self::get_pane_title_styles($props, 'title-');

            if (isset($props['title-typography-status-active']) && $props['title-typography-status-active']) {
                $response['[aria-expanded=true] .maxi-pane-block__title'] = self::get_pane_title_styles($props, 'active-title-');
            }

            if (isset($props['title-typography-status-hover']) && $props['title-typography-status-hover']) {
                $response['[aria-expanded] .maxi-pane-block__header:hover .maxi-pane-block__title'] = self::get_pane_title_styles($props, 'title-', true);
            }

            return $response;
        }

        public static function get_pane_content_object($props)
        {
            $response = [
                ' .maxi-pane-block__content-wrapper' => self::get_pane_content_wrapper_styles($props),
            ];

            if (isset($props['accordionLayout']) && $props['accordionLayout'] === 'simple') {
                $response[' .maxi-pane-block__content-line-container'] = [
                    'paneLine' => get_divider_styles(
                        $props,
                        'container',
                        $props['blockStyle'],
                        false,
                        'content-'
                    ),
                ];

                $response[' .maxi-pane-block__content-line'] = [
                    'paneLine' => get_divider_styles(
                        $props,
                        'line',
                        $props['blockStyle'],
                        false,
                        'content-',
                        true
                    ),
                ];

                if (isset($props['content-line-status-active']) && $props['content-line-status-active']) {
                    $response['[aria-expanded=true] .maxi-pane-block__content-line'] = [
                        'paneLine' => get_divider_styles(
                            $props,
                            'line',
                            $props['blockStyle'],
                            false,
                            'content-active-',
                            true
                        ),
                    ];
                }

                if (isset($props['content-line-status-hover']) && $props['content-line-status-hover']) {
                    $response['[aria-expanded] .maxi-pane-block__header:hover .maxi-pane-block__content-line'] = [
                        'paneLine' => get_divider_styles(
                            $props,
                            'line',
                            $props['blockStyle'],
                            true,
                            'content-',
                            true
                        ),
                    ];
                }
            }

            return $response;
        }
    }

endif;
