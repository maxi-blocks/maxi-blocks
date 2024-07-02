<?php
/**
 * MaxiBlocks Maxi Styles Class
 *
 * @since   1.2.0
 * @package MaxiBlocks
 */

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-style-cards.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/frontend/class-maxi-fonts.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/frontend/class-maxi-templates.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/frontend/class-maxi-reusable-blocks.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/frontend/class-maxi-custom-data.php';
require_once MAXI_PLUGIN_DIR_PATH . 'core/frontend/class-maxi-styles-utils.php';


class MaxiBlocks_Styles
{
    private static ?MaxiBlocks_Styles $instance = null;
    private static ?MaxiBlocks_Fonts_Processor $fonts_processor = null;
    private static ?MaxiBlocks_Templates_Processor $templates_processor = null;
    private static ?MaxiBlocks_Reusable_Blocks_Processor $reusable_blocks_processor = null;
    private static ?MaxiBlocks_Custom_Data_Processor $custom_data_processor = null;
    private static ?MaxiBlocks_Styles_Utils $styles_utils = null;
    private static ?string $active_theme = null;

    /**
     * Registers the plugin.
     */
    public static function register(): MaxiBlocks_Styles
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_Styles();
        }
        if (null === self::$active_theme) {
            self::$active_theme = self::get_active_theme();
        }

        self::register_processors();

        return self::$instance;
    }

    private static function register_processors(): void
    {
        $processors = [
            'fonts_processor' => MaxiBlocks_Fonts_Processor::class,
            'templates_processor' => MaxiBlocks_Templates_Processor::class,
            'reusable_blocks_processor' => MaxiBlocks_Reusable_Blocks_Processor::class,
            'custom_data_processor' => MaxiBlocks_Custom_Data_Processor::class,
            'styles_utils' => MaxiBlocks_Styles_Utils::class,
        ];

        foreach ($processors as $property => $class) {
            if (null === self::$$property) {
                self::$$property = $class::register();
            }
        }
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        if(self::should_apply_content_filter()) {
            add_filter('wp_enqueue_scripts', [$this, 'process_content_frontend']);
        }
    }

    private function should_apply_content_filter()
    {
        // Check if the REQUEST_URI contains context=edit
        if (isset($_SERVER['REQUEST_URI']) && strpos($_SERVER['REQUEST_URI'], 'context=edit') !== false) {
            return false; // Do not apply the filter for this context
        }

        return true; // Apply the filter in other cases
    }

    // Legacy function
    public function get_template_parts($content)
    {
        if ($content && array_key_exists('template_parts', $content)) {
            $template_parts = json_decode($content['template_parts'], true);
            if (!empty($template_parts)) {
                return $template_parts;
            }
        }

        /**
         * In case, when template has never been opened in FSE, it hadn't been saved in DB,
         * so it doesn't have template parts. In this case, we need to get default
         * template parts (header and footer).
         */
        $theme_name = self::$styles_utils->get_template_name();
        return [
            $theme_name . '//header',
            $theme_name . '//footer',
        ];
    }

    public function apply_content(string $name, array $content, int|string $id)
    {
        $is_content = $content && !empty($content);
        $is_template_part = is_string($name) && strpos($name, '-templates');
        $is_template = $is_template_part && str_ends_with($name, '-templates');

        if ($is_content) {
            $styles = $this->get_styles($content);
            $fonts = $this->get_fonts($content);

            if ($styles) {
                // Inline styles
                wp_register_style($name, false, [], MAXI_PLUGIN_VERSION);
                wp_enqueue_style($name);
                wp_add_inline_style($name, $styles);
            }

            if ($fonts) {
                self::$fonts_processor->enqueue_fonts($fonts, $name);
            }
        } elseif (self::$styles_utils->get_template_name() === 'maxi-theme' && $is_template_part) {
            do_action('maxi_enqueue_template_styles', $name, $id, $is_template);
        }

        if ($is_template) {
            $template_parts = $this->get_template_parts($content);

            if ($template_parts && !empty($template_parts)) {
                foreach ($template_parts as $template_part) {
                    $template_part_name = 'maxi-blocks-style-templates-' . @end(explode('//', $template_part, 2));
                    $content = $this->get_content(true, $template_part);
                    if($content) {
                        $this->apply_content($template_part_name, $content, $template_part);
                    }
                }
            }
        }
    }

    public function get_content(bool $is_template = false, int $id = null) : array|false
    {
        global $post;

        if ((!$is_template && (!$post || !isset($post->ID))) || !$id) {
            return false;
        }

        global $wpdb;
        $content_array = [];
        if ($is_template) {
            // Prepare and execute the query for templates
            $content_array = (array) $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}maxi_blocks_styles_templates WHERE template_id = %s",
                    $id
                ),
                OBJECT
            );
        } else {
            // Prepare and execute the query for posts
            $content_array = (array) $wpdb->get_results(
                $wpdb->prepare(
                    "SELECT * FROM {$wpdb->prefix}maxi_blocks_styles WHERE post_id = %d",
                    $id
                ),
                OBJECT
            );
        }

        if (!$content_array || empty($content_array)) {
            return false;
        }

        $content = $content_array[0];

        if (!$content || empty($content)) {
            return false;
        }

        return json_decode(wp_json_encode($content), true);
    }

    public function get_styles(array $content): string|bool
    {
        $style =
            is_preview() || is_admin()
                ? $content['prev_css_value']
                : $content['css_value'];

        if (!$style || empty($style)) {
            return false;
        }

        $style = $this->update_color_palette_backups($style);

        return $style;
    }

    public function get_fonts(array $content): array|false
    {
        if(!isset($content['fonts_value'])) {
            return false;
        }
        $fonts =
            is_preview() || is_admin()
                ? $content['prev_fonts_value']
                : $content['fonts_value'];

        if (!$fonts || empty($fonts)) {
            return false;
        }

        return json_decode($fonts, true);
    }

    public function update_color_palette_backups(string $style): string
    {
        global $wpdb;

        $style_card = maybe_unserialize(
            $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT object FROM {$wpdb->prefix}maxi_blocks_general where id = %s",
                    'sc_string'
                )
            )
        );

        if (!$style_card) {
            return $style;
        }

        // Get used colors on the post style
        $needle = 'rgba(var(--maxi-';
        $last_pos = 0;
        $colors = [];

        while (($last_pos = strpos($style, $needle, $last_pos)) !== false) {
            $end_pos = strpos($style, ')', $last_pos);
            $color_str = substr($style, $last_pos, $end_pos - $last_pos + 1);

            if (!in_array($color_str, $colors)) {
                $colors[] = $color_str;
            }

            $last_pos = $last_pos + strlen($needle);
        }

        // Get color values from the SC considering the used on post style
        $color_vars = [];

        foreach ($colors as $color) {
            $color = str_replace('rgba(var(', '', $color);
            $color_var = explode(',', $color)[0];
            $color_content = str_replace($color_var, '', $color);
            $color_content = str_replace(')', '', $color_content);
            $color_content = ltrim($color_content, ',');

            if (!in_array($color_var, $color_vars)) {
                $color_vars[$color_var] = $color_content;
            }
        }

        $changed_sc_colors = [];

        if (!array_key_exists('_maxi_blocks_style_card', $style_card)) {
            $style_card['_maxi_blocks_style_card'] =
                $style_card['_maxi_blocks_style_card_preview'];
        }

        $style_card =
            is_preview() || is_admin()
                ? $style_card['_maxi_blocks_style_card_preview']
                : $style_card['_maxi_blocks_style_card'];

        foreach ($color_vars as $color_key => $color_value) {
            $start_pos = strpos($style_card, $color_key);
            $end_pos = strpos($style_card, ';--', $start_pos);
            $color_sc_value = substr(
                $style_card,
                $start_pos + strlen($color_key) + 1,
                $end_pos - $start_pos - strlen($color_key) - 1
            );

            if ($color_sc_value !== $color_value) {
                $changed_sc_colors[$color_key] = $color_sc_value;
            }
        }

        // In case there are changes, fix them
        if (empty($changed_sc_colors)) {
            return $style;
        } else {
            $new_style = $style;

            foreach ($changed_sc_colors as $color_key => $color_value) {
                $old_color_str =
                    "rgba(var($color_key," . $color_vars[$color_key] . ')';
                $new_color_str = "rgba(var($color_key," . $color_value . ')';

                $new_style = str_replace(
                    $old_color_str,
                    $new_color_str,
                    $new_style
                );
            }

            // Replaces all ,NUMBER)),SECOND_NUMBER) to ,SECOND_NUMBER) where SECOND_NUMBER can be a decimal
            $new_style = preg_replace(
                '/,\d+\)\),(\d+(\.\d+)?\))/',
                ',$1',
                $new_style
            );

            return $new_style;
        }
    }

    /***************************** NEW CODE PER BLOCK ****************************/

    private function filter_recursive($input)
    {
        foreach ($input as &$value) {
            if (is_array($value)) {
                $value = $this->filter_recursive($value);
            }
        }
        return array_filter($input, function ($v) {
            return !(is_array($v) && count($v) == 0);
        });
    }

    public function process_content_frontend(): void
    {
        $post_id = self::$styles_utils->get_id();
        $content_meta_fonts = $this->get_content_meta_fonts_frontend($post_id, 'maxi-blocks-styles');

        if ($content_meta_fonts['meta'] !== null) {
            $meta_filtered = $this->filter_recursive($content_meta_fonts['meta']);
            self::$custom_data_processor->process_scripts($meta_filtered);
        }
    }

    private function get_content_meta_fonts_frontend(int|string $id, string $content_key): array
    {
        $data = $this->get_content_for_blocks_frontend($id);

        if(!empty($data) && isset($data['content']) && isset($data['meta']) && isset($data['fonts'])) {
            $this->apply_content($content_key, $data['content'], $id);
            self::$fonts_processor->enqueue_fonts($data['fonts'], $content_key);

            return [
                'content' => $data['content'],
                'meta' => $data['meta'],
                'fonts' => $data['fonts'],
            ];
        }
        return ['content' => null, 'meta' => null, 'fonts' => null];
    }

    /**
     * Processes the provided blocks to extract styles, fonts, and other metadata.
     */
    private function process_blocks_frontend(array $blocks): array
    {
        $styles = '';
        $prev_styles = '';
        $active_custom_data_array = [];
        $fonts = [];

        $style_cards = new MaxiBlocks_StyleCards();
        $current_style_cards = $style_cards->get_maxi_blocks_active_style_card();

        $gutenberg_blocks_status = $current_style_cards && array_key_exists('gutenberg_blocks_status', $current_style_cards) && $current_style_cards['gutenberg_blocks_status'];

        foreach ($blocks as $block) {
            $this->process_block_frontend($block, $fonts, $styles, $prev_styles, $active_custom_data_array, $gutenberg_blocks_status);
        }

        return [$styles, $prev_styles, $active_custom_data_array, $fonts];
    }

    /**
     * Gets content for blocks
     */
    public function process_block_frontend(
        array $block,
        array &$fonts,
        string &$styles,
        string &$prev_styles,
        array &$active_custom_data_array,
        bool &$gutenberg_blocks_status,
        string $maxi_block_style = ''
    ): void {
        global $wpdb;

        $block_name = $block['blockName'] ?? '';
        $props = $block['attrs'] ?? [];
        $unique_id = $props['uniqueID'] ?? null;
        $is_core_block = str_starts_with($block_name, 'core/');

        if($gutenberg_blocks_status && $is_core_block && $maxi_block_style) {
            $level = $props['level'] ?? null;
            $text_level = null;

            if($block_name === 'core/button') {
                $text_level = 'button';
            } elseif($block_name === 'core/navigation') {
                $text_level = 'navigation';
                $remove_hover_underline = MaxiBlocks_StyleCards::get_active_style_cards_value_by_name($maxi_block_style, 'navigation', 'remove-hover-underline');
                if($remove_hover_underline) {
                    $styles .= ' .maxi-blocks--active .maxi-container-block .wp-block-navigation ul li a:hover { text-decoration: none; }';
                }
            } elseif($level) {
                $text_level = 'h' . $level;
            } else {
                $text_level = 'p';
            }

            $fonts_array = get_all_fonts([], false, false, $text_level, $maxi_block_style, false);
            $fonts = array_merge($fonts, $fonts_array);
        }

        if(!$maxi_block_style && str_starts_with($block_name, 'maxi-blocks/')) {
            $maxi_block_style = $props['blockStyle'] ?? 'light';
        }

        if (empty($props) || !isset($unique_id) || !$unique_id) {
            if (empty($block['innerBlocks'])) {
                return;
            }
            foreach ($block['innerBlocks'] as $innerBlock) {
                $this->process_block_frontend($innerBlock, $fonts, $styles, $prev_styles, $active_custom_data_array, $gutenberg_blocks_status, $maxi_block_style);
            }
        }

        $content_array_block = $wpdb->get_results(
            $wpdb->prepare(
                "SELECT * FROM {$wpdb->prefix}maxi_blocks_styles_blocks WHERE block_style_id = %s",
                $unique_id
            ),
            ARRAY_A
        );

        $content_block = $content_array_block[0] ?? null;

        if (!isset($content_block) || empty($content_block)) {
            if(empty($block['innerBlocks'])) {
                return;
            }
            foreach ($block['innerBlocks'] as $innerBlock) {
                $this->process_block_frontend($innerBlock, $fonts, $styles, $prev_styles, $active_custom_data_array, $gutenberg_blocks_status, $maxi_block_style);
            }
        }

        if (isset($content_block['css_value'])) {
            if($block_name === 'maxi-blocks/container-maxi' && $props['isFirstOnHierarchy'] && strpos($content_block['css_value'], 'min-width:100%') !== false) {
                if(self::$active_theme === "2023" || self::$active_theme === "2024") {
                    $new_styles = "body.maxi-blocks--active .has-global-padding > #$unique_id {
					margin-right: calc(var(--wp--style--root--padding-right) * -1) !important;
					margin-left: calc(var(--wp--style--root--padding-left) * -1) !important;
					min-width: calc(100% + var(--wp--style--root--padding-right) + var(--wp--style--root--padding-left)) !important;
				}";
                    $content_block['css_value'] .= $new_styles;
                }
                if(self::$active_theme === 2022) {
                    $new_styles = "body.maxi-blocks--active .wp-site-blocks .entry-content > #$unique_id {
					margin-left: calc(-1 * var(--wp--custom--spacing--outer)) !important;
					margin-right: calc(-1 * var(--wp--custom--spacing--outer)) !important;
					min-width: calc(100% + var(--wp--custom--spacing--outer) * 2) !important;
				}";
                    $content_block['css_value'] .= $new_styles;
                }
                if(self::$active_theme === 'astra') {
                    $new_styles = "body.maxi-blocks--active .entry-content > #$unique_id {
						margin-left: calc( -50vw + 50%);
						margin-right: calc( -50vw + 50%);
						max-width: 100vw;
						width: 100vw;
				}";
                    $content_block['css_value'] .= $new_styles;
                }
            }
            $styles .= ' ' . $content_block['css_value'];
        }

        if (isset($content_block['prev_css_value'])) {
            $prev_styles .= ' ' . $content_block['prev_css_value'];
        }

        if (isset($content_block['active_custom_data'])) {
            self::$custom_data_processor->process_custom_data_frontend($block_name, $unique_id, $active_custom_data_array);
        }

        // fonts
        // TODO: split fonts and prev_fonts
        foreach (['prev_fonts_value', 'fonts_value'] as $fonts_key) {
            $fonts_json = $content_block[$fonts_key] ?? null;

            if ($fonts_json !== '' && $fonts_json !== null) {
                $fonts_array = json_decode($fonts_json, true) ?? [];
            } else {
                $fonts_array = [];
            }

            $fonts = array_merge($fonts, $fonts_array);
        }

        // Process inner blocks, if any
        if (!empty($block['innerBlocks'])) {
            foreach ($block['innerBlocks'] as $innerBlock) {
                $this->process_block_frontend($innerBlock, $fonts, $styles, $prev_styles, $active_custom_data_array, $gutenberg_blocks_status, $maxi_block_style);
            }
        }
    }

    /**
     * Fetches content for blocks with various optimizations.
     */
    public function get_content_for_blocks_frontend(int $id = null, string $passed_content = null): array
    {
        global $post;

        $post = $id ? get_post($id) : get_post();

        // Fetch blocks from template parts.
        $template_id = self::$styles_utils->get_id(true);
        $blocks = self::$templates_processor->fetch_blocks_by_template_id($template_id);

        $specific_archives = ['tag', 'category', 'author', 'date'];
        // Attempt to replace a specific archive type with 'archive' in the template_id
        $modified_template_id = $template_id;
        foreach ($specific_archives as $archive_type) {
            if (strpos($template_id, $archive_type) !== false) {
                // Replace the first occurrence of the archive_type with 'archive'
                $modified_template_id = preg_replace('/' . preg_quote($archive_type, '/') . '/', 'archive', $template_id, 1);
                break; // Exit the loop once a match is found and replacement is done
            }
        }

        // Check if the modification was successful and the modified template_id is different
        if ($modified_template_id !== $template_id) {
            // Fetch blocks for the modified template_id which now targets 'archive'
            $blocks_all_archives = self::$templates_processor->fetch_blocks_by_template_id($modified_template_id);

            // Merge the blocks specific to the archive with the general archive blocks
            $blocks = array_merge($blocks, $blocks_all_archives);
        }

        $blocks_post = [];

        // Fetch blocks from passed content or from the global post.
        if($passed_content) {
            $blocks_post = parse_blocks($passed_content);
        } elseif($post) {
            if(is_preview()) {
                $revisions = wp_get_post_revisions($post->ID);

                if (!empty($revisions)) {
                    $latest_revision = array_shift($revisions);
                    $blocks_post = parse_blocks($latest_revision->post_content);
                }
            } else {
                $blocks_post = parse_blocks($post->post_content);
            }
        }

        // Merge the blocks.
        if (is_array($blocks_post) && !empty($blocks_post)) {
            $blocks = array_merge_recursive($blocks, $blocks_post);
        }

        if (empty($blocks)) {
            return [];
        }

        // Fetch and parse reusable blocks.
        $reusable_blocks = self::$reusable_blocks_processor->get_parsed_reusable_blocks_frontend($blocks);

        if (!empty($reusable_blocks)) {
            $blocks = array_merge_recursive($blocks, $reusable_blocks);
        }

        // Process the blocks to extract styles and other metadata.
        [$styles, $prev_styles, $active_custom_data_array, $fonts] = $this->process_blocks_frontend($blocks);

        // Construct the content array.
        $content = [
            'css_value' => $styles,
            'prev_css_value' => $prev_styles,
        ];

        return ['content' => json_decode(wp_json_encode($content), true), 'meta' => $active_custom_data_array, 'fonts'=> $fonts];
    }

    public static function get_active_theme(): string
    {
        $current_theme = wp_get_theme();

        if ('Twenty Twenty-Four' === $current_theme->name || 'twentytwentyfour' === $current_theme->template) {
            return '2024';
        }
        if ('Twenty Twenty-Three' === $current_theme->name || 'twentytwentythree' === $current_theme->template) {
            return '2023';
        }
        if ('Twenty Twenty-Two' === $current_theme->name || 'twentytwentytwo' === $current_theme->template) {
            return '2022';
        }
        if ('Astra' === $current_theme->name || 'astra' === $current_theme->template) {
            return 'astra';
        }

        return 0; // another theme
    }
}
