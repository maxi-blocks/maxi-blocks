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


$defaulThemeStylesDefault = 'body.Default .maxi-dark { background-color : #000000 !important;}
body.Default .maxi-light { background-color : #ffffff !important;}
body.Default .default { background-color : #ffffff !important;}
body.Default .maxi-dark h1 {font-family:"Roboto" !important;color : #ffffff !important;font-size : 45 !important;line-height : 55px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Default .maxi-light h1 {font-family:"Roboto" !important;color : #000000 !important;font-size : 45 !important;line-height : 55px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Default .maxi-dark h1 {color : #ffffff !important;}body.Default .maxi-light h1 {color : #000000 !important;}}
@media screen and (max-width:480px) { body.Default .maxi-dark h1 {color : #ffffff !important;}body.Default .maxi-light h1 {color : #000000 !important;}}
body.Default .maxi-dark h2 {font-family:"Roboto" !important;color : #ffffff !important;font-size : 38 !important;line-height : 48px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Default .maxi-light h2 {font-family:"Roboto" !important;color : #000000 !important;font-size : 38 !important;line-height : 48px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Default .maxi-dark h2 {color : #ffffff !important;}body.Default .maxi-light h2 {color : #000000 !important;}}
@media screen and (max-width:480px) { body.Default .maxi-dark h2 {color : #ffffff !important;}body.Default .maxi-light h2 {color : #000000 !important;}}
body.Default .maxi-dark h3 {font-family:"Roboto" !important;color : #ffffff !important;font-size : 30 !important;line-height : 40px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Default .maxi-light h3 {font-family:"Roboto" !important;color : #000000 !important;font-size : 30 !important;line-height : 40px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Default .maxi-dark h3 {color : #ffffff !important;}body.Default .maxi-light h3 {color : #000000 !important;}}
@media screen and (max-width:480px) { body.Default .maxi-dark h3 {color : #ffffff !important;}body.Default .maxi-light h3 {color : #000000 !important;}}
body.Default .maxi-dark h4 {font-family:"Roboto" !important;color : #ffffff !important;font-size : 26 !important;line-height : 36px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Default .maxi-light h4 {font-family:"Roboto" !important;color : #000000 !important;font-size : 26 !important;line-height : 36px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Default .maxi-dark h4 {color : #ffffff !important;}body.Default .maxi-light h4 {color : #000000 !important;}}
@media screen and (max-width:480px) { body.Default .maxi-dark h4 {color : #ffffff !important;}body.Default .maxi-light h4 {color : #000000 !important;}}
body.Default .maxi-dark h5 {font-family:"Roboto" !important;color : #ffffff !important;font-size : 22 !important;line-height : 32px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Default .maxi-light h5 {font-family:"Roboto" !important;color : #000000 !important;font-size : 22 !important;line-height : 32px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Default .maxi-dark h5 {color : #ffffff !important;}body.Default .maxi-light h5 {color : #000000 !important;}}
@media screen and (max-width:480px) { body.Default .maxi-dark h5 {color : #ffffff !important;}body.Default .maxi-light h5 {color : #000000 !important;}}
body.Default .maxi-dark h6 {font-family:"Roboto" !important;color : #ffffff !important;font-size : 20 !important;line-height : 30px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Default .maxi-light h6 {font-family:"Roboto" !important;color : #000000 !important;font-size : 20 !important;line-height : 30px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Default .maxi-dark h6 {color : #ffffff !important;}body.Default .maxi-light h6 {color : #000000 !important;}}
@media screen and (max-width:480px) { body.Default .maxi-dark h6 {color : #ffffff !important;}body.Default .maxi-light h6 {color : #000000 !important;}}
body.Default .maxi-dark p {font-family:"Roboto" !important;color : #9b9b9b !important;font-size : 16 !important;line-height : 26px !important;font-weight: 400 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Default .maxi-light p {font-family:"Roboto" !important;color : #9b9b9b !important;font-size : 16 !important;line-height : 26px !important;font-weight: 400 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Default .maxi-dark p {color : #9b9b9b !important;}body.Default .maxi-light p {color : #9b9b9b !important;}}
@media screen and (max-width:480px) { body.Default .maxi-dark p {color : #9b9b9b !important;}body.Default .maxi-light p {color : #9b9b9b !important;}}
body.Default .maxi-dark li {font-family:"Roboto" !important;color : #9b9b9b !important;font-size : 16 !important;line-height : 26px !important;font-weight: 400 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Default .maxi-light li {font-family:"Roboto" !important;color : #9b9b9b !important;font-size : 16 !important;line-height : 26px !important;font-weight: 400 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Default .maxi-dark li {color : #9b9b9b !important;}body.Default .maxi-light li {color : #9b9b9b !important;}}
@media screen and (max-width:480px) { body.Default .maxi-dark li {color : #9b9b9b !important;}body.Default .maxi-light li {color : #9b9b9b !important;}}
body.Default .maxi-dark a { color : #00ccff !important;}
body.Default .maxi-light a { color : #00ccff !important;}
body.Default default a { color : #00ccff !important;}
body.Default .maxi-dark a:hover { color : #999999 !important;}
body.Default .maxi-light a:hover { color : #999999 !important;}
body.Default .default a:hover { color : #999999 !important;}
body.Default .maxi-dark .highlight { color : #00ccff !important;}
body.Default .maxi-dark .divider { border-color : #00ccff !important;}
body.Default .maxi-light .highlight { color : #00ccff !important;}
body.Default .default .highlight { color : #00ccff !important;}
body.Default .maxi-light .divider { border-color : #00ccff !important;}
body.Default .default .divider { border-color : #00ccff !important;}';

$defaulThemeStylesMint = 'body.Mint .maxi-dark { background-color : #0c4c65 !important;}
body.Mint .maxi-light { background-color : #ffffff !important;}
body.Mint .default { background-color : #ffffff !important;}
body.Mint .maxi-dark h1 {font-family:"Roboto" !important;color : #ffffff !important;font-size : 45 !important;line-height : 55px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Mint .maxi-light h1 {font-family:"Roboto" !important;color : #000000 !important;font-size : 45 !important;line-height : 55px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Mint .maxi-dark h1 {color : #ffffff !important;}body.Mint .maxi-light h1 {color : #000000 !important;}}
@media screen and (max-width:480px) { body.Mint .maxi-dark h1 {color : #ffffff !important;}body.Mint .maxi-light h1 {color : #000000 !important;}}
body.Mint .maxi-dark h2 {font-family:"Roboto" !important;color : #36dbc2 !important;font-size : 38 !important;line-height : 48px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Mint .maxi-light h2 {font-family:"Roboto" !important;color : #000000 !important;font-size : 38 !important;line-height : 48px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Mint .maxi-dark h2 {color : #36dbc2 !important;}body.Mint .maxi-light h2 {color : #000000 !important;}}
@media screen and (max-width:480px) { body.Mint .maxi-dark h2 {color : #36dbc2 !important;}body.Mint .maxi-light h2 {color : #000000 !important;}}
body.Mint .maxi-dark h3 {font-family:"Roboto" !important;color : #ffffff !important;font-size : 30 !important;line-height : 40px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Mint .maxi-light h3 {font-family:"Roboto" !important;color : #000000 !important;font-size : 30 !important;line-height : 40px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Mint .maxi-dark h3 {color : #ffffff !important;}body.Mint .maxi-light h3 {color : #000000 !important;}}
@media screen and (max-width:480px) { body.Mint .maxi-dark h3 {color : #ffffff !important;}body.Mint .maxi-light h3 {color : #000000 !important;}}
body.Mint .maxi-dark h4 {font-family:"Roboto" !important;color : #ffffff !important;font-size : 26 !important;line-height : 36px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Mint .maxi-light h4 {font-family:"Roboto" !important;color : #000000 !important;font-size : 26 !important;line-height : 36px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Mint .maxi-dark h4 {color : #ffffff !important;}body.Mint .maxi-light h4 {color : #000000 !important;}}
@media screen and (max-width:480px) { body.Mint .maxi-dark h4 {color : #ffffff !important;}body.Mint .maxi-light h4 {color : #000000 !important;}}
body.Mint .maxi-dark h5 {font-family:"Roboto" !important;color : #ffffff !important;font-size : 22 !important;line-height : 32px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Mint .maxi-light h5 {font-family:"Roboto" !important;color : #000000 !important;font-size : 22 !important;line-height : 32px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Mint .maxi-dark h5 {color : #ffffff !important;}body.Mint .maxi-light h5 {color : #000000 !important;}}
@media screen and (max-width:480px) { body.Mint .maxi-dark h5 {color : #ffffff !important;}body.Mint .maxi-light h5 {color : #000000 !important;}}
body.Mint .maxi-dark h6 {font-family:"Roboto" !important;color : #ffffff !important;font-size : 20 !important;line-height : 30px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Mint .maxi-light h6 {font-family:"Roboto" !important;color : #000000 !important;font-size : 20 !important;line-height : 30px !important;font-weight: 500 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Mint .maxi-dark h6 {color : #ffffff !important;}body.Mint .maxi-light h6 {color : #000000 !important;}}
@media screen and (max-width:480px) { body.Mint .maxi-dark h6 {color : #ffffff !important;}body.Mint .maxi-light h6 {color : #000000 !important;}}
body.Mint .maxi-dark p {font-family:"Lato" !important;color : #36dbc2 !important;font-size : 16 !important;line-height : 26px !important;font-weight: 400 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Mint .maxi-light p {font-family:"Lato" !important;color : #9b9b9b !important;font-size : 16 !important;line-height : 26px !important;font-weight: 400 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Mint .maxi-dark p {color : #36dbc2 !important;}body.Mint .maxi-light p {color : #9b9b9b !important;}}
@media screen and (max-width:480px) { body.Mint .maxi-dark p {color : #36dbc2 !important;}body.Mint .maxi-light p {color : #9b9b9b !important;}}
body.Mint .maxi-dark li {font-family:"Lato" !important;color : #36dbc2 !important;font-size : 16 !important;line-height : 26px !important;font-weight: 400 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
body.Mint .maxi-light li {font-family:"Lato" !important;color : #9b9b9b !important;font-size : 16 !important;line-height : 26px !important;font-weight: 400 !important;text-transform:none !important;font-style: normal !important;text-decoration-line :none;text-decoration-style: unset !important;}
@media screen and (max-width:980px) { body.Mint .maxi-dark li {color : #36dbc2 !important;}body.Mint .maxi-light li {color : #9b9b9b !important;}}
@media screen and (max-width:480px) { body.Mint .maxi-dark li {color : #36dbc2 !important;}body.Mint .maxi-light li {color : #9b9b9b !important;}}
body.Mint .maxi-dark a { color : #07f7d3 !important;}
body.Mint .maxi-light a { color : #00ccff !important;}
body.Mint default a { color : #00ccff !important;}
body.Mint .maxi-dark a:hover { color : #64dd9e !important;}
body.Mint .maxi-light a:hover { color : #0c4c65 !important;}
body.Mint .default a:hover { color : #0c4c65 !important;}
body.Mint .maxi-dark .highlight { color : #36dbc2 !important;}
body.Mint .maxi-dark .divider { border-color : #36dbc2 !important;}
body.Mint .maxi-light .highlight { color : #36dbc2 !important;}
body.Mint .default .highlight { color : #36dbc2 !important;}
body.Mint .maxi-light .divider { border-color : #36dbc2 !important;}
body.Mint .default .divider { border-color : #36dbc2 !important;}';

$defaulThemeStylesElegance = 'body.Elegance .maxi-dark { background-color : #1e1e26 !important;}
body.Elegance .maxi-light { background-color : #ffffff !important;}
body.Elegance .default { background-color : #ffffff !important;}
body.Elegance .maxi-dark h1 {color : #ffffff !important;}
body.Elegance .maxi-light h1 {color : #1e1e26 !important;}
@media screen and (max-width:980px) { body.Elegance .maxi-dark h1 {color : #ffffff !important;}body.Elegance .maxi-light h1 {color : #1e1e26 !important;}}
@media screen and (max-width:480px) { body.Elegance .maxi-dark h1 {color : #ffffff !important;}body.Elegance .maxi-light h1 {color : #1e1e26 !important;}}
body.Elegance .maxi-dark h2 {color : #ffffff !important;}
body.Elegance .maxi-light h2 {color : #1e1e26 !important;}
@media screen and (max-width:980px) { body.Elegance .maxi-dark h2 {color : #ffffff !important;}body.Elegance .maxi-light h2 {color : #1e1e26 !important;}}
@media screen and (max-width:480px) { body.Elegance .maxi-dark h2 {color : #ffffff !important;}body.Elegance .maxi-light h2 {color : #1e1e26 !important;}}
body.Elegance .maxi-dark h3 {color : #ffffff !important;}
body.Elegance .maxi-light h3 {color : #1e1e26 !important;}
@media screen and (max-width:980px) { body.Elegance .maxi-dark h3 {color : #ffffff !important;}body.Elegance .maxi-light h3 {color : #1e1e26 !important;}}
@media screen and (max-width:480px) { body.Elegance .maxi-dark h3 {color : #ffffff !important;}body.Elegance .maxi-light h3 {color : #1e1e26 !important;}}
body.Elegance .maxi-dark h4 {color : #ffffff !important;}
body.Elegance .maxi-light h4 {color : #1e1e26 !important;}
@media screen and (max-width:980px) { body.Elegance .maxi-dark h4 {color : #ffffff !important;}body.Elegance .maxi-light h4 {color : #1e1e26 !important;}}
@media screen and (max-width:480px) { body.Elegance .maxi-dark h4 {color : #ffffff !important;}body.Elegance .maxi-light h4 {color : #1e1e26 !important;}}
body.Elegance .maxi-dark h5 {color : #ffffff !important;}
body.Elegance .maxi-light h5 {color : #1e1e26 !important;}
@media screen and (max-width:980px) { body.Elegance .maxi-dark h5 {color : #ffffff !important;}body.Elegance .maxi-light h5 {color : #1e1e26 !important;}}
@media screen and (max-width:480px) { body.Elegance .maxi-dark h5 {color : #ffffff !important;}body.Elegance .maxi-light h5 {color : #1e1e26 !important;}}
body.Elegance .maxi-dark h6 {color : #ffffff !important;}
body.Elegance .maxi-light h6 {color : #1e1e26 !important;}
@media screen and (max-width:980px) { body.Elegance .maxi-dark h6 {color : #ffffff !important;}body.Elegance .maxi-light h6 {color : #1e1e26 !important;}}
@media screen and (max-width:480px) { body.Elegance .maxi-dark h6 {color : #ffffff !important;}body.Elegance .maxi-light h6 {color : #1e1e26 !important;}}
body.Elegance .maxi-dark p {color : #9b9b9b !important;}
body.Elegance .maxi-light p {color : #9b9b9b !important;}
@media screen and (max-width:980px) { body.Elegance .maxi-dark p {color : #9b9b9b !important;}body.Elegance .maxi-light p {color : #9b9b9b !important;}}
@media screen and (max-width:480px) { body.Elegance .maxi-dark p {color : #9b9b9b !important;}body.Elegance .maxi-light p {color : #9b9b9b !important;}}
body.Elegance .maxi-dark li {color : #9b9b9b !important;}
body.Elegance .maxi-light li {color : #9b9b9b !important;}
@media screen and (max-width:980px) { body.Elegance .maxi-dark li {color : #9b9b9b !important;}body.Elegance .maxi-light li {color : #9b9b9b !important;}}
@media screen and (max-width:480px) { body.Elegance .maxi-dark li {color : #9b9b9b !important;}body.Elegance .maxi-light li {color : #9b9b9b !important;}}
body.Elegance .maxi-dark a { color : #dec79b !important;}
body.Elegance .maxi-light a { color : #dec79b !important;}
body.Elegance default a { color : #dec79b !important;}
body.Elegance .maxi-dark a:hover { color : #9b9b9b !important;}
body.Elegance .maxi-light a:hover { color : #9b9b9b !important;}
body.Elegance .default a:hover { color : #9b9b9b !important;}
body.Elegance .maxi-dark .highlight { color : #dec79b !important;}
body.Elegance .maxi-dark .divider { border-color : #dec79b !important;}
body.Elegance .maxi-light .highlight { color : #dec79b !important;}
body.Elegance .default .highlight { color : #dec79b !important;}
body.Elegance .maxi-light .divider { border-color : #dec79b !important;}
body.Elegance .default .divider { border-color : #dec79b !important;}';

$defaulThemeStylesCandy = 'body.Candy .maxi-dark { background-color : #eaf4f9 !important;}
body.Candy .maxi-light { background-color : #ffffff !important;}
body.Candy .default { background-color : #ffffff !important;}
body.Candy .maxi-dark h1 {color : #2b2b33 !important;}
body.Candy .maxi-light h1 {color : #2b2b33 !important;}
@media screen and (max-width:980px) { body.Candy .maxi-dark h1 {color : #2b2b33 !important;}body.Candy .maxi-light h1 {color : #2b2b33 !important;}}
@media screen and (max-width:480px) { body.Candy .maxi-dark h1 {color : #2b2b33 !important;}body.Candy .maxi-light h1 {color : #2b2b33 !important;}}
body.Candy .maxi-dark h2 {color : #64c2ec !important;}
body.Candy .maxi-light h2 {color : #64c2ec !important;}
@media screen and (max-width:980px) { body.Candy .maxi-dark h2 {color : #64c2ec !important;}body.Candy .maxi-light h2 {color : #64c2ec !important;}}
@media screen and (max-width:480px) { body.Candy .maxi-dark h2 {color : #64c2ec !important;}body.Candy .maxi-light h2 {color : #64c2ec !important;}}
body.Candy .maxi-dark h3 {color : #f74356 !important;}
body.Candy .maxi-light h3 {color : #f74356 !important;}
@media screen and (max-width:980px) { body.Candy .maxi-dark h3 {color : #f74356 !important;}body.Candy .maxi-light h3 {color : #f74356 !important;}}
@media screen and (max-width:480px) { body.Candy .maxi-dark h3 {color : #f74356 !important;}body.Candy .maxi-light h3 {color : #f74356 !important;}}
body.Candy .maxi-dark h4 {color : #2b2b33 !important;}
body.Candy .maxi-light h4 {color : #2b2b33 !important;}
@media screen and (max-width:980px) { body.Candy .maxi-dark h4 {color : #2b2b33 !important;}body.Candy .maxi-light h4 {color : #2b2b33 !important;}}
@media screen and (max-width:480px) { body.Candy .maxi-dark h4 {color : #2b2b33 !important;}body.Candy .maxi-light h4 {color : #2b2b33 !important;}}
body.Candy .maxi-dark h5 {color : #f74356 !important;}
body.Candy .maxi-light h5 {color : #f74356 !important;}
@media screen and (max-width:980px) { body.Candy .maxi-dark h5 {color : #f74356 !important;}body.Candy .maxi-light h5 {color : #f74356 !important;}}
@media screen and (max-width:480px) { body.Candy .maxi-dark h5 {color : #f74356 !important;}body.Candy .maxi-light h5 {color : #f74356 !important;}}
body.Candy .maxi-dark h6 {color : #f74356 !important;}
body.Candy .maxi-light h6 {color : #f74356 !important;}
@media screen and (max-width:980px) { body.Candy .maxi-dark h6 {color : #f74356 !important;}body.Candy .maxi-light h6 {color : #f74356 !important;}}
@media screen and (max-width:480px) { body.Candy .maxi-dark h6 {color : #f74356 !important;}body.Candy .maxi-light h6 {color : #f74356 !important;}}
body.Candy .maxi-dark p {color : #666666 !important;}
body.Candy .maxi-light p {color : #666666 !important;}
@media screen and (max-width:980px) { body.Candy .maxi-dark p {color : #666666 !important;}body.Candy .maxi-light p {color : #666666 !important;}}
@media screen and (max-width:480px) { body.Candy .maxi-dark p {color : #666666 !important;}body.Candy .maxi-light p {color : #666666 !important;}}
body.Candy .maxi-dark li {color : #666666 !important;}
body.Candy .maxi-light li {color : #666666 !important;}
@media screen and (max-width:980px) { body.Candy .maxi-dark li {color : #666666 !important;}body.Candy .maxi-light li {color : #666666 !important;}}
@media screen and (max-width:480px) { body.Candy .maxi-dark li {color : #666666 !important;}body.Candy .maxi-light li {color : #666666 !important;}}
body.Candy .maxi-dark a { color : #f74356 !important;}
body.Candy .maxi-light a { color : #f74356 !important;}
body.Candy default a { color : #f74356 !important;}
body.Candy .maxi-dark a:hover { color : #64c2ec !important;}
body.Candy .maxi-light a:hover { color : #64c2ec !important;}
body.Candy .default a:hover { color : #64c2ec !important;}
body.Candy .maxi-dark .highlight { color : #f74356 !important;}
body.Candy .maxi-dark .divider { border-color : #f74356 !important;}
body.Candy .maxi-light .highlight { color : #f74356 !important;}
body.Candy .default .highlight { color : #f74356 !important;}
body.Candy .maxi-light .divider { border-color : #f74356 !important;}
body.Candy .default .divider { border-color : #f74356 !important;}';

$defaulThemeStylesBumblebee = 'body.Bumblebee .maxi-dark { background-color : #323c47 !important;}
body.Bumblebee .maxi-light { background-color : #ffffff !important;}
body.Bumblebee .default { background-color : #ffffff !important;}
body.Bumblebee .maxi-dark h1 {color : #ffffff !important;}
body.Bumblebee .maxi-light h1 {color : #323c47 !important;}
@media screen and (max-width:980px) { body.Bumblebee .maxi-dark h1 {color : #ffffff !important;}body.Bumblebee .maxi-light h1 {color : #323c47 !important;}}
@media screen and (max-width:480px) { body.Bumblebee .maxi-dark h1 {color : #ffffff !important;}body.Bumblebee .maxi-light h1 {color : #323c47 !important;}}
body.Bumblebee .maxi-dark h2 {color : #64c2ec !important;}
body.Bumblebee .maxi-light h2 {color : #323c47 !important;}
@media screen and (max-width:980px) { body.Bumblebee .maxi-dark h2 {color : #64c2ec !important;}body.Bumblebee .maxi-light h2 {color : #323c47 !important;}}
@media screen and (max-width:480px) { body.Bumblebee .maxi-dark h2 {color : #64c2ec !important;}body.Bumblebee .maxi-light h2 {color : #323c47 !important;}}
body.Bumblebee .maxi-dark h3 {color : #f74356 !important;}
body.Bumblebee .maxi-light h3 {color : #323c47 !important;}
@media screen and (max-width:980px) { body.Bumblebee .maxi-dark h3 {color : #f74356 !important;}body.Bumblebee .maxi-light h3 {color : #323c47 !important;}}
@media screen and (max-width:480px) { body.Bumblebee .maxi-dark h3 {color : #f74356 !important;}body.Bumblebee .maxi-light h3 {color : #323c47 !important;}}
body.Bumblebee .maxi-dark h4 {color : #ffffff !important;}
body.Bumblebee .maxi-light h4 {color : #323c47 !important;}
@media screen and (max-width:980px) { body.Bumblebee .maxi-dark h4 {color : #ffffff !important;}body.Bumblebee .maxi-light h4 {color : #323c47 !important;}}
@media screen and (max-width:480px) { body.Bumblebee .maxi-dark h4 {color : #ffffff !important;}body.Bumblebee .maxi-light h4 {color : #323c47 !important;}}
body.Bumblebee .maxi-dark h5 {color : #f74356 !important;}
body.Bumblebee .maxi-light h5 {color : #ffd012 !important;}
@media screen and (max-width:980px) { body.Bumblebee .maxi-dark h5 {color : #f74356 !important;}body.Bumblebee .maxi-light h5 {color : #ffd012 !important;}}
@media screen and (max-width:480px) { body.Bumblebee .maxi-dark h5 {color : #f74356 !important;}body.Bumblebee .maxi-light h5 {color : #ffd012 !important;}}
body.Bumblebee .maxi-dark h6 {color : #ffd012 !important;}
body.Bumblebee .maxi-light h6 {color : #ffd012 !important;}
@media screen and (max-width:980px) { body.Bumblebee .maxi-dark h6 {color : #ffd012 !important;}body.Bumblebee .maxi-light h6 {color : #ffd012 !important;}}
@media screen and (max-width:480px) { body.Bumblebee .maxi-dark h6 {color : #ffd012 !important;}body.Bumblebee .maxi-light h6 {color : #ffd012 !important;}}
body.Bumblebee .maxi-dark p {color : #a7a7a7 !important;}
body.Bumblebee .maxi-light p {color : #666666 !important;}
@media screen and (max-width:980px) { body.Bumblebee .maxi-dark p {color : #a7a7a7 !important;}body.Bumblebee .maxi-light p {color : #666666 !important;}}
@media screen and (max-width:480px) { body.Bumblebee .maxi-dark p {color : #a7a7a7 !important;}body.Bumblebee .maxi-light p {color : #666666 !important;}}
body.Bumblebee .maxi-dark li {color : #a7a7a7 !important;}
body.Bumblebee .maxi-light li {color : #666666 !important;}
@media screen and (max-width:980px) { body.Bumblebee .maxi-dark li {color : #a7a7a7 !important;}body.Bumblebee .maxi-light li {color : #666666 !important;}}
@media screen and (max-width:480px) { body.Bumblebee .maxi-dark li {color : #a7a7a7 !important;}body.Bumblebee .maxi-light li {color : #666666 !important;}}
body.Bumblebee .maxi-dark a { color : #ffd012 !important;}
body.Bumblebee .maxi-light a { color : #ffd012 !important;}
body.Bumblebee default a { color : #ffd012 !important;}
body.Bumblebee .maxi-dark a:hover { color : #ff9212 !important;}
body.Bumblebee .maxi-light a:hover { color : #ff9212 !important;}
body.Bumblebee .default a:hover { color : #ff9212 !important;}
body.Bumblebee .maxi-dark .highlight { color : #ffd012 !important;}
body.Bumblebee .maxi-dark .divider { border-color : #ffd012 !important;}
body.Bumblebee .maxi-light .highlight { color : #ffd012 !important;}
body.Bumblebee .default .highlight { color : #ffd012 !important;}
body.Bumblebee .maxi-light .divider { border-color : #ffd012 !important;}
body.Bumblebee .default .divider { border-color : #ffd012 !important;}';

global $wpdb;

$table_name = $wpdb->prefix . 'maxi_blocks_general';  // table name
$wpdb->replace($table_name, array(
    'id' => 'style_cards_defaul_theme_styles_default',
    'object' => $defaulThemeStylesDefault,
));

$wpdb->replace($table_name, array(
    'id' => 'style_cards_defaul_theme_styles_mint',
    'object' => $defaulThemeStylesMint,
));

$wpdb->replace($table_name, array(
    'id' => 'style_cards_defaul_theme_styles_elegance',
    'object' => $defaulThemeStylesElegance,
));



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