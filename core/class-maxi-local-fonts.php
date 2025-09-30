<?php
require_once MAXI_PLUGIN_DIR_PATH . 'core/class-maxi-style-cards.php';

class MaxiBlocks_Local_Fonts
{
    /**
     * This plugin's instance.
     *
     * @var MaxiBlocks_Local_Fonts
     */
    private static $instance;

    /**
     * Registers the plugin.
     */
    public static function register()
    {
        if (null === self::$instance) {
            self::$instance = new MaxiBlocks_Local_Fonts();
        }
    }

    public static function get_instance()
    {
        self::register();
        return self::$instance;
    }

    /**
     * Variables
     */
    private $fonts_upload_dir;

    /**
     * Constructor
     */
    public function __construct()
    {
        $this->fonts_upload_dir = wp_upload_dir()['basedir'] . '/maxi/fonts';
    }

    public function process_single_font(string $font_name, ?array $font_data = null)
    {
        // Check if fonts are disabled
        if (!(bool) get_option('local_fonts')) {
            return false;
        }

        $font_name_sanitized = $this->sanitize_font_name($font_name);
        $font_dir = $this->fonts_upload_dir . '/' . $font_name_sanitized;

        // If font directory and style.css exist, font is already processed
        if (is_dir($font_dir) && file_exists($font_dir . '/style.css')) {
            return true;
        }

        // Create font URL
        $use_bunny_fonts = (bool) get_option('bunny_fonts');
        $font_api_url = $use_bunny_fonts
            ? 'https://fonts.bunny.net'
            : 'https://fonts.googleapis.com';
        // Use the original font name for the URL to maintain proper capitalization
        $font_url =
            $font_api_url . '/css2?family=' . str_replace(' ', '+', $font_name);

        // Generate complete font URL with weights/styles
        $font_url = $this->generate_font_url($font_url, $font_data);

        // Create directory and upload font
        $this->create_upload_folder();
        $this->upload_css_file($font_name_sanitized, $font_url);

        return true;
    }

    public function process_all_fonts()
    {
        // Check if fonts are disabled
        if (!(bool) get_option('local_fonts')) {
            return false;
        }

        // Check if fonts are already uploaded
        if ((bool) get_option('local_fonts_uploaded')) {
            return false;
        }

        $all_fonts = $this->get_all_fonts_db();

        if (is_array($all_fonts) && !empty($all_fonts)) {
            $all_urls = $this->construct_font_urls($all_fonts);

            if (is_array($all_urls) && !empty($all_urls)) {
                $this->create_upload_folder();
                $this->upload_css_files($all_urls);
            }
            update_option('local_fonts_uploaded', true);
        }
    }

    public function get_all_fonts_db()
    {
        global $wpdb;

        $post_content_array = [];
        $post_content_templates_array = [];
        $prev_post_content_array = [];
        $prev_post_content_templates_array = [];
        $blocks_content_array = [];
        $prev_blocks_content_array = [];
        $sc_string = '';

        if ($this->check_table_exists('maxi_blocks_styles')) {
            // Fetch the distinct fonts_value directly
            $post_content_array = (array) $wpdb->get_col(
                "SELECT DISTINCT fonts_value FROM {$wpdb->prefix}maxi_blocks_styles",
            );

            // Fetch the distinct prev_fonts_value directly
            $prev_post_content_array = (array) $wpdb->get_col(
                "SELECT DISTINCT prev_fonts_value FROM {$wpdb->prefix}maxi_blocks_styles",
            );
        }

        // For templates
        if ($this->check_table_exists('maxi_blocks_styles_templates')) {
            $post_content_templates_array = (array) $wpdb->get_col(
                "SELECT DISTINCT fonts_value FROM {$wpdb->prefix}maxi_blocks_styles_templates",
            );

            $prev_post_content_templates_array = (array) $wpdb->get_col(
                "SELECT DISTINCT prev_fonts_value FROM {$wpdb->prefix}maxi_blocks_styles_templates",
            );
        }


        // For blocks
        if ($this->check_table_exists('maxi_blocks_styles_blocks')) {
            $blocks_content_array = (array) $wpdb->get_col(
                "SELECT DISTINCT fonts_value FROM {$wpdb->prefix}maxi_blocks_styles_blocks",
            );

            $prev_blocks_content_array = (array) $wpdb->get_col(
                "SELECT DISTINCT prev_fonts_value FROM {$wpdb->prefix}maxi_blocks_styles_blocks",
            );
        }

        // $sc_string
        if ($this->check_table_exists('maxi_blocks_general')) {
            $sc_string = $wpdb->get_var(
                $wpdb->prepare(
                    "SELECT id FROM {$wpdb->prefix}maxi_blocks_general WHERE id = %s",
                    'sc_string',
                ),
            );
        }

        if (
            empty($post_content_array) &&
            empty($prev_post_content_array) &&
            empty($post_content_templates_array) &&
            empty($prev_post_content_templates_array) &&
            empty($blocks_content_array) &&
            empty($prev_blocks_content_array) &&
            $sc_string === ''
        ) {
            return false;
        }

        $post_content_array = array_merge(
            $post_content_array,
            $blocks_content_array,
        );
        $prev_post_content_array = array_merge(
            $prev_post_content_array,
            $prev_blocks_content_array,
        );


        foreach ($post_content_array as $font) {
            $array[] = $font;
        }

        if (!empty($prev_post_content_array)) {
            foreach ($prev_post_content_array as $font) {
                $array[] = $font;
            }
        }

        if (!empty($post_content_templates_array)) {
            foreach ($post_content_templates_array as $font) {
                $array[] = $font;
            }
        }

        if (!empty($prev_post_content_templates_array)) {
            foreach ($prev_post_content_templates_array as $font) {
                $array[] = $font;
            }
        }

        if (empty($array)) {
            return false;
        }

        foreach ($array as $key => $value) {
            if (isset($value)) {
                $array[$key] = json_decode($value, true);
            }
        }

        $array = array_filter($array, function ($arr) {
            return $arr !== null && $arr !== false && $arr !== '';
        });

        if (empty($array)) {
            return false;
        }

        $array_all = array_merge_recursive(...$array);

        return $array_all;
    }

    public function generate_font_url($font_url, $font_data)
    {
        if (empty($font_data)) {
            return rtrim($font_url, ':') . '&display=swap';
        }

        // For legacy reasons font data is saved both as 'weight' ('style') and 'fontWeight' ('fontStyle')
        // See https://github.com/maxi-blocks/maxi-blocks/pull/4305#discussion_r1098988152
        $font_weight =
            $font_data['fontWeight'] ?? ($font_data['weight'] ?? false);
        $font_style = $font_data['fontStyle'] ?? ($font_data['style'] ?? false);

        $font_url .= $this->build_font_style_string($font_style);
        $font_url .= $this->build_font_weight_string($font_weight, $font_style);
        $font_url .= '&display=swap';

        return $font_url;
    }

    private function build_font_style_string($font_style)
    {
        return $font_style === 'italic' ? 'ital,' : '';
    }

    private function build_font_weight_string($font_weight, $font_style)
    {
        if (!$font_weight) {
            return $this->get_default_weight_string($font_style);
        }

        $weights = $this->normalize_weights($font_weight);

        if (count($weights) > 1) {
            return $this->get_multiple_weights_string($weights, $font_style);
        }

        return $this->get_single_weight_string($weights[0], $font_style);
    }

    private function normalize_weights($font_weight)
    {
        $weight_string = is_array($font_weight)
            ? implode(',', $font_weight)
            : $font_weight;
        $weights = array_unique(explode(',', $weight_string));
        sort($weights);
        return $weights;
    }

    private function get_multiple_weights_string($weights, $font_style)
    {
        $result = 'wght@';
        foreach ($weights as $weight) {
            if ($font_style === 'italic') {
                $result .= "0,$weight;1,$weight;";
            } else {
                $result .= "$weight;";
            }
        }
        return rtrim($result, ';');
    }

    private function get_single_weight_string($weight, $font_style)
    {
        if ($font_style === 'italic') {
            return "wght@0,$weight;1,$weight";
        }
        return "wght@$weight";
    }

    private function get_default_weight_string($font_style)
    {
        return $font_style === 'italic' ? 'wght@0,400;1,400' : 'wght@400';
    }

    public function construct_font_urls($all_fonts)
    {
        $response = [];
        foreach ($all_fonts as $font_name => $font_data) {
            if (strpos($font_name, 'sc_font') !== false) {
                $split_font = explode(
                    '_',
                    str_replace('sc_font_', '', $font_name),
                );
                if (isset($split_font)) {
                    $block_style = isset($split_font[0])
                        ? $split_font[0]
                        : 'light';
                    $text_level = isset($split_font[1]) ? $split_font[1] : 'p';
                    $breakpoint = isset($split_font[2])
                        ? $split_font[2]
                        : 'general';

                    if (class_exists('MaxiBlocks_StyleCards')) {
                        $sc_fonts = MaxiBlocks_StyleCards::get_maxi_blocks_style_card_fonts(
                            $block_style,
                            $text_level,
                            $breakpoint,
                        );

                        @[$font_name] = $sc_fonts;
                    }
                }
            }

            $font_name_sanitized = str_replace(' ', '+', $font_name);

            $use_bunny_fonts = (bool) get_option('bunny_fonts');
            $font_api_url = $use_bunny_fonts
                ? 'https://fonts.bunny.net'
                : 'https://fonts.googleapis.com';
            $font_url = $font_api_url . "/css2?family=$font_name_sanitized:";

            $response[$font_name] = $this->generate_font_url(
                $font_url,
                $font_data,
            );
        }
        return $response;
    }

    public function create_upload_folder()
    {
        wp_mkdir_p($this->fonts_upload_dir);
    }

    public function minimize_font_css($font_css)
    {
        $font_css = preg_replace('/\/\*((?!\*\/).)*\*\//', '', $font_css);
        $font_css = preg_replace('/\s{2,}/', ' ', $font_css);
        $font_css = preg_replace('/\s*([:;{}])\s*/', '$1', $font_css);
        $font_css = preg_replace('/;}/', '}', $font_css);
        return $font_css;
    }

    public function sanitize_font_name($font_name)
    {
        return str_replace(' ', '', strtolower($font_name));
    }

    public function upload_css_files($all_urls)
    {
        $all_fonts_names = [];

        foreach ($all_urls as $font_name => $font_url) {
            $font_name_sanitized = $this->sanitize_font_name($font_name);
            $this->upload_css_file($font_name_sanitized, $font_url);
            $all_fonts_names[] = $font_name_sanitized;
        }

        // remove not used fonts directories
        $directories = glob($this->fonts_upload_dir . '/*', GLOB_ONLYDIR);
        foreach ($directories as $directory) {
            $folder_name = basename($directory);
            if (!in_array($folder_name, $all_fonts_names)) {
                $this->remove_directory_recursive($directory);
            }
        }
    }

    private function remove_directory_recursive($directory)
    {
        if (is_dir($directory)) {
            $files = glob($directory . '/*');
            foreach ($files as $file) {
                if (is_dir($file)) {
                    $this->remove_directory_recursive($file);
                } else {
                    unlink($file);
                }
            }
            rmdir($directory);
        }
    }

    public function upload_css_file($font_name, $font_url)
    {
        if (strpos($font_name, 'sc_font') !== false) {
            $split_font = explode('_', str_replace('sc_font_', '', $font_name));
            $block_style = $split_font[0];
            $text_level = $split_font[1];
            $breakpoint = $split_font[2];

            if (class_exists('MaxiBlocks_StyleCards')) {
                $sc_fonts = MaxiBlocks_StyleCards::get_maxi_blocks_style_card_fonts(
                    $block_style,
                    $text_level,
                    $breakpoint,
                );

                @[$font_name] = $sc_fonts;
            }
        }

        $font_name_sanitized = $this->sanitize_font_name($font_name);

        $font_uploads_dir =
            $this->fonts_upload_dir . '/' . $font_name_sanitized;
        wp_mkdir_p($font_uploads_dir);

        $font_url_dir =
            wp_upload_dir()['baseurl'] . '/maxi/fonts/' . $font_name_sanitized;

        if (!preg_match('/wght@.*?400/', $font_url)) {
            $font_url = preg_replace('/(wght@)/', '${1}400;', $font_url);
        }

        $response = wp_remote_get($font_url);
        $css_file = wp_remote_retrieve_body($response);

        preg_match_all('/url\((.*?)\)/s', $css_file, $urls);

        if (!is_array($urls) || empty($urls)) {
            return false;
        }

        $font_files = $urls[1];
        $new_font_files = [];

        foreach ($font_files as $file_path) {
            $font_response = wp_remote_get($file_path);
            $font_body = wp_remote_retrieve_body($font_response);
            $file_name = basename($file_path);
            $new_file_path = $font_uploads_dir . '/' . $file_name;

            $new_font_files[] = $font_url_dir . '/' . $file_name;

            // Try direct file write first
            if (!file_exists($new_file_path)) {
                if (@file_put_contents($new_file_path, $font_body) === false) {
                    // Fallback to WP_Filesystem if direct write fails
                    global $wp_filesystem;
                    if (empty($wp_filesystem)) {
                        require_once ABSPATH . 'wp-admin/includes/file.php';
                        WP_Filesystem(false, false, true);
                    }
                    if (!empty($wp_filesystem)) {
                        $wp_filesystem->put_contents(
                            $new_file_path,
                            $font_body,
                        );
                    }
                }
            }
        }

        $new_css_file = str_replace($font_files, $new_font_files, $css_file);
        $new_css_file = str_replace(
            '}',
            'font-display: swap; }',
            $new_css_file,
        );
        $new_css_file = $this->minimize_font_css($new_css_file);

        // Try direct file write first
        if (
            @file_put_contents(
                $font_uploads_dir . '/style.css',
                $new_css_file,
            ) === false
        ) {
            // Fallback to WP_Filesystem if direct write fails
            global $wp_filesystem;
            if (empty($wp_filesystem)) {
                require_once ABSPATH . 'wp-admin/includes/file.php';
                WP_Filesystem(false, false, true);
            }
            if (!empty($wp_filesystem)) {
                $wp_filesystem->put_contents(
                    $font_uploads_dir . '/style.css',
                    $new_css_file,
                );
            }
        }
    }

    public function check_table_exists($table_name)
    {
        global $wpdb;

        // Prepare the table name with the WP prefix
        $full_table_name = $wpdb->prefix . $table_name;

        // Check if table exists using wpdb->prepare()
        $table_exists = $wpdb->get_var(
            $wpdb->prepare('SHOW TABLES LIKE %s', $full_table_name),
        );

        if ($table_exists != $full_table_name) {
            // Table doesn't exist
            return false;
        }

        // Table exists
        return true;
    }
}
