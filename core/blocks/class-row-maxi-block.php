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

        public static function get_styles($props, $customCss, $sc_props)
        {
            $time_start = microtime(true);
            $performance = [];
            $uniqueID = $props['uniqueID'];
            $block_style = $props['blockStyle'];

            $data = [
                'customCss' => $customCss,
            ];

            $performance['styles_obj_start'] = microtime(true);
            $styles_obj = [
                $uniqueID => [
                    '' => self::get_normal_object($props),
                    ':hover' => self::get_hover_object($props),
                ],
            ];
            $performance['styles_obj_end'] = microtime(true);
            $performance['background_styles_start'] = microtime(true);
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
            $performance['background_styles_end'] = microtime(true);
            $performance['merge_start'] = microtime(true);
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
            $performance['merge_end'] = microtime(true);

            WP_CLI::log('Row Maxi Block Styles Performance:');
            WP_CLI::log('Styles Object: ' . (string)($performance['styles_obj_end'] - $performance['styles_obj_start']));
            WP_CLI::log('Background Styles: ' . (string)($performance['background_styles_end'] - $performance['background_styles_start']));
            WP_CLI::log('Merge: ' . (string)($performance['merge_end'] - $performance['merge_start']));
            WP_CLI::log('Total: ' . (string)(microtime(true) - $time_start));

            return $response;
        }

        public static function measure_time($function, ...$args)
        {
            $start = microtime(true);
            $result = call_user_func_array($function, $args);
            $end = microtime(true);
            $execution_time = $end - $start;
            $execution_time = round($execution_time, 4);
            WP_CLI::log($function . ' took ' . $execution_time . ' seconds');
            return $result;
        }

        public static function get_normal_object($props)
        {
            $block_style = $props['blockStyle'];
            $block_name = (new self())->get_block_name();

            $response = [
                'boxShadow' => self::measure_time('get_box_shadow_styles', [
                    'obj' => self::measure_time('get_group_attributes', $props, 'boxShadow'),
                    'block_style' => $block_style,
                    'block_name' => $block_name,
                ]),
                'border' => self::measure_time('get_border_styles', [
                    'obj' => self::measure_time('get_group_attributes', $props, [
                        'border',
                        'borderWidth',
                        'borderRadius',
                    ]),
                    'block_style' => $block_style,
                ]),
                'size' => self::measure_time('get_size_styles', self::measure_time('get_group_attributes', $props, 'size'), $block_name),
                'margin' => self::measure_time('get_margin_padding_styles', [
                    'obj' => self::measure_time('get_group_attributes', $props, 'margin'),
                ]),
                'padding' => self::measure_time('get_margin_padding_styles', [
                    'obj' => self::measure_time('get_group_attributes', $props, 'padding'),
                ]),
                'opacity' => self::measure_time('get_opacity_styles', self::measure_time('get_group_attributes', $props, 'opacity')),
                'zIndex' => self::measure_time('get_zindex_styles', self::measure_time('get_group_attributes', $props, 'zIndex')),
                'position' => self::measure_time('get_position_styles', self::measure_time('get_group_attributes', $props, 'position')),
                'display' => self::measure_time('get_display_styles', self::measure_time('get_group_attributes', $props, 'display')),
                'row' => [ 'general' => [ ]],
                'overflow' => self::measure_time('get_overflow_styles', self::measure_time('get_group_attributes', $props, 'overflow')),
                'flex' => self::measure_time('get_flex_styles', self::measure_time('get_group_attributes', $props, 'flex')),
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
