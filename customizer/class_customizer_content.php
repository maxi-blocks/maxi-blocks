<?php

/**
 * Add sections, settings and controls for customizer
 * Strcture names will fillow next schema:
 * {theme}_{style}_{device*}_{target*}_{property}
 */

class GXCustomizerContent extends GXCustomizer
{

    static $transport = 'postMessage';
    static $contentColorsData = [
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
    static $headingSections = [
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
    static $headingData = [
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
    static $ColSchSettValues = array(
        'Default'               => 'Default',
        'Mint'                  => 'Mint',
        'Elegance'              => 'Elegance',
        'Candy'                 => 'Candy',
        'Bumblebee'             => 'Bumblebee',
    );
    static $section = 'globalStyling';
    static $themes = ['Default', 'Mint', 'Elegance', 'Candy', 'Bumblebee'];

    public function __construct()
    {
        add_action('customize_register', array($this, 'gx_customizer_init'));
    }

    public function gx_customizer_init(WP_Customize_Manager $wp_customize)
    {
        if (is_customize_preview()) {
            self::create_panel_section($wp_customize);
            self::create_basic_settings($wp_customize);
            self::create_themes_settings($wp_customize);
            self::create_dark_settings($wp_customize);
            self::create_light_settings($wp_customize);
            self::create_typography_settings($wp_customize);
        }
    }

    /**
     * Creates Panel and Settings for 
     */
    public function create_panel_section($wp_customize)
    {
        $wp_customize->add_panel(
            'MaxiBlocks',
            [
                'title'     => 'MaxiBlocks',
                'priority'  => 1
            ]
        );

        $wp_customize->add_section(
            self::$section,
            [
                'title'     => 'Global Styling',
                'priority'  => 10,
                'panel'     => 'MaxiBlocks'
            ]
        );
    }

    /**
     * Creates basic settings on the top of Customizer
     */
    public function create_basic_settings($wp_customize)
    {
        $wp_customize->add_setting(
            'leftSide',
            [
                'default'   => 'Default',
                'transport' => self::$transport
            ]
        );

        $wp_customize->add_control(
            'leftSide',
            [
                'section'   => self::$section,
                'type'      => 'text',
            ]
        );

        $wp_customize->add_setting(
            'color_scheme',
            [
                'default'   => 'Default',
                'transport' => self::$transport
            ]
        );

        $wp_customize->add_control(
            'color_scheme',
            [
                'section'   => self::$section,
                'label'     => __('Colour Scheme', 'maxi-blocks'),
                'type'      => 'select',
                'choices'   => self::$ColSchSettValues
            ]
        );

        $wp_customize->add_setting(
            'reset',
            [
                'default'   => 'Reset',
                'transport' => self::$transport
            ]
        );

        $wp_customize->add_control(
            'reset',
            [
                'section'   => self::$section,
                'type'      => 'button',
                'input_attrs' => array(
                    'value'     => __('Reset', 'Reset'), // 👈
                    'class'     => 'button button-info', // 👈
                ),
            ]
        );
    }

    /**
     * Sets Default/Dark/Light selector for every Theme
     */
    public function create_themes_settings($wp_customize)
    {
        $themesCount = count(self::$themes);
        for ($i = 0; $i < $themesCount; $i++) {
            $wp_customize->add_setting(
                'themeSwitch' .  self::$themes[$i],
                [
                    'default'   => 'default',
                    'transport' => self::$transport
                ]
            );
            $wp_customize->add_control(
                'themeSwitch' .  self::$themes[$i],
                [
                    'section'   => self::$section,
                    'label'     => __('Global Theme colour', 'global-theme-color'),
                    'type'      => 'select',
                    'choices'   => [
                        'default'    => __('Show setting for Light and Dark Blocks', 'maxi-blocks'),
                        'dark'       => __('Show setting only for Dark Blocks', 'maxi-blocks'),
                        'light'      => __('Show setting only for Light Blocks', 'maxi-blocks'),
                    ]
                ]
            );
        }
    }

    /**
     * Creates settings for Dark styles
     */
    public function create_dark_settings($wp_customize)
    {
        $themesCount = count(self::$themes);

        $wp_customize->add_setting('darkColors', [
            'default'   => 'darkColors',
            'transport' => self::$transport
        ]);
        $wp_customize->add_control('darkColors', [
            'section'   => self::$section,
            'type'      => 'text',
        ]);

        $contentColorsDataKeys = array_keys(self::$contentColorsData);
        $contentColorsDataValues = array_values(self::$contentColorsData);
        $contentColorsDataCount = SplFixedArray::fromArray($contentColorsDataKeys)->count();

        for ($i = 0; $i < $themesCount; $i++) {
            for ($j = $contentColorsDataCount - 1; $j >= 0; $j--) {
                $wp_customize->add_setting($contentColorsDataKeys[$j] . self::$themes[$i] . '-color-dark', [
                    'default' => 'null',
                    'transport' => self::$transport
                ]);
                $wp_customize->add_control($contentColorsDataKeys[$j] . self::$themes[$i] . '-color-dark', [
                    'section' => self::$section,
                    'type' => 'color',
                    'label' => $contentColorsDataValues[$j]
                ]);
            }
        }
    }

    /**
     * Creates settings for Light styles
     */
    public function create_light_settings($wp_customize)
    {
        $themesCount = count(self::$themes);

        $contentColorsDataKeys = array_keys(self::$contentColorsData);
        $contentColorsDataValues = array_values(self::$contentColorsData);
        $contentColorsDataCount = SplFixedArray::fromArray($contentColorsDataKeys)->count();

        if ($wp_customize->get_control('lightColors')) {
            echo $wp_customize->get_control('lightColors')->get_content();
        } else {
            $wp_customize->add_setting('lightColors', [
                'default' => '',
                'transport' => self::$transport
            ]);
            $wp_customize->add_control('lightColors', [
                'section' => self::$section,
                'type' => 'text',
            ]);
        }

        for ($i = 0; $i < $themesCount; $i++) {
            for ($j = $contentColorsDataCount - 1; $j >= 0; $j--) {
                $wp_customize->add_setting($contentColorsDataKeys[$j] . self::$themes[$i] . '-color-light', [
                    'default' => 'null',
                    'transport' => self::$transport
                ]);
                $wp_customize->add_control($contentColorsDataKeys[$j] . self::$themes[$i] . '-color-light', [
                    'section' => self::$section,
                    'type' => 'color',
                    'label' => $contentColorsDataValues[$j]
                ]);
            }
        }
    }

    /**
     * Creates settings for Typography for every Theme and Style
     */
    public function create_typography_settings($wp_customize)
    {
        $devices = new SplFixedArray(3);
        $devices[0] = 'desktop';
        $devices[1] = 'tablet';
        $devices[2] = 'mobile';
        $devicesCount = count($devices);
        $themesCount = count(self::$themes);

        // make headingsections array more faster
        $headingSectionsKeys = array_keys(self::$headingSections);
        $headingSectionsValues = array_values(self::$headingSections);
        $headingSectionsCount = SplFixedArray::fromArray($headingSectionsKeys)->count();

        $headingDataKeys = array_keys(self::$headingData);
        $headingDataValues = array_values(self::$headingData);
        $headingDataCount = SplFixedArray::fromArray($headingDataKeys)->count();

        // need to add control/setting for each theme 'Default', 'Mint', 'Elegance', 'Natural', 'Admiral', 'Peach', 'Candy', 'Bumblebee'
        for ($i = 0; $i < $themesCount; $i++) {
            for ($j = 0; $j < $headingSectionsCount; $j++) {
                $wp_customize->add_setting($headingSectionsKeys[$j] . self::$themes[$i]  . '_blockPopUp_', [
                    'default' => get_theme_mod($headingSectionsKeys[$j] . self::$themes[$i]  . '_blockPopUp_') ?? "text",
                    'transport' => self::$transport,
                ]);

                $wp_customize->add_control($headingSectionsKeys[$j] . self::$themes[$i]  . '_blockPopUp_', [
                    'section' => self::$section,
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
                        $wp_customize->add_setting($headingSectionsKeys[$j] . $headingDataKeys[$n] . self::$themes[$i]  . '-' . $devices[$m], [
                            'default' => get_theme_mod($headingSectionsKeys[$j] . $headingDataKeys[$n] . self::$themes[$i]  . '-' . $devices[$m]) ?? "text",
                            'transport' => self::$transport,
                        ]);
                        $wp_customize->add_control($headingSectionsKeys[$j] . $headingDataKeys[$n] . self::$themes[$i]  . '-' . $devices[$m], [
                            'section' => self::$section,
                            'type' => 'hidden',
                            'label' => 'Size',
                        ]);
                    }
                }
            }
        }
    }
}

new GXCustomizerContent();
