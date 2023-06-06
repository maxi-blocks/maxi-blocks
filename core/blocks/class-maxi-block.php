<?php
/**
 * MaxiBlocks Maxi Block Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

// Utils
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_attribute_key.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_attributes_value.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_color_rgba_string.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_default_attribute.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_group_attributes.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_palette_attributes.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_row_gap_attributes.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/style_processor.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_last_breakpoint_attribute.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/get_prev_breakpoint.php';

// Style Helpers
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_alignment_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_alignment_text_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_arrow_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_aspect_ratio.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_background_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_border_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_box_shadow_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_button_icon_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_clip_path_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_column_size_styles.php';
// require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_custom_css.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_custom_formats_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_display_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_divider_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_flex_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_hover_effects_background_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_icon_path_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_icon_size_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_icon_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_image_shape_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_link_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_margin_padding_styles.php';
// require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_number_counter_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_opacity_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_overflow_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_position_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_shape_divider_styles.php';
// require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_shape_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_size_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_svg_styles.php';
// require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_transform_styles.php';
// require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_transition_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_typography_styles.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/style-helpers/get_zindex_styles.php';


if (!class_exists('MaxiBlocks_Block')):
    class MaxiBlocks_Block
    {
        /**
         * Block name
         */
        protected $block_name = '';

        /**
         * Block
         *
         * WP Block Type object
         */
        protected $block;

        /**
         * Block metadata
         */
        protected $block_metadata = [];

        /**
         * Block custom css
         */
        protected $block_custom_css = [];

        /**
         * Block sc props
         */
        protected $block_sc_props = [];

        /**
         * Block sc vars
         */
        protected $block_sc_vars = [];

        /**
         * Constructor.
         */
        public function __construct()
        {
            // Register block
            add_action('init', [$this, 'register_block'], 20);
        }

        public function register_block()
        {
            $this->block = register_block_type(
                MAXI_PLUGIN_DIR_PATH . 'src/blocks/' . $this->block_name . '/block.json',
                [
                   'render_callback' => [$this, 'render_block'],
                ]
            );
        }

        public function render_block($attributes, $content)
        {
            return $content;
        }

        public function get_block()
        {
            return $this->block;
        }

        public function get_block_name()
        {
            return $this->block_name;
        }

        public function get_block_metadata()
        {
            if (empty($this->block_metadata)) {
                $this->block_metadata = json_decode(file_get_contents(MAXI_PLUGIN_DIR_PATH . 'src/blocks/' . $this->block_name . '/block.json'), true);
            }

            return $this->block_metadata;
        }

        public function get_block_attributes($props)
        {
            return $this->block->prepare_attributes_for_render($props);
        }

        public function get_block_custom_css()
        {
            if (empty($this->block_custom_css)) {
                $block_metadata = $this->get_block_metadata();

                if($block_metadata && array_key_exists('customCss', $block_metadata)) {
                    $this->block_custom_css = $block_metadata['customCss'];
                }
            }

            return $this->block_custom_css;
        }

        public function get_block_sc_props()
        {
            if (empty($this->block_sc_props)) {
                $block_metadata = $this->get_block_metadata();

                if($block_metadata && array_key_exists('scProps', $block_metadata)) {
                    $this->block_sc_props = $block_metadata['scProps'];
                }
            }

            return $this->block_sc_props;
        }

        public function get_block_sc_vars($block_style)
        {
            if (empty($this->block_sc_vars)) {
                $block_sc_props = $this->get_block_sc_props();

                if(!empty($block_sc_props)) {
                    if(class_exists('MaxiBlocks_StyleCards')) {
                        $sc_props = $block_sc_props['scElements'];
                        $sc_entry = $block_sc_props['scType'];


                        $this->block_sc_vars = MaxiBlocks_StyleCards::get_style_cards_values($sc_props, $block_style, $sc_entry);
                    }
                }
            }

            return $this->block_sc_vars;
        }
    }

endif;
