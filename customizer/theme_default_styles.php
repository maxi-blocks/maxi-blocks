<?php

    function set_color_and_fonts ( $comingStyles = [] ) {
        $styles = [];
        if ( isset($comingStyles['color']) && $comingStyles['color']) {
            $styles['color'] = $comingStyles['color'];
        }
        if ( isset($comingStyles['font-family']) && $comingStyles['font-family']) {
            $styles['font-family'] = str_replace(' ', '+', $comingStyles['font-family']);
        }
        if ( isset($comingStyles['font-size']) && $comingStyles['font-size']) {
            $styles['font-size'] = $comingStyles['font-size'];
        }
        if ( isset($comingStyles['font-weight']) && $comingStyles['font-weight']) {
            $styles['font-weight'] = $comingStyles['font-weight'];
        }
        if ( isset($comingStyles['line-height']) && $comingStyles['line-height']) {
            $styles['line-height'] = $comingStyles['line-height'];
        }
        if ( isset($comingStyles['letter-spacing']) && $comingStyles['letter-spacing']) {
            $styles['letter-spacing'] = $comingStyles['letter-spacing'];
        }
        if ( isset($comingStyles['transform']) && $comingStyles['transform']) {
            $styles['text-transform'] = $comingStyles['transform'];
        }
        if ( isset($comingStyles['style']) && $comingStyles['style']) {
            $styles['font-style'] = $comingStyles['style'];
        }
        if ( isset($comingStyles['decoration']) && $comingStyles['decoration']) {
            $styles['text-decoration-style'] = $comingStyles['decoration'];
        }
        if ( isset($comingStyles['decoration-line']) && $comingStyles['decoration-line']) {
            $styles['text-decoration-line'] = $comingStyles['decoration-line'];
        }
        return $styles;
    }



$themesDefaultOptions =  array(
    'Default' => array(
        'Dark' => array(
            'block' => array(
                'background' => '#000000',
            ),
            'domElements' => array(
                'p' =>  set_color_and_fonts(['color' => '#9b9b9b', 'font-family' => 'Roboto', 'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'a' =>  set_color_and_fonts(['color' => '#00ccff', 'font-family' => 'Roboto']),
                'h1' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Roboto', 'font-size' => '45px', 'font-weight' => '500', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h2' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Roboto', 'font-size' => '38px', 'font-weight' => '500', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h3' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Roboto', 'font-size' => '30px', 'font-weight' => '500', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h4' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Roboto', 'font-size' => '26px', 'font-weight' => '500', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h5' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Roboto', 'font-size' => '22px', 'font-weight' => '500', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h6' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Roboto', 'font-size' => '20px', 'font-weight' => '500', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
            ),
            'highlight' => '#00ccff',
            'hover' => '#999999',
        ),
        'Light' => array(
            'block' => array(
                'background' => '#ffffff',
            ),
            //add hover and highlight
            'domElements' => array(
                'p'  => set_color_and_fonts(['color' => '#9b9b9b', 'font-family' => 'Roboto', 'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'a'  => set_color_and_fonts(['color' => '#00ccff', 'font-family' => 'Roboto']),
                'h1' => set_color_and_fonts(['color' => '#000000', 'font-family' => 'Roboto', 'font-size' => '45px', 'font-weight' => '500', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h2' => set_color_and_fonts(['color' => '#000000', 'font-family' => 'Roboto', 'font-size' => '38px', 'font-weight' => '500', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h3' => set_color_and_fonts(['color' => '#000000', 'font-family' => 'Roboto', 'font-size' => '30px', 'font-weight' => '500', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h4' => set_color_and_fonts(['color' => '#000000', 'font-family' => 'Roboto', 'font-size' => '26px', 'font-weight' => '500', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h5' => set_color_and_fonts(['color' => '#000000', 'font-family' => 'Roboto', 'font-size' => '22px', 'font-weight' => '500', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h6' => set_color_and_fonts(['color' => '#000000', 'font-family' => 'Roboto', 'font-size' => '20px', 'font-weight' => '500', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
            ),
            'highlight' => '#00ccff',
            'hover' => '#999999',
        ),

    ),
    'Mint' => array(
        'Dark' => array(
            'block' => array(
                'background' => '#0c4c65',
            ),
            'domElements' => array(
                'p'  => set_color_and_fonts(['color' => '#36dbc2', 'font-family' => 'Lato',   'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'a'  => set_color_and_fonts(['color' => '#07f7d3', 'font-family' => 'Lato']),
                'h1' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Roboto', 'font-size' => '45px', 'font-weight' => '500', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h2' => set_color_and_fonts(['color' => '#36dbc2', 'font-family' => 'Roboto', 'font-size' => '38px', 'font-weight' => '500', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h3' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Roboto', 'font-size' => '30px', 'font-weight' => '500', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h4' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Roboto', 'font-size' => '26px', 'font-weight' => '500', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h5' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Roboto', 'font-size' => '22px', 'font-weight' => '500', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h6' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Roboto', 'font-size' => '20px', 'font-weight' => '500', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
            ),
            'highlight' => '#36dbc2',
            'hover' => '#64dd9e',
        ),
        'Light' => array(
            'block' => array(
                'background' => '#ffffff',
            ),
            'domElements' => array(
                'p'  => set_color_and_fonts(['color' => '#9b9b9b', 'font-family' => 'Lato',   'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'a'  => set_color_and_fonts(['color' => '#00ccff', 'font-family' => 'Lato']),
                'h1' => set_color_and_fonts(['color' => '#000000', 'font-family' => 'Roboto', 'font-size' => '45px', 'font-weight' => '500', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h2' => set_color_and_fonts(['color' => '#000000', 'font-family' => 'Roboto', 'font-size' => '38px', 'font-weight' => '500', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h3' => set_color_and_fonts(['color' => '#000000', 'font-family' => 'Roboto', 'font-size' => '30px', 'font-weight' => '500', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h4' => set_color_and_fonts(['color' => '#000000', 'font-family' => 'Roboto', 'font-size' => '26px', 'font-weight' => '500', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h5' => set_color_and_fonts(['color' => '#000000', 'font-family' => 'Roboto', 'font-size' => '22px', 'font-weight' => '500', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h6' => set_color_and_fonts(['color' => '#000000', 'font-family' => 'Roboto', 'font-size' => '20px', 'font-weight' => '500', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
            ),
            'highlight' => '#36dbc2',
            'hover' => '#0c4c65',
        ),
    ),
    'Elegance' => array(
        'Dark' => array(
            'block' => array(
                'background' => '#1e1e26',
            ),
            'domElements' => array(
                'p'  => set_color_and_fonts(['color' => '#9b9b9b', 'font-family' => 'Roboto',   'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'a'  => set_color_and_fonts(['color' => '#dec79b', 'font-family' => 'Roboto']),
                'h1' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Vidaloka', 'font-size' => '45px', 'font-weight' => '400', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h2' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Vidaloka', 'font-size' => '38px', 'font-weight' => '400', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h3' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Vidaloka', 'font-size' => '30px', 'font-weight' => '400', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h4' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Vidaloka', 'font-size' => '26px', 'font-weight' => '400', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h5' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Roboto',   'font-size' => '22px', 'font-weight' => '400', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h6' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Roboto',   'font-size' => '20px', 'font-weight' => '400', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
            ),
            'highlight' => '#dec79b',
            'hover' => '#9b9b9b',
        ),
        'Light' => array(
            'block' => array(
                'background' => '#ffffff',
            ),
            'domElements' => array(
                'p'  => set_color_and_fonts(['color' => '#9b9b9b', 'font-family' => 'Roboto',   'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'a'  => set_color_and_fonts(['color' => '#dec79b', 'font-family' => 'Roboto']),
                'h1' => set_color_and_fonts(['color' => '#1e1e26', 'font-family' => 'Vidaloka', 'font-size' => '45px', 'font-weight' => '400', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h2' => set_color_and_fonts(['color' => '#1e1e26', 'font-family' => 'Vidaloka', 'font-size' => '38px', 'font-weight' => '400', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h3' => set_color_and_fonts(['color' => '#1e1e26', 'font-family' => 'Vidaloka', 'font-size' => '30px', 'font-weight' => '400', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h4' => set_color_and_fonts(['color' => '#1e1e26', 'font-family' => 'Vidaloka', 'font-size' => '26px', 'font-weight' => '400', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h5' => set_color_and_fonts(['color' => '#1e1e26', 'font-family' => 'Roboto',   'font-size' => '22px', 'font-weight' => '400', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h6' => set_color_and_fonts(['color' => '#1e1e26', 'font-family' => 'Roboto',   'font-size' => '20px', 'font-weight' => '400', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
            ),
            'highlight' => '#dec79b',
            'hover' => '#9b9b9b',
        ),
    ),
    'Candy' => array(
        'Dark' => array(
            'block' => array(
                'background' => '#eaf4f9',
            ),
            'domElements' => array(
                'p'  => set_color_and_fonts(['color' => '#666666', 'font-family' => 'Merriweather', 'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'a'  => set_color_and_fonts(['color' => '#f74356', 'font-family' => 'Merriweather']),
                'h1' => set_color_and_fonts(['color' => '#2b2b33', 'font-family' => 'Raleway',      'font-size' => '45px', 'font-weight' => '400', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h2' => set_color_and_fonts(['color' => '#64c2ec', 'font-family' => 'Raleway',      'font-size' => '38px', 'font-weight' => '400', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h3' => set_color_and_fonts(['color' => '#f74356', 'font-family' => 'Raleway',      'font-size' => '30px', 'font-weight' => '400', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h4' => set_color_and_fonts(['color' => '#2b2b33', 'font-family' => 'Raleway',      'font-size' => '26px', 'font-weight' => '400', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h5' => set_color_and_fonts(['color' => '#f74356', 'font-family' => 'Merriweather', 'font-size' => '22px', 'font-weight' => '400', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h6' => set_color_and_fonts(['color' => '#f74356', 'font-family' => 'Merriweather', 'font-size' => '20px', 'font-weight' => '400', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
            ),
            'highlight' => '#f74356',
            'hover' => '#64c2ec',
        ),
        'Light' => array(
            'block' => array(
                'background' => '#ffffff',
            ),
            'domElements' => array(
                'p'  => set_color_and_fonts(['color' => '#666666', 'font-family' => 'Merriweather', 'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'a'  => set_color_and_fonts(['color' => '#f74356', 'font-family' => 'Merriweather']),
                'h1' => set_color_and_fonts(['color' => '#2b2b33', 'font-family' => 'Raleway',      'font-size' => '45px', 'font-weight' => '400', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h2' => set_color_and_fonts(['color' => '#64c2ec', 'font-family' => 'Raleway',      'font-size' => '38px', 'font-weight' => '400', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h3' => set_color_and_fonts(['color' => '#f74356', 'font-family' => 'Raleway',      'font-size' => '30px', 'font-weight' => '400', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h4' => set_color_and_fonts(['color' => '#2b2b33', 'font-family' => 'Raleway',      'font-size' => '26px', 'font-weight' => '400', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h5' => set_color_and_fonts(['color' => '#f74356', 'font-family' => 'Merriweather', 'font-size' => '22px', 'font-weight' => '400', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h6' => set_color_and_fonts(['color' => '#f74356', 'font-family' => 'Merriweather', 'font-size' => '20px', 'font-weight' => '400', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
            ),
            'highlight' => '#f74356',
            'hover' => '#64c2ec',
        ),
    ),
    'Bumblebee' => array(
        'Dark' => array(
            'block' => array(
                'background' => '#323c47',
            ),
            'domElements' => array(
                'p'  => set_color_and_fonts(['color' => '#a7a7a7', 'font-family' => 'Lora',    'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'a'  => set_color_and_fonts(['color' => '#ffd012', 'font-family' => 'Lora']),
                'h1' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Poppins', 'font-size' => '45px', 'font-weight' => '700', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h2' => set_color_and_fonts(['color' => '#64c2ec', 'font-family' => 'Poppins', 'font-size' => '38px', 'font-weight' => '700', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h3' => set_color_and_fonts(['color' => '#f74356', 'font-family' => 'Poppins', 'font-size' => '30px', 'font-weight' => '700', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h4' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Poppins', 'font-size' => '26px', 'font-weight' => '700', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h5' => set_color_and_fonts(['color' => '#f74356', 'font-family' => 'Poppins', 'font-size' => '22px', 'font-weight' => '700', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h6' => set_color_and_fonts(['color' => '#ffd012', 'font-family' => 'Poppins', 'font-size' => '20px', 'font-weight' => '700', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
            ),
            'highlight' => '#ffd012',
            'hover' => '#ff9212',
        ),
        'Light' => array(
            'block' => array(
                'background' => '#ffffff',
            ),
            'domElements' => array(
                'p'  => set_color_and_fonts(['color' => '#666666', 'font-family' => 'Lora',    'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'a'  => set_color_and_fonts(['color' => '#ffd012', 'font-family' => 'Lora']),
                'h1' => set_color_and_fonts(['color' => '#323c47', 'font-family' => 'Poppins', 'font-size' => '45px', 'font-weight' => '700', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h2' => set_color_and_fonts(['color' => '#323c47', 'font-family' => 'Poppins', 'font-size' => '38px', 'font-weight' => '700', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h3' => set_color_and_fonts(['color' => '#323c47', 'font-family' => 'Poppins', 'font-size' => '30px', 'font-weight' => '700', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h4' => set_color_and_fonts(['color' => '#323c47', 'font-family' => 'Poppins', 'font-size' => '26px', 'font-weight' => '700', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h5' => set_color_and_fonts(['color' => '#ffd012', 'font-family' => 'Poppins', 'font-size' => '22px', 'font-weight' => '700', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
                'h6' => set_color_and_fonts(['color' => '#ffd012', 'font-family' => 'Poppins', 'font-size' => '20px', 'font-weight' => '700', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
            ),
            'highlight' => '#ffd012',
            'hover' => '#ff9212',
        ),
    ),
);

return $themesDefaultOptions;
















//    'Natural' => array(
//        'Dark' => array(
//            'block' => array(
//                'background' => '#323c47',
//            ),
//            'domElements' => array(
//                'p' =>  set_color_and_fonts(['color' => '#36dbc2', 'font-family' => 'Open Sans', 'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'a' =>  set_color_and_fonts(['color' => '#94e349', 'font-family' => 'Open Sans']),
//                'h1' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Oswald',    'font-size' => '45px', 'font-weight' => '400', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h2' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Oswald',    'font-size' => '38px', 'font-weight' => '400', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h3' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Oswald',    'font-size' => '30px', 'font-weight' => '400', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h4' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Oswald',    'font-size' => '26px', 'font-weight' => '400', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h5' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Open Sans', 'font-size' => '22px', 'font-weight' => '400', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h6' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Open Sans', 'font-size' => '20px', 'font-weight' => '400', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//            ),
//            'highlight' => '#94e349',
//            'hover' => '#7dfb05',
//        ),
//        'Light' => array(
//            'block' => array(
//                'background' => '#ffffff',
//            ),
//            'domElements' => array(
//                'p' =>  set_color_and_fonts(['color' => '#36dbc2', 'font-family' => 'Open Sans', 'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'a' =>  set_color_and_fonts(['color' => '#94e349', 'font-family' => 'Open Sans']),
//                'h1' => set_color_and_fonts(['color' => '#323c47', 'font-family' => 'Oswald', 'font-size' => '45px',    'font-weight' => '400', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h2' => set_color_and_fonts(['color' => '#323c47', 'font-family' => 'Oswald', 'font-size' => '38px',    'font-weight' => '400', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h3' => set_color_and_fonts(['color' => '#323c47', 'font-family' => 'Oswald', 'font-size' => '30px',    'font-weight' => '400', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h4' => set_color_and_fonts(['color' => '#323c47', 'font-family' => 'Oswald', 'font-size' => '26px',    'font-weight' => '400', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h5' => set_color_and_fonts(['color' => '#323c47', 'font-family' => 'Open Sans', 'font-size' => '22px', 'font-weight' => '400', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h6' => set_color_and_fonts(['color' => '#323c47', 'font-family' => 'Open Sans', 'font-size' => '20px', 'font-weight' => '400', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//            ),
//            'highlight' => '#94e349',
//            'hover' => '#7dfb05',
//        ),
//    ),
//    'Admiral' => array(
//        'Dark' => array(
//            'block' => array(
//                'background' => '#f4f5f8',
//            ),
//            'domElements' => array(
//                'p' =>  set_color_and_fonts(['color' => '#595f6f', 'font-family' => 'Arial', 'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'a' =>  set_color_and_fonts(['color' => '#f91f42', 'font-family' => 'Arial']),
//                'h1' => set_color_and_fonts(['color' => '#1a47b0', 'font-family' => 'Roboto Slab', 'font-size' => '45px', 'font-weight' => '400', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h2' => set_color_and_fonts(['color' => '#1a47b0', 'font-family' => 'Roboto Slab', 'font-size' => '38px', 'font-weight' => '400', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h3' => set_color_and_fonts(['color' => '#1a47b0', 'font-family' => 'Roboto Slab', 'font-size' => '30px', 'font-weight' => '400', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h4' => set_color_and_fonts(['color' => '#1a47b0', 'font-family' => 'Roboto Slab', 'font-size' => '26px', 'font-weight' => '400', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h5' => set_color_and_fonts(['color' => '#f91f42', 'font-family' => 'Arial',       'font-size' => '22px', 'font-weight' => '400', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h6' => set_color_and_fonts(['color' => '#f91f42', 'font-family' => 'Arial',       'font-size' => '20px', 'font-weight' => '400', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//            ),
//            'highlight' => '#94e349',
//            'hover' => '#1a47b0',
//        ),
//        'Light' => array(
//            'block' => array(
//                'background' => '#ffffff',
//            ),
//            'domElements' => array(
//                'p' =>  set_color_and_fonts(['color' => '#595f6f', 'font-family' => 'Arial', 'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'a' =>  set_color_and_fonts(['color' => '#f91f42', 'font-family' => 'Arial']),
//                'h1' => set_color_and_fonts(['color' => '#1a47b0', 'font-family' => 'Roboto Slab', 'font-size' => '45px', 'font-weight' => '400', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h2' => set_color_and_fonts(['color' => '#1a47b0', 'font-family' => 'Roboto Slab', 'font-size' => '38px', 'font-weight' => '400', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h3' => set_color_and_fonts(['color' => '#1a47b0', 'font-family' => 'Roboto Slab', 'font-size' => '30px', 'font-weight' => '400', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h4' => set_color_and_fonts(['color' => '#1a47b0', 'font-family' => 'Roboto Slab', 'font-size' => '26px', 'font-weight' => '400', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h5' => set_color_and_fonts(['color' => '#f91f42', 'font-family' => 'Arial',       'font-size' => '22px', 'font-weight' => '400', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h6' => set_color_and_fonts(['color' => '#f91f42', 'font-family' => 'Arial',       'font-size' => '20px', 'font-weight' => '400', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//            ),
//            'highlight' => '#94e349',
//            'hover' => '#1a47b0',
//        ),
//    ),
//    'Peach' => array(
//        'Dark' => array(
//            'block' => array(
//                'background' => '#24315e',
//            ),
//            'domElements' => array(
//                'p'  => set_color_and_fonts(['color' => '#cccccc', 'font-family' => 'Verdana',          'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'a'  => set_color_and_fonts(['color' => '#f76d6d', 'font-family' => 'Verdana']),
//                'h1' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Playfair Display', 'font-size' => '45px', 'font-weight' => '400', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h2' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Playfair Display', 'font-size' => '38px', 'font-weight' => '400', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h3' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Playfair Display', 'font-size' => '30px', 'font-weight' => '400', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h4' => set_color_and_fonts(['color' => '#ffffff', 'font-family' => 'Playfair Display', 'font-size' => '26px', 'font-weight' => '400', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h5' => set_color_and_fonts(['color' => '#f91f42', 'font-family' => 'Open Sans',        'font-size' => '22px', 'font-weight' => '400', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h6' => set_color_and_fonts(['color' => '#f91f42', 'font-family' => 'Open Sans',        'font-size' => '20px', 'font-weight' => '400', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//            ),
//            'highlight' => '#f76d6d',
//            'hover' => '#f71717',
//        ),
//        'Light' => array(
//            'block' => array(
//                'background' => '#ffffff',
//            ),
//            'domElements' => array(
//                'p'  => set_color_and_fonts(['color' => '#36dbc2', 'font-family' => 'Verdana',          'font-size' => '16px', 'font-weight' => '400', 'line-height' => '26px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'a'  => set_color_and_fonts(['color' => '#f76d6d', 'font-family' => 'Verdana']),
//                'h1' => set_color_and_fonts(['color' => '#374785', 'font-family' => 'Playfair Display', 'font-size' => '45px', 'font-weight' => '400', 'line-height' => '55px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h2' => set_color_and_fonts(['color' => '#374785', 'font-family' => 'Playfair Display', 'font-size' => '38px', 'font-weight' => '400', 'line-height' => '48px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h3' => set_color_and_fonts(['color' => '#374785', 'font-family' => 'Playfair Display', 'font-size' => '30px', 'font-weight' => '400', 'line-height' => '40px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h4' => set_color_and_fonts(['color' => '#374785', 'font-family' => 'Playfair Display', 'font-size' => '26px', 'font-weight' => '400', 'line-height' => '36px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h5' => set_color_and_fonts(['color' => '#f76d6d', 'font-family' => 'Verdana',          'font-size' => '22px', 'font-weight' => '400', 'line-height' => '32px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//                'h6' => set_color_and_fonts(['color' => '#f76d6d', 'font-family' => 'Verdana',          'font-size' => '20px', 'font-weight' => '400', 'line-height' => '30px', 'letter-spacing' => '0', 'transform' => 'none', 'style' => 'normal', 'decoration' => 'unset', 'decoration-line' => 'none']),
//            ),
//            'highlight' => '#f76d6d',
//            'hover' => '#f71717',
//        ),
//    ),