<?php

class GXCustomizer
{
    public function __construct()
    {
        self::init();
    }

    public function init()
    {
        // Enqueue styles and js
        add_action('admin_enqueue_scripts', array($this, 'gx_customizer_css_file'));
        add_action('admin_enqueue_scripts', array($this, 'gx_admin_js_file'));
        //add_action('wp_head', array($this, 'gx_customizer_style_tag'));
        add_action('wp_enqueue_scripts', array($this, 'gx_test_model'));

        //we will show/hide controls depending on selected theme
        add_action('customize_controls_enqueue_scripts', array($this, 'gx_theme_control_setting'));

        // Set customizer settings
        add_action('customize_register', array($this, 'gx_customizer_init'));
        add_action('customize_preview_init', array($this, 'gx_customizer_js_file'));

        /*add theme class to the body */
        add_filter('body_class', array($this, 'my_body_classes'));
    }

    public function gx_customizer_css_file()
    {
        if (is_customize_preview()) {
            // Styles
            wp_enqueue_style(
                'select2-css',
                plugin_dir_url(__FILE__) . "/css/select2.min.css"
            );
            wp_enqueue_style(
                'theme-customizercss',
                plugin_dir_url(__FILE__) . "/css/gx-customizer.css?v=" . rand()
            );
            wp_enqueue_style(
                'page-loader',
                plugin_dir_url(__FILE__) . "/css/page-loader.css?v=" . rand()
            );
        }
    }

    public function gx_admin_js_file()
    {
        if (is_customize_preview()) {
            $list = [];
            $font_info = [];
            $fonts_list =  file_get_contents(plugin_dir_url(__FILE__) . 'dist/fonts.json');
            $fonts_list = json_decode($fonts_list, true);

            $fonts_listCount = count($fonts_list['items']);
            $fonts_listItems = array_values($fonts_list['items']);

            for ($i = 0; $i < $fonts_listCount; $i++) {
                $font = $fonts_listItems[$i];

                $family = str_ireplace(' ', '+', $font['family']);
                $font_info[$family] = array(
                    'subsets' => $font['subsets'],
                    'weights' => (array) array_filter($font['variants'], function ($weight) {
                        return (is_numeric($weight));
                    }),
                    'styles' => array('normal'),
                );

                if (array_search('italic', $font['variants'])) {
                    array_push($font_info[$family]['styles'], 'italic', 'oblique');
                }
                array_push($list, $font['family']);
            }


            wp_enqueue_script('select2-js', plugin_dir_url(__FILE__) . "/js/select2.min.js?v=" . rand(), ['jquery', 'customize-preview'], '', true);
            wp_enqueue_script('theme-customizer', plugin_dir_url(__FILE__) . "/js/gx-admin.js?v=" . rand(), ['jquery', 'customize-preview'], '', true);
            wp_localize_script(
                'theme-customizer',
                'gx_ajax_object',
                array(
                    'defaultThemeOptions' => json_encode(require_once('theme_default_styles.php')),
                    'bodyClass' => ''/*get_theme_mod( 'color_scheme' )*/,
                    'list' => $list,
                    'font_info' => $font_info,
                    'ajax_url' => admin_url() . '../wp-content/plugins/gutenberg-extra/customizer/customizer.php',
                )
            );
        }
    }

    public function gx_theme_control_setting()
    {
        if (is_customize_preview()) {
            wp_enqueue_script(
                'theme-customizerc',
                plugin_dir_url(__FILE__) . "/js/gx-theme-control.js?v=" . rand(),
                ['jquery', 'customize-preview'],
                '',
                true
            );
        }
    }

    public function gx_customizer_js_file()
    {
        if (is_customize_preview()) {
            $font_info = [];
            $fonts_list = file_get_contents(plugin_dir_url(__FILE__) . 'dist/fonts.json');
            $fonts_list = json_decode($fonts_list, true);

            $fonts_listCount = count($fonts_list['items']);
            $fonts_listItems = array_values($fonts_list['items']);

            for ($i = 0; $i < $fonts_listCount; $i++) {
                $font = $fonts_listItems[$i];

                $family = str_ireplace(' ', '+', $font['family']);
                $font_info[$family] = array(
                    'subsets' => $font['subsets'],
                    'weights' => (array) array_filter($font['variants'], function ($weight) {
                        return (is_numeric($weight));
                    }),
                    'styles' => array('normal'),
                );

                if (array_search('italic', $font['variants'])) {
                    array_push($font_info[$family]['styles'], 'italic', 'oblique');
                }
            }
            wp_enqueue_script('theme-customizerc', plugin_dir_url(__FILE__) . "/js/gx-customizer.js?v=" . rand(), ['jquery', 'customize-preview'], '', true);
            wp_localize_script(
                'theme-customizerc',
                'gx_ajax_object',
                array(
                    'bodyClass' => 'gx-' . strtolower(get_theme_mod('color_scheme')),
                    'font_info' => $font_info,
                )
            );
        }
    }

    /**
     * Loads model CSS file with all CSS properties for all themes and elements
     * Also loads an inline CSS with CSS variables from settings
     */
    public function gx_test_model()
    {
        wp_enqueue_style(
            'test-model',
            plugin_dir_url(__FILE__) . "/css/test-model.css?v=" . rand()
        );

        // Inline styles
        wp_register_style('test-variables', false);
        wp_enqueue_style('test-variables');
        wp_add_inline_style(
            'test-variables',
            self::gx_style_variables()
        );
        self::gx_style_variables();
    }

    public function gx_style_variables()
    {
        $Default_dark_background = get_theme_mod('body_background_color-Default-color-dark');
        $Default_dark_p_color = get_theme_mod('Default-color-dark');
        $Default_dark_p_font_family = get_theme_mod('pDarkFontDefault-desktop');
        var_dump($Default_dark_p_font_family);
        $Default_dark_p_font_size = get_theme_mod('Default-color-dark');
        $Default_dark_p_font_weight = get_theme_mod('Default-color-dark');
        $Default_dark_p_line_height = get_theme_mod('Default-color-dark');
        $Default_dark_p_letter_spacing = get_theme_mod('Default-color-dark');
        $Default_dark_p_transform = get_theme_mod('Default-color-dark');
        $Default_dark_p_style = get_theme_mod('Default-color-dark');
        $Default_dark_p_decoration = get_theme_mod('Default-color-dark');
        $Default_dark_p_decoration_line = get_theme_mod('Default-color-dark');
        $Default_dark_a_color = get_theme_mod('Default-color-dark');
        $Default_dark_a_font_family = get_theme_mod('Default-color-dark');
        $Default_dark_h1_color = get_theme_mod('Default-color-dark');
        $Default_dark_h1_font_family = get_theme_mod('Default-color-dark');
        $Default_dark_h1_font_size = get_theme_mod('Default-color-dark');
        $Default_dark_h1_font_weight = get_theme_mod('Default-color-dark');
        $Default_dark_h1_line_height = get_theme_mod('Default-color-dark');
        $Default_dark_h1_letter_spacing = get_theme_mod('Default-color-dark');
        $Default_dark_h1_transform = get_theme_mod('Default-color-dark');
        $Default_dark_h1_style = get_theme_mod('Default-color-dark');
        $Default_dark_h1_decoration = get_theme_mod('Default-color-dark');
        $Default_dark_h1_decoration_line = get_theme_mod('Default-color-dark');
        $Default_dark_h2_color = get_theme_mod('Default-color-dark');
        $Default_dark_h2_font_family = get_theme_mod('Default-color-dark');
        $Default_dark_h2_font_size = get_theme_mod('Default-color-dark');
        $Default_dark_h2_font_weight = get_theme_mod('Default-color-dark');
        $Default_dark_h2_line_height = get_theme_mod('Default-color-dark');
        $Default_dark_h2_letter_spacing = get_theme_mod('Default-color-dark');
        $Default_dark_h2_transform = get_theme_mod('Default-color-dark');
        $Default_dark_h2_style = get_theme_mod('Default-color-dark');
        $Default_dark_h2_decoration = get_theme_mod('Default-color-dark');
        $Default_dark_h2_decoration_line = get_theme_mod('Default-color-dark');
        $Default_dark_h3_color = get_theme_mod('Default-color-dark');
        $Default_dark_h3_font_family = get_theme_mod('Default-color-dark');
        $Default_dark_h3_font_size = get_theme_mod('Default-color-dark');
        $Default_dark_h3_font_weight = get_theme_mod('Default-color-dark');
        $Default_dark_h3_line_height = get_theme_mod('Default-color-dark');
        $Default_dark_h3_letter_spacing = get_theme_mod('Default-color-dark');
        $Default_dark_h3_transform = get_theme_mod('Default-color-dark');
        $Default_dark_h3_style = get_theme_mod('Default-color-dark');
        $Default_dark_h3_decoration = get_theme_mod('Default-color-dark');
        $Default_dark_h3_decoration_line = get_theme_mod('Default-color-dark');
        $Default_dark_h4_color = get_theme_mod('Default-color-dark');
        $Default_dark_h4_font_family = get_theme_mod('Default-color-dark');
        $Default_dark_h4_font_size = get_theme_mod('Default-color-dark');
        $Default_dark_h4_font_weight = get_theme_mod('Default-color-dark');
        $Default_dark_h4_line_height = get_theme_mod('Default-color-dark');
        $Default_dark_h4_letter_spacing = get_theme_mod('Default-color-dark');
        $Default_dark_h4_transform = get_theme_mod('Default-color-dark');
        $Default_dark_h4_style = get_theme_mod('Default-color-dark');
        $Default_dark_h4_decoration = get_theme_mod('Default-color-dark');
        $Default_dark_h4_decoration_line = get_theme_mod('Default-color-dark');
        $Default_dark_h5_color = get_theme_mod('Default-color-dark');
        $Default_dark_h5_font_family = get_theme_mod('Default-color-dark');
        $Default_dark_h5_font_size = get_theme_mod('Default-color-dark');
        $Default_dark_h5_font_weight = get_theme_mod('Default-color-dark');
        $Default_dark_h5_line_height = get_theme_mod('Default-color-dark');
        $Default_dark_h5_letter_spacing = get_theme_mod('Default-color-dark');
        $Default_dark_h5_transform = get_theme_mod('Default-color-dark');
        $Default_dark_h5_style = get_theme_mod('Default-color-dark');
        $Default_dark_h5_decoration = get_theme_mod('Default-color-dark');
        $Default_dark_h5_decoration_line = get_theme_mod('Default-color-dark');
        $Default_dark_h6_color = get_theme_mod('Default-color-dark');
        $Default_dark_h6_font_family = get_theme_mod('Default-color-dark');
        $Default_dark_h6_font_size = get_theme_mod('Default-color-dark');
        $Default_dark_h6_font_weight = get_theme_mod('Default-color-dark');
        $Default_dark_h6_line_height = get_theme_mod('Default-color-dark');
        $Default_dark_h6_letter_spacing = get_theme_mod('Default-color-dark');
        $Default_dark_h6_transform = get_theme_mod('Default-color-dark');
        $Default_dark_h6_style = get_theme_mod('Default-color-dark');
        $Default_dark_h6_decoration = get_theme_mod('Default-color-dark');
        $Default_dark_h6_decoration_line = get_theme_mod('Default-color-dark');
        $Default_dark_highlight = get_theme_mod('Default-color-dark');
        $Default_dark_hover = get_theme_mod('Default-color-dark');
        
        $Default_light_background = get_theme_mod('');
        $Default_light_p_color = get_theme_mod('');
        $Default_light_p_font_family = get_theme_mod('');
        $Default_light_p_font_size = get_theme_mod('');
        $Default_light_p_font_weight = get_theme_mod('');
        $Default_light_p_line_height = get_theme_mod('');
        $Default_light_p_letter_spacing = get_theme_mod('');
        $Default_light_p_transform = get_theme_mod('');
        $Default_light_p_style = get_theme_mod('');
        $Default_light_p_decoration = get_theme_mod('');
        $Default_light_p_decoration_line = get_theme_mod('');
        $Default_light_a_color = get_theme_mod('');
        $Default_light_a_font_family = get_theme_mod('');
        $Default_light_h1_color = get_theme_mod('');
        $Default_light_h1_font_family = get_theme_mod('');
        $Default_light_h1_font_size = get_theme_mod('');
        $Default_light_h1_font_weight = get_theme_mod('');
        $Default_light_h1_line_height = get_theme_mod('');
        $Default_light_h1_letter_spacing = get_theme_mod('');
        $Default_light_h1_transform = get_theme_mod('');
        $Default_light_h1_style = get_theme_mod('');
        $Default_light_h1_decoration = get_theme_mod('');
        $Default_light_h1_decoration_line = get_theme_mod('');
        $Default_light_h2_color = get_theme_mod('');
        $Default_light_h2_font_family = get_theme_mod('');
        $Default_light_h2_font_size = get_theme_mod('');
        $Default_light_h2_font_weight = get_theme_mod('');
        $Default_light_h2_line_height = get_theme_mod('');
        $Default_light_h2_letter_spacing = get_theme_mod('');
        $Default_light_h2_transform = get_theme_mod('');
        $Default_light_h2_style = get_theme_mod('');
        $Default_light_h2_decoration = get_theme_mod('');
        $Default_light_h2_decoration_line = get_theme_mod('');
        $Default_light_h3_color = get_theme_mod('');
        $Default_light_h3_font_family = get_theme_mod('');
        $Default_light_h3_font_size = get_theme_mod('');
        $Default_light_h3_font_weight = get_theme_mod('');
        $Default_light_h3_line_height = get_theme_mod('');
        $Default_light_h3_letter_spacing = get_theme_mod('');
        $Default_light_h3_transform = get_theme_mod('');
        $Default_light_h3_style = get_theme_mod('');
        $Default_light_h3_decoration = get_theme_mod('');
        $Default_light_h3_decoration_line = get_theme_mod('');
        $Default_light_h4_color = get_theme_mod('');
        $Default_light_h4_font_family = get_theme_mod('');
        $Default_light_h4_font_size = get_theme_mod('');
        $Default_light_h4_font_weight = get_theme_mod('');
        $Default_light_h4_line_height = get_theme_mod('');
        $Default_light_h4_letter_spacing = get_theme_mod('');
        $Default_light_h4_transform = get_theme_mod('');
        $Default_light_h4_style = get_theme_mod('');
        $Default_light_h4_decoration = get_theme_mod('');
        $Default_light_h4_decoration_line = get_theme_mod('');
        $Default_light_h5_color = get_theme_mod('');
        $Default_light_h5_font_family = get_theme_mod('');
        $Default_light_h5_font_size = get_theme_mod('');
        $Default_light_h5_font_weight = get_theme_mod('');
        $Default_light_h5_line_height = get_theme_mod('');
        $Default_light_h5_letter_spacing = get_theme_mod('');
        $Default_light_h5_transform = get_theme_mod('');
        $Default_light_h5_style = get_theme_mod('');
        $Default_light_h5_decoration = get_theme_mod('');
        $Default_light_h5_decoration_line = get_theme_mod('');
        $Default_light_h6_color = get_theme_mod('');
        $Default_light_h6_font_family = get_theme_mod('');
        $Default_light_h6_font_size = get_theme_mod('');
        $Default_light_h6_font_weight = get_theme_mod('');
        $Default_light_h6_line_height = get_theme_mod('');
        $Default_light_h6_letter_spacing = get_theme_mod('');
        $Default_light_h6_transform = get_theme_mod('');
        $Default_light_h6_style = get_theme_mod('');
        $Default_light_h6_decoration = get_theme_mod('');
        $Default_light_h6_decoration_line = get_theme_mod('');
        $Default_light_highlight = get_theme_mod('');
        $Default_light_hover = get_theme_mod('');
        
        return ":root{
            // Dark
            --Default-dark-background: {$Default_dark_background};
            --Default-dark-p-color: {$Default_dark_p_color};
            --Default-dark-p-font-family: {$Default_dark_p_font_family};
            --Default-dark-p-font-size: {$Default_dark_p_font_size};
            --Default-dark-p-font-weight: {$Default_dark_p_font_weight};
            --Default-dark-p-line-height: {$Default_dark_p_line_height};
            --Default-dark-p-letter-spacing: {$Default_dark_p_letter_spacing};
            --Default-dark-p-transform: {$Default_dark_p_transform};
            --Default-dark-p-style: {$Default_dark_p_style};
            --Default-dark-p-decoration: {$Default_dark_p_decoration};
            --Default-dark-p-decoration-line: {$Default_dark_p_decoration_line};
            --Default-dark-a-color: {$Default_dark_a_color};
            --Default-dark-a-font-family: {$Default_dark_a_font_family};
            --Default-dark-h1-color: {$Default_dark_h1_color};
            --Default-dark-h1-font-family: {$Default_dark_h1_font_family};
            --Default-dark-h1-font-size: {$Default_dark_h1_font_size};
            --Default-dark-h1-font-weight: {$Default_dark_h1_font_weight};
            --Default-dark-h1-line-height: {$Default_dark_h1_line_height};
            --Default-dark-h1-letter-spacing: {$Default_dark_h1_letter_spacing};
            --Default-dark-h1-transform: {$Default_dark_h1_transform};
            --Default-dark-h1-style: {$Default_dark_h1_style};
            --Default-dark-h1-decoration: {$Default_dark_h1_decoration};
            --Default-dark-h1-decoration-line: {$Default_dark_h1_decoration_line};
            --Default-dark-h2-color: {$Default_dark_h2_color};
            --Default-dark-h2-font-family: {$Default_dark_h2_font_family};
            --Default-dark-h2-font-size: {$Default_dark_h2_font_size};
            --Default-dark-h2-font-weight: {$Default_dark_h2_font_weight};
            --Default-dark-h2-line-height: {$Default_dark_h2_line_height};
            --Default-dark-h2-letter-spacing: {$Default_dark_h2_letter_spacing};
            --Default-dark-h2-transform: {$Default_dark_h2_transform};
            --Default-dark-h2-style: {$Default_dark_h2_style};
            --Default-dark-h2-decoration: {$Default_dark_h2_decoration};
            --Default-dark-h2-decoration-line: {$Default_dark_h2_decoration_line};
            --Default-dark-h3-color: {$Default_dark_h3_color};
            --Default-dark-h3-font-family: {$Default_dark_h3_font_family};
            --Default-dark-h3-font-size: {$Default_dark_h3_font_size};
            --Default-dark-h3-font-weight: {$Default_dark_h3_font_weight};
            --Default-dark-h3-line-height: {$Default_dark_h3_line_height};
            --Default-dark-h3-letter-spacing: {$Default_dark_h3_letter_spacing};
            --Default-dark-h3-transform: {$Default_dark_h3_transform};
            --Default-dark-h3-style: {$Default_dark_h3_style};
            --Default-dark-h3-decoration: {$Default_dark_h3_decoration};
            --Default-dark-h3-decoration-line: {$Default_dark_h3_decoration_line};
            --Default-dark-h4-color: {$Default_dark_h4_color};
            --Default-dark-h4-font-family: {$Default_dark_h4_font_family};
            --Default-dark-h4-font-size: {$Default_dark_h4_font_size};
            --Default-dark-h4-font-weight: {$Default_dark_h4_font_weight};
            --Default-dark-h4-line-height: {$Default_dark_h4_line_height};
            --Default-dark-h4-letter-spacing: {$Default_dark_h4_letter_spacing};
            --Default-dark-h4-transform: {$Default_dark_h4_transform};
            --Default-dark-h4-style: {$Default_dark_h4_style};
            --Default-dark-h4-decoration: {$Default_dark_h4_decoration};
            --Default-dark-h4-decoration-line: {$Default_dark_h4_decoration_line};
            --Default-dark-h5-color: {$Default_dark_h5_color};
            --Default-dark-h5-font-family: {$Default_dark_h5_font_family};
            --Default-dark-h5-font-size: {$Default_dark_h5_font_size};
            --Default-dark-h5-font-weight: {$Default_dark_h5_font_weight};
            --Default-dark-h5-line-height: {$Default_dark_h5_line_height};
            --Default-dark-h5-letter-spacing: {$Default_dark_h5_letter_spacing};
            --Default-dark-h5-transform: {$Default_dark_h5_transform};
            --Default-dark-h5-style: {$Default_dark_h5_style};
            --Default-dark-h5-decoration: {$Default_dark_h5_decoration};
            --Default-dark-h5-decoration-line: {$Default_dark_h5_decoration_line};
            --Default-dark-h6-color: {$Default_dark_h6_color};
            --Default-dark-h6-font-family: {$Default_dark_h6_font_family};
            --Default-dark-h6-font-size: {$Default_dark_h6_font_size};
            --Default-dark-h6-font-weight: {$Default_dark_h6_font_weight};
            --Default-dark-h6-line-height: {$Default_dark_h6_line_height};
            --Default-dark-h6-letter-spacing: {$Default_dark_h6_letter_spacing};
            --Default-dark-h6-transform: {$Default_dark_h6_transform};
            --Default-dark-h6-style: {$Default_dark_h6_style};
            --Default-dark-h6-decoration: {$Default_dark_h6_decoration};
            --Default-dark-h6-decoration-line: {$Default_dark_h6_decoration_line};
            --Default-dark-highlight: {$Default_dark_highlight};
            --Default-dark-hover: {$Default_dark_hover};
        
            // Light
            --Default-light-background: {$Default_light_background};
            --Default-light-p-color: {$Default_light_p_color};
            --Default-light-p-font-family: {$Default_light_p_font_family};
            --Default-light-p-font-size: {$Default_light_p_font_size};
            --Default-light-p-font-weight: {$Default_light_p_font_weight};
            --Default-light-p-line-height: {$Default_light_p_line_height};
            --Default-light-p-letter-spacing: {$Default_light_p_letter_spacing};
            --Default-light-p-transform: {$Default_light_p_transform};
            --Default-light-p-style: {$Default_light_p_style};
            --Default-light-p-decoration: {$Default_light_p_decoration};
            --Default-light-p-decoration-line: {$Default_light_p_decoration_line};
            --Default-light-a-color: {$Default_light_a_color};
            --Default-light-a-font-family: {$Default_light_a_font_family};
            --Default-light-h1-color: {$Default_light_h1_color};
            --Default-light-h1-font-family: {$Default_light_h1_font_family};
            --Default-light-h1-font-size: {$Default_light_h1_font_size};
            --Default-light-h1-font-weight: {$Default_light_h1_font_weight};
            --Default-light-h1-line-height: {$Default_light_h1_line_height};
            --Default-light-h1-letter-spacing: {$Default_light_h1_letter_spacing};
            --Default-light-h1-transform: {$Default_light_h1_transform};
            --Default-light-h1-style: {$Default_light_h1_style};
            --Default-light-h1-decoration: {$Default_light_h1_decoration};
            --Default-light-h1-decoration-line: {$Default_light_h1_decoration_line};
            --Default-light-h2-color: {$Default_light_h2_color};
            --Default-light-h2-font-family: {$Default_light_h2_font_family};
            --Default-light-h2-font-size: {$Default_light_h2_font_size};
            --Default-light-h2-font-weight: {$Default_light_h2_font_weight};
            --Default-light-h2-line-height: {$Default_light_h2_line_height};
            --Default-light-h2-letter-spacing: {$Default_light_h2_letter_spacing};
            --Default-light-h2-transform: {$Default_light_h2_transform};
            --Default-light-h2-style: {$Default_light_h2_style};
            --Default-light-h2-decoration: {$Default_light_h2_decoration};
            --Default-light-h2-decoration-line: {$Default_light_h2_decoration_line};
            --Default-light-h3-color: {$Default_light_h3_color};
            --Default-light-h3-font-family: {$Default_light_h3_font_family};
            --Default-light-h3-font-size: {$Default_light_h3_font_size};
            --Default-light-h3-font-weight: {$Default_light_h3_font_weight};
            --Default-light-h3-line-height: {$Default_light_h3_line_height};
            --Default-light-h3-letter-spacing: {$Default_light_h3_letter_spacing};
            --Default-light-h3-transform: {$Default_light_h3_transform};
            --Default-light-h3-style: {$Default_light_h3_style};
            --Default-light-h3-decoration: {$Default_light_h3_decoration};
            --Default-light-h3-decoration-line: {$Default_light_h3_decoration_line};
            --Default-light-h4-color: {$Default_light_h4_color};
            --Default-light-h4-font-family: {$Default_light_h4_font_family};
            --Default-light-h4-font-size: {$Default_light_h4_font_size};
            --Default-light-h4-font-weight: {$Default_light_h4_font_weight};
            --Default-light-h4-line-height: {$Default_light_h4_line_height};
            --Default-light-h4-letter-spacing: {$Default_light_h4_letter_spacing};
            --Default-light-h4-transform: {$Default_light_h4_transform};
            --Default-light-h4-style: {$Default_light_h4_style};
            --Default-light-h4-decoration: {$Default_light_h4_decoration};
            --Default-light-h4-decoration-line: {$Default_light_h4_decoration_line};
            --Default-light-h5-color: {$Default_light_h5_color};
            --Default-light-h5-font-family: {$Default_light_h5_font_family};
            --Default-light-h5-font-size: {$Default_light_h5_font_size};
            --Default-light-h5-font-weight: {$Default_light_h5_font_weight};
            --Default-light-h5-line-height: {$Default_light_h5_line_height};
            --Default-light-h5-letter-spacing: {$Default_light_h5_letter_spacing};
            --Default-light-h5-transform: {$Default_light_h5_transform};
            --Default-light-h5-style: {$Default_light_h5_style};
            --Default-light-h5-decoration: {$Default_light_h5_decoration};
            --Default-light-h5-decoration-line: {$Default_light_h5_decoration_line};
            --Default-light-h6-color: {$Default_light_h6_color};
            --Default-light-h6-font-family: {$Default_light_h6_font_family};
            --Default-light-h6-font-size: {$Default_light_h6_font_size};
            --Default-light-h6-font-weight: {$Default_light_h6_font_weight};
            --Default-light-h6-line-height: {$Default_light_h6_line_height};
            --Default-light-h6-letter-spacing: {$Default_light_h6_letter_spacing};
            --Default-light-h6-transform: {$Default_light_h6_transform};
            --Default-light-h6-style: {$Default_light_h6_style};
            --Default-light-h6-decoration: {$Default_light_h6_decoration};
            --Default-light-h6-decoration-line: {$Default_light_h6_decoration_line};
            --Default-light-highlight: {$Default_light_highlight};
            --Default-light-hover: {$Default_light_hover};
        }";
        
    }

    /**
     * Add current theme as a class on document body
     */
    public function my_body_classes($classes)
    {
        // $bodyThemeClass = get_theme_mod('color_scheme') ?? 'Default';
        $bodyThemeClass = 'Default';
        array_push($classes, $bodyThemeClass);
        // $classes[] = $bodyThemeClass;

        return $classes;
    }

    /**
     * Add sections, settings and controls for customizer
     */
    public function gx_customizer_init(WP_Customize_Manager $wp_customize)
    {
        if (is_customize_preview()) {
            $transport = 'postMessage';
            $contentColorsData = [
                'body_background_color' => 'icon',
                'p_color'               => 'icon',
                'a_color'               => 'icon',
                'h1_color'              => 'H1',
                'h2_color'              => 'H2',
                'h3_color'              => 'H3',
                'h4_color'              => 'H4',
                'h5_color'              => 'H5',
                'h6_color'              => 'H6',
                'highlight'             => 'icon',
                'hover'                 => 'icon',
            ];
            $headingSections = [
                'pDark'                 => 'Paragraph Dark',
                'pLight'                => 'Paragraph Light',
                'h1Dark'                => 'Heading 1 Dark',
                'h1Light'               => 'Heading 1 Light',
                'h2Dark'                => 'Heading 2 Dark',
                'h2Light'               => 'Heading 2 Light',
                'h3Dark'                => 'Heading 3 Dark',
                'h3Light'               => 'Heading 3 Light',
                'h4Dark'                => 'Heading 4 Dark',
                'h4Light'               => 'Heading 4 Light',
                'h5Dark'                => 'Heading 5 Dark',
                'h5Light'               => 'Heading 5 Light',
                'h6Dark'                => 'Heading 6 Dark',
                'h6Light'               => 'Heading 6 Light',
            ];
            $headingData = [
                'FS'                    => '36px',
                'LineHgt'               => '1.35px',
                'LetterSpc'             => '0.1em',
                'Weight'                => 'normal',
                'Transform'             => 'none',
                'Style'                 => 'normal',
                'Decoration'            => 'solid',
                'DecorationLine'        => 'none',
                'Font'                  => 'Gugi'
            ];
            $devices = new SplFixedArray(3);
            $devices[0] = 'desktop';
            $devices[1] = 'tablet';
            $devices[2] = 'mobile';
            $devicesCount = count($devices);
            $section = 'globalStyling';
            $ColSchSettValues = array(
                'Default'               => 'Default',
                'Mint'                  => 'Mint',
                'Elegance'              => 'Elegance',
                'Candy'                 => 'Candy',
                'Bumblebee'             => 'Bumblebee',
            );

            // Panel
            $wp_customize->add_panel('GutenbergExtra', array(
                'title' => 'GutenbergExtra',
                'priority' => 1
            ));

            // Section
            $wp_customize->add_section($section, [
                'title' => 'Global Styling',
                'priority' => 10,
                'panel' => 'GutenbergExtra'
            ]);

            // Settings & Controls
            $wp_customize->add_setting('leftSide', [
                'default' => 'Default',
                'transport' => $transport
            ]);

            $wp_customize->add_control('leftSide', [
                'section' => $section,
                'type' => 'text',
            ]);

            $wp_customize->add_setting('color_scheme', [
                'default' => 'Default',
                'transport' => $transport
            ]);

            $wp_customize->add_control('color_scheme', [
                'section' => $section,
                'label' => __('Colour Scheme', 'gutenberg-extra'),
                'type' => 'select',
                'choices' => $ColSchSettValues
            ]);

            $wp_customize->add_setting('reset', [
                'default' => 'Reset',
                'transport' => $transport
            ]);

            $wp_customize->add_control('reset', [
                'section' => $section,
                'type' => 'button',
                'input_attrs' => array(
                    'value' => __('Reset', 'Reset'), // 👈
                    'class' => 'button button-info', // 👈
                ),
            ]);

            $themes = ['Default', 'Mint', 'Elegance', 'Candy', 'Bumblebee'];
            $themes = SplFixedArray::fromArray($themes, false);
            $themesCount = $themes->count();

            // global switch to dark/light this one is for custom theme
            for ($i = 0; $i < $themesCount; $i++) {
                $wp_customize->add_setting('themeSwitch' .  $themes[$i], [
                    'default' => 'gx-default',
                    'transport' => $transport
                ]);
                $wp_customize->add_control('themeSwitch' .  $themes[$i], [
                    'section' => $section,
                    'label' => __('Global Theme colour', 'global-theme-color'),
                    'type' => 'select',
                    'choices' => [
                        'gx-default' => __('Show setting for Light and Dark Blocks', 'gutenberg-extra'),
                        'gx-dark' => __('Show setting only for Dark Blocks', 'gutenberg-extra'),
                        'gx-light' => __('Show setting only for Light Blocks', 'gutenberg-extra'),
                    ]
                ]);
            }

            $wp_customize->add_setting('darkColors', [
                'default' => 'darkColors',
                'transport' => $transport
            ]);
            $wp_customize->add_control('darkColors', [
                'section' => $section,
                'type' => 'text',
            ]);

            $contentColorsDataKeys = array_keys($contentColorsData);
            $contentColorsDataValues = array_values($contentColorsData);
            $contentColorsDataCount = SplFixedArray::fromArray($contentColorsDataKeys)->count();


            // when page is loading all will have color class and will be visible
            // will change from js by hiding/ displaying blocks
            for ($i = 0; $i < $themesCount; $i++) {
                for ($j = $contentColorsDataCount - 1; $j >= 0; $j--) {
                    $wp_customize->add_setting($contentColorsDataKeys[$j] . $themes[$i] . '-color-dark', [
                        'default' => 'null',
                        'transport' => $transport
                    ]);
                    $wp_customize->add_control($contentColorsDataKeys[$j] . $themes[$i] . '-color-dark', [
                        'section' => $section,
                        'type' => 'color',
                        'label' => $contentColorsDataValues[$j]
                    ]);
                }
            }
            if ($wp_customize->get_control('lightColors')) {
                echo $wp_customize->get_control('lightColors')->get_content();
            } else {
                $wp_customize->add_setting('lightColors', [
                    'default' => '',
                    'transport' => $transport
                ]);
                $wp_customize->add_control('lightColors', [
                    'section' => $section,
                    'type' => 'text',
                ]);
            }

            for ($i = 0; $i < $themesCount; $i++) {
                for ($j = $contentColorsDataCount - 1; $j >= 0; $j--) {
                    $wp_customize->add_setting($contentColorsDataKeys[$j] . $themes[$i] . '-color-light', [
                        'default' => 'null',
                        'transport' => $transport
                    ]);
                    $wp_customize->add_control($contentColorsDataKeys[$j] . $themes[$i] . '-color-light', [
                        'section' => $section,
                        'type' => 'color',
                        'label' => $contentColorsDataValues[$j]
                    ]);
                }
            }

            // make headingsections array more faster
            $headingSectionsKeys = array_keys($headingSections);
            $headingSectionsValues = array_values($headingSections);
            $headingSectionsCount = SplFixedArray::fromArray($headingSectionsKeys)->count();

            $headingDataKeys = array_keys($headingData);
            $headingDataValues = array_values($headingData);
            $headingDataCount = SplFixedArray::fromArray($headingDataKeys)->count();

            // need to add control/setting for each theme 'Default', 'Mint', 'Elegance', 'Natural', 'Admiral', 'Peach', 'Candy', 'Bumblebee'
            for ($i = 0; $i < $themesCount; $i++) {
                for ($j = 0; $j < $headingSectionsCount; $j++) {
                    $wp_customize->add_setting($headingSectionsKeys[$j] . $themes[$i]  . '_blockPopUp_', [
                        'default' => get_theme_mod($headingSectionsKeys[$j] . $themes[$i]  . '_blockPopUp_') ?? "text",
                        'transport' => $transport,
                    ]);

                    $wp_customize->add_control($headingSectionsKeys[$j] . $themes[$i]  . '_blockPopUp_', [
                        'section' => $section,
                        'type' => 'text',
                        'label' => $headingSectionsValues[$j],
                        'input_attrs' => array(
                            'disabled' => 'disabled',
                            'class' => 'has-popup',
                            'data-name' => $headingSectionsKeys[$j]
                        ),
                    ]);

                    for ($m = 0; $m < $devicesCount; $m++) {
                        // fs, decoration, lineheight etc.
                        for ($n = 0; $n < $headingDataCount; $n++) {
                            $wp_customize->add_setting($headingSectionsKeys[$j] . $headingDataKeys[$n] . $themes[$i]  . '-' . $devices[$m], [
                                'default' => get_theme_mod("$headingSectionsKeys[$j] . $headingDataKeys[$n] . $themes[$i]  . '-' . $devices[$m]") ?? "text",
                                'transport' => $transport,
                            ]);
                            $wp_customize->add_control($headingSectionsKeys[$j] . $headingDataKeys[$n] . $themes[$i]  . '-' . $devices[$m], [
                                'section' => $section,
                                'type' => 'hidden',
                                'label' => 'Size',
                            ]);
                        }
                    }
                }
            }
        }
    }


    public function makeStyle()
    {
        // here should call style for theme using body class
        // use another function for style on each page

        self::makeThemeStylesForCustomizer();

        // need to have all theme styles
        // will apply those which are for current theme
        $themeClasses = SplFixedArray::fromArray(['Default', 'Mint', 'Elegance',  'Candy', 'Bumblebee']);
        $themeClassesCount = $themeClasses->count();
        $tags = SplFixedArray::fromArray(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li']);
        $tagsCount = $tags->count();

        // we will have default styles and override #000000 with those using set_theme_mod
        $style = [];
        //    if not customize preview, load for curreent theme
        if (!is_customize_preview()) {
            $themeClasses = [get_theme_mod('color_scheme')];
            $themeClassesCount = 1;
        }

        for ($i = 0; $i < $themeClassesCount; $i++) {
            $themeClassBody = 'body.' . $themeClasses[$i] . ' ';
            if (get_theme_mod('body_background_color' . $themeClasses[$i] . '-color-dark'))
                $style[] = $themeClassBody . '.gx-dark { background-color : ' . get_theme_mod('body_background_color' . $themeClasses[$i] . '-color-dark') . ' !important;}';
            if (get_theme_mod('body_background_color' . $themeClasses[$i] . '-color-light')) {
                $style[] = $themeClassBody . '.gx-light { background-color : ' . get_theme_mod('body_background_color' . $themeClasses[$i] . '-color-light') . ' !important;}';
                $style[] = $themeClassBody . '.gx-default { background-color : ' . get_theme_mod('body_background_color' . $themeClasses[$i] . '-color-light') . ' !important;}';
            }

            for ($m = 0; $m < $tagsCount; $m++) {
                $style[] = $themeClassBody . '.gx-dark ' . $tags[$m] . ' {' . self::checkThemeMod($tags[$m], 'Dark', $themeClasses[$i], 'desktop') . '}';
                $style[] = $themeClassBody . '.gx-light ' . $tags[$m] . ' {' . self::checkThemeMod($tags[$m], 'Light', $themeClasses[$i], 'desktop') . '}';

                // make responsive design
                $style[] = '@media screen and (max-width:980px) { ' . $themeClassBody . '.gx-dark ' . $tags[$m] . ' {' . self::checkThemeMod($tags[$m], 'Dark', $themeClasses[$i], 'tablet') . '}' . $themeClassBody . '.gx-light ' . $tags[$m] . ' {' . self::checkThemeMod($tags[$m], 'Light', $themeClasses[$i], 'tablet') . '}' . '}';
                $style[] = '@media screen and (max-width:480px) { ' . $themeClassBody . '.gx-dark ' . $tags[$m] . ' {'  . self::checkThemeMod($tags[$m], 'Dark', $themeClasses[$i], 'mobile') . '}' . $themeClassBody . '.gx-light ' . $tags[$m] . ' {' . self::checkThemeMod($tags[$m], 'Light', $themeClasses[$i], 'mobile') . '}' . '}';
            }

            //        add body class
            if (get_theme_mod('a_color' . $themeClasses[$i] . '-color-dark')) {
                $style[] = $themeClassBody . '.gx-dark a { color : ' . get_theme_mod('a_color' . $themeClasses[$i] . '-color-dark') . ' !important;}';
            }
            if (get_theme_mod('a_color' . $themeClasses[$i] . '-color-light')) {
                $style[] = $themeClassBody . '.gx-light a { color : ' . get_theme_mod('a_color' . $themeClasses[$i] . '-color-light') . ' !important;}';
                $style[] = $themeClassBody . 'gx-default a { color : ' . get_theme_mod('a_color' . $themeClasses[$i] . '-color-light') . ' !important;}';
            }

            if (get_theme_mod('hover' . $themeClasses[$i] . '-color-dark')) {
                $style[] = $themeClassBody . '.gx-dark a:hover { color : ' . get_theme_mod('hover' . $themeClasses[$i] . '-color-dark') . ' !important;}';
            }
            if (get_theme_mod('hover' . $themeClasses[$i] . '-color-light')) {
                $style[] = $themeClassBody . '.gx-light a:hover { color : ' . get_theme_mod('hover' . $themeClasses[$i] . '-color-light') . ' !important;}';
                $style[] = $themeClassBody . '.gx-default a:hover { color : ' . get_theme_mod('hover' . $themeClasses[$i] . '-color-light') . ' !important;}';
            }

            if (get_theme_mod('highlight' . $themeClasses[$i] . '-color-dark')) {
                $style[] = $themeClassBody . '.gx-dark .gx-highlight { color : ' . get_theme_mod('highlight' . $themeClasses[$i] . '-color-dark') . ' !important;}';
                $style[] = $themeClassBody . '.gx-dark .gx-divider { border-color : ' . get_theme_mod('highlight' . $themeClasses[$i] . '-color-dark') . ' !important;}';
            }
            if (get_theme_mod('highlight' . $themeClasses[$i] . '-color-light')) {
                $style[] = $themeClassBody . '.gx-light .gx-highlight { color : ' . get_theme_mod('highlight' . $themeClasses[$i] . '-color-light') . ' !important;}';
                $style[] = $themeClassBody . '.gx-default .gx-highlight { color : ' . get_theme_mod('highlight' . $themeClasses[$i] . '-color-light') . ' !important;}';
                $style[] = $themeClassBody . '.gx-light .gx-divider { border-color : ' . get_theme_mod('highlight' . $themeClasses[$i] . '-color-light') . ' !important;}';
                $style[] = $themeClassBody . '.gx-default .gx-divider { border-color : ' . get_theme_mod('highlight' . $themeClasses[$i] . '-color-light') . ' !important;}';
            }
        }

        return $style;
    }

    public function checkThemeMod($tag, $mode, $themMod, $device)
    {
        $temp = '';

        if ($tag === 'li') $tag = 'p'; //styles for li same as p
        if (get_theme_mod($tag . $mode . 'Font' . $themMod . '-' . $device)) {
            $temp .= 'font-family:"' . str_replace('+', ' ', get_theme_mod($tag . $mode . 'Font' . $themMod . '-' . $device)) . '" !important;';
        }

        if (get_theme_mod($tag . '_color' . $themMod . '-color-' . strtolower($mode))) {
            $temp .= 'color : ' . get_theme_mod($tag . '_color' . $themMod . '-color-' . strtolower($mode)) . ' !important;';
        }

        if (get_theme_mod($tag . $mode . 'FS' . $themMod . '-' . $device)) {
            $temp .= 'font-size : ' . get_theme_mod($tag . $mode . 'FS' . $themMod . '-' . $device) . ' !important;';
        }

        if (get_theme_mod($tag . $mode . 'LineHgt' . $themMod . '-' . $device)) {
            $temp .= 'line-height : ' . get_theme_mod($tag . $mode . 'LineHgt' . $themMod . '-' . $device) . ' !important;';
        }

        if (get_theme_mod($tag . $mode . 'LetterSpc' . $themMod . '-' . $device)) {
            $temp .= 'letter-spacing : ' . get_theme_mod($tag . $mode . 'LetterSpc' . $themMod . '-' . $device) . ' !important;';
        }

        if (get_theme_mod($tag . $mode . 'Weight' . $themMod . '-' . $device)) {
            $temp .= 'font-weight: ' . get_theme_mod($tag . $mode . 'Weight' . $themMod . '-' . $device) . ' !important;';
        }

        if (get_theme_mod($tag . $mode . 'Transform' . $themMod . '-' . $device)) {
            $temp .= 'text-transform:' . get_theme_mod($tag . $mode . 'Transform' . $themMod . '-' . $device) . ' !important;';
        }

        if (get_theme_mod($tag . $mode . 'Style' . $themMod . '-' . $device)) {
            $temp .= 'font-style: ' . get_theme_mod($tag . $mode . 'Style' . $themMod . '-' . $device) . ' !important;';
        }

        if (get_theme_mod($tag . $mode . 'DecorationLine' . $themMod . '-' . $device)) {
            $temp .= 'text-decoration-line :' . get_theme_mod($tag . $mode . 'DecorationLine' . $themMod . '-' . $device) . ';';
        }

        if (get_theme_mod($tag . $mode . 'Decoration' . $themMod . '-' . $device)) {
            $temp .= 'text-decoration-style: ' . get_theme_mod($tag . $mode . 'Decoration' . $themMod . '-' . $device) . ' !important;';
        }

        return $temp;
    }

    public function makeThemeStylesForCustomizer()
    {
        //    $themeStyles = array();
        //     by Default we have Default -> gx-default
        //    $currentThemeName = get_theme_mod('color_scheme') ?? 'Default';
        //    $currentThemeName = get_theme_mod('themeSwitch'.$currentThemeName) ?? 'gx-default';
        $themes = require_once('theme_default_styles.php');

        $themesKeys = array_keys($themes);
        $themesValues = array_values($themes);
        $themesCount = SplFixedArray::fromArray($themesKeys)->count();

        $devices = SplFixedArray::fromArray(['desktop', 'tablet', 'mobile']);
        $devicesCount = $devices->count();

        $headingSections = SplFixedArray::fromArray(['p', 'a', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6']);
        $headingSectionsCount = $headingSections->count();

        // by default all theme mod has specific styles
        for ($i = 0; $i < $themesCount; $i++) {
            // set default color for theme  overwritten it every time
            for ($j = 0; $j < $devicesCount; $j++) {
                for ($m = 0; $m < $headingSectionsCount; $m++) {

                    if ('null' === get_theme_mod($headingSections[$m] . 'Dark' . 'Font' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['font-family']))
                        set_theme_mod($headingSections[$m] . 'Dark' . 'Font' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['font-family']);
                    if ('null' === get_theme_mod($headingSections[$m] . 'Light' . 'Font' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Light']['domElements'][$headingSections[$m]]['font-family']))
                        set_theme_mod($headingSections[$m] . 'Light' . 'Font' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Light']['domElements'][$headingSections[$m]]['font-family']);

                    if ('null' === get_theme_mod($headingSections[$m] . 'Dark' . 'LineHgt' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['line-height']))
                        set_theme_mod($headingSections[$m] . 'Dark' . 'LineHgt' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['line-height']);
                    if ('null' === get_theme_mod($headingSections[$m] . 'Light' . 'LineHgt' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Light']['domElements'][$headingSections[$m]]['line-height']))
                        set_theme_mod($headingSections[$m] . 'Light' . 'LineHgt' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Light']['domElements'][$headingSections[$m]]['line-height']);

                    if ('null' === get_theme_mod($headingSections[$m] . 'Dark' . 'LetterSpc' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['letter-spacing']))
                        set_theme_mod($headingSections[$m] . 'Dark' . 'LetterSpc' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['letter-spacing']);
                    if ('null' === get_theme_mod($headingSections[$m] . 'Light' . 'LetterSpc' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Light']['domElements'][$headingSections[$m]]['letter-spacing']))
                        set_theme_mod($headingSections[$m] . 'Light' . 'LetterSpc' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Light']['domElements'][$headingSections[$m]]['letter-spacing']);

                    if ('null' === get_theme_mod($headingSections[$m] . 'Dark' . 'Transform' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['text-transform']))
                        set_theme_mod($headingSections[$m] . 'Dark' . 'Transform' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['text-transform']);
                    if ('null' === get_theme_mod($headingSections[$m] . 'Light' . 'Transform' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Light']['domElements'][$headingSections[$m]]['text-transform']))
                        set_theme_mod($headingSections[$m] . 'Light' . 'Transform' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Light']['domElements'][$headingSections[$m]]['text-transform']);

                    if ('null' === get_theme_mod($headingSections[$m] . 'Dark' . 'Style' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['font-style']))
                        set_theme_mod($headingSections[$m] . 'Dark' . 'Style' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['font-style']);
                    if ('null' === get_theme_mod($headingSections[$m] . 'Light' . 'Style' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Light']['domElements'][$headingSections[$m]]['font-style']))
                        set_theme_mod($headingSections[$m] . 'Light' . 'Style' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Light']['domElements'][$headingSections[$m]]['font-style']);

                    if ('null' === get_theme_mod($headingSections[$m] . 'Dark' . 'Decoration' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['text-decoration-style']))
                        set_theme_mod($headingSections[$m] . 'Dark' . 'Decoration' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['text-decoration-style']);
                    if ('null' === get_theme_mod($headingSections[$m] . 'Light' . 'Decoration' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Light']['domElements'][$headingSections[$m]]['text-decoration-style']))
                        set_theme_mod($headingSections[$m] . 'Light' . 'Decoration' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Light']['domElements'][$headingSections[$m]]['text-decoration-style']);

                    if ('null' === get_theme_mod($headingSections[$m] . 'Dark' . 'DecorationLine' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['text-decoration-line']))
                        set_theme_mod($headingSections[$m] . 'Dark' . 'DecorationLine' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['text-decoration-line']);
                    if ('null' === get_theme_mod($headingSections[$m] . 'Light' . 'DecorationLine' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Light']['domElements'][$headingSections[$m]]['text-decoration-line']))
                        set_theme_mod($headingSections[$m] . 'Light' . 'DecorationLine' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Light']['domElements'][$headingSections[$m]]['text-decoration-line']);

                    if ('null' === get_theme_mod($headingSections[$m] . '_color' . $themesKeys[$i] . '-color-' . strtolower('Dark')) && isset($themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['color']))
                        set_theme_mod($headingSections[$m] . '_color' . $themesKeys[$i] . '-color-' . strtolower('Dark'), $themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['color']);
                    if ('null' === get_theme_mod($headingSections[$m] . '_color' . $themesKeys[$i] . '-color-' . strtolower('Light')) && isset($themesValues[$i]['Light']['domElements'][$headingSections[$m]]['color']))
                        set_theme_mod($headingSections[$m] . '_color' . $themesKeys[$i] . '-color-' . strtolower('Light'), $themesValues[$i]['Light']['domElements'][$headingSections[$m]]['color']);

                    if ('null' === get_theme_mod($headingSections[$m] . 'Dark' . 'FS' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['font-size']))
                        set_theme_mod($headingSections[$m] . 'Dark' . 'FS' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['font-size']);
                    if ('null' === get_theme_mod($headingSections[$m] . 'Light' . 'FS' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Light']['domElements'][$headingSections[$m]]['font-size']))
                        set_theme_mod($headingSections[$m] . 'Light' . 'FS' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Light']['domElements'][$headingSections[$m]]['font-size']);

                    if ('null' === get_theme_mod($headingSections[$m] . 'Dark' . 'Weight' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['font-weight']))
                        set_theme_mod($headingSections[$m] . 'Dark' . 'Weight' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Dark']['domElements'][$headingSections[$m]]['font-weight']);
                    if ('null' === get_theme_mod($headingSections[$m] . 'Light' . 'Weight' . $themesKeys[$i] . '-' . $devices[$j]) && isset($themesValues[$i]['Light']['domElements'][$headingSections[$m]]['font-weight']))
                        set_theme_mod($headingSections[$m] . 'Light' . 'Weight' . $themesKeys[$i] . '-' . $devices[$j], $themesValues[$i]['Light']['domElements'][$headingSections[$m]]['font-weight']);
                }
                if ('null' === get_theme_mod('hover' . $themesKeys[$i] . '-color-dark') && isset($themesValues[$i]['Dark']['hover']))
                    set_theme_mod('hover' . $themesKeys[$i] . '-color-dark', $themesValues[$i]['Dark']['hover']);
                if ('null' === get_theme_mod('hover' . $themesKeys[$i] . '-color-light') && isset($themesValues[$i]['Light']['hover']))
                    set_theme_mod('hover' . $themesKeys[$i] . '-color-light', $themesValues[$i]['Light']['hover']);
                if ('null' === get_theme_mod('highlight' . $themesKeys[$i] . '-color-dark') && isset($themesValues[$i]['Dark']['highlight']))
                    set_theme_mod('highlight' . $themesKeys[$i] . '-color-dark', $themesValues[$i]['Dark']['highlight']);
                if ('null' === get_theme_mod('highlight' . $themesKeys[$i] . '-color-light') && isset($themesValues[$i]['Light']['highlight']))
                    set_theme_mod('highlight' . $themesKeys[$i] . '-color-light', $themesValues[$i]['Light']['highlight']);
            }

            // block styles like the following body.{themeName} .{themeModSwitch}
            // create block and inside elements design for each theme
            if ('null' === get_theme_mod('body_background_color' . $themesKeys[$i] . '-color-dark')) {
                set_theme_mod('body_background_color' . $themesKeys[$i] . '-color-dark', $themesValues[$i]['Dark']['block']['background']);
            }
            if ('null' === get_theme_mod('body_background_color' . $themesKeys[$i] . '-color-light')) {
                set_theme_mod('body_background_color' . $themesKeys[$i] . '-color-light', $themesValues[$i]['Light']['block']['background']);
            }
        }
        //    error_log('end makeThemeStylesForCustomizer');
    }


    public function gx_customizer_style_tag()
    {

        $style = self::makeStyle();
        // we need to print block styles for each of them, they should be with different names
        // f.e. h1DarkElegance

        $headingSections = ['pDark', 'pLight', 'h1Dark', 'h1Light', 'h2Dark', 'h2Light', 'h3Dark', 'h3Light', 'h4Dark', 'h4Light', 'h5Dark', 'h5Light', 'h6Dark', 'h6Light'];
        $headingSections = SplFixedArray::fromArray($headingSections);
        $headingSectionsCount = $headingSections->count();

        $themes = ['Default', 'Mint', 'Elegance', 'Candy', 'Bumblebee'];
        $themesCount = SplFixedArray::fromArray($themes)->count();

        $devices = SplFixedArray::fromArray(['desktop', 'tablet', 'mobile']);
        $devicesCount = $devices->count();

        $usingFonts = [];
        $weights = [];
        $fonts_list = file_get_contents(plugin_dir_url(__FILE__) . 'dist/fonts.json');
        $fonts_list = json_decode($fonts_list, true);

        for ($i = 0; $i < $themesCount; $i++) {
            for ($j = 0; $j < $devicesCount; $j++) {
                for ($m = 0; $m < $headingSectionsCount; $m++) {
                    if (!in_array(get_theme_mod($headingSections[$m] . 'Font' . $themes[$i] . '-' . $devices[$j]), $usingFonts)) {
                        $font = get_theme_mod($headingSections[$m] . 'Font' . $themes[$i] . '-' . $devices[$j]);
                        //                    if (array_search($font, ['Verdana', 'Arial']) == false) {

                        $usingFonts[] = $font;
                        $fontNormally = str_ireplace('+', ' ', $font);
                        $index = array_search($fontNormally, array_column($fonts_list['items'], 'family'));

                        $weights[$font] = (array) array_filter($fonts_list['items'][$index]['variants'], function ($weight) {
                            return (is_numeric($weight));
                        });
                        //                    }

                    }
                }
            }
        }

        $usingFonts = SplFixedArray::fromArray($usingFonts);
        for ($i = 0; $i < $usingFonts->count(); $i++) {
            if (!empty($usingFonts[$i])) {
                $fontsWeight = implode(',', $weights[$usingFonts[$i]]);

                if (!in_array($usingFonts[$i], ['Verdana', 'Arial'])) {
                    $fontURL = $usingFonts[$i] . ':' . $fontsWeight;
                    $font = "<link href='https://fonts.googleapis.com/css?family=" . $fontURL . "' rel='stylesheet' type='text/css'>";
                    echo $font . "\n";
                }
            }
        }

        echo "<style id='gx-styles'>\n" . implode("\n", $style) . "\n</style>\n";
    }
}

new GXCustomizer();
