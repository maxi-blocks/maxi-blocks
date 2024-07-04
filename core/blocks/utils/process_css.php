<?php

require_once MAXI_PLUGIN_DIR_PATH . 'vendor/autoload.php';

use Padaliyajay\PHPAutoprefixer\Autoprefixer;
use MatthiasMullie\Minify;

function process_css($code)
{
    if(empty($code)) {
        return $code;
    }

    try {
        // Auto prefix the CSS code
        $autoprefixer = new Autoprefixer($code);
        $prefixed_css = $autoprefixer->compile();

        if (empty($prefixed_css)) {
            return null;
        }

        // Minify the CSS code
        $minifier = new Minify\CSS();
        $minifier->add($prefixed_css);
        $minified_css = $minifier->minify();

        return $minified_css;
    } catch (Exception $e) {
        error_log('Error processing CSS: ' . $e->getMessage());
        error_log('Problematic code: ' . $code);
        throw $e;
    }
}
