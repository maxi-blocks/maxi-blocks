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

        $array = [];

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

    /**
     * Return custom font data from option by family (case-insensitive), or null.
     */
    public function get_custom_font_data_by_family($family)
    {
        $fonts = get_option('maxi_blocks_custom_fonts', []);
        if (!is_array($fonts) || empty($fonts)) {
            return null;
        }
        foreach ($fonts as $font) {
            $value = isset($font['value']) ? $font['value'] : '';
            if ($value && strtolower($value) === strtolower($family)) {
                return $font;
            }
        }
        return null;
    }

    /**
     * Ensure @font-face CSS exists for a custom uploaded family and return its URL.
     * CSS path: uploads/maxi/custom-fonts/{family}/style.css
     */
    public function get_or_create_custom_font_stylesheet_url($family, $font_data, $force = false)
    {
        $uploads = wp_upload_dir();
        $sanitized = $this->sanitize_font_name($family);
        $dir = trailingslashit($uploads['basedir']) . 'maxi/custom-fonts/' . $sanitized;
        $url = trailingslashit($uploads['baseurl']) . 'maxi/custom-fonts/' . $sanitized . '/style.css';
        $css_file = $dir . '/style.css';

        if ($force && file_exists($css_file)) {
            @unlink($css_file);
        }

        if (!file_exists($css_file)) {
            if (!wp_mkdir_p($dir)) {
                return false;
            }
            $css = $this->build_custom_font_css($family, $font_data);
            if (!$css) {
                return false;
            }
            if (@file_put_contents($css_file, $css) === false) {
                global $wp_filesystem;
                if (empty($wp_filesystem)) {
                    require_once ABSPATH . 'wp-admin/includes/file.php';
                    WP_Filesystem(false, false, true);
                }
                if (empty($wp_filesystem)) {
                    return false;
                }
                $wp_filesystem->put_contents($css_file, $css);
            }
        }
        return $url;
    }

    /**
     * Regenerate the stylesheet for a custom font family.
     *
     * @param string $family
     * @param array  $font_data
     * @return false|string
     */
    public function regenerate_custom_font_stylesheet($family, $font_data)
    {
        return $this->get_or_create_custom_font_stylesheet_url($family, $font_data, true);
    }

    /**
     * Remove the generated stylesheet for a custom font family.
     *
     * @param string $family
     * @return void
     */
    public function remove_custom_font_stylesheet($family)
    {
        $uploads = wp_upload_dir();
        $sanitized = $this->sanitize_font_name($family);
        $dir = trailingslashit($uploads['basedir']) . 'maxi/custom-fonts/' . $sanitized;
        $css_file = $dir . '/style.css';

        if (file_exists($css_file)) {
            @unlink($css_file);
        }

        // Remove directory if empty.
        if (is_dir($dir)) {
            $files = @scandir($dir);
            if (is_array($files) && count($files) <= 2) {
                @rmdir($dir);
            }
        }
    }

    private function build_custom_font_css($family, $font_data)
    {
        $variants = isset($font_data['variants']) && is_array($font_data['variants']) ? $font_data['variants'] : [];
        if (empty($variants)) {
            return false;
        }

        $css_rules = [];
        foreach ($variants as $variant) {
            $weight = isset($variant['weight']) ? $variant['weight'] : '400';
            $style = isset($variant['style']) ? $variant['style'] : 'normal';
            $url = isset($variant['url']) ? $variant['url'] : '';
            if (!$url) {
                continue;
            }
            $format = $this->guess_font_format_from_url($url);
            $safe_family = str_replace(["\n", "\r"], '', $family);
            $safe_url = esc_url_raw($url);
            $safe_weight = esc_attr($this->normalize_font_weight_value($weight, false));
            $safe_style = $this->normalize_font_style_value($style, false);

            $rules = "@font-face{font-family:'{$safe_family}';font-style:{$safe_style};font-weight:{$safe_weight};font-display:swap;src:url('{$safe_url}')";
            if ($format) {
                $rules .= " format('{$format}')";
            }
            $rules .= ";}";
            $css_rules[] = $rules;
        }

        if (empty($css_rules)) {
            return false;
        }

        return $this->minimize_font_css(implode('', $css_rules));
    }

    /**
     * Detect font attributes for a given attachment.
     * Returns an array of variants found in the font file.
     *
     * @param int $attachment_id
     * @return array<int,array{weight:string,style:string}>|WP_Error Array of variants with weight/style
     */
    public function detect_font_attributes_from_attachment($attachment_id)
    {
        $file_path = get_attached_file($attachment_id);
        if (!$file_path || !file_exists($file_path)) {
            return new WP_Error(
                'font_file_missing',
                __('Unable to locate the uploaded font file.', 'maxi-blocks'),
                ['status' => 400],
            );
        }

        $variants = $this->parse_font_file_variants($file_path);
        if (is_wp_error($variants)) {
            return $variants;
        }

        if (empty($variants)) {
            return new WP_Error(
                'font_metadata_missing',
                __('Unable to read required font metadata (weight/style).', 'maxi-blocks'),
                ['status' => 400],
            );
        }

        return $variants;
    }

    /**
     * Parse font file and extract all variants.
     * Supports TrueType Collections (.ttc) and variable fonts.
     *
     * @param string $file_path
     * @return array<int,array{weight:string,style:string}>|WP_Error
     */
    private function parse_font_file_variants($file_path)
    {
        if (!class_exists('\FontLib\Font')) {
            return new WP_Error(
                'font_parser_unavailable',
                __('Font parsing library is not available.', 'maxi-blocks'),
                ['status' => 500],
            );
        }

        try {
            $font = \FontLib\Font::load($file_path);

            if (!$font) {
                return new WP_Error(
                    'font_load_failed',
                    __('Unable to load the font file.', 'maxi-blocks'),
                    ['status' => 400],
                );
            }

            // Check if this is a TrueType Collection (TTC file)
            // Collection implements Iterator and Countable
            if (is_a($font, 'FontLib\TrueType\Collection')) {
                $font->parse();
                $variants = [];
                $font_count = $font->count();

                for ($i = 0; $i < $font_count; $i++) {
                    $sub_font = $font->getFont($i);
                    if ($sub_font) {
                        $sub_font->parse();
                        $variant = $this->extract_variant_from_font($sub_font);
                        if ($variant) {
                            // Avoid duplicate weight/style combinations
                            $key = $variant['weight'] . '_' . $variant['style'];
                            if (!isset($variants[$key])) {
                                $variants[$key] = $variant;
                            }
                        }
                    }
                }

                return array_values($variants);
            }

            // Single font file (TrueType, OpenType, WOFF)
            $font->parse();

            // Check if it's a variable font and parse its axes
            $variable_axes = $this->parse_variable_font_axes($file_path);

            $variant = $this->extract_variant_from_font($font);

            if (!$variant) {
                return new WP_Error(
                    'font_metadata_missing',
                    __('Required font metadata is missing.', 'maxi-blocks'),
                    ['status' => 400],
                );
            }

            // If it's a variable font, generate variants based on available axes
            if (!empty($variable_axes)) {
                return $this->generate_variable_font_variants_from_axes($variable_axes, $variant['style']);
            }

            return [$variant];
        } catch (\Throwable $e) {
            return new WP_Error(
                'font_parser_failed',
                __('Unable to parse the uploaded font file.', 'maxi-blocks'),
                ['status' => 400],
            );
        }
    }

    /**
     * Extract weight and style from a parsed font object.
     *
     * @param \FontLib\TrueType\File $font FontLib font object (must be parsed)
     * @return array{weight:string,style:string}|null
     */
    private function extract_variant_from_font($font)
    {
        try {
            $os2 = $font->getData('OS/2');

            if (!is_array($os2) || empty($os2)) {
                return null;
            }

            $weight_value = isset($os2['usWeightClass']) ? $os2['usWeightClass'] : null;
            if (!$weight_value) {
                return null;
            }

            $fs_selection = isset($os2['fsSelection']) ? (int) $os2['fsSelection'] : 0;
            $style = 'normal';
            if ($fs_selection & (1 << 9)) {
                $style = 'oblique';
            } elseif ($fs_selection & 1) {
                $style = 'italic';
            }

            return [
                'weight' => $this->normalize_font_weight_value($weight_value),
                'style' => $this->normalize_font_style_value($style, false),
            ];
        } catch (\Throwable $e) {
            return null;
        }
    }

    /**
     * Parse the fvar table from a font file to detect variable axes.
     *
     * @param string $file_path
     * @return array Associative array of axes with their min/max values, or empty if not variable
     */
    private function parse_variable_font_axes($file_path)
    {
        $axes = [];

        try {
            $handle = fopen($file_path, 'rb');
            if (!$handle) {
                return $axes;
            }

            // Read the first 4 bytes to check font type
            $header = fread($handle, 4);

            // For WOFF files, we can't easily read the fvar table
            // Return empty and fall back to non-variable handling
            if ($header === 'wOFF') {
                fclose($handle);
                return $axes;
            }

            // Skip TTC files for now (handled separately)
            if ($header === 'ttcf') {
                fclose($handle);
                return $axes;
            }

            // Read number of tables (at offset 4)
            fseek($handle, 4);
            $num_tables = unpack('n', fread($handle, 2))[1];

            // Skip to table directory (offset 12)
            fseek($handle, 12);

            // Find fvar table
            $fvar_offset = 0;

            for ($i = 0; $i < $num_tables; $i++) {
                $tag = fread($handle, 4);
                fread($handle, 4); // checksum
                $offset = unpack('N', fread($handle, 4))[1];
                fread($handle, 4); // length

                if ($tag === 'fvar') {
                    $fvar_offset = $offset;
                    break;
                }
            }

            if ($fvar_offset === 0) {
                fclose($handle);
                return $axes;
            }

            // Read fvar table header
            fseek($handle, $fvar_offset);
            fread($handle, 2); // majorVersion
            fread($handle, 2); // minorVersion
            $axes_offset = unpack('n', fread($handle, 2))[1];
            fread($handle, 2); // reserved
            $axis_count = unpack('n', fread($handle, 2))[1];
            $axis_size = unpack('n', fread($handle, 2))[1];

            // Read each axis
            for ($i = 0; $i < $axis_count; $i++) {
                $axis_start = $fvar_offset + $axes_offset + ($i * $axis_size);
                fseek($handle, $axis_start);

                $axis_tag = fread($handle, 4);
                $min_value = $this->read_fixed($handle);
                $default_value = $this->read_fixed($handle);
                $max_value = $this->read_fixed($handle);

                $axes[$axis_tag] = [
                    'min' => $min_value,
                    'default' => $default_value,
                    'max' => $max_value,
                ];
            }

            fclose($handle);
        } catch (\Throwable $e) {
            // Error parsing fvar, return empty axes
        }

        return $axes;
    }

    /**
     * Read a Fixed (16.16) value from file handle.
     *
     * @param resource $handle
     * @return float
     */
    private function read_fixed($handle)
    {
        $data = fread($handle, 4);
        if (strlen($data) < 4) {
            return 0;
        }
        $int_part = unpack('n', substr($data, 0, 2))[1];
        $frac_part = unpack('n', substr($data, 2, 2))[1];

        // Handle signed integer part
        if ($int_part >= 32768) {
            $int_part -= 65536;
        }

        return $int_part + ($frac_part / 65536);
    }

    /**
     * Generate variants based on variable font axes.
     *
     * @param array  $axes Variable font axes with min/max values
     * @param string $base_style The base style from OS/2 table
     * @return array<int,array{weight:string,style:string}>
     */
    private function generate_variable_font_variants_from_axes($axes, $base_style)
    {
        $variants = [];
        $weights = [];
        $styles = [];

        // Check for weight axis (wght)
        if (isset($axes['wght'])) {
            $min_weight = max(100, (int) round($axes['wght']['min'] / 100) * 100);
            $max_weight = min(900, (int) round($axes['wght']['max'] / 100) * 100);

            // Generate weights in increments of 100 within the range
            for ($w = $min_weight; $w <= $max_weight; $w += 100) {
                $weights[] = (string) $w;
            }
        }

        // If no weight axis or empty, use default weight
        if (empty($weights)) {
            $weights[] = '400';
        }

        // Check for italic axis (ital)
        if (isset($axes['ital']) && $axes['ital']['max'] >= 1) {
            $styles[] = 'normal';
            $styles[] = 'italic';
        }
        // Check for slant axis (slnt) - indicates oblique support
        elseif (isset($axes['slnt']) && $axes['slnt']['min'] < 0) {
            $styles[] = 'normal';
            $styles[] = 'oblique';
        }
        // No style axis, use base style
        else {
            $styles[] = $base_style;
        }

        // Generate all combinations
        foreach ($styles as $style) {
            foreach ($weights as $weight) {
                $variants[] = [
                    'weight' => $weight,
                    'style' => $style,
                ];
            }
        }

        return $variants;
    }

    /**
     * Attempt to read OS/2 table data from the provided font file using php-font-lib.
     *
     * @param string $file_path
     * @return array<string,string>|WP_Error
     */
    private function parse_font_file_attributes($file_path)
    {
        if (!class_exists('\FontLib\Font')) {
            return new WP_Error(
                'font_parser_unavailable',
                __('Font parsing library is not available.', 'maxi-blocks'),
                ['status' => 500],
            );
        }

        try {
            $font = \FontLib\Font::load($file_path);
            $font->parse();
            $os2 = $font->getData('OS/2');
            $font->close();
        } catch (\Throwable $e) {
            return new WP_Error(
                'font_parser_failed',
                __('Unable to parse the uploaded font file.', 'maxi-blocks'),
                ['status' => 400],
            );
        }

        if (!is_array($os2) || empty($os2)) {
            return new WP_Error(
                'font_metadata_missing',
                __('Required font metadata is missing.', 'maxi-blocks'),
                ['status' => 400],
            );
        }

        $weight_value = isset($os2['usWeightClass']) ? $os2['usWeightClass'] : null;
        if (!$weight_value) {
            return new WP_Error(
                'font_weight_missing',
                __('Font weight metadata is missing.', 'maxi-blocks'),
                ['status' => 400],
            );
        }

        $fs_selection = isset($os2['fsSelection']) ? (int) $os2['fsSelection'] : 0;
        $style = 'normal';
        if ($fs_selection & (1 << 9)) {
            $style = 'oblique';
        } elseif ($fs_selection & 1) {
            $style = 'italic';
        }

        return [
            'weight' => $this->normalize_font_weight_value($weight_value),
            'style' => $this->normalize_font_style_value($style, false),
        ];
    }

    private function normalize_font_weight_value($weight, $allow_empty = true)
    {
        if ($weight === '' || null === $weight) {
            return $allow_empty ? '' : '400';
        }

        if (!is_numeric($weight)) {
            return $allow_empty ? '' : '400';
        }

        $weight = (int) $weight;
        if ($weight <= 0) {
            return $allow_empty ? '' : '400';
        }

        $weight = $this->clamp_weight_value($weight);

        return (string) $weight;
    }

    private function normalize_font_style_value($style, $allow_empty = true)
    {
        if (!is_string($style) || '' === trim($style)) {
            return $allow_empty ? '' : 'normal';
        }

        $style = strtolower(trim($style));
        if ('italic' === $style || 'oblique' === $style) {
            return $style;
        }

        if ('normal' === $style) {
            return 'normal';
        }

        return $allow_empty ? '' : 'normal';
    }

    private function clamp_weight_value($weight)
    {
        $weight = max(100, min(900, $weight));
        $rounded = (int) round($weight / 100) * 100;

        if ($rounded < 100) {
            return 100;
        }

        if ($rounded > 900) {
            return 900;
        }

        return $rounded;
    }

    private function guess_font_format_from_url($url)
    {
        $path = strtolower(parse_url($url, PHP_URL_PATH));
        if (str_ends_with($path, '.woff2')) {
            return 'woff2';
        }
        if (str_ends_with($path, '.woff')) {
            return 'woff';
        }
        if (str_ends_with($path, '.ttf')) {
            return 'truetype';
        }
        if (str_ends_with($path, '.otf')) {
            return 'opentype';
        }
        return '';
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
