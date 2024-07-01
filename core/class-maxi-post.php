<?php

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-media.php';

$coreClasses = [
    'class-maxi-local-fonts',
    'class-maxi-style-cards',
    'class-maxi-api',
    'blocks/utils/get_all_fonts',
];

foreach($coreClasses as $coreClass) {
    require_once MAXI_PLUGIN_DIR_PATH . 'core/' . $coreClass . '.php';
}

$blockClasses = [
    'class-group-maxi-block',
    'class-container-maxi-block',
    'class-row-maxi-block',
    'class-column-maxi-block',
    'class-accordion-maxi-block',
    'class-pane-maxi-block',
    'class-button-maxi-block',
    'class-divider-maxi-block',
    'class-image-maxi-block',
    'class-svg-icon-maxi-block',
    'class-text-maxi-block',
    'class-list-item-maxi-block',
    'class-video-maxi-block',
    'class-number-counter-maxi-block',
    'class-search-maxi-block',
    'class-map-maxi-block',
    'class-slide-maxi-block',
    'class-slider-maxi-block'
];

foreach($blockClasses as $blockClass) {
    require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/' . $blockClass . '.php';
}

class MaxiBlocks_PostUpdateHandler
{
    /**
    * This plugin's instance.
    *
    * @var MaxiBlocks_PostUpdateHandler
    */
    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_PostUpdateHandler();
        }
    }

    protected $max_execution_time;


    /**
    * Constructor
    */
    public function __construct()
    {
        add_action('maxiblocks_update_post_content', [$this, 'process_updated_post_content'], 10, 3);
        // TODO: add some comments, at least to filter "duplicate_post_new_post"
        add_filter('duplicate_post_new_post', [$this, 'update_post_unique_ids'], 10, 1);
        add_action('delete_post', [$this, 'clean_deleted_maxiblocks_styles'], 10, 2);
        add_action('wp_import_post_data_raw', [$this,'process_imported_post'], 10, 1);

        $this->max_execution_time = ini_get('max_execution_time');
    }

    /**
     * Updates the post with maxi blocks with updated post_content and styles
     */
    public function process_updated_post_content(int $post_id, string $post_content, bool $new_blocks = false): void
    {
        $updated_post_content = $this->get_updated_post_content($post_content, $new_blocks);
        $this->update_post_blocks_styles($updated_post_content);
        wp_update_post([
            'ID' => $post_id,
            'post_content' => $this->prepare_content($updated_post_content),
        ]);
    }

    /**
     * Updates the unique IDs of all blocks within a new post's content.
     *
     * This function parses the blocks of the new post, updates their unique IDs,
     * and then re-serializes the blocks back into the post content.
     */
    public function update_post_unique_ids(WP_Post $new_post): WP_Post
    {
        $blocks = parse_blocks($new_post['post_content']);
        $this->update_unique_ids($blocks);

        $serialized_content = serialize_blocks($blocks);

        $new_post['post_content'] = $serialized_content;

        return $new_post;
    }

    /**
     * Deletes all block styles associated with a post when the post is deleted.
     */
    public function clean_deleted_maxiblocks_styles(string $post_id, WP_Post $post): void
    {
        global $wpdb;
        $block_unique_ids = $this->get_maxiblocks_unique_ids(parse_blocks($post->post_content));

        foreach ($block_unique_ids as $uniqueID) {
            $wpdb->delete("{$wpdb->prefix}maxi_blocks_styles_blocks", ['block_style_id' => $uniqueID]);
        }
    }

    /**
     * Updates the post content of an imported post and add styles to the blocks.
     */
    public function process_imported_post(WP_Post $post): WP_Post
    {
        $updated_post_content = $this->get_updated_post_content($post->post_content, true);
        $this->update_post_blocks_styles($updated_post_content);
        $post->post_content = $updated_post_content;
        return $post;
    }

    /**
     * Get the updated post content with media added and unique IDs updated if new blocks are present.
     */
    public function get_updated_post_content(string $post_content, bool $new_blocks = false): string
    {
        $updated_post_content = MaxiBlocks_Media::add_media($post_content);

        if($new_blocks) {
            // Get all blocks from post content
            $blocks = parse_blocks($updated_post_content);
            $blocks = array_filter($blocks, function ($block) {
                return isset($block['blockName']);
            });

            if (empty($blocks)) {
                return '';
            }

            $this->update_unique_ids($blocks, function ($block) use ($new_blocks) {
                return $new_blocks || (isset($block['attrs']['uniqueID']) && substr($block['attrs']['uniqueID'], -2) != '-u');
            });

            // Save the post with the updated blocks
            $updated_post_content = serialize_blocks($blocks);
        }

        return $updated_post_content;
    }

    /**
     * Updates the styles of all blocks within a post's content.
     */
    public function update_post_blocks_styles(string $post_content): void
    {
        $blocks = parse_blocks($post_content);

        // Split blocks array into chunks of 3 blocks
        $block_chunks = array_chunk($blocks, 3);

        foreach ($block_chunks as $block_chunk) {
            // Process each block in the current chunk
            foreach($block_chunk as $block) {
                $this->update_blocks_info($block);
            }

            // Reset PHP maximum execution time for each chunk to avoid a timeout
            if ($this->max_execution_time != 0) {
                set_time_limit($this->max_execution_time - 2);
            }
        }
    }

    public function update_blocks_info(array $block, array $context = null): void
    {
        $block_name = $block['blockName'];
        $inner_blocks = $block['innerBlocks'];

        if(strpos($block_name, 'maxi-blocks') !== false) {
            $props = $block['attrs'];
            $unique_id = $props['uniqueID'];

            $context = $this->create_context($block_name, $props, $inner_blocks);

            $styles = $this->get_block_styles($block, $context);
            $frontend_styles = frontend_style_generator($styles, $unique_id);
            $custom_meta = $this->get_custom_data_from_block($block_name, $props, $context);

            $this->update_block_info($unique_id, $block_name, $props, $custom_meta, $frontend_styles);
        }

        if ($inner_blocks && !empty($inner_blocks)) {
            //Split inner_blocks array into chunks of 3
            $inner_block_chunks = array_chunk($inner_blocks, 3);

            foreach ($inner_block_chunks as $inner_block_chunk) {
                // Process each block in the current chunk
                foreach($inner_block_chunk as $inner_block) {
                    $this->update_blocks_info($inner_block, $context);
                }

                // Reset PHP maximum execution time for each chunk to avoid a timeout
                if ($this->max_execution_time != 0) {
                    set_time_limit($this->max_execution_time - 2);
                }
            }
        }
    }

    /**
     * Context creator
     */
    public function create_context(string $block_name, array $props, array $inner_blocks)
    {
        $context = null;
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

    public function get_block_styles(array $block, array $context = null): array
    {
        $styles = [];

        if(empty($block)) {
            return $styles;
        }

        $block_name = $block['blockName'];

        if ($block_name === null || strpos($block_name, 'maxi-blocks') === false) {
            return $styles;
        }

        $props = $block['attrs'];
        $block_style = $props['blockStyle'] ?? 'light';

        $block_instance = null;

        $blockClasses = [
            'maxi-blocks/group-maxi' => 'MaxiBlocks_Group_Maxi_Block',
            'maxi-blocks/container-maxi' => 'MaxiBlocks_Container_Maxi_Block',
            'maxi-blocks/row-maxi' => 'MaxiBlocks_Row_Maxi_Block',
            'maxi-blocks/column-maxi' => 'MaxiBlocks_Column_Maxi_Block',
            'maxi-blocks/accordion-maxi' => 'MaxiBlocks_Accordion_Maxi_Block',
            'maxi-blocks/pane-maxi' => 'MaxiBlocks_Pane_Maxi_Block',
            'maxi-blocks/button-maxi' => 'MaxiBlocks_Button_Maxi_Block',
            'maxi-blocks/divider-maxi' => 'MaxiBlocks_Divider_Maxi_Block',
            'maxi-blocks/image-maxi' => 'MaxiBlocks_Image_Maxi_Block',
            'maxi-blocks/svg-icon-maxi' => 'MaxiBlocks_SVG_Icon_Maxi_Block',
            'maxi-blocks/text-maxi' => 'MaxiBlocks_Text_Maxi_Block',
            'maxi-blocks/list-item-maxi' => 'MaxiBlocks_List_Item_Maxi_Block',
            'maxi-blocks/video-maxi' => 'MaxiBlocks_Video_Maxi_Block',
            'maxi-blocks/number-counter-maxi' => 'MaxiBlocks_Number_Counter_Maxi_Block',
            'maxi-blocks/search-maxi' => 'MaxiBlocks_Search_Maxi_Block',
            'maxi-blocks/map-maxi' => 'MaxiBlocks_Map_Maxi_Block',
            'maxi-blocks/slider-maxi' => 'MaxiBlocks_Slider_Maxi_Block',
            'maxi-blocks/slide-maxi' => 'MaxiBlocks_Slide_Maxi_Block',
        ];

        if (class_exists($blockClasses[$block_name])) {
            $block_instance = $blockClasses[$block_name]::get_instance();
        }

        if($block_instance === null) {
            return $styles;
        }

        $props = $block_instance->get_block_attributes($props);
        $data = $block_instance->get_block_data();
        $sc_props = $block_instance->get_block_sc_vars($block_style);
        $styles = $block_instance->get_styles($props, $data, $sc_props, $context);

        $resolved_styles = style_resolver($styles);
        return $resolved_styles;
    }

    public function update_block_info(string $unique_id, string $block_name, array $props, array $custom_meta, string $frontend_styles, int $custom_meta_block = 0)
    {
        global $wpdb;

        // custom meta
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

        if(in_array($block_name, $meta_blocks)) {
            $custom_meta_block = 1;
        }

        if(!empty($custom_meta)) {
            $custom_meta_json = json_encode($custom_meta);
            $exists = $wpdb->get_row(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}maxi_blocks_custom_data_blocks WHERE block_style_id = %s",
                    $unique_id
                ),
                OBJECT
            );

            if (!empty($exists)) {
                // Update the existing row.
                $old_custom_meta = $exists->custom_data_value;
                $wpdb->query(
                    $wpdb->prepare(
                        "UPDATE {$wpdb->prefix}maxi_blocks_custom_data_blocks
						SET custom_data_value = %s, prev_custom_data_value = %s
						WHERE block_style_id = %s",
                        $custom_meta_json,
                        $old_custom_meta,
                        $unique_id
                    )
                );
            } else {
                // Insert a new row.
                $wpdb->query(
                    $wpdb->prepare(
                        "INSERT INTO {$wpdb->prefix}maxi_blocks_custom_data_blocks (block_style_id, custom_data_value, prev_custom_data_value)
						VALUES (%s, %s, %s)",
                        $unique_id,
                        $custom_meta_json,
                        ''
                    )
                );
            }
        }

        // fonts
        $blocks_with_fonts = [
            'maxi-blocks/number-counter-maxi',
            'maxi-blocks/button-maxi',
            'maxi-blocks/text-maxi',
            'maxi-blocks/list-item-maxi',
            'maxi-blocks/image-maxi',
        ];

        if (in_array($block_name, $blocks_with_fonts) && !empty($props)) {
            $fonts = json_encode($this->get_block_fonts($block_name, $props));
        } else {
            $fonts = '';
        }
        // save to DB
        $exists = $wpdb->get_row(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}maxi_blocks_styles_blocks WHERE block_style_id = %s",
                $unique_id
            ),
            OBJECT
        );

        if (!empty($exists)) {
            // Update the existing row.
            $wpdb->query(
                $wpdb->prepare(
                    "UPDATE {$wpdb->prefix}maxi_blocks_styles_blocks
					SET css_value = %s, prev_css_value = %s, prev_fonts_value = %s, fonts_value = %s, active_custom_data = %d, prev_active_custom_data = %d
					WHERE block_style_id = %s",
                    $frontend_styles,
                    $frontend_styles,
                    $fonts,
                    $fonts,
                    $custom_meta_block,
                    $custom_meta_block,
                    $unique_id
                )
            );
        } else {
            // Insert a new row.
            $wpdb->query(
                $wpdb->prepare(
                    "INSERT INTO {$wpdb->prefix}maxi_blocks_styles_blocks (block_style_id, css_value, prev_css_value, fonts_value, prev_fonts_value, active_custom_data, prev_active_custom_data)
					VALUES (%s, %s, %s, %s, %s, %d, %d)",
                    $unique_id,
                    $frontend_styles,
                    $frontend_styles,
                    $fonts,
                    $fonts,
                    $custom_meta_block,
                    $custom_meta_block
                )
            );
        }
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
     * Legacy function
     * Returns default breakpoints values in case breakpoints are not set
     */
    public function get_breakpoints($breakpoints)
    {

        // TODO: It may connect to the API to centralize the default values there
        return (object) [
            'xs' => 480,
            's' => 767,
            'm' => 1024,
            'l' => 1366,
            'xl' => 1920,
        ];
    }

    public function get_block_fonts(string $block_name, array $props, bool $only_backend = false)
    {
        $response = [];

        $typography = [];
        $typography_hover = [];
        $text_level = isset($props['textLevel']) ? $props['textLevel'] : 'p';
        $block_style = $props['blockStyle'] ?? 'light';

        switch ($block_name) {
            case 'maxi-blocks/number-counter-maxi':
                $typography = get_group_attributes($props, 'numberCounter');
                break;
            case 'maxi-blocks/button-maxi':
                $typography = get_group_attributes($props, 'typography');
                $typography_hover = get_group_attributes($props, 'typographyHover');
                $text_level = 'button';
                break;
            default:
                $typography = get_group_attributes($props, 'typography');
                $typography_hover = get_group_attributes($props, 'typographyHover');
                break;
        }

        if (isset($typography_hover['typography-status-hover'])) {
            $response = array_merge_recursive(
                get_all_fonts($typography, 'custom-formats', false, $text_level, $block_style, $only_backend),
                get_all_fonts($typography_hover, 'custom-formats', true, $text_level, $block_style, $only_backend)
            );
        } else {
            $response = get_all_fonts($typography, 'custom-formats', false, $text_level, $block_style, $only_backend);
        }


        return $response;
    }

    private static function get_maxiblocks_unique_ids(array $blocks, array &$block_unique_ids = []): array
    {
        foreach ($blocks as $block) {
            $block_name = $block['blockName'] ?? '';
            if (strpos($block_name, 'maxi-blocks') !== false && isset($block['attrs']['uniqueID'])) {
                $block_unique_ids[] = $block['attrs']['uniqueID'];
            }

            if (isset($block['innerBlocks']) && !empty($block['innerBlocks'])) {
                self::get_maxiblocks_unique_ids($block['innerBlocks'], $block_unique_ids);
            }
        }

        return $block_unique_ids;
    }

    /**
     * Recursively updates the unique IDs of blocks and their inner blocks.
     *
     * This function iterates through each block, generating a new unique ID based on the block name,
     * and replaces the old unique ID in the block's attributes, innerHTML, and innerContent.
     * It also recursively updates any inner blocks.
     *
     * @param array $blocks Reference to the array of blocks to be updated.
     * @param callable $should_update_unique_id Callback function to determine if the block's unique ID should be updated.
     * @return void
    */
    private function update_unique_ids(
        array &$blocks,
        callable $should_update_unique_id = null,
        array &$id_mapping = [],
        array &$blocks_with_relations = [],
        int $recursion_level = 0
    ): void {
        $is_highest_level = $recursion_level === 0;
        $block_chunks = array_chunk($blocks, 3, true);

        foreach ($block_chunks as $chunk_index => $block_chunk) {
            foreach ($block_chunk as $block_index => $_) {
                $block = &$blocks[$block_index];

                $previous_unique_id = isset($block['attrs']['uniqueID']) ? $block['attrs']['uniqueID'] : null;
                if (!$previous_unique_id) {
                    continue;
                }

                $block_name = $block['blockName'];
                if (strpos($block_name, 'maxi-blocks') === false) {
                    continue;
                }

                if($should_update_unique_id == null || $should_update_unique_id($block)) {
                    $new_unique_id = self::unique_id_generator($block_name);
                    $id_mapping[$previous_unique_id] = $new_unique_id;

                    $block['attrs']['uniqueID'] = $new_unique_id;

                    if (isset($block['attrs']['background-layers'])) {
                        foreach ($block['attrs']['background-layers'] as $key => &$value) {
                            if (isset($value['background-svg-SVGData'])) {
                                $svg_data = &$value['background-svg-SVGData'];
                                foreach ($svg_data as $svg_data_key => $svg_data_value) {
                                    if (strpos($svg_data_key, $previous_unique_id) !== false) {
                                        $svg_data[$new_unique_id] = $svg_data_value;
                                        unset($svg_data[$svg_data_key]);
                                    }
                                }
                                unset($svg_data);
                            }

                            if (isset($value['background-svg-SVGElement'])) {
                                $value['background-svg-SVGElement'] = str_replace($previous_unique_id, $new_unique_id, $value['background-svg-SVGElement']);
                            }
                            unset($value);
                        }
                    }

                    $block['innerHTML'] = str_replace($previous_unique_id, $block['attrs']['uniqueID'], $block['innerHTML']);
                    $block['innerContent'] = array_map(function ($content) use ($previous_unique_id, $block) {
                        return is_string($content) ? str_replace($previous_unique_id, $block['attrs']['uniqueID'], $content) : $content;
                    }, $block['innerContent']);
                }

                if (isset($block['attrs']['relations']) && is_array($block['attrs']['relations'])) {
                    $blocks_with_relations[] = &$block;
                }

                if (!empty($block['innerBlocks'])) {
                    $this->update_unique_ids($block['innerBlocks'], $should_update_unique_id, $id_mapping, $blocks_with_relations, $recursion_level + 1);
                }
            }

            // Reset PHP maximum execution time for each chunk to avoid a timeout
            if ($this->max_execution_time != 0) {
                set_time_limit($this->max_execution_time - 2);
            }
        }

        if ($is_highest_level) {
            $this->update_attribute_relations($blocks_with_relations, $id_mapping);
        }
    }

    public static function generate_random_string()
    {
        $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
        $randomString = '';

        for ($i = 0; $i < 3; $i++) {
            $index = wp_rand(0, strlen($characters) - 1);
            $randomString .= $characters[$index];
        }

        return $randomString;
    }

    public static function unique_id_generator(string $block_name): string
    {
        $name = str_replace('maxi-blocks/', '', $block_name);
        $uniquePart = self::generate_random_string().substr(uniqid('', true), 0, 5);
        return "{$name}-{$uniquePart}-u";
    }

    /**
     * Updates the unique IDs in the attribute relations of the given blocks.
     *
     * @param array &$blocks_with_relations Array of references to blocks that contain attribute relations.
     * @param array &$id_mapping Mapping of old unique IDs to new unique IDs.
     */
    private function update_attribute_relations(array &$blocks_with_relations, array &$id_mapping): void
    {
        foreach ($blocks_with_relations as &$block) {
            if (is_array($block['attrs']['relations'])) {
                foreach ($block['attrs']['relations'] as &$relation) {
                    if (isset($relation['uniqueID']) && isset($id_mapping[$relation['uniqueID']])) {
                        $relation['uniqueID'] = $id_mapping[$relation['uniqueID']];
                    }
                }
            }
        }
    }

    /**
     * Transforms all string attributes in the content to JSON format
     * to get correct array of blocks from `parse_blocks` function later on.
     */
    private function prepare_content($content)
    {
        $pattern = '/<!-- wp:maxi-blocks\/\$?[a-zA-Z-]+ (.*?) -->/';
        if (preg_match_all($pattern, $content, $block_matches)) {
            foreach ($block_matches[1] as $block_content) {
                $attribute_pattern = '/"([^"]+)":\s*"([^"]+)"/';
                if (preg_match_all($attribute_pattern, $block_content, $matches)) {
                    foreach ($matches[2] as $match) {
                        $decoded = json_encode($match);
                        $decoded = substr($decoded, 1, -1);
                        if ($decoded) {
                            $content = str_replace($match, $decoded, $content);
                        }
                    }
                }
            }
        }

        return $content;
    }
}
