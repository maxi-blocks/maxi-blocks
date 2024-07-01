<?php

// Exit if accessed directly.
if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-style-cards.php';

class MaxiBlocks_Styles_Legacy
{
    private static ?MaxiBlocks_Styles_Legacy $instance = null;
    private static ?MaxiBlocks_Styles $styles_instance = null;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_Styles_Legacy();
        }

        if(null === self::$styles_instance) {
            self::$styles_instance = new MaxiBlocks_Styles();
        }
    }

    /**
     * Constructor
     */
    public function __construct()
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'maxi_blocks_styles';

        if ($wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table_name)) == $table_name) {
            add_action('wp_enqueue_scripts', [$this, 'enqueue_styles']);
        }
    }
    public function enqueue_styles()
    {
        $post_id = self::$styles_instance->get_id();
        $post_content = self::$styles_instance->get_content(false, $post_id);
        self::$styles_instance->apply_content('maxi-blocks-styles', $post_content, $post_id);

        $template_id = self::$styles_instance->get_id(true);
        $template_content = self::$styles_instance->get_content(true, $template_id);
        self::$styles_instance->apply_content('maxi-blocks-styles-templates', $template_content, $template_id);

        if ($this->need_custom_meta([['content' => $post_content], ['content' => $template_content, 'is_template' => true]])) {
            $scripts = [
                'hover-effects',
                'bg-video',
                'parallax',
                'scroll-effects',
                'number-counter',
                'shape-divider',
                'relations',
                'video',
                'search',
                'map',
                'accordion',
                'slider'
            ];

            $template_parts = self::$styles_instance->get_template_parts($template_content);

            foreach ($scripts as &$script) {
                $js_var = str_replace('-', '_', $script);
                $js_var_to_pass =
                    'maxi' .
                    str_replace(
                        ' ',
                        '',
                        ucwords(str_replace('-', ' ', $script))
                    );
                $js_script_name = 'maxi-' . $script;
                $js_script_path = '//js//min//' . $js_script_name . '.min.js';

                $post_meta = self::$styles_instance->custom_meta($js_var, false);
                $template_meta = self::$styles_instance->custom_meta($js_var, true);
                $template_parts_meta = [];

                if ($template_parts && !empty($template_parts)) {
                    foreach ($template_parts as $template_part_id) {
                        $template_parts_meta = array_merge($template_parts_meta, self::$styles_instance->custom_meta($js_var, true, $template_part_id));
                    }
                }

                $meta = array_merge($post_meta, $template_meta, $template_parts_meta);

                if (!empty($meta)) {
                    if ($script === 'number-counter') {
                        wp_enqueue_script(
                            'maxi-waypoints-js',
                            plugins_url(
                                '/js/waypoints.min.js',
                                dirname(__FILE__)
                            ),
                            array(),
                            MAXI_PLUGIN_VERSION,
                            true
                        );
                    }

                    wp_enqueue_script(
                        $js_script_name,
                        plugins_url($js_script_path, dirname(__FILE__)),
                        array(),
                        MAXI_PLUGIN_VERSION,
                        true
                    );

                    wp_localize_script($js_script_name, $js_var_to_pass, self::$styles_instance->get_block_data($js_var, $meta));
                }
            }
        }
    }

    public function need_custom_meta($contents)
    {
        $need_custom_meta = false;

        if ($contents) {
            foreach ($contents as $contentData) {
                $content = $contentData['content'] ?? null;
                $is_template = $contentData['is_template'] ?? false;
                $is_template_part = $contentData['is_template_part'] ?? false;

                if ($content) {
                    if (
                        ((isset($content['prev_active_custom_data']) && (int) $content['prev_active_custom_data'] === 1) ||
                        (isset($content['active_custom_data']) && (int) $content['active_custom_data'] === 1))
                    ) {
                        $need_custom_meta = true;
                        break;
                    }
                }

                if ($is_template && !$is_template_part) {
                    $template_parts = self::$styles_instance->get_template_parts($content);

                    if ($template_parts) {
                        foreach ($template_parts as $template_part) {
                            $template_part_content = self::$styles_instance->get_content(true, $template_part);
                            if ($template_part_content && $this->need_custom_meta([['content' => $template_part_content, 'is_template_part' => true]])) {
                                $need_custom_meta = true;
                                break;
                            }
                        }
                    }
                }
            }
        }

        return $need_custom_meta;
    }
}
