<?php

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

class MaxiBlocks_Block_Info_Updater
{
    private static ?self $instance = null;
    private static ?MaxiBlocks_BlockFactory $block_factory = null;

    private static int $max_execution_time;
    private const CHUNK_SIZE = 3;

    private static array $block_updates = [];

    public static function register(): void
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }

        self::$block_factory = MaxiBlocks_BlockFactory::get_instance();
    }

    public static function get_instance(): self
    {
        self::register();
        return self::$instance;
    }

    public function __construct()
    {
        self::$max_execution_time = ini_get('max_execution_time');
    }

    /**
     * Updates the styles of all blocks within a post's content.
     */
    public function update_post_blocks_styles(string $post_content): void
    {
        $blocks = parse_blocks($post_content);
        $this->process_blocks_chunk($blocks);
        $this->perform_bulk_update();
    }

    /**
     * Recursively processes chunks of blocks.
     */
    private function process_blocks_chunk(array $blocks, array $context = []): void
    {
        $block_chunks = array_chunk($blocks, self::CHUNK_SIZE);

        foreach ($block_chunks as $block_chunk) {
            foreach ($block_chunk as $block) {
                $this->update_block_info_recursive($block, $context);
            }

            // Reset PHP maximum execution time for each chunk to avoid a timeout
            if (self::$max_execution_time != 0) {
                set_time_limit(self::$max_execution_time * 0.95);
            }
        }
    }

    /**
     * Recursively updates block info, including nested blocks.
     */
    private function update_block_info_recursive(array $block, array $context = []): void
    {
        $block_name = $block['blockName'];
        $inner_blocks = $block['innerBlocks'];

        if ($block_name && strpos($block_name, 'maxi-blocks') !== false && $block['attrs']) {
            $block_instance = self::$block_factory->create_block($block_name);
            if ($block_instance === null) {
                return;
            }

            $props = $block_instance->get_block_attributes($block['attrs']);
            $unique_id = $props['uniqueID'];

            $context = array_merge($context, $this->create_context($block_name, $props, $inner_blocks));

            $styles = $this->get_block_styles($block_instance, $block, $context);
            $fonts = json_encode($this->get_block_fonts($block_name, $props));
            $frontend_styles = process_css(frontend_style_generator($styles, $unique_id));
            $custom_meta = $this->get_custom_data_from_block($block_name, $props, $context);

            $this->collect_block_update($unique_id, $block_name, $props, $custom_meta, $frontend_styles, $fonts);
        }

        if (!empty($inner_blocks)) {
            $this->process_blocks_chunk($inner_blocks, $context);
        }
    }

    /**
     * Collects block update information.
     */
    private function collect_block_update(string $unique_id, string $block_name, array $props, array $custom_meta, string $frontend_styles, string $fonts): void
    {
        $custom_meta_block = 0;
        $meta_blocks = [
            'maxi-blocks/number-counter-maxi',
            'maxi-blocks/video-maxi',
            'maxi-blocks/search-maxi',
            'maxi-blocks/map-maxi',
            'maxi-blocks/accordion-maxi',
            'maxi-blocks/pane-maxi',
            'maxi-blocks/slider-maxi',
        ];

        if (in_array($block_name, $meta_blocks)) {
            $custom_meta_block = 1;
        }

        self::$block_updates[] = [
            'unique_id' => $unique_id,
            'block_name' => $block_name,
            'props' => $props,
            'custom_meta' => $custom_meta,
            'frontend_styles' => $frontend_styles,
            'fonts' => $fonts,
            'custom_meta_block' => $custom_meta_block,
        ];

        do_action('maxiblocks_block_info_processed');
    }

    /**
     * Performs bulk update of all collected block information.
     */
    private function perform_bulk_update(): void
    {
        global $wpdb;

        if (empty(self::$block_updates)) {
            return;
        }

        $styles_values = [];
        $custom_data_values = [];

        foreach (self::$block_updates as $update) {
            $styles_values[] = $wpdb->prepare(
                "(%s, %s, %s, %s, %s, %d, %d)",
                $update['unique_id'],
                $update['frontend_styles'],
                $update['frontend_styles'],
                $update['fonts'],
                $update['fonts'],
                $update['custom_meta_block'],
                $update['custom_meta_block']
            );

            if (!empty($update['custom_meta'])) {
                $custom_meta_json = json_encode($update['custom_meta']);
                $custom_data_values[] = $wpdb->prepare(
                    "(%s, %s, %s)",
                    $update['unique_id'],
                    $custom_meta_json,
                    $custom_meta_json
                );
            }
        }

        // Bulk insert/update styles
        $wpdb->query("INSERT INTO {$wpdb->prefix}maxi_blocks_styles_blocks
            (block_style_id, css_value, prev_css_value, fonts_value, prev_fonts_value, active_custom_data, prev_active_custom_data)
            VALUES " . implode(', ', $styles_values) . "
            ON DUPLICATE KEY UPDATE
            css_value = VALUES(css_value),
            prev_css_value = VALUES(prev_css_value),
            fonts_value = VALUES(fonts_value),
            prev_fonts_value = VALUES(prev_fonts_value),
            active_custom_data = VALUES(active_custom_data),
            prev_active_custom_data = VALUES(prev_active_custom_data)");

        // Bulk insert/update custom data if any
        if (!empty($custom_data_values)) {
            $wpdb->query("INSERT INTO {$wpdb->prefix}maxi_blocks_custom_data_blocks
                (block_style_id, custom_data_value, prev_custom_data_value)
                VALUES " . implode(', ', $custom_data_values) . "
                ON DUPLICATE KEY UPDATE
                custom_data_value = VALUES(custom_data_value),
                prev_custom_data_value = VALUES(prev_custom_data_value)");
        }

        // Clear the block updates array
        self::$block_updates = [];
    }

    /**
     * Context creator
     */
    public function create_context(string $block_name, array $props, array $inner_blocks): array
    {
        $context = [];
        if ($block_name === 'maxi-blocks/row-maxi') {
            $column_size = [];

            if ($inner_blocks && !empty($inner_blocks)) {
                foreach ($inner_blocks as $inner_block) {
                    $attrs = $inner_block['attrs'];
                    $column_size_attrs = get_group_attributes($attrs, 'columnSize');
                    $column_unique_id = $attrs['uniqueID'];

                    $column_size[$column_unique_id] = $column_size_attrs;
                }
            }

            $context = [
                'row_gap_props' => array_merge(
                    get_row_gap_attributes($props),
                    [
                        'column_num' => count($inner_blocks),
                        'column_size' => $column_size,
                    ]
                ),
                'row_border_radius'=> get_group_attributes(
                    $props,
                    'borderRadius'
                ),
            ];
        }

        if($block_name === 'maxi-blocks/text-maxi' && isset($props['isList']) && $props['isList']) {
            $context = [
                'list_items_length' => count($inner_blocks),
            ];
        }

        return $context;
    }

    public function get_block_styles(MaxiBlocks_Block $block_instance, array $block, array $context = []): array
    {
        $styles = [];

        if(empty($block)) {
            return $styles;
        }

        if($block_instance === null) {
            return $styles;
        }

        $props = $block_instance->get_block_attributes($block['attrs']);
        $data = $block_instance->get_block_data();
        $block_style = $props['blockStyle'] ?? 'light';
        $sc_props = $block_instance->get_block_sc_vars($block_style);
        $styles = $block_instance->get_styles($props, $data, $sc_props, $context);

        $resolved_styles = style_resolver($styles);
        return $resolved_styles;
    }

    /**
     * Retrieves custom data from a block, based on the block's name, properties and context.
     *
     * This function first extracts relevant properties from the given arguments, including unique ID,
     * status, background layers, relations, and context loop. It then calculates some properties
     * based on the extracted data. Finally, it constructs and returns an array that contains all
     * the calculated properties and the results from another method called `get_maxi_custom_data_from_block`.
     *
     * @param string $block_name The name of the block.
     * @param array $props An associative array of properties for the block.
     * @param array|null $context (Optional) The context in which the block is being processed.
     * @return array An array containing the custom data from the block.
     */
    public function get_custom_data_from_block(string $block_name, array $props, array $context = null): array
    {
        // Extract the unique ID from the properties
        $unique_id = $props['uniqueID'];

        // Extract other relevant properties with default values if not set
        $dc_status = $props['dc-status'] ?? false;
        $bg_layers = $props['background-layers'] ?? [];
        $relations_raw = $props['relations'] ?? [];
        $context_loop = $context['contextLoop'] ?? null;

        // Calculate parallax layers if background layers are not empty
        $bg_parallax_layers = !empty($bg_layers) ? get_parallax_layers($unique_id, $bg_layers) : [];

        // Calculate video flag
        $has_video = get_has_video($unique_id, $bg_layers);

        // Calculate relations if exist
        $relations = get_relations($unique_id, $relations_raw);

        // Calculate scroll effects
        $scroll = get_group_attributes($props, 'scroll', false, '', true);
        $scroll_effects = get_scroll_effects($unique_id, $scroll);

        // Construct the response by merging all calculated data and the data from another method
        $response = array_merge(
            !empty($bg_parallax_layers) ? ['parallax' => $bg_parallax_layers] : [],
            !empty($relations) ? ['relations' => $relations] : [],
            !empty($scroll_effects) ? $scroll_effects : [],
            $has_video ? ['bg_video' => true] : [],
            $dc_status && isset($context_loop['cl-status'])
                    ? ['dynamic_content' => [$unique_id => $context_loop]]
                    : [],
            $this->get_maxi_custom_data_from_block($block_name, $props)
        );

        return $response;
    }

    /**
     * Retrieves custom data from a block, based on the block's name and properties.
     *
     * The function supports a variety of block types, and returns different data depending
     * on the block type. If the block type is not supported, the function returns an empty array.
     *
     * @param string $block_name The name of the block, e.g., 'maxi-blocks/number-counter-maxi'.
     * @param array $attributes An associative array of attributes for the block.
     * @return array An array containing the custom data from the block.
     */
    public function get_maxi_custom_data_from_block(string $block_name, array $attributes): array
    {
        // Define the block types and their corresponding attribute groups
        $block_types = [
            'maxi-blocks/accordion-maxi' => 'accordion',
            'maxi-blocks/container-maxi' => 'container',
            'maxi-blocks/map-maxi' => 'map',
            'maxi-blocks/number-counter-maxi' => 'numberCounter',
            'maxi-blocks/search-maxi' => 'search',
            'maxi-blocks/slider-maxi' => 'slider',
            'maxi-blocks/video-maxi' => 'video',
        ];

        // Iterate over the block types array
        foreach ($block_types as $block_type => $attr_group) {
            // If the block name matches the current block type
            if ($block_name === $block_type) {
                switch ($attr_group) {
                    case 'accordion':
                        $pane_icon = $attributes['icon-content'] ?? null;
                        $pane_icon_active = $attributes['active-icon-content'] ?? null;
                        $accordion_layout = $attributes['accordionLayout'] ?? null;
                        $auto_pane_close = $attributes['autoPaneClose'] ?? null;
                        $is_collapsible = $attributes['isCollapsible'] ?? null;
                        $animation_duration = $attributes['animationDuration'] ?? null;

                        $unique_custom_data = [
                            'paneIcon' => $pane_icon,
                            'paneIconActive' => $pane_icon_active,
                            'accordionLayout' => $accordion_layout,
                            'autoPaneClose' => $auto_pane_close,
                            'isCollapsible' => $is_collapsible,
                            'animationDuration' => $animation_duration,
                        ];

                        break;
                    case 'container':
                        $shape_divider_top_status = $attributes['shape-divider-top-status'] ?? null;
                        $shape_divider_bottom_status = $attributes['shape-divider-bottom-status'] ?? null;
                        $shape_status = $shape_divider_top_status ?? $shape_divider_bottom_status;

                        $unique_custom_data = $shape_status ? get_group_attributes($attributes, 'shapeDivider') : [];

                        break;
                    case 'map':
                        $unique_custom_data = get_group_attributes($attributes, [
                            'mapInteraction',
                            'mapMarker',
                            'mapPopup',
                            'mapPopupText',
                        ]);

                        break;
                    case 'search':
                        $close_icon_prefix = 'close-';
                        $button_icon_content = $attributes['icon-content'] ?? null;
                        $button_close_icon_content = $attributes[$close_icon_prefix . 'icon-content'] ?? null;
                        $button_content = $attributes['buttonContent'] ?? null;
                        $button_content_close = $attributes['buttonContentClose'] ?? null;
                        $button_skin = $attributes['buttonSkin'] ?? null;
                        $icon_reveal_action = $attributes['iconRevealAction'] ?? null;
                        $skin = $attributes['skin'] ?? null;
                        $unique_custom_data = [
                            'icon-content' => $button_icon_content,
                            $close_icon_prefix . 'icon-content' => $button_close_icon_content,
                            'buttonContent' => $button_content,
                            'buttonContentClose' => $button_content_close,
                            'buttonSkin' => $button_skin,
                            'iconRevealAction' => $icon_reveal_action,
                            'skin' => $skin,
                        ];

                        break;
                    case 'slider':
                        $unique_custom_data = ['slider'=> true];
                        break;
                    case 'numberCounter':
                        $unique_custom_data = get_group_attributes($attributes, 'numberCounter');
                        break;
                    default:
                        $unique_custom_data = [];
                        break;
                }
                // Construct and return the response array
                return
                   array_merge(
                       get_group_attributes($attributes, $attr_group),
                       $unique_custom_data,
                       ['breakpoints' => $this->get_breakpoints($attributes)]
                   );
            }
        }

        // If no matching block type was found, return an empty array
        return [];
    }

    /**
    * Returns default breakpoints values in case breakpoints are not set
    */
    public function get_breakpoints($breakpoints)
    {

        // TODO: It may connect to the API to centralize the default values there
        return (object) [
            'xl' => 1920,
            'l' => 1366,
            'm' => 1024,
            's' => 767,
            'xs' => 480,
        ];
    }

    public function get_block_fonts(string $block_name, array $props, bool $only_backend = false): array
    {
        if (empty($block_name) || empty($props)) {
            return [];
        }

        $blocks_with_fonts = [
            'maxi-blocks/number-counter-maxi',
            'maxi-blocks/button-maxi',
            'maxi-blocks/text-maxi',
            'maxi-blocks/list-item-maxi',
            'maxi-blocks/image-maxi',
            'maxi-blocks/accordion-maxi',
            'maxi-blocks/search-maxi',
            'maxi-blocks/map-maxi',
            'maxi-blocks/row-maxi',
            'maxi-blocks/column-maxi',
            'maxi-blocks/group-maxi',
            'maxi-blocks/container-maxi',
        ];

        if (!in_array($block_name, $blocks_with_fonts, true)) {
            return [];
        }

        $typography = [];
        $typography_hover = [];
        $text_level = isset($props['textLevel']) ? $props['textLevel'] : 'p';
        $block_style = $props['blockStyle'] ?? 'light';
        $prefixes = [''];

        switch ($block_name) {
            case 'maxi-blocks/number-counter-maxi':
                $typography = get_group_attributes($props, 'numberCounter');
                break;
            case 'maxi-blocks/button-maxi':
                $typography = get_group_attributes($props, 'typography');
                $typography_hover = get_group_attributes($props, 'typographyHover');
                $text_level = 'button';
                break;
            case 'maxi-blocks/row-maxi':
            case 'maxi-blocks/column-maxi':
            case 'maxi-blocks/group-maxi':
            case 'maxi-blocks/container-maxi':
                $typography = get_group_attributes($props, 'typography', false, 'cl-pagination-');
                $prefixes[] = 'cl-pagination-';
                break;
            case 'maxi-blocks/map-maxi':
                $typography = array_merge(
                    get_group_attributes($props, 'typography'),
                    get_group_attributes($props, 'typography', false, 'description-')
                );
                $prefixes[] = 'description-';
                break;
            case 'maxi-blocks/accordion-maxi':
                $typography = array_merge(
                    get_group_attributes($props, 'typography', false, 'title-'),
                    get_group_attributes($props, 'typography', false, 'active-title-')
                );
                $typography_hover = get_group_attributes($props, 'typographyHover', false, 'title-');
                $prefixes = array_merge($prefixes, ['title-', 'active-title-']);
                break;
            case 'maxi-blocks/search-maxi':
                $typography = array_merge(
                    get_group_attributes($props, 'typography', false, 'button-'),
                    get_group_attributes($props, 'typography', false, 'input-')
                );
                $typography_hover = array_merge(
                    get_group_attributes($props, 'typographyHover', false, 'button-'),
                    get_group_attributes($props, 'typographyHover', false, 'input-')
                );
                $prefixes = array_merge($prefixes, ['button-', 'input-']);
                break;
            default:
                $typography = get_group_attributes($props, 'typography');
                $typography_hover = get_group_attributes($props, 'typographyHover');
                break;
        }

        $response = [];
        foreach ($prefixes as $prefix) {
            if (!empty($typography_hover["{$prefix}typography-status-hover"])) {
                $response = array_merge_recursive(
                    get_all_fonts($typography, 'custom-formats', false, $text_level, $block_style, $only_backend, $prefixes),
                    get_all_fonts($typography_hover, 'custom-formats', true, $text_level, $block_style, $only_backend, $prefixes)
                );
            } else {
                $response = get_all_fonts($typography, 'custom-formats', false, $text_level, $block_style, $only_backend, $prefixes);
            }
        }

        $font_files = $this->load_font_files();
        if (empty($font_files)) {
            return [];
        }

        foreach ($response as $font_name => &$font_data) {
            $this->process_font_data($font_data, $font_files[$font_name]['files'] ?? null);
        }

        return $response;
    }

    private function load_font_files(): array
    {
        static $font_files = null;
        if ($font_files === null) {
            $font_files = json_decode(file_get_contents(MAXI_PLUGIN_DIR_PATH . '/fonts/fonts.json'), true);
        }
        return $font_files ?: [];
    }

    private function process_font_data(array &$font_data, ?array $font_files_content): void
    {
        $font_weight = $font_data['weight'] ?? '400';
        $font_style = $font_data['style'] ?? 'normal';

        $font_weight_arr = $this->normalize_font_property($font_weight);
        $font_style_arr = $this->normalize_font_property($font_style);

        $font_data['weight'] = implode(',', $font_weight_arr);
        $font_data['style'] = implode(',', $font_style_arr);
        $font_data['display'] = 'swap';

        if (empty($font_data['style'])) {
            unset($font_data['style']);
        }

        $this->adjust_font_weights($font_weight_arr, $font_style_arr, $font_files_content, $font_data);
    }

    private function normalize_font_property($property): array
    {
        if (is_array($property)) {
            return array_unique($property);
        }
        if (is_string($property)) {
            return array_filter(array_unique(explode(',', $property)), 'strlen');
        }
        return [$property];
    }

    private function adjust_font_weights(array $font_weight_arr, array $font_style_arr, ?array $font_files_content, array &$font_data): void
    {
        $get_weight_file = function ($weight, $style) {
            return $style === 'italic' ? (($weight === '400' ? '' : $weight) . 'italic') : $weight;
        };

        $new_font_weight_arr = [];
        foreach ($font_weight_arr as $weight) {
            foreach ($font_style_arr as $current_font_style) {
                $weight_file = $get_weight_file($weight, $current_font_style);
                if (is_array($font_files_content) && !array_key_exists($weight_file, $font_files_content)) {
                    $weight = '400';
                }
            }
            $new_font_weight_arr[] = $weight;
        }

        $font_data['weight'] = implode(',', array_unique($new_font_weight_arr));
    }
}
