<?php

require_once MAXI_PLUGIN_DIR_PATH . 'core/blocks/utils/convert_aspect_ratio_to_decimal.php';

function get_aspect_ratio($ratio, $custom_ratio) {
    if ($ratio === 'original') {
        return [];
    }

    $aspect_ratio = null;

    switch ($ratio) {
        case 'ar11':
            $aspect_ratio = '1 / 1';
            break;
        case 'ar23':
            $aspect_ratio = '2 / 3';
            break;
        case 'ar32':
            $aspect_ratio = '3 / 2';
            break;
        case 'ar43':
            $aspect_ratio = '4 / 3';
            break;
        case 'ar169':
            $aspect_ratio = '16 / 9';
            break;
		case 'custom':
			$aspect_ratio = strval(convert_aspect_ratio_to_decimal($custom_ratio));
        default:
            $aspect_ratio = '';
            break;
    }

    return [
        'ratio' => [
            'general' => [
                'aspect-ratio' => $aspect_ratio
            ]
        ]
    ];
}
