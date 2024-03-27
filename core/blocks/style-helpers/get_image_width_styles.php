<?php

/**
 * Generates image width styles object
 *
 * @param array   $obj         Block size properties
 * @param boolean $use_init_size Flag to determine if initial size should be used
 * @param number  $media_width Width of the media element
 *
 * @return array The image width styles
 */
function get_img_width_styles(array $obj, bool $use_init_size, int $media_width)
{
	$breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    $response = [];

    foreach ($breakpoints as $breakpoint) {
        $attr_key = get_attribute_key('img-width', false, false, $breakpoint);
        $value = $obj[$attr_key] ?? null;

        if ($value) {
            $response[$breakpoint] = [
                'width' => !$use_init_size ? "{$value}%" : "{$media_width}px",
            ];
        }
    }

    return ['img_width' => $response];
}
