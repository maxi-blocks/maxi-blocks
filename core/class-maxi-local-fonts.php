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

    /**
     * Variables
     */
    private $fontsUploadDir;

    /**
     * Constructor
     */
    public function __construct()
    {
        if ((bool) get_option('local_fonts')) {
            $this->fontsUploadDir = wp_upload_dir()['basedir'] . '/maxi/fonts';
            $all_fonts = $this->getAllFontsDB();

            if (is_array($all_fonts) && !empty($all_fonts)) {
                $all_urls = $this->constructFontURLs($all_fonts);
                if (is_array($all_urls) && !empty($all_urls)) {
                    $this->createUploadFolder();
                    $this->uploadCssFiles($all_urls);
                }
                update_option('local_fonts_uploaded', true);
            }
        }
    }

    public function getAllFontsDB()
    {
        global $wpdb;

        $post_content_array = [];
        $post_content_templates_array = [];
        $prev_post_content_array = [];
        $prev_post_content_templates_array = [];
        $blocks_content_array = [];
        $prev_blocks_content_array = [];
        $sc_string = '';

        if($this->check_table_exists('maxi_blocks_styles')) {
            $post_content_array = (array) $wpdb->get_results(
                "SELECT DISTINCT fonts_value FROM {$wpdb->prefix}maxi_blocks_styles",
            );
            $prev_post_content_array = (array) $wpdb->get_results(
                "SELECT DISTINCT prev_fonts_value FROM {$wpdb->prefix}maxi_blocks_styles",
            );
        }

        // for templates
        if($this->check_table_exists('maxi_blocks_styles_templates')) {
            $post_content_templates_array = (array) $wpdb->get_results(
                "SELECT DISTINCT fonts_value FROM {$wpdb->prefix}maxi_blocks_styles_templates",
            );

            $prev_post_content_templates_array = (array) $wpdb->get_results(
                "SELECT DISTINCT prev_fonts_value FROM {$wpdb->prefix}maxi_blocks_styles_templates",
            );
        }

        // blocks
        if($this->check_table_exists('maxi_blocks_styles_blocks')) {
            $blocks_content_array = (array) $wpdb->get_results(
                "SELECT DISTINCT fonts_value FROM {$wpdb->prefix}maxi_blocks_styles_blocks",
            );
            $prev_blocks_content_array = (array) $wpdb->get_results(
                "SELECT DISTINCT prev_fonts_value FROM {$wpdb->prefix}maxi_blocks_styles_blocks",
            );
        }

        // $sc_string
        if($this->check_table_exists('maxi_blocks_general')) {
            $sc_string = $wpdb->get_var(
                "SELECT id FROM {$wpdb->prefix}maxi_blocks_general WHERE id = 'sc_string'"
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

        foreach ($post_content_array as $font) {
            $array[] = $font->fonts_value;
        }

        if (!empty($prev_post_content_array)) {
            foreach ($prev_post_content_array as $font) {
                $array[] = $font->prev_fonts_value;
            }
        }

        if (!empty($post_content_templates_array)) {
            foreach ($post_content_templates_array as $font) {
                $array[] = $font->fonts_value;
            }
        }

        if (!empty($prev_post_content_templates_array)) {
            foreach ($prev_post_content_templates_array as $font) {
                $array[] = $font->prev_fonts_value;
            }
        }

        if (empty($array)) {
            return false;
        }

        foreach ($array as $key => $value) {
            if(isset($value)) {
                $array[$key] = json_decode($value, true);
            }
        }

        $array = array_filter($array, function ($arr) {return $arr !== null && $arr !== false && $arr !== '';});

        if (empty($array)) {
            return false;
        }

        $array_all = array_merge_recursive(...$array);

        return $array_all;
    }

    public function generateFontURL($font_url, $font_data)
    {
        if (!empty($font_data)) {
            // For legacy reasons font data is saved both as 'weight' ('style') and 'fontWeight' ('fontStyle')
            // See https://github.com/maxi-blocks/maxi-blocks/pull/4305#discussion_r1098988152
            $font_weight = array_key_exists('fontWeight', $font_data)
                ? $font_data['fontWeight']
                : (array_key_exists('weight', $font_data)
                    ? $font_data['weight']
                    : false);
            $font_style = array_key_exists('fontStyle', $font_data)
                ? $font_data['fontStyle']
                : (array_key_exists('style', $font_data)
                    ? $font_data['style']
                    : false);

            if (is_array($font_weight)) {
                $font_weight = implode(',', array_unique($font_weight));
            }

            if ($font_style === 'italic') {
                $font_url .= 'ital,';
            }

            if (strpos($font_weight, ',') !== false) {
                $font_weight_arr = array_unique(explode(',', $font_weight));
                sort($font_weight_arr);
                $font_url .= 'wght@';
                if ($font_style === 'italic') {
                    foreach ($font_weight_arr as $fw) {
                        $font_url .= '0,' . $fw . ';';
                    }
                    foreach ($font_weight_arr as $fw) {
                        $font_url .= '1,' . $fw . ';';
                    }
                } else {
                    foreach ($font_weight_arr as $fw) {
                        $font_url .= $fw . ';';
                    }
                }
                $font_url = rtrim($font_url, ';');
            } elseif ($font_weight) {
                if ($font_style === 'italic') {
                    $font_url .=
                        'wght@0,' . $font_weight . ';1,' . $font_weight;
                } else {
                    $font_url .= 'wght@' . $font_weight;
                }
            } else {
                if ($font_style === 'italic') {
                    $font_url .= 'wght@0,400;1,400';
                } else {
                    $font_url .= 'wght@400';
                }
            }
        } else {
            $font_url = rtrim($font_url, ':');
        }

        return $font_url;
    }

    public function constructFontURLs($all_fonts)
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

            $font_url = "https://fonts.googleapis.com/css2?family=$font_name_sanitized:";

            $response[$font_name] = $this->generateFontURL(
                $font_url,
                $font_data,
            );
        }
        return $response;
    }

    public function createUploadFolder()
    {
        wp_mkdir_p($this->fontsUploadDir);
    }

    public function minimizeFontCss($font_css)
    {
        $font_css = preg_replace('/\/\*((?!\*\/).)*\*\//', '', $font_css);
        $font_css = preg_replace('/\s{2,}/', ' ', $font_css);
        $font_css = preg_replace('/\s*([:;{}])\s*/', '$1', $font_css);
        $font_css = preg_replace('/;}/', '}', $font_css);
        return $font_css;
    }

    public function uploadCssFiles($all_urls)
    {
        foreach ($all_urls as $font_name => $font_url) {
            if (strpos($font_name, 'sc_font') !== false) {
                $split_font = explode(
                    '_',
                    str_replace('sc_font_', '', $font_name),
                );
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

            $font_name_sanitized = str_replace(' ', '', strtolower($font_name));

            $all_fonts_names[] = $font_name_sanitized;

            $font_uploads_dir =
                $this->fontsUploadDir . '/' . $font_name_sanitized;
            wp_mkdir_p($font_uploads_dir);

            $font_url_dir =
                wp_upload_dir()['baseurl'] .
                '/maxi/fonts/' .
                $font_name_sanitized;

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

                if (!file_exists($new_file_path)) {
                    file_put_contents($new_file_path, $font_body);
                }
            }

            $new_css_file = str_replace(
                $font_files,
                $new_font_files,
                $css_file,
            );

            $new_css_file = str_replace(
                '}',
                'font-display: swap; }',
                $new_css_file,
            );

            $new_css_file = $this->minimizeFontCss($new_css_file);

            file_put_contents($font_uploads_dir . '/style.css', $new_css_file);
        }

        // remove not used fonts directories
        $directories = glob($this->fontsUploadDir . '/*', GLOB_ONLYDIR);
        foreach ($directories as $directory) {
            $folder_name = basename($directory);
            if (!in_array($folder_name, $all_fonts_names)) {
                array_map('unlink', glob("$directory/*"));
                rmdir($directory);
            }
        }
    }

    public function check_table_exists($table_name)
    {
        global $wpdb;

        // Prepare the table name with the WP prefix
        $full_table_name = $wpdb->prefix . $table_name;

        // Check if table exists
        if($wpdb->get_var("SHOW TABLES LIKE '$full_table_name'") != $full_table_name) {
            // Table doesn't exist
            return false;
        }

        // Table exists
        return true;
    }
}
