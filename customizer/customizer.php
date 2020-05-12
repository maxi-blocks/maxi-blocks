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
        require_once plugin_dir_path( __FILE__ ) . '/class_customizer_model.php';

        // Set default settings
        add_action('customize_preview_init', [$this, 'makeThemeStylesForCustomizer']);

        //we will show/hide controls depending on selected theme
        add_action('customize_controls_enqueue_scripts', array($this, 'gx_theme_control_setting'));

        // Set customizer settings
        require_once plugin_dir_path( __FILE__ ) . '/class_customizer_content.php';
        add_action('customize_preview_init', array($this, 'gx_customizer_js_file'));

        // Add theme class to the body
        add_filter('body_class', array($this, 'gx_body_theme'));
        add_filter('admin_body_class', array($this, 'gx_body_theme'));

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
     * Add current theme as a class on document body
     */
    public function gx_body_theme($classes)
    {
        $bodyThemeClass = get_theme_mod('color_scheme') ? : 'Default';
        if(gettype($classes) === 'string')
            $classes .= $bodyThemeClass;
        if(gettype($classes) === 'array')
            array_push($classes, $bodyThemeClass);

        return $classes;
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

    /**
     * Set default settings for customizer
     */
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
