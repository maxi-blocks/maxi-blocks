<?php

/**
 * Loads model CSS file with all CSS properties for all themes and elements
 * Also loads an inline CSS with CSS variables from settings
 */

class GXCustomizerModel extends GXCustomizer
{
    static $themes = [
        'Default',
        'Mint',
        'Elegance',
        'Candy',
        'Bumblebee',
    ];
    static $devices = [
        'desktop',
        'tablet',
        'mobile',
    ];
    static $headingSections = [
        'pDark'     => 'p',
        'pLight'    => 'p',
        'h1Dark'    => 'h1',
        'h1Light'   => 'h1',
        'h2Dark'    => 'h2',
        'h2Light'   => 'h2',
        'h3Dark'    => 'h3',
        'h3Light'   => 'h3',
        'h4Dark'    => 'h4',
        'h4Light'   => 'h4',
        'h5Dark'    => 'h5',
        'h5Light'   => 'h5',
        'h6Dark'    => 'h6',
        'h6Light'   => 'h6',
    ];

    public function __construct()
    {
       // add_action('wp_enqueue_scripts', [$this, 'gx_styling_model']);
       // add_action('admin_enqueue_scripts', [$this, 'gx_styling_model']);
    }

    public function gx_styling_model()
    {
        wp_register_style('model-variables', false);
        wp_enqueue_style('model-variables');
        wp_add_inline_style(
            'model-variables',
            self::gx_style_variables(),
            []
        );
        self::gx_style_variables();
    }

    public function gx_style_variables()
    {
        $style_variables = implode(
            ' ',
            array_map(
                function ($theme) {
                    $response = '';
                    $response .= self::gx_variables_creator($theme, 'dark');
                    $response .= self::gx_variables_creator($theme, 'light');

                    return $response;
                },
                self::$themes
            )
        );

        return ":root{{$style_variables}}";
    }

    public function gx_variables_creator($theme, $style)
    {
        $response = '';

        // General
        get_theme_mod("body_background_color{$theme}-color-{$style}") ? $response .= "--{$theme}-{$style}-background: " . get_theme_mod("body_background_color{$theme}-color-{$style}") . '; ' : null;
        get_theme_mod("{$theme}-color-{$style}") ? $response .= "--{$theme}-{$style}-highlight: " . get_theme_mod("{$theme}-color-{$style}") . '; ' : null;
        get_theme_mod("{$theme}-color-{$style}") ? $response .= "--{$theme}-{$style}-hover: " . get_theme_mod("{$theme}-color-{$style}") . '; ' : null;

        // Colors
        get_theme_mod("p_color{$theme}-color-{$style}") ? $response .= "--{$theme}-{$style}-p-color: " . get_theme_mod("p_color{$theme}-color-{$style}") . '; ' : null;
        get_theme_mod("a_color{$theme}-color-{$style}") ? $response .= "--{$theme}-{$style}-a-color: " . get_theme_mod("a_color{$theme}-color-{$style}") . '; ' : null;
        get_theme_mod("h1_color{$theme}-color-{$style}") ? $response .= "--{$theme}-{$style}-h1-color: " . get_theme_mod("h1_color{$theme}-color-{$style}") . '; ' : null;
        get_theme_mod("h2_color{$theme}-color-{$style}") ? $response .= "--{$theme}-{$style}-h2-color: " . get_theme_mod("h2_color{$theme}-color-{$style}") . '; ' : null;
        get_theme_mod("h3_color{$theme}-color-{$style}") ? $response .= "--{$theme}-{$style}-h3-color: " . get_theme_mod("h3_color{$theme}-color-{$style}") . '; ' : null;
        get_theme_mod("h4_color{$theme}-color-{$style}") ? $response .= "--{$theme}-{$style}-h4-color: " . get_theme_mod("h4_color{$theme}-color-{$style}") . '; ' : null;
        get_theme_mod("h5_color{$theme}-color-{$style}") ? $response .= "--{$theme}-{$style}-h5-color: " . get_theme_mod("h5_color{$theme}-color-{$style}") . '; ' : null;
        get_theme_mod("h6_color{$theme}-color-{$style}") ? $response .= "--{$theme}-{$style}-h6-color: " . get_theme_mod("h6_color{$theme}-color-{$style}") . '; ' : null;

        // Typography
        foreach (self::$devices as $device) {
            foreach (self::$headingSections as $headingSections => $heading) {
                $response .= self::gx_get_typography($device, $theme, $style, $headingSections, $heading);
            }
        }

        return $response;
    }

    public function gx_get_typography($device, $theme, $style, $headingSection, $heading)
    {
        $response = '';
        if(!stripos($headingSection, $style))
            return;

        // Needs to add mediaqueries for styling!

        get_theme_mod("{$headingSection}Font{$theme}-{$device}") ? $response .= "--{$theme}-{$style}-{$heading}-font-family: " . get_theme_mod("{$headingSection}Font{$theme}-{$device}") . '; ' : null;
        get_theme_mod("{$headingSection}FS{$theme}-{$device}") ? $response .= "--{$theme}-{$style}-{$heading}-font-size: " . get_theme_mod("{$headingSection}FS{$theme}-{$device}") . '; ' : null;
        get_theme_mod("{$headingSection}Weight{$theme}-{$device}") ? $response .= "--{$theme}-{$style}-{$heading}-font-weight: " . get_theme_mod("{$headingSection}Weight{$theme}-{$device}") . '; ' : null;
        get_theme_mod("{$headingSection}LineHgt{$theme}-{$device}") ? $response .= "--{$theme}-{$style}-{$heading}-line-height: " . get_theme_mod("{$headingSection}LineHgt{$theme}-{$device}") . '; ' : null;
        get_theme_mod("{$headingSection}LetterSpc{$theme}-{$device}") ? $response .= "--{$theme}-{$style}-{$heading}-letter_spacing: " . get_theme_mod("{$headingSection}LetterSpc{$theme}-{$device}") . '; ' : null;
        get_theme_mod("{$headingSection}Transform{$theme}-{$device}") ? $response .= "--{$theme}-{$style}-{$heading}-transform: " . get_theme_mod("{$headingSection}Transform{$theme}-{$device}") . '; ' : null;
        get_theme_mod("{$headingSection}Style{$theme}-{$device}") ? $response .= "--{$theme}-{$style}-{$heading}-style: " . get_theme_mod("{$headingSection}Style{$theme}-{$device}") . '; ' : null;
        get_theme_mod("{$headingSection}Decoration{$theme}-{$device}") ? $response .= "--{$theme}-{$style}-{$heading}-decoration: " . get_theme_mod("{$headingSection}Decoration{$theme}-{$device}") . '; ' : null;
        get_theme_mod("{$headingSection}DecorationLine{$theme}-{$device}") ? $response .= "--{$theme}-{$style}-{$heading}-decoration-line: " . get_theme_mod("{$headingSection}DecorationLine{$theme}-{$device}") . '; ' : null;

        return $response;
    }
}

new GXCustomizerModel();
