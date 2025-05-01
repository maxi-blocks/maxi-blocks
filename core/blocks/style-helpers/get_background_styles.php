<?php

function get_color_background_object(array $args)
{
    $is_hover = $args['is_hover'] ?? false;
    $prefix = $args['prefix'] ?? '';
    $block_style = $args['block_style'];
    $is_button = $args['is_button'] ?? false;
    $is_icon = $args['is_icon'] ?? false;
    $is_icon_inherit = $args['is_icon_inherit'] ?? false;
    $breakpoint = $args['breakpoint'] ?? 'general';
    $sc_values = $args['sc_values'] ?? [];
    $background_color_property = $args['background_color_property'] ?? 'background-color';
    $props = $args;

    $hover_status = $props[$prefix . 'background-status-hover'] ?? false;
    $is_active = $sc_values['hover-background-color-global'] ?? false;
    $affect_all = $sc_values['hover-background-color-all'] ?? false;
    $global_hover_status = $is_active && $affect_all;

    if ($is_hover && !is_null($hover_status) && !$hover_status && !$global_hover_status) {
        return [];
    }

    $response = [
        'label' => 'Background Color',
        $breakpoint => [],
    ];

    $palette_attributes = get_palette_attributes([
        'obj' => $props,
        'prefix' => $prefix . 'background-',
        'is_hover' => $is_hover,
        'breakpoint' => $breakpoint,
    ]);

    $palette_status = $palette_attributes['palette_status'];
    $palette_sc_status = $palette_attributes['palette_sc_status'];
    $palette_color = $palette_attributes['palette_color'];
    $palette_opacity = $palette_attributes['palette_opacity'];
    $color = $palette_attributes['color'];

    $bg_clip_path = get_last_breakpoint_attribute([
        'target' => $prefix . 'background-color-clip-path',
        'breakpoint' => $breakpoint,
        'attributes' => $props,
        'is_hover' => $is_hover,
    ]);

    $is_bg_color_clip_path_active = get_last_breakpoint_attribute([
        'target' => $prefix . 'background-color-clip-path-status',
        'breakpoint' => $breakpoint,
        'attributes' => $props,
        'is_hover' => $is_hover,
    ]);

    if (!$palette_status && !empty($color)) {
        $response[$breakpoint][$background_color_property] = $color;
    } elseif ($palette_status && ($palette_color || $palette_opacity)) {
        if ($is_button && (!$is_hover || $hover_status || $global_hover_status)) {
            $response[$breakpoint]['background'] = get_color_rgba_string(
                $palette_sc_status
                    ? [
                            'first_var' => 'color-' . $palette_color,
                            'opacity' => $palette_opacity,
                            'block_style' => $block_style,
                      ]
                    : [
                            'first_var' => 'button-background-color' . ($is_hover ? '-hover' : ''),
                            'second_var' => 'color-' . $palette_color,
                            'opacity' => $palette_opacity,
                            'block_style' => $block_style,
                      ]
            );
        } else {
            $response[$breakpoint][$background_color_property] = get_color_rgba_string([
                'first_var' => 'color-' . $palette_color,
                'opacity' => $palette_opacity,
                'block_style' => $block_style,
            ]);
        }
    }

    if ($is_icon_inherit) {
        $hasBackground =
            !empty($props['background-active-media']) &&
            $props['background-active-media'] !== 'none';

        if ($hasBackground) {
            $response[$breakpoint][$background_color_property] =
                !empty($props['background-active-media']) && $palette_status
                    ? get_color_rgba_string(
                        $palette_sc_status
                            ? [
                                    'first_var' => 'color-' . $palette_color,
                                    'opacity' => $palette_opacity,
                                    'block_style' => $block_style,
                              ]
                            : [
                                    'first_var' => 'button-background-color' . ($is_hover ? '-hover' : ''),
                                    'second_var' => 'color-' . $palette_color,
                                    'opacity' => $palette_opacity,
                                    'block_style' => $block_style,
                              ]
                    )
                    : $color;
        } else {
            $response[$breakpoint][$background_color_property] = '';
        }
    }

    if (!$is_icon_inherit && $is_icon) {
        $response[$breakpoint]['background'] = $palette_status
            ? get_color_rgba_string([
                    'first_var' => 'color-' . $palette_color,
                    'opacity' => $palette_opacity,
                    'block_style' => $block_style,
              ])
            : $color;
    } elseif ($is_icon) {
        $hasBackground =
            !empty($props['background-active-media']) &&
            $props['background-active-media'] !== 'none';

        $palette_attributes = get_palette_attributes([
            'obj' => $props,
            'prefix' => 'button-background-',
            'is_hover' => $is_hover,
            'breakpoint' => $breakpoint,
        ]);

        $palette_color = $palette_attributes['palette_color'];
        $palette_opacity = $palette_attributes['palette_opacity'];
        $color = $palette_attributes['color'];

        if ($hasBackground) {
            $response[$breakpoint]['background'] = $palette_status
                ? get_color_rgba_string([
                        'first_var' => 'color-' . $palette_color,
                        'opacity' => $palette_opacity,
                        'block_style' => $block_style,
                  ])
                : $color;
        } else {
            $response[$breakpoint]['background'] = '';
        }
    }

    if ($is_bg_color_clip_path_active) {
        $response[$breakpoint]['clip-path'] = empty($bg_clip_path)
            ? 'none'
            : $bg_clip_path;
    }

    return $response;
}


function get_gradient_background_object(array $options)
{
    $is_hover = $options['is_hover'] ?? false;
    $prefix = $options['prefix'] ?? '';
    $breakpoint = $options['breakpoint'] ?? 'general';
    $is_icon = $options['is_icon'] ?? false;
    $block_style = $options['block_style'] ?? null;
    $is_button = $options['is_button'] ?? null;
    $is_icon_inherit = $options['is_icon_inherit'] ?? null;
    $sc_values = $options['sc_values'] ?? null;
    $props = $options;

    $response = [
        'label' => 'Background gradient',
        $breakpoint => [],
    ];

    $bg_gradient_opacity = get_last_breakpoint_attribute([
        'target' => $prefix . 'background-gradient-opacity',
        'breakpoint' => $breakpoint,
        'attributes' => $props,
        'is_hover' => $is_hover,
    ]);

    $bg_gradient = get_last_breakpoint_attribute([
        'target' => $prefix . 'background-gradient',
        'breakpoint' => $breakpoint,
        'attributes' => $props,
        'is_hover' => $is_hover,
    ]);

    $bg_gradient_clip_path = get_last_breakpoint_attribute([
        'target' => $prefix . 'background-gradient-clip-path',
        'breakpoint' => $breakpoint,
        'attributes' => $props,
        'is_hover' => $is_hover,
    ]);

    $is_bg_gradient_clip_path_active = get_last_breakpoint_attribute([
        'target' => $prefix . 'background-gradient-clip-path-status',
        'breakpoint' => $breakpoint,
        'attributes' => $props,
        'is_hover' => $is_hover,
    ]);

    if (
        ($is_icon &&
            get_last_breakpoint_attribute([
                'target' => $prefix . 'background-active-media',
                'breakpoint' => $breakpoint,
                'attributes' => $props,
                'is_hover' => $is_hover,
            ]) === 'gradient') ||
        !$is_icon
    ) {
        if (
            is_numeric($bg_gradient_opacity) &&
            !empty($bg_gradient) &&
            $bg_gradient !== 'undefined'
        ) {
            $response[$breakpoint]['background'] = $bg_gradient;

            if ($bg_gradient_opacity < 1) {
                $color_regex =
                    '/rgba?\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})(?:,\s*(\d(?:\.\d+)?))?\)/';

                preg_match_all($color_regex, $bg_gradient, $matches);
                if (!empty($matches[0])) {
                    foreach ($matches[0] as $match) {
                        $color_opacity = 1;

                        $is_rgba = strpos($match, 'rgba') !== false;
                        if ($is_rgba) {
                            $color_opacity = (float)explode(',', $match)[3];
                            $color_opacity = str_replace(')', '', $color_opacity);
                        }

                        $new_match = preg_replace_callback(
                            $color_regex,
                            function ($m) use ($color_opacity, $bg_gradient_opacity) {
                                return "rgba({$m[1]},{$m[2]},{$m[3]},"
                                    . round($color_opacity * $bg_gradient_opacity, 2)
                                    . ')';
                            },
                            $match
                        );

                        $response[$breakpoint]['background'] = str_replace($match, $new_match, $response[$breakpoint]['background']);
                    }
                }
            }
        } elseif (!$is_icon) {
            $color_background = get_color_background_object(array_merge(
                get_group_attributes(
                    $props,
                    ['background', 'backgroundColor'],
                    $is_hover,
                    $prefix
                ),
                [
                    'block_style' => $block_style,
                    'is_button' => $is_button,
                    'breakpoint' => $breakpoint,
                    'is_hover' => $is_hover,
                    'prefix' => $prefix,
                    'is_iconInherit' => $is_icon_inherit,
                    'sc_values' => $sc_values,
                ]
            ));

            $background =
                $color_background[$breakpoint]['background'] ??
                $color_background[$breakpoint]['background-color'];

            if ($background) {
                $response[$breakpoint]['background'] = $background;
            }
        }

        if ($is_bg_gradient_clip_path_active) {
            $response[$breakpoint]['clip-path'] = !empty($bg_gradient_clip_path)
                ? $bg_gradient_clip_path
                : 'none';
        }
    }

    return $response;
}


function get_image_background_object($args)
{
    $is_hover = $args['is_hover'] ?? false;
    $prefix = $args['prefix'] ?? '';
    $breakpoint = $args['breakpoint'];
    $is_parallax = $args['isParallax'] ?? false;
    $ignore_media_attributes = $args['ignore_media_attributes'] ?? false;
    $props = $args;

    $response = [
        'label' => 'Background Image',
        $breakpoint => [],
    ];

    $bg_image_url = get_attribute_value(
        'background-image-mediaURL',
        $props,
        $prefix
    );

    if (empty($bg_image_url) && !$ignore_media_attributes) {
        return [];
    }

    $get_bg_image_attribute_value = function ($target, $is_hover_param = null) use ($prefix, $breakpoint, $props, $is_hover) {
        return get_attributes_value([
            'target' => $target,
            'is_hover' => $is_hover_param ?? $is_hover,
            'prefix' => $prefix,
            'breakpoint' => $breakpoint,
            'props' => $props,
        ]);
    };

    $get_bg_image_last_breakpoint_attribute = function ($target) use ($prefix, $breakpoint, $props, $is_hover) {
        return get_last_breakpoint_attribute([
            'target' => $prefix . $target,
            'breakpoint' => $breakpoint,
            'attributes' => $props,
            'is_hover' => $is_hover,
        ]);
    };

    $bg_image_size = get_last_breakpoint_attribute([
        'target' => $prefix . 'background-image-size',
        'breakpoint' => $breakpoint,
        'attributes' => $props,
        'is_hover' => $is_hover,
    ]);

    $bg_image_crop_options = $get_bg_image_attribute_value('background-image-crop-options');
    $bg_image_repeat = $get_bg_image_attribute_value('background-image-repeat');
    $bg_image_position = get_last_breakpoint_attribute([
        'target' => $prefix . 'background-image-position',
        'breakpoint' => $breakpoint,
        'attributes' => $props,
        'is_hover' => $is_hover,
    ]);
    $bg_image_origin = $get_bg_image_attribute_value('background-image-origin');
    $bg_image_clip = $get_bg_image_attribute_value('background-image-clip');
    $bg_image_attachment = $get_bg_image_attribute_value('background-image-attachment');
    $bg_image_opacity = $get_bg_image_attribute_value('background-image-opacity');
    $bg_image_clip_path = get_last_breakpoint_attribute([
        'target' => $prefix . 'background-image-clip-path',
        'breakpoint' => $breakpoint,
        'attributes' => $props,
        'is_hover' => $is_hover,
    ]);
    $is_bg_image_clip_path_active = get_last_breakpoint_attribute([
        'target' => $prefix . 'background-image-clip-path-status',
        'breakpoint' => $breakpoint,
        'attributes' => $props,
        'is_hover' => $is_hover,
    ]);



    if (!$is_parallax) {
        // Image
        if ($breakpoint === 'general') {
            if ($bg_image_size === 'custom' &&
                isset($bg_image_crop_options)) {
                $response[$breakpoint]['background-image'] = "url('{$bg_image_crop_options['image']['source_url']}')";
            } elseif (($bg_image_size === 'custom' &&
                !isset($bg_image_crop_options)) ||
                ($bg_image_size !== 'custom' &&
                    isset($bg_image_url))) {
                $response[$breakpoint]['background-image'] = "url('{$bg_image_url}')";
            }
        }

        // Size
        if ($bg_image_size !== 'custom') {
            if (isset($response[$breakpoint]['background-size'])) {
                $response[$breakpoint]['background-size'] .= ",{$bg_image_size}";
            } else {
                $response[$breakpoint]['background-size'] = $bg_image_size;
            }
        } elseif (isset($response[$breakpoint]['background-size'])) {
            $response[$breakpoint]['background-size'] .= ',cover';
        } else {
            $response[$breakpoint]['background-size'] = 'cover';
        }

        // Repeat
        if (isset($bg_image_repeat)) {
            $response[$breakpoint]['background-repeat'] = $bg_image_repeat;
        }

        // Position
        if ($bg_image_position !== 'custom') {
            $response[$breakpoint]['background-position'] = $bg_image_position;
        } else {
            $bg_image_position_width = $get_bg_image_last_breakpoint_attribute(
                'background-image-position-width'
            );
            $bg_image_position_width_unit = $get_bg_image_last_breakpoint_attribute(
                'background-image-position-width-unit'
            );
            $bg_image_position_height = $get_bg_image_last_breakpoint_attribute(
                'background-image-position-height'
            );
            $bg_image_position_height_unit = $get_bg_image_last_breakpoint_attribute(
                'background-image-position-height-unit'
            );
            $response[$breakpoint]['background-position'] = "{$bg_image_position_width}{$bg_image_position_width_unit} {$bg_image_position_height}{$bg_image_position_height_unit}";
        }

        // Origin
        if (isset($bg_image_origin)) {
            $response[$breakpoint]['background-origin'] = $bg_image_origin;
        }

        // Clip
        if (isset($bg_image_clip)) {
            $response[$breakpoint]['background-clip'] = $bg_image_clip;
        }

        // Attachment
        if (isset($bg_image_attachment)) {
            if (isset($response[$breakpoint]['background-attachment'])) {
                $response[$breakpoint]['background-attachment'] .= ",{$bg_image_attachment}";
            } else {
                $response[$breakpoint]['background-attachment'] = $bg_image_attachment;
            }
        }
    } else {
        if ($bg_image_size !== 'custom') {
            $response[$breakpoint]['object-fit'] = $bg_image_size;
        } else {
            $response[$breakpoint]['object-fit'] = 'cover';
        }

        // Position
        if ($bg_image_position !== 'custom') {
            $response[$breakpoint]['object-position'] = $bg_image_position;
        } else {
            $bg_image_position_width = $get_bg_image_last_breakpoint_attribute(
                'background-image-position-width'
            );
            $bg_image_position_width_unit = $get_bg_image_last_breakpoint_attribute(
                'background-image-position-width-unit'
            );
            $bg_image_position_height = $get_bg_image_last_breakpoint_attribute(
                'background-image-position-height'
            );
            $bg_image_position_height_unit = $get_bg_image_last_breakpoint_attribute(
                'background-image-position-height-unit'
            );
            $response[$breakpoint]['object-position'] = "{$bg_image_position_width}{$bg_image_position_width_unit} {$bg_image_position_height}{$bg_image_position_height_unit}";
        }
    }

    // Opacity
    if (is_int($bg_image_opacity)) {
        $response[$breakpoint]['opacity'] = $bg_image_opacity;

        // To avoid image blinking on opacity hover
        if (!$is_hover) {
            $bg_image_opacity = $get_bg_image_attribute_value(
                'background-image-opacity',
                true
            );

            if (isset($bg_image_opacity)) {
                $response[$breakpoint]['-webkit-transform'] = 'translate3d(0,0,0)';
            }
        }
    }

    // Clip-path
    if ($is_bg_image_clip_path_active) {
        $response[$breakpoint]['clip-path'] = empty($bg_image_clip_path)
            ? 'none'
            : $bg_image_clip_path;
    }

    return $response;
}

function get_video_background_object($options)
{
    $is_hover = $options['is_hover'] ?? false;
    $prefix = $options['prefix'] ?? '';
    $breakpoint = $options['breakpoint'] ?? '';
    $props = $options;

    $response = [
        'label' => 'Video Background',
        $breakpoint => [],
    ];

    $bg_video_opacity = get_last_breakpoint_attribute([
        'target' => $prefix . 'background-video-opacity',
        'breakpoint' => $breakpoint,
        'attributes' => $props,
        'is_hover' => $is_hover,
    ]);
    $bg_video_clip_path = get_last_breakpoint_attribute([
        'target' => $prefix . 'background-video-clip-path',
        'breakpoint' => $breakpoint,
        'attributes' => $props,
        'is_hover' => $is_hover,
    ]);
    $bg_video_fallback_url = get_last_breakpoint_attribute([
        'target' => $prefix . 'background-video-fallbackURL',
        'breakpoint' => $breakpoint,
        'attributes' => $props,
        'is_hover' => $is_hover,
    ]);

    // Opacity
    if (is_numeric($bg_video_opacity)) {
        $response[$breakpoint]['opacity'] = $bg_video_opacity;
    }

    // Clip-path
    if (!is_null($bg_video_clip_path)) {
        $response[$breakpoint]['clip-path'] = empty($bg_video_clip_path)
            ? 'none'
            : $bg_video_clip_path;
    }

    // Fallback URL
    if (!empty($bg_video_fallback_url)) {
        $response[$breakpoint]['background'] = 'url(' . $bg_video_fallback_url . ')';
        $response[$breakpoint]['background-size'] = 'cover';
    }

    return $response;
}

function get_wrapper_object($args)
{
    $breakpoint = $args['breakpoint'];
    $is_hover = $args['is_hover'] ?? false;
    $prefix = $args['prefix'] ?? '';
    $setSameWidthAndHeight = $args['setSameWidthAndHeight'] ?? false;

    $response = [
        'label' => 'Background layer wrapper',
        $breakpoint => [],
    ];

    $sizes = ['width', 'height'];

    foreach ($sizes as $size) {
        $bgSize = get_last_breakpoint_attribute([
            'target' => $prefix . $size,
            'breakpoint' => $breakpoint,
            'attributes' => $args,
            'is_hover' => $is_hover,
        ]);

        if (is_numeric($bgSize)) {
            $bgSVGSizeUnit = get_last_breakpoint_attribute([
                'target' => $prefix . $size . '-unit',
                'breakpoint' => $breakpoint,
                'attributes' => $args,
                'is_hover' => $is_hover,
            ]);

            if (!($setSameWidthAndHeight && $size === 'height')) {
                $response[$breakpoint][$size] = $bgSize . $bgSVGSizeUnit;
            }
        }
    }

    $keyWords = ['top', 'right', 'bottom', 'left'];

    foreach ($keyWords as $keyWord) {
        $positionValue = get_last_breakpoint_attribute([
            'target' => $prefix . 'position-' . $keyWord,
            'breakpoint' => $breakpoint,
            'attributes' => $args,
            'is_hover' => $is_hover,
        ]);

        $positionUnit = get_last_breakpoint_attribute([
            'target' => $prefix . 'position-' . $keyWord . '-unit',
            'breakpoint' => $breakpoint,
            'attributes' => $args,
            'is_hover' => $is_hover,
        ]);

        if (!is_null($positionValue) && !is_null($positionUnit)) {
            $response[$breakpoint][$keyWord] =
                $positionValue === 'auto' ? 'auto' : $positionValue . $positionUnit;
        }
    }

    return !empty($response[$breakpoint]) ? $response : [];
}


function get_svg_background_object($options)
{
    $block_style = $options['block_style'];
    $breakpoint = $options['breakpoint'];
    $is_hover = $options['is_hover'];
    $props = $options;

    $response = [
        'label' => 'Icon background',
        $breakpoint => [],
    ];

    $palette_attributes = get_palette_attributes([
        'obj' => $props,
        'prefix' => 'background-svg-',
        'is_hover' => $is_hover,
        'breakpoint' => $breakpoint,
    ]);

    $palette_status = $palette_attributes['palette_status'];
    $palette_color = $palette_attributes['palette_color'];
    $palette_opacity = $palette_attributes['palette_opacity'];
    $color = $palette_attributes['color'];

    if ($palette_status) {
        $response[$breakpoint]['fill'] = get_color_rgba_string([
            'first_var' => 'color-' . $palette_color,
            'opacity' => $palette_opacity,
            'block_style' => $block_style,
        ]);
    } else {
        $response[$breakpoint]['fill'] = $color;
    }

    return $response;
}

function get_background_layers($args)
{
    $response = $args['response'];
    $layers = $args['layers'];
    $target = $args['target'];
    $is_hover = $args['is_hover'] ?? false;
    $block_style = $args['block_style'];
    $prefix = $args['prefix'] ?? '';
    $breakpoint = $args['breakpoint'];
    $ignore_media_attributes = $args['ignore_media_attributes'] ?? false;

    foreach ($layers as $layer) {
        $type = $layer['type'];

        $layerTarget = $target . ' > .maxi-background-displayer .maxi-background-displayer__' . $layer['order'];

        switch ($type) {
            case 'color':
                $response[$layerTarget][$type] = array_replace_recursive(
                    isset($response[$layerTarget][$type]) ? $response[$layerTarget][$type] : [],
                    get_wrapper_object(
                        array_merge(
                            get_group_attributes($layer, 'backgroundColor', $is_hover),
                            [
                                'breakpoint' => $breakpoint,
                                'is_hover' => $is_hover,
                                'prefix' => 'background-color-wrapper-',
                                'block_style' => $block_style
                            ]
                        )
                    ),
                    get_color_background_object(
                        array_merge(
                            get_group_attributes($layer, 'backgroundColor', $is_hover),
                            [
                                'breakpoint' => $breakpoint,
                                'is_hover' => $is_hover,
                                'prefix' => $prefix,
                                'block_style' => $block_style
                            ]
                        )
                    ),
                    get_display_styles(
                        get_group_attributes($layer, 'display', $is_hover),
                        $is_hover
                    )
                );
                break;
            case 'gradient':
                $response[$layerTarget][$type] = array_replace_recursive(
                    isset($response[$layerTarget][$type]) ? $response[$layerTarget][$type] : [],
                    get_gradient_background_object(
                        array_merge(
                            get_group_attributes($layer, 'backgroundGradient', $is_hover),
                            [
                                'breakpoint' => $breakpoint,
                                'is_hover' => $is_hover,
                                'prefix' => $prefix,
                                'block_style' => $block_style
                            ]
                        )
                    ),
                    get_wrapper_object(
                        array_merge(
                            get_group_attributes($layer, 'backgroundGradient', $is_hover),
                            [
                                'breakpoint' => $breakpoint,
                                'is_hover' => $is_hover,
                                'prefix' => 'background-gradient-wrapper-',
                                'block_style' => $block_style
                            ]
                        )
                    ),
                    get_display_styles(
                        get_group_attributes($layer, 'display', $is_hover),
                        $is_hover
                    )
                );
                break;
            case 'image':
                $parallaxStatus = get_attribute_value(
                    'background-image-parallax-status',
                    $layer,
                    $prefix
                );

                if (!$parallaxStatus) {
                    $response[$layerTarget][$type] = array_replace_recursive(
                        isset($response[$layerTarget][$type]) ? $response[$layerTarget][$type] : [],
                        get_image_background_object(array_merge(
                            get_group_attributes($layer, 'backgroundImage', $is_hover),
                            [
                                'breakpoint' => $breakpoint,
                                'is_hover' => $is_hover,
                                'prefix' => $prefix,
                                'block_style' => $block_style
                            ]
                        )),
                        get_wrapper_object(array_merge(
                            get_group_attributes($layer, 'backgroundImage', $is_hover),
                            [
                                'breakpoint' => $breakpoint,
                                'is_hover' => $is_hover,
                                'prefix' => 'background-image-wrapper-',
                                'block_style' => $block_style
                            ]
                        )),
                        get_display_styles(
                            get_group_attributes($layer, 'display', $is_hover),
                            $is_hover
                        )
                    );
                } else {
                    $response[$layerTarget][$type] = array_replace_recursive(
                        isset($response[$layerTarget][$type]) ? $response[$layerTarget][$type] : [],
                        get_display_styles(
                            get_group_attributes($layer, 'display', $is_hover),
                            $is_hover
                        )
                    );
                    $response[$layerTarget . ' img'][$type] = array_replace_recursive(
                        isset($response[$layerTarget . ' img'][$type]) ? $response[$layerTarget . ' img'][$type] : [],
                        get_image_background_object(array_merge(
                            get_group_attributes($layer, 'backgroundImage', $is_hover),
                            [
                                'breakpoint' => $breakpoint,
                                'is_hover' => $is_hover,
                                'prefix' => $prefix,
                                'block_style' => $block_style
                            ]
                        )),
                        get_display_styles(
                            get_group_attributes($layer, 'display', $is_hover),
                            $is_hover
                        )
                    );
                }
                break;
            case 'video':
                $response[$layerTarget][$type] = array_replace_recursive(
                    isset($response[$layerTarget][$type]) ? $response[$layerTarget][$type] : [],
                    get_video_background_object(array_merge(
                        get_group_attributes($layer, 'backgroundVideo', $is_hover),
                        [
                            'breakpoint' => $breakpoint,
                            'is_hover' => $is_hover,
                            'prefix' => $prefix
                        ]
                    )),
                    get_wrapper_object(array_merge(
                        get_group_attributes($layer, 'backgroundVideo', $is_hover),
                        [
                            'breakpoint' => $breakpoint,
                            'is_hover' => $is_hover,
                            'prefix' => 'background-video-wrapper-',
                            'block_style' => $block_style
                        ]
                    )),
                    get_display_styles(
                        get_group_attributes($layer, 'display', $is_hover),
                        $is_hover
                    )
                );
                break;
            case 'shape':
                $response[$layerTarget][$type] = array_replace_recursive(
                    isset($response[$layerTarget][$type]) ? $response[$layerTarget][$type] : [],
                    get_wrapper_object(
                        array_merge(
                            get_group_attributes($layer, 'backgroundSVG', $is_hover),
                            [
                                'breakpoint' => $breakpoint,
                                'is_hover' => $is_hover,
                                'prefix' => 'background-svg-',
                                'isSameWidthAndHeight' => true
                            ]
                        )
                    ),
                    get_display_styles(
                        get_group_attributes($layer, 'display', $is_hover),
                        $is_hover
                    )
                );
                $response[$layerTarget . ' svg *'][$type] = array_replace_recursive(
                    isset($response[$layerTarget . ' svg *'][$type]) ? $response[$layerTarget . ' svg *'][$type] : [],
                    get_svg_background_object(array_merge(
                        get_group_attributes($layer, 'backgroundSVG', $is_hover),
                        [
                            'block_style' => $block_style,
                            'breakpoint' => $breakpoint,
                            'is_hover' => $is_hover
                        ]
                    ))
                );
                if ($breakpoint === 'general') {
                    $response[$layerTarget . ' > svg:first-child'][$type] = array_replace_recursive(
                        isset($response[$layerTarget . ' > svg:first-child'][$type]) ? $response[$layerTarget . ' > svg:first-child'][$type] : [],
                        get_image_shape_styles(
                            get_group_attributes($layer, 'imageShape', $is_hover, 'background-svg-'),
                            'svg',
                            'background-svg-',
                            false,
                            $is_hover
                        )
                    );
                    $response[$layerTarget . ' > svg:first-child pattern image'][$type] = array_replace_recursive(
                        isset($response[$layerTarget . ' > svg:first-child pattern image'][$type]) ? $response[$layerTarget . ' > svg:first-child pattern image'][$type] : [],
                        get_image_shape_styles(
                            get_group_attributes($layer, 'imageShape', false, 'background-svg-'),
                            'image',
                            'background-svg-'
                        )
                    );
                }
                break;
            default:
                break;
        }
    }



    return $response;
}

function get_general_background_styles(
    $props,
    $border_props,
    $block_style,
    $is_hover
) {
    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
    $size = [];

    $get_border_value = function ($target, $breakpoint, $force_is_hover = null) use ($border_props, $is_hover, $props) {
        $lastValue = get_last_breakpoint_attribute(
            [
                'target' => "border-$target-width",
                'breakpoint' => $breakpoint,
                'attributes' => $props,
                'avoidXXL' => !$is_hover,
                'is_hover' => $force_is_hover !== null ? $force_is_hover : $is_hover
            ]
        );

        return is_numeric($lastValue) ? $lastValue : 2;
    };

    $border = get_border_styles([
        'obj' => $border_props,
        'block_style' => $block_style,
        'is_hover' => $is_hover
    ]);

    if (!empty($props)) {
        foreach ($breakpoints as $breakpoint) {
            $width_top = null;
            $width_bottom = null;
            $width_left = null;
            $width_right = null;

            if (
                array_key_exists("border-style-$breakpoint", $props) &&
                $props["border-style-$breakpoint"] !== 'none' &&
                (($props['border-style-general'] &&
                    $props['border-style-general'] !== 'none') ||
                    $props["border-style-$breakpoint"])
            ) {
                $width_top = $get_border_value('top', $breakpoint);
                $width_bottom = $get_border_value('bottom', $breakpoint);
                $width_left = $get_border_value('left', $breakpoint);
                $width_right = $get_border_value('right', $breakpoint);
            }

            $widthUnit = get_last_breakpoint_attribute([
                'target' => 'border-unit-width',
                'breakpoint' => $breakpoint,
                'attributes' => $props
            ]) ?? 'px';

            if (
                isset($border[$breakpoint]['border-style']) ||
                is_numeric($width_top) ||
                is_numeric($width_bottom) ||
                is_numeric($width_left) ||
                is_numeric($width_right)
            ) {
                $get_size = function ($width, $target) use ($breakpoint, $widthUnit, $is_hover, $get_border_value) {
                    if (!is_numeric($width)) {
                        return null;
                    }

                    if ($is_hover) {
                        $isSameThanNormal =
                            $get_border_value($target, $breakpoint, false) === $width;

                        if ($isSameThanNormal) {
                            return null;
                        }
                    }

                    return [$target =>  strval(-round($width, 2)) . $widthUnit];
                };

                $size[$breakpoint] = array_merge(
                    $get_size($width_top, 'top'),
                    $get_size($width_bottom, 'bottom'),
                    $get_size($width_left, 'left'),
                    $get_size($width_right, 'right')
                );
            }
        }
    }

    foreach ($breakpoints as $breakpoint) {
        if (isset($border[$breakpoint]['border-top-width'])) {
            $border[$breakpoint]['border-top-style'] =
                $border[$breakpoint]['border-style'];
        }

        if (isset($border[$breakpoint]['border-right-width'])) {
            $border[$breakpoint]['border-right-style'] =
                $border[$breakpoint]['border-style'];
        }

        if (isset($border[$breakpoint]['border-bottom-width'])) {
            $border[$breakpoint]['border-bottom-style'] =
                $border[$breakpoint]['border-style'];
        }

        if (isset($border[$breakpoint]['border-left-width'])) {
            $border[$breakpoint]['border-left-style'] =
                $border[$breakpoint]['border-style'];
        }
    }

    unset($border['general']['border-style']);

    if (!empty($size)) {
        foreach (array_reverse($breakpoints) as $index => $breakpoint) {
            if ($index - 1 < 0) {
                continue;
            }

            if (
                isset($size[$breakpoints[$index - 1]]['top']) &&
                isset($size[$breakpoint]['top']) &&
                $size[$breakpoints[$index - 1]]['top'] === $size[$breakpoint]['top']
            ) {
                unset($size[$breakpoint]['top']);
            }

            if (
                isset($size[$breakpoints[$index - 1]]['left']) &&
                isset($size[$breakpoint]['left']) &&
                $size[$breakpoints[$index - 1]]['left'] === $size[$breakpoint]['left']
            ) {
                unset($size[$breakpoint]['left']);
            }

            if (
                isset($size[$breakpoints[$index - 1]]['bottom']) &&
                isset($size[$breakpoint]['bottom']) &&
                $size[$breakpoints[$index - 1]]['bottom'] === $size[$breakpoint]['bottom']
            ) {
                unset($size[$breakpoint]['bottom']);
            }

            if (
                isset($size[$breakpoints[$index - 1]]['right']) &&
                isset($size[$breakpoint]['right']) &&
                $size[$breakpoints[$index - 1]]['right'] === $size[$breakpoint]['right']
            ) {
                unset($size[$breakpoint]['right']);
            }

            if (empty($size[$breakpoints[$index - 1]])) {
                unset($size[$breakpoints[$index - 1]]);
            }
            if (empty($size[$breakpoint])) {
                unset($size[$breakpoint]);
            }
        }
    }

    return array_merge(['border' => $border], (!empty($size) ? ['size' => $size] : []));
}

function get_basic_response_object($args)
{
    $target = $args['target'] ?? '';
    $is_hover = $args['is_hover'] ?? false;
    $prefix = $args['prefix'] = '';
    $block_style = $args['block_style'];
    $row_border_radius = $args['row_border_radius'] ?? [];

    $include_border =
        !$is_hover || ($is_hover && $args[$prefix . 'border-status-hover']);

    $border_obj = $include_border
        ? get_general_background_styles(
            $args,
            get_group_attributes($args, ['border', 'borderRadius', 'borderWidth'], $is_hover),
            $block_style,
            $is_hover
        )
        : null;

    $row_border_radius_obj = get_general_background_styles(
        $row_border_radius,
        $row_border_radius,
        $block_style,
        $is_hover
    );

    $merged_border_obj = !is_null($border_obj) ? array_merge($row_border_radius_obj, $border_obj) : $row_border_radius_obj;

    return [
        $target . ' > .maxi-background-displayer' => $include_border && !empty($border_obj['border']['general'])
            ? $merged_border_obj
            : $row_border_radius_obj,
    ];
}

function get_block_background_styles($args)
{
    $is_hover = $args['is_hover'] ?? false;
    $target = ($args['target'] ?? '') . ($is_hover ? ':hover' : '');
    $prefix = $args['prefix'] ?? '';
    $block_style = $args['block_style'];
    $ignore_media_attributes = $args['ignore_media_attributes'] ?? false;

    $response = get_basic_response_object($args);

    if ($is_hover && !$args[$prefix . 'block-background-status-hover']) {
        return $response;
    }

    $layers = get_attributes_value([
            'target' => 'background-layers',
            'props' => $args,
            'prefix' => $prefix,
        ]);

    if ($is_hover) {
        $layers = [
            ...$layers,
            ...get_attributes_value([
                'target' => 'background-layers',
                'props' => $args,
                'prefix' => $prefix,
                'is_hover' => $is_hover,
            ]),
        ];
    }

    if ($layers) {
        $layers = array_filter($layers, function ($layer) {
            return isset($layer);
        });
    }

    if ($layers && count($layers) > 0) {
        $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

        foreach ($breakpoints as $breakpoint) {
            $response =  get_background_layers([
                    'response' => $response,
                    'layers' => $layers,
                    'target' => $target,
                    'is_hover' => $is_hover,
                    'block_style' => $block_style,
                    'prefix' => $prefix,
                    'breakpoint' => $breakpoint,
                    'ignore_media_attributes' => $ignore_media_attributes,
            ]);

        }

    }

    return $response;
}




function get_background_styles($args)
{
    $is_hover = $args['is_hover'] ?? false;
    $prefix = $args['prefix'] ?? '';
    $is_button = $args['is_button'] ?? false;
    $block_style = $args['block_style'];
    $is_icon_inherit = $args['is_icon_inherit'] ?? false;
    $sc_values  = $args['sc_values'] ?? [];
    $background_color_property = $args['background_color_property'] ?? 'background-color';
    $props = $args;

    $response = [];

    $response['background'] = [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $current_active_media = get_last_breakpoint_attribute(array(
            'target' => "{$prefix}background-active-media",
            'breakpoint' => $breakpoint,
            'attributes' => $props,
            'is_hover' => $is_hover,
        ));

        if (!$current_active_media) {
            continue;
        }

        if ($current_active_media === 'color') {

            $response['background'] = array_merge($response['background'], get_color_background_object(
                array_merge(
                    get_group_attributes(
                        $props,
                        array('background', 'backgroundColor'),
                        $is_hover,
                        $prefix
                    ),
                    [
                        'block_style' => $block_style,
                        'is_button' => $is_button,
                        'breakpoint' => $breakpoint,
                        'is_hover' => $is_hover,
                        'prefix' => $prefix,
                        'is_icon_inherit' => $is_icon_inherit,
                        'sc_values' => $sc_values,
                        'background_color_property' => $background_color_property,
                    ]
                )
            ));
        }
        if ($current_active_media === 'gradient') {
            $response['background'] = array_merge($response['background'], get_gradient_background_object(
                array(
                    ...get_group_attributes(
                        $props,
                        array('background', 'backgroundGradient'),
                        $is_hover,
                        $prefix
                    ),
                    'block_style' => $block_style,
                    'is_button' => $is_button,
                    'breakpoint' => $breakpoint,
                    'is_hover' => $is_hover,
                    'prefix' => $prefix,
                    'is_icon_inherit' => $is_icon_inherit,
                    'sc_values' => $sc_values,
                )
            ));
        }
    }

    return $response;
}
