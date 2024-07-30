<?php

if (!defined('ABSPATH')) {
    exit();
}

require_once MAXI_PLUGIN_DIR_PATH . 'core/frontend/helpers/class-maxi-style-utils.php';


class MaxiBlocks_Custom_Data_Processor
{
    private static ?self $instance = null;
    private static ?MaxiBlocks_Style_Utils $style_utils = null;

    public static function register(): void
    {
        if (null === self::$instance) {
            self::$instance = new self();
        }
        if (null === self::$style_utils) {
            self::$style_utils = MaxiBlocks_Style_Utils::get_instance();
        }
    }

    public static function get_instance(): self
    {
        self::register();
        return self::$instance;
    }

    public function process_scripts(array $post_meta): void
    {
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
            'slider',
            'navigation',
        ];

        $script_attr = [
            'bg-video',
            'parallax',
            'scroll-effects',
            'shape-divider',
            'relations',
            'navigation',
        ];

        foreach ($scripts as $script) {
            $js_var = str_replace('-', '_', $script);
            $js_var_to_pass = 'maxi' . str_replace(' ', '', ucwords(str_replace('-', ' ', $script)));
            $js_script_name = 'maxi-' . $script;
            $js_script_path = '//js//min//' . $js_script_name . '.min.js';
            //$js_script_path = '//js//' . $js_script_name . '.js';

            $block_meta = $this->custom_meta($js_var, false);
            $template_meta = $this->custom_meta($js_var, true);
            $meta_to_pass = [];

            $meta = array_merge_recursive($post_meta, $block_meta, $template_meta);
            $match = false;
            $block_names = [];

            foreach ($meta as $key => $value) {
                if(str_contains($key, $script)) {
                    $match = true;
                    $block_names[] = $key;
                } else {
                    if(is_array($value) && in_array($script, $script_attr)) {
                        foreach ($value as $k => $v) {
                            if(gettype($v) === 'string' && (str_contains($v, $script) || str_contains($v, $js_var))) {
                                $match = true;
                                $block_names[] = $key;
                            }
                        }
                    }
                }
            }

            if ($match) {
                foreach ($block_names as $block_name) {
                    if(!str_contains($block_name, 'maxi-blocks')) {
                        continue;
                    }
                    if($script === 'relations') {
                        foreach ($meta[$block_name] as $json) {
                            if (is_string($json)) {
                                $array = json_decode($json, true);
                                if (isset($array['relations'])) {
                                    $meta_to_pass = array_merge($meta_to_pass, $array['relations']);  // Add the 'relations' value to the new array
                                }
                            }
                        }
                    } elseif($script === 'navigation') {
                        foreach ($meta[$block_name] as $json) {
                            if (is_string($json)) {
                                $array = json_decode($json, true);
                                if (isset($array['navigation'])) {
                                    $block_style = $array['navigation']['style'];
                                    $overwrite_mobile = MaxiBlocks_StyleCards::get_active_style_cards_value_by_name($block_style, 'navigation', 'overwrite-mobile');
                                    if($overwrite_mobile) {
                                        $always_show_mobile = MaxiBlocks_StyleCards::get_active_style_cards_value_by_name($block_style, 'navigation', 'always-show-mobile');
                                        $show_mobile_down_from = MaxiBlocks_StyleCards::get_active_style_cards_value_by_name($block_style, 'navigation', 'show-mobile-down-from');
                                        $meta[$block_name]['navigation']['always-show-mobile'] = $always_show_mobile;
                                        $meta[$block_name]['navigation']['show-mobile-down-from'] = $show_mobile_down_from;
                                    }

                                    $meta_to_pass = array_merge($meta_to_pass, $meta[$block_name]);
                                }
                            }
                        }
                    } else {
                        $meta_to_pass = array_merge($meta_to_pass, $meta[$block_name]);
                    }

                }

                if(!empty($meta_to_pass)) {
                    $this->enqueue_script_per_block($script, $js_script_name, $js_script_path, $js_var_to_pass, $js_var, $meta_to_pass);
                }
            }
        }
    }

    private function enqueue_script_per_block(
        string $script,
        string $js_script_name,
        string $js_script_path,
        string $js_var_to_pass,
        string $js_var,
        array $meta
    ): void {
        if ($script === 'number-counter') {
            wp_enqueue_script('maxi-waypoints-js', plugins_url('/js/waypoints.min.js', MAXI_PLUGIN_DIR_FILE), [], MAXI_PLUGIN_VERSION, array(
                'strategy'  => 'defer', 'in_footer' => true
                ));
        }

        $prefetch_url = plugins_url($js_script_path, MAXI_PLUGIN_DIR_FILE);

        $strategy = 'defer';
        $version = MAXI_PLUGIN_VERSION;

        if ($script === 'relations') {
            $strategy = 'async';
        }

        wp_enqueue_script($js_script_name, $prefetch_url, [], $version, array(
            'strategy'  => $strategy, 'in_footer' => true
            ));
        wp_localize_script($js_script_name, $js_var_to_pass, $this->get_block_data($js_var, $meta));

        // Add prefetch link for the script
        echo "<link rel='prefetch' href='$prefetch_url' as='script'>";
    }

    public function get_block_data(string $js_var, array $meta)
    {
        switch ($js_var) {
            case 'search':
                return [$meta, home_url('/') . '?s='];
                break;
            case 'map':
                return [$meta, get_option('google_api_key_option')];
                break;
            default:
                return [$meta];
                break;
        }
    }

    public function block_needs_custom_meta(string $unique_id): bool
    {
        global $wpdb;

        $active_custom_data = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT active_custom_data FROM {$wpdb->prefix}maxi_blocks_styles_blocks WHERE block_style_id = %s",
                $unique_id
            )
        );

        return (bool)$active_custom_data;
    }

    public function custom_meta(string $metaJs, bool $is_template = false, int|string $id = null)
    {
        global $post;
        if ((!$is_template && (!$post || !isset($post->ID))) || empty($metaJs)) {
            return [];
        }

        if (!$id) {
            $id = self::$style_utils->get_id($is_template);
        }

        $custom_data = $this->get_meta($id, $is_template);

        if (!$custom_data) {
            return [];
        }

        $result_arr = (array) $custom_data[0];
        $result_string = $result_arr['custom_data_value'];
        $result = maybe_unserialize($result_string);

        if (!$result || empty($result)) {
            return [];
        }

        if (!isset($result[$metaJs])) {
            return [];
        }

        $result_decoded = $result[$metaJs];

        // TODO: This is a temporary solution to fix the issue with the bg_video, scroll_effects and slider meta
        if (in_array($metaJs, ['bg_video', 'scroll_effects', 'slider'])) {
            return [ true ];
        }

        if (!is_array($result_decoded) || empty($result_decoded)) {
            return [];
        }

        return $result_decoded;
    }

    public function get_meta(int|string $id, bool $is_template = false)
    {
        global $wpdb;
        $table_name = $wpdb->prefix . 'maxi_blocks_custom_data' . ($is_template ? '_templates' : '');

        if ($wpdb->get_var($wpdb->prepare("SHOW TABLES LIKE %s", $table_name)) == $table_name) {
            global $post;

            if ((!$is_template && (!$post || !isset($post->ID))) || !$id) {
                return false;
            }

            $response = '';
            if ($is_template) {
                // Prepare and execute the query for templates
                $response = $wpdb->get_results(
                    $wpdb->prepare(
                        "SELECT custom_data_value FROM {$wpdb->prefix}maxi_blocks_custom_data_templates WHERE template_id = %s",
                        $id
                    ),
                    OBJECT
                );
            } else {
                // Prepare and execute the query for posts
                $response = $wpdb->get_results(
                    $wpdb->prepare(
                        "SELECT custom_data_value FROM {$wpdb->prefix}maxi_blocks_custom_data WHERE post_id = %d",
                        $id
                    ),
                    OBJECT
                );
            }

            if (!$response) {
                $response = '';
            }

            return $response;
        }

    }

    /**
     * Process custom data
     *
     * @param array $block
     * @param string $unique_id
     * @param array &$active_custom_data_array
     */
    public function process_custom_data_frontend(string $block_name, string $unique_id, array &$active_custom_data_array)
    {
        global $wpdb;

        $block_meta = $wpdb->get_var(
            $wpdb->prepare(
                "SELECT custom_data_value FROM {$wpdb->prefix}maxi_blocks_custom_data_blocks WHERE block_style_id = %s",
                $unique_id
            )
        );

        if (!empty($block_meta)) {
            if (isset($active_custom_data_array[$block_name])) {
                $active_custom_data_array[$block_name] = array_merge($active_custom_data_array[$block_name], [$unique_id => $block_meta]);
            } else {
                $active_custom_data_array[$block_name] = [$unique_id => $block_meta];
            }
        }
    }
}
