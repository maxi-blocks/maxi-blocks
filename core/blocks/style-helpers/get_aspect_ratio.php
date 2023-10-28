<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/convert_aspect_ratio_to_decimal.php';

function get_aspect_ratio($ratio, $custom_ratio) {
    if ($ratio === 'original') {
        return null;
    }

    $aspectRatio = null;

    switch ($ratio) {
        case 'ar11':
            $aspectRatio = '1 / 1';
            break;
        case 'ar23':
            $aspectRatio = '2 / 3';
            break;
        case 'ar32':
            $aspectRatio = '3 / 2';
            break;
        case 'ar43':
            $aspectRatio = '4 / 3';
            break;
        case 'ar169':
            $aspectRatio = '16 / 9';
            break;
		case 'custom':
			$aspect_ratio = strval(convert_aspect_ratio_to_decimal($custom_ratio));
        default:
            $aspectRatio = '';
            break;
    }

    return [
        'ratio' => [
            'general' => [
                'aspect-ratio' => $aspectRatio
            ]
        ]
    ];
}
