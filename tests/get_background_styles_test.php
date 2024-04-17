<?php

use Spatie\Snapshots\MatchesSnapshots;

class Get_Background_Styles_Test extends WP_UnitTestCase
{
    use MatchesSnapshots;

    public function get_block_background_normal_and_hover_styles($attributes)
    {
        $target = 'maxi-test';
        $normal = get_block_background_styles([
            'target' => $target,
            'is_hover' => false,
            ...$attributes,
        ]);
        $hover = get_block_background_styles([
            'target' => $target,
            'is_hover' => true,
            ...$attributes,
        ]);

        return array_merge($normal, $hover);
    }

    public function get_general_size_and_position_attributes($args)
    {
        $type = $args['type'];
        $is_hover = $args['is_hover'] ?? false;
        $is_responsive = $args['is_responsive'] ?? false;

        $type_string = $type . ($type === 'svg' ? '' : '-wrapper');
        $general_attributes = [
            "background-{$type_string}-position-bottom-general" => '10',
            "background-{$type_string}-position-bottom-unit-general" => 'px',
            "background-{$type_string}-position-general" => 'inherit',
            "background-{$type_string}-position-left-general" => '10',
            "background-{$type_string}-position-left-unit-general" => 'px',
            "background-{$type_string}-position-right-general" => '10',
            "background-{$type_string}-position-right-unit-general" => 'px',
            "background-{$type_string}-position-sync-general" => 'all',
            "background-{$type_string}-position-top-general" => '10',
            "background-{$type_string}-position-top-unit-general" => 'px',
            "background-{$type_string}-width-general" => 100,
            "background-{$type_string}-width-unit-general" => '%',
            "background-{$type_string}-height-general" => 100,
            "background-{$type_string}-height-unit-general" => '%',
        ];

        if (!$is_responsive) {
            return $general_attributes;
        }

        $response = [];
        $units = ['px', '%', 'em', 'vw', 'vh'];
        foreach ($general_attributes as $rawKey => $rawValue) {
            foreach ($is_hover ? ['', '-hover'] : [''] as $suffixIndex => $suffix) {
                foreach (['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'] as $index => $breakpoint) {
                    $value = null;
                    if (is_numeric($rawValue)) {
                        $value = (int) $rawValue + $index + $suffixIndex;
                    } elseif (in_array($rawValue, $units)) {
                        switch ($rawValue) {
                            case 'px':
                                $value = '%';
                                break;
                            case '%':
                                $value = 'px';
                                break;
                            case 'em':
                                $value = 'px';
                                break;
                            case 'vw':
                                $value = 'vh';
                                break;
                            case 'vh':
                                $value = 'vw';
                                break;
                            default:
                                $value = 'px';
                                break;
                        }
                    } else {
                        $value = $rawValue;
                    }

                    $key = str_replace('general', $breakpoint, $rawKey) . $suffix;
                    $response[$key] = $value;
                }
            }
        }

        return $response;
    }

    public function test_get_correct_block_background_styles_for_color_layer_with_different_values_on_different_responsive_stages()
    {
        $target = 'maxi-test';
        $result = get_block_background_styles([
            'target' => $target,
            'is_hover' => false,
            'block_style' => 'light',
            'background-layers' => [
                [
                    'type' => 'color',
                    'display-general' => 'block',
                    'background-palette-status-general' => true,
                    'background-palette-color-general' => 1,
                    'background-palette-opacity-general' => 0.07,
                    'background-color-general' => '',
                    'background-color-clip-path-general' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    'order' => 0,
                    'background-palette-status-xl' => true,
                    'background-palette-color-xl' => 1,
                    'background-palette-opacity-xl' => 0.07,
                    'background-color-xl' => '',
                    'background-color-clip-path-xl' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    'background-color-clip-path-xxl' => 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                    'background-palette-status-xxl' => true,
                    'background-palette-color-xxl' => 2,
                    'background-palette-opacity-xxl' => 0.2,
                    'background-color-xxl' => '',
                    'background-palette-status-l' => true,
                    'background-palette-color-l' => 4,
                    'background-palette-opacity-l' => 0.3,
                    'background-color-l' => '',
                    'background-color-clip-path-l' => 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    'background-palette-status-m' => true,
                    'background-palette-color-m' => 5,
                    'background-palette-opacity-m' => 0.59,
                    'background-color-m' => '',
                    'background-color-clip-path-m' => 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
                    'background-palette-status-s' => false,
                    'background-palette-color-s' => 5,
                    'background-palette-opacity-s' => 0.59,
                    'background-color-s' => 'rgba(204,68,68,0.59)',
                    'background-color-clip-path-s' => 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
                    'background-color-clip-path-xs' => 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
                ] + $this->get_general_size_and_position_attributes([
                    'type' => 'color',
                    'is_responsive' => true,
                ]),
            ],
        ]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_image_layer_with_different_values_on_different_responsive_stages()
    {
        $target = 'maxi-test';
        $result = get_block_background_styles([
            'target' => $target,
            'is_hover' => false,
            'block_style' => 'light',
            'background-layers' => [
                [
                    'type'=> 'image',
                    'display-general' => 'block',
                    'background-image-mediaID' => 302,
                    'background-image-mediaURL' =>
                        'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
                    'background-image-size-general' => 'cover',
                    'background-image-width-general' => 470,
                    'background-image-width-unit-general' => '%',
                    'background-image-height-general' => 300,
                    'background-image-height-unit-general' => '%',
                    'background-image-crop-options-general' => null,
                    'background-image-repeat-general' => 'repeat-x',
                    'background-image-position-general' => 'left top',
                    'background-image-position-width-unit-general' => '%',
                    'background-image-position-width-general' => 0,
                    'background-image-position-height-unit-general' => '%',
                    'background-image-position-height-general' => 0,
                    'background-image-origin-general' => 'border-box',
                    'background-image-clip-general' => 'padding-box',
                    'background-image-attachment-general' => 'local',
                    'background-image-clip-path-general' =>
                        'polygon(50% 0%, 0% 100%, 100% 100%)',
                    'background-image-opacity-general' => 0.52,
                    'order' => 0,
                    'background-image-width-xl' => 470,
                    'background-image-height-xl' => 300,
                    'background-image-opacity-xl' => 0.52,
                    'background-image-size-xl' => 'cover',
                    'background-image-repeat-xl' => 'repeat-x',
                    'background-image-position-xl' => 'left top',
                    'background-image-attachment-xl' => 'local',
                    'background-image-origin-xl' => 'border-box',
                    'background-image-clip-xl' => 'padding-box',
                    'background-image-clip-path-xl' =>
                        'polygon(50% 0%, 0% 100%, 100% 100%)',
                    'background-image-width-l' => 2560,
                    'background-image-height-l' => 1920,
                    'background-image-size-l' => 'contain',
                    'background-image-repeat-l' => 'space',
                    'background-image-position-l' => 'right top',
                    'background-image-attachment-l' => 'fixed',
                    'background-image-origin-l' => 'content-box',
                    'background-image-clip-l' => 'padding-box',
                    'background-image-clip-path-l' =>
                        'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                    'background-image-opacity-m' => 0.91,
                    'background-image-opacity-xxl' => 0.11,
                    'background-image-clip-path-xxl' =>
                        'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                    'background-image-repeat-s' => 'repeat-x',
                    'background-image-attachment-s' => 'scroll',
                    'background-image-position-s' => 'center top',
                    'background-image-clip-path-s' =>
                        'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
                    'background-image-width-xs' => 600,
                    'background-image-height-xs' => 600,
                    'background-image-size-xs' => 'auto',
                ],
            ],
        ]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_image_layer_with_parallax_and_different_values_on_different_responsive_stages()
    {
        $target = 'maxi-test';
        $result = get_block_background_styles([
            'target' => $target,
            'is_hover' => false,
            'block_style' => 'light',
            'background-layers' => [
                [
                    'type'=> 'image',
                    'display-general' => 'block',
                    'background-image-parallax-status' => true,
                    'background-image-mediaID' => 302,
                    'background-image-mediaURL' =>
                        'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
                    'background-image-size-general' => 'cover',
                    'background-image-width-general' => 470,
                    'background-image-width-unit-general' => '%',
                    'background-image-height-general' => 300,
                    'background-image-height-unit-general' => '%',
                    'background-image-crop-options-general' => null,
                    'background-image-repeat-general' => 'repeat-x',
                    'background-image-position-general' => 'left top',
                    'background-image-position-width-unit-general' => '%',
                    'background-image-position-width-general' => 0,
                    'background-image-position-height-unit-general' => '%',
                    'background-image-position-height-general' => 0,
                    'background-image-origin-general' => 'border-box',
                    'background-image-clip-general' => 'padding-box',
                    'background-image-attachment-general' => 'local',
                    'background-image-clip-path-general' =>
                        'polygon(50% 0%, 0% 100%, 100% 100%)',
                    'background-image-opacity-general' => 0.52,
                    'order' => 0,
                    'background-image-width-xl' => 470,
                    'background-image-height-xl' => 300,
                    'background-image-opacity-xl' => 0.52,
                    'background-image-size-xl' => 'cover',
                    'background-image-repeat-xl' => 'repeat-x',
                    'background-image-position-xl' => 'left top',
                    'background-image-attachment-xl' => 'local',
                    'background-image-origin-xl' => 'border-box',
                    'background-image-clip-xl' => 'padding-box',
                    'background-image-clip-path-xl' =>
                        'polygon(50% 0%, 0% 100%, 100% 100%)',
                    'background-image-width-l' => 2560,
                    'background-image-height-l' => 1920,
                    'background-image-size-l' => 'contain',
                    'background-image-repeat-l' => 'space',
                    'background-image-position-l' => 'right top',
                    'background-image-attachment-l' => 'fixed',
                    'background-image-origin-l' => 'content-box',
                    'background-image-clip-l' => 'padding-box',
                    'background-image-clip-path-l' =>
                        'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                    'background-image-opacity-m' => 0.91,
                    'background-image-opacity-xxl' => 0.11,
                    'background-image-clip-path-xxl' =>
                        'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                    'background-image-repeat-s' => 'repeat-x',
                    'background-image-attachment-s' => 'scroll',
                    'background-image-position-s' => 'center top',
                    'background-image-clip-path-s' =>
                        'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
                    'background-image-width-xs' => 600,
                    'background-image-height-xs' => 600,
                    'background-image-size-xs' => 'auto',
                ],
            ],
        ]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_video_layer_with_different_values_on_different_responsive_stages()
    {
        $target = 'maxi-test';
        $result = get_block_background_styles([
            'target' => $target,
            'is_hover' => false,
            'block_style' => 'light',
            'background-layers' => [
                [
                    'type' => 'video',
                    'display-general' => 'block',
                    'background-video-mediaID' => null,
                    'background-video-mediaURL' => 'https://www.youtube.com/watch?v=y1dbbrfekAM',
                    'background-video-startTime' => 285,
                    'background-video-endTime' => 625,
                    'background-video-loop' => false,
                    'background-video-clipPath-general' => '',
                    'background-video-fallbackID-general' => 302,
                    'background-video-fallbackURL-general' => 'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
                    'background-video-opacity-general' => 0.11,
                    'order' => 0,
                    'background-video-opacity-xl' => 0.11,
                    'background-video-fallbackID-xl' => 302,
                    'background-video-fallbackURL-xl' => 'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
                    'background-video-opacity-xxl' => 0.37,
                    'background-video-fallbackID-xxl' => 227,
                    'background-video-fallbackURL-xxl' => 'http://localhost:8888/wp-content/uploads/2021/09/maxi-IMG_9344-scaled-1.jpg',
                    'background-video-opacity-l' => 0.65,
                    'background-video-fallbackID-l' => 226,
                    'background-video-fallbackURL-l' => 'http://localhost:8888/wp-content/uploads/2021/09/maxi-a6848490-test.jpg',
                    'background-video-opacity-s' => 0.25,
                    'background-video-opacity-xs' => 0.9,
                ] + $this->get_general_size_and_position_attributes([
                    'type' => 'video',
                    'is_responsive' => true,
                ]),
            ],
        ]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_gradient_layer_with_different_values_on_different_responsive_stages()
    {
        $target = 'maxi-test';
        $result = get_block_background_styles([
            'target' => $target,
            'is_hover' => false,
            'block_style' => 'light',
            'background-layers' => [
                [
                    'type' => 'gradient',
                    'display-general' => 'block',
                    'background-gradient-general' =>
                        'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
                    'background-gradient-opacity-general' => 0.15,
                    'background-gradient-clip-path-general' =>
                        'polygon(50% 0%, 0% 100%, 100% 100%)',
                    'order' => 0,
                    'background-gradient-opacity-xl' => 0.15,
                    'background-gradient-xl' =>
                        'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
                    'background-gradient-clip-path-xl' =>
                        'polygon(50% 0%, 0% 100%, 100% 100%)',
                    'background-gradient-opacity-xxl' => 0.48,
                    'background-gradient-clip-path-xxl' =>
                        'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                    'background-gradient-clip-path-l' =>
                        'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)',
                    'background-gradient-opacity-l' => 0.8,
                    'background-gradient-l' =>
                        'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
                    'background-gradient-s' =>
                        'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(118,170,192) 76%,rgb(155,81,224) 100%)',
                    'background-gradient-opacity-s' => 0.17,
                    'background-gradient-clip-path-s' =>
                        'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
                ],
            ],
        ]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_shape_layer_with_different_values_on_different_responsive_stages()
    {
        $target = 'maxi-test';
        $result = get_block_background_styles([
            'target' => $target,
            'is_hover' => false,
            'block_style' => 'light',
            'background-layers' => [
                [
                    'type' => 'shape',
                    'display-general' => 'block',
                    'background-svg-palette-status-general' => true,
                    'background-svg-palette-color-general' => 5,
                    'background-svg-SVGElement' => '<svg viewBox="2.500000238418579, 11.457558631896973, 31.10000228881836, 12.842442512512207" class="shape-22-maxi-svg" data-item="group-maxi-12__svg"><path fill="" data-fill="" d="M33.6 12.9c-.4-.8-1.5-1-2.3-.8s-1.6.8-2.3 1.3-1.5 1-2.4 1.1c-1 .1-2-.5-3-.5-1.3 0-2.5.8-3.8.6-1.9-.2-3-2.4-4.8-3-1.7-.5-3.4.4-4.9 1.4S7 15.1 5.3 14.8c-1.3-.2-2.5-1.3-2.8-2.6v12.1h31.1V12.9z"></path></svg>',
                    'background-svg-SVGData' => [
                        'group-maxi-12__30' => [
                            'color' => '',
                            'imageID' => '',
                            'imageURL' => '',
                        ],
                    ],
                    'background-svg-top-unit-general' => '%',
                    'background-svg-top-general' => 0,
                    'background-svg-left-unit-general' => '%',
                    'background-svg-left-general' => 50,
                    'order' => 0,
                    'background-svg-top-xl' => 0,
                    'SVGElement-xxl' => '<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-12__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
                    'SVGData-xxl' => [
                        'group-maxi-12__30' => [
                            'color' => '',
                            'imageID' => '',
                            'imageURL' => '',
                        ],
                    ],
                    'background-svg-palette-status-xxl' => true,
                    'background-svg-palette-color-xxl' => 2,
                    'background-svg-palette-opacity-xxl' => 0.37,
                    'background-svg-top-xxl' => 72,
                    'background-svg-left-xxl' => 14,
                    'SVGElement' => '<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-1718__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
                    'SVGData' => [
                        'group-maxi-12__30' => [
                            'color' => '',
                            'imageID' => '',
                            'imageURL' => '',
                        ],
                    ],
                    'SVGElement-l' => '<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-12__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
                    'SVGData-l' => [
                        'group-maxi-12__30' => [
                            'color' => '',
                            'imageID' => '',
                            'imageURL' => '',
                        ],
                    ],
                    'background-svg-palette-status-l' => true,
                    'background-svg-palette-color-l' => 3,
                    'background-svg-palette-opacity-l' => 0.37,
                    'background-svg-top-l' => 82,
                    'background-svg-left-l' => 62,
                    'SVGElement-s' => '<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-12__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
                    'SVGData-s' => [
                        'group-maxi-12__30' => [
                            'color' => '',
                            'imageID' => '',
                            'imageURL' => '',
                        ],
                    ],
                    'background-svg-palette-status-s' => true,
                    'background-svg-palette-color-s' => 7,
                    'background-svg-palette-opacity-s' => 0.37,
                    'background-svg-top-s' => 23,
                    'background-svg-left-s' => 31,
                    'background-svg-image-shape-flip-x-general' => false,
                    'background-svg-image-shape-flip-y-general' => false,
                    'background-svg-image-shape-rotate-general' => 104,
                    'background-svg-image-shape-scale-general' => 72,
                ] + $this->get_general_size_and_position_attributes([
                    'type' => 'svg',
                    'is_responsive' => true,
                ]),
            ],
        ]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_general_responsive_stage()
    {
        $target = 'maxi-test';
        $result = get_block_background_styles([
            'target' => $target,
            'is_hover' => false,
            'block_style' => 'light',
            'background-layers' => [
                [
                    'type' => 'color',
                    'display-general' => 'block',
                    'background-palette-status-general' => true,
                    'background-palette-color-general' => 1,
                    'background-color-general' => '',
                    'background-color-clip-path-general' => '',
                    'order' => 0,
                ],
                [
                    'type' => 'image',
                    'display-general' => 'block',
                    'background-image-mediaID' => '',
                    'background-image-mediaURL' => '',
                    'background-image-size-general' => '',
                    'background-image-width-general' => 100,
                    'background-image-width-unit-general' => '%',
                    'background-image-height-general' => 100,
                    'background-image-height-unit-general' => '%',
                    'background-image-crop-options-general' => null,
                    'background-image-repeat-general' => 'no-repeat',
                    'background-image-position-general' => 'center center',
                    'background-image-position-width-unit-general' => '%',
                    'background-image-position-width-general' => 0,
                    'background-image-position-height-unit-general' => '%',
                    'background-image-position-height-general' => 0,
                    'background-image-origin-general' => 'padding-box',
                    'background-image-clip-general' => 'border-box',
                    'background-image-attachment-general' => 'scroll',
                    'background-image-clip-path-general' => '',
                    'background-image-opacity-general' => 1,
                    'order' => 1,
                ] + $this->get_general_size_and_position_attributes([
                    'type' => 'image',
                    'is_responsive' => false,
                ]),
                [
                    'type' => 'video',
                    'display-general' => 'block',
                    'background-video-mediaID' => null,
                    'background-video-mediaURL' => '',
                    'background-video-startTime-general' => '',
                    'background-video-endTime-general' => '',
                    'background-video-loop-general' => false,
                    'background-video-clipPath-general' => '',
                    'background-video-fallbackID-general' => null,
                    'background-video-fallbackURL-general' => '',
                    'background-video-playOnMobile-general' => false,
                    'background-video-opacity-general' => 1,
                    'order' => 2,
                ],
                [
                    'type' => 'gradient',
                    'display-general' => 'block',
                    'background-gradient-general' => '',
                    'background-gradient-opacity-general' => 1,
                    'background-gradient-clip-path-general' => '',
                    'order' => 3,
                ],
                [
                    'type' => 'shape',
                    'display-general' => 'block',
                    'background-svg-palette-status-general' => true,
                    'background-svg-palette-color-general' => 5,
                    'background-svg-SVGElement-general' => '',
                    'background-svg-SVGMediaURL' => '',
                    'background-svg-top-unit-general' => '%',
                    'background-svg-top-general' => null,
                    'background-svg-left-unit-general' => '%',
                    'background-svg-left-general' => null,
                    'background-svg-width-general' => 100,
                    'background-svg-width-unit-general' => '%',
                    'order' => 4,
                ],
            ],
            'border-palette-status-general' => true,
            'border-palette-color-general' => 2,
            'border-sync-width-general' => true,
            'border-unit-width-general' => 'px',
            'border-sync-radius-general' => true,
            'border-unit-radius-general' => 'px',
        ]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_simple_background_styles()
    {
        $target = 'maxi-test';
        $result = get_background_styles([
            'target' => $target,
            'is_hover' => false,
            'block_style' => 'light',
            'background-active-media-general' => 'color',
            'background-active-media-l' => 'gradient',
            'background-active-media-m' => 'color',
            'background-active-media-xs' => 'gradient',
            'background-color-general' => 'rgba(255,255,255,0.39)',
            'background-color-m' => 'rgba(255,255,255,0.39)',
            'background-color-s' => 'rgba(43,43,179,0.39)',
            'background-color-xl' => 'rgba(255,255,255,0.39)',
            'background-color-xxl' => 'rgba(255,255,255,0.39)',
            'background-gradient-l' => 'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(73,131,156) 39%,rgb(155,81,224) 100%)',
            'background-gradient-opacity-general' => 1,
            'background-gradient-opacity-l' => 0.29,
            'background-gradient-xs' => 'linear-gradient(135deg,rgb(6,147,227) 0%,rgb(73,131,156) 39%,rgb(102,186,223) 67%,rgb(155,81,224) 100%)',
            'background-layers-status-general' => false,
            'background-layers-status-general-hover' => false,
            'background-palette-color-general' => 1,
            'background-palette-color-general-hover' => 6,
            'background-palette-color-m' => 4,
            'background-palette-color-s' => 4,
            'background-palette-status-general' => true,
            'background-palette-status-general-hover' => true,
            'background-palette-status-m' => true,
            'background-palette-status-s' => false,
            'background-palette-status-xl' => true,
            'background-palette-status-xxl' => true,
            'background-palette-color-xl' => 1,
            'background-palette-color-xxl' => 2,
            'background-palette-opacity-general' => 0.39,
            'background-palette-opacity-m' => 0.39,
            'background-palette-opacity-s' => 0.39,
            'background-palette-opacity-xl' => 0.39,
        ]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_color_layer_with_different_values_on_different_responsive_stages_and_hover()
    {
        $attributes = [
            'block_style' => 'light',
            'block-background-status-hover' => true,
            'background-layers' => [
                [
                    'type'=> 'color',
                    'display-general' => 'block',
                    'background-palette-status-general' => true,
                    'background-palette-color-general' => 1,
                    'background-palette-opacity-general' => 0.07,
                    'background-color-general' => '',
                    'background-color-clip-path-general' => true,
                    'order' => 0,
                    'background-palette-status-xl' => true,
                    'background-palette-color-xl' => 1,
                    'background-palette-opacity-xl' => 0.07,
                    'background-color-xl' => '',
                    'background-color-clip-path-xl' => true,
                    'background-color-clip-path-xxl' =>
                        'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                    'background-palette-status-xxl' => true,
                    'background-palette-color-xxl' => 2,
                    'background-palette-opacity-xxl' => 0.2,
                    'background-color-xxl' => '',
                    'background-palette-status-l' => true,
                    'background-palette-color-l' => 4,
                    'background-palette-opacity-l' => 0.3,
                    'background-color-l' => '',
                    'background-color-clip-path-l' =>
                        'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    'background-palette-status-m' => true,
                    'background-palette-color-m' => 5,
                    'background-palette-opacity-m' => 0.59,
                    'background-color-m' => '',
                    'background-color-clip-path-m' =>
                        'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
                    'background-palette-status-s' => false,
                    'background-palette-color-s' => 5,
                    'background-palette-opacity-s' => 0.59,
                    'background-color-s' => 'rgba(204,68,68,0.59)',
                    'background-color-clip-path-s' =>
                        'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
                    'background-color-clip-path-xs' =>
                        'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
                    'background-palette-status-xl-hover' => true,
                    'background-palette-color-xl-hover' => 4,
                    'background-palette-opacity-xl-hover' => 0.59,
                    'background-color-xl-hover' => '',
                    'background-palette-status-general-hover' => true,
                    'background-palette-color-general-hover' => 4,
                    'background-palette-opacity-general-hover' => 0.59,
                    'background-color-general-hover' => '',
                    'background-palette-status-xxl-hover' => true,
                    'background-palette-color-xxl-hover' => 7,
                    'background-palette-opacity-xxl-hover' => 0.22,
                    'background-color-xxl-hover' => '',
                    'background-palette-status-l-hover' => true,
                    'background-palette-color-l-hover' => 1,
                    'background-palette-opacity-l-hover' => 0.59,
                    'background-color-l-hover' => '',
                    'background-palette-status-s-hover' => true,
                    'background-palette-color-s-hover' => 8,
                    'background-palette-opacity-s-hover' => 0.59,
                    'background-color-s-hover' => 'rgba(204,68,68,0.59)',
                    'background-color-clip-path-l-hover' =>
                        'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                    'background-color-clip-path-s-hover' =>
                        'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)',
                ] + $this->get_general_size_and_position_attributes([
                    'type' => 'color',
                    'is_responsive' => true,
                    'is_hover' => true,
                ]),
            ],
        ];

        $result = $this->get_block_background_normal_and_hover_styles($attributes);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_image_layer_with_different_values_on_different_responsive_stages_and_hovers()
    {
        $attributes = [
            'block_style' => 'light',
            'block-background-status-hover' => true,
            'background-layers' => [
                [
                    'type' => 'image',
                    'display-general' => 'block',
                    'background-image-mediaID' => 302,
                    'background-image-mediaURL' => 'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
                    'background-image-size-general' => 'cover',
                    'background-image-width-general' => 470,
                    'background-image-width-unit-general' => '%',
                    'background-image-height-general' => 300,
                    'background-image-height-unit-general' => '%',
                    'background-image-crop-options-general' => null,
                    'background-image-repeat-general' => 'repeat-x',
                    'background-image-position-general' => 'left top',
                    'background-image-position-width-unit-general' => '%',
                    'background-image-position-width-general' => 0,
                    'background-image-position-height-unit-general' => '%',
                    'background-image-position-height-general' => 0,
                    'background-image-origin-general' => 'border-box',
                    'background-image-clip-general' => 'padding-box',
                    'background-image-attachment-general' => 'local',
                    'background-image-clip-path-status-general' => true,
                    'background-image-clip-path-general' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    'background-image-opacity-general' => 0.52,
                    'order' => 0,
                    'background-image-width-xl' => 470,
                    'background-image-height-xl' => 300,
                    'background-image-opacity-xl' => 0.52,
                    'background-image-size-xl' => 'cover',
                    'background-image-repeat-xl' => 'repeat-x',
                    'background-image-position-xl' => 'left top',
                    'background-image-attachment-xl' => 'local',
                    'background-image-origin-xl' => 'border-box',
                    'background-image-clip-xl' => 'padding-box',
                    'background-image-clip-path-status-xl' => true,
                    'background-image-clip-path-xl' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    'background-image-width-l' => 2560,
                    'background-image-height-l' => 1920,
                    'background-image-size-l' => 'contain',
                    'background-image-repeat-l' => 'space',
                    'background-image-position-l' => 'right top',
                    'background-image-attachment-l' => 'fixed',
                    'background-image-origin-l' => 'content-box',
                    'background-image-clip-l' => 'padding-box',
                    'background-image-clip-path-status-l' => true,
                    'background-image-clip-path-l' => 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                    'background-image-opacity-m' => 0.91,
                    'background-image-opacity-xxl' => 0.11,
                    'background-image-clip-path-status-xxl' => true,
                    'background-image-clip-path-xxl' => 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                    'background-image-repeat-s' => 'repeat-x',
                    'background-image-attachment-s' => 'scroll',
                    'background-image-position-s' => 'center top',
                    'background-image-clip-path-status-s' => true,
                    'background-image-clip-path-s' => 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
                    'background-image-width-xs' => 600,
                    'background-image-height-xs' => 600,
                    'background-image-size-xs' => 'auto',
                    'background-image-width-xl-hover' => 600,
                    'background-image-height-xl-hover' => 600,
                    'background-image-width-general-hover' => 600,
                    'background-image-height-general-hover' => 600,
                    'background-image-opacity-xl-hover' => 0.17,
                    'background-image-opacity-general-hover' => 0.17,
                    'background-image-clip-path-status-xl-hover' => true,
                    'background-image-clip-path-xl-hover' => 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                    'background-image-clip-path-status-general-hover' => true,
                    'background-image-clip-path-general-hover' => 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                    'background-image-width-xxl-hover' => 788,
                    'background-image-height-xxl-hover' => 732,
                    'background-image-opacity-xxl-hover' => 0.79,
                    'background-image-width-l-hover' => 470,
                    'background-image-height-l-hover' => 300,
                    'background-image-opacity-l-hover' => 0.81,
                    'background-image-clip-path-status-s-hover' => true,
                    'background-image-clip-path-s-hover' => 'ellipse(25% 40% at 50% 50%)',
                ],
            ],
        ];

        $result = $this->get_block_background_normal_and_hover_styles($attributes);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_video_layer_with_different_values_on_different_responsive_stages_and_hovers()
    {
        $attributes = [
            'block_style' => 'light',
            'block-background-status-hover' => true,
            'background-layers' => [
                [
                    'type' => 'video',
                    'display-general' => 'block',
                    'background-video-mediaID' => null,
                    'background-video-mediaURL' => 'https://www.youtube.com/watch?v=y1dbbrfekAM',
                    'background-video-startTime' => 285,
                    'background-video-endTime' => 625,
                    'background-video-loop' => false,
                    'background-video-clipPath-general' => '',
                    'background-video-fallbackID-general' => 302,
                    'background-video-fallbackURL-general' => 'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
                    'background-video-opacity-general' => 0.11,
                    'order' => 0,
                    'background-video-opacity-xl' => 0.11,
                    'background-video-fallbackID-xl' => 302,
                    'background-video-fallbackURL-xl' => 'http://localhost:8888/wp-content/uploads/2021/10/maxi-PIL-65.jpg',
                    'background-video-opacity-xxl' => 0.37,
                    'background-video-fallbackID-xxl' => 227,
                    'background-video-fallbackURL-xxl' => 'http://localhost:8888/wp-content/uploads/2021/09/maxi-IMG_9344-scaled-1.jpg',
                    'background-video-opacity-l' => 0.65,
                    'background-video-fallbackID-l' => 226,
                    'background-video-fallbackURL-l' => 'http://localhost:8888/wp-content/uploads/2021/09/maxi-a6848490-test.jpg',
                    'background-video-opacity-s' => 0.25,
                    'background-video-opacity-xs' => 0.9,
                    'background-video-opacity-xl-hover' => 0.82,
                    'background-video-opacity-general-hover' => 0.82,
                    'background-video-opacity-xxl-hover' => 0.21,
                    'background-video-opacity-m-hover' => 0.06,
                    'background-video-opacity-s-hover' => 1,
                ] + $this->get_general_size_and_position_attributes([
                    'type' => 'video',
                    'is_responsive' => true,
                    'is_hover' => true,
                ]),
            ],
        ];

        $result = $this->get_block_background_normal_and_hover_styles($attributes);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_gradient_layer_with_different_values_on_different_responsive_stages_and_hovers()
    {
        $attributes = [
            'block_style' => 'light',
            'block-background-status-hover' => true,
            'background-layers' => [
                [
                    'type' => 'gradient',
                    'display-general' => 'block',
                    'background-gradient-general' => 'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
                    'background-gradient-opacity-general' => 0.15,
                    'background-gradient-clip-path-status-general' => true,
                    'background-gradient-clip-path-general' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    'order' => 0,
                    'background-gradient-opacity-xl' => 0.15,
                    'background-gradient-xl' => 'radial-gradient(rgb(6,147,227) 0%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
                    'background-gradient-clip-path-status-xl' => true,
                    'background-gradient-clip-path-xl' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    'background-gradient-opacity-xxl' => 0.48,
                    'background-gradient-clip-path-status-xxl' => true,
                    'background-gradient-clip-path-xxl' => 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                    'background-gradient-clip-path-status-l' => true,
                    'background-gradient-clip-path-l' => 'polygon(50% 0%, 90% 20%, 100% 60%, 75% 100%, 25% 100%, 0% 60%, 10% 20%)',
                    'background-gradient-opacity-l' => 0.8,
                    'background-gradient-l' => 'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(155,81,224) 100%)',
                    'background-gradient-s' => 'radial-gradient(rgb(6,147,227) 0%,rgb(89,121,135) 29%,rgb(68,150,185) 52%,rgb(118,170,192) 76%,rgb(155,81,224) 100%)',
                    'background-gradient-opacity-s' => 0.17,
                    'background-gradient-clip-path-status-s' => true,
                    'background-gradient-clip-path-s' => 'polygon(75% 0%, 100% 50%, 75% 100%, 0% 100%, 25% 50%, 0% 0%)',
                    'background-gradient-xl-hover' => 'radial-gradient(rgb(26,229,6) 0%,rgb(186,69,107) 52%,rgb(224,218,82) 100%)',
                    'background-gradient-general-hover' => 'radial-gradient(rgb(26,229,6) 0%,rgb(186,69,107) 52%,rgb(224,218,82) 100%)',
                    'background-gradient-opacity-xl-hover' => 0.71,
                    'background-gradient-opacity-general-hover' => 0.71,
                    'background-gradient-xxl-hover' => 'linear-gradient(205deg,rgb(26,229,6) 0%,rgb(186,69,107) 52%,rgb(224,218,82) 100%)',
                    'background-gradient-clip-path-status-xxl-hover' => true,
                    'background-gradient-clip-path-xxl-hover' => 'polygon(25% 0%, 100% 0%, 75% 100%, 0% 100%)',
                    'background-gradient-clip-path-status-xl-hover' => true,
                    'background-gradient-clip-path-xl-hover' => 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                    'background-gradient-clip-path-status-general-hover' => true,
                    'background-gradient-clip-path-general-hover' => 'polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)',
                    'background-gradient-clip-path-status-l-hover' => true,
                    'background-gradient-clip-path-l-hover' => 'circle(50% at 50% 50%)',
                    'background-gradient-l-hover' => 'radial-gradient(rgb(26,229,6) 0%,rgb(89,136,156) 25%,rgb(186,69,107) 52%,rgba(0,114,163,0.08) 74%,rgb(224,218,82) 100%)',
                    'background-gradient-opacity-l-hover' => 0.37,
                    'background-gradient-s-hover' => 'radial-gradient(rgb(186,69,107) 52%,rgba(0,114,163,0.08) 74%,rgb(224,218,82) 100%)',
                    'background-gradient-clip-path-status-s-hover' => true,
                    'background-gradient-clip-path-s-hover' => 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    'background-gradient-opacity-s-hover' => 0.91,
                ] + $this->get_general_size_and_position_attributes([
                    'type' => 'gradient',
                    'is_responsive' => true,
                    'is_hover' => true,
                ]),
            ],
        ];

        $result = $this->get_block_background_normal_and_hover_styles($attributes);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_shape_layer_with_different_values_on_different_responsive_stages_and_hovers()
    {
        $attributes = [
            'block_style' => 'light',
            'block-background-status-hover' => true,
            'background-layers' => [
                [
                    'type' => 'shape',
                    'display-general' => 'block',
                    'background-svg-palette-status-general' => true,
                    'background-svg-palette-color-general' => 5,
                    'background-svg-SVGElement' => '<svg viewBox="2.500000238418579, 11.457558631896973, 31.10000228881836, 12.842442512512207" class="shape-22-maxi-svg" data-item="group-maxi-12__svg"><path fill="" data-fill="" d="M33.6 12.9c-.4-.8-1.5-1-2.3-.8s-1.6.8-2.3 1.3-1.5 1-2.4 1.1c-1 .1-2-.5-3-.5-1.3 0-2.5.8-3.8.6-1.9-.2-3-2.4-4.8-3-1.7-.5-3.4.4-4.9 1.4S7 15.1 5.3 14.8c-1.3-.2-2.5-1.3-2.8-2.6v12.1h31.1V12.9z"></path></svg>',
                    'background-svg-SVGData' => [
                        'group-maxi-12__30' => [
                            'color' => '',
                            'imageID' => '',
                            'imageURL' => '',
                        ],
                    ],
                    'background-svg-top-unit-general' => '%',
                    'background-svg-top-general' => 0,
                    'background-svg-left-unit-general' => '%',
                    'background-svg-left-general' => 50,
                    'order' => 0,
                    'background-svg-top-xl' => 0,
                    'SVGElement-xxl' => '<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-12__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
                    'SVGData-xxl' => [
                        'group-maxi-12__30' => [
                            'color' => '',
                            'imageID' => '',
                            'imageURL' => '',
                        ],
                    ],
                    'background-svg-palette-status-xxl' => true,
                    'background-svg-palette-color-xxl' => 2,
                    'background-svg-palette-opacity-xxl' => 0.37,
                    'background-svg-top-xxl' => 72,
                    'background-svg-left-xxl' => 14,
                    'SVGElement' => '<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-1718__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
                    'SVGData' => [
                        'group-maxi-12__30' => [
                            'color' => '',
                            'imageID' => '',
                            'imageURL' => '',
                        ],
                    ],
                    'SVGElement-l' => '<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-12__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
                    'SVGData-l' => [
                        'group-maxi-12__30' => [
                            'color' => '',
                            'imageID' => '',
                            'imageURL' => '',
                        ],
                    ],
                    'background-svg-palette-status-l' => true,
                    'background-svg-palette-color-l' => 3,
                    'background-svg-palette-opacity-l' => 0.37,
                    'background-svg-top-l' => 82,
                    'background-svg-left-l' => 62,
                    'SVGElement-s' => '<html xmlns="http://www.w3.org/1999/xhtml" data-item="group-maxi-12__svg"><body><parsererror style="display: block; white-space: pre; border: 2px solid #c77; padding: 0 1em 0 1em; margin: 1em; background-color: #fdd; color: black"><h3>This page contains the following errors:</h3><div style="font-family:monospace;font-size:12px">error on line 1 at column 1: Document is empty\n</div><h3>Below is a rendering of the page up to the first error.</h3></parsererror></body></html>',
                    'SVGData-s' => [
                        'group-maxi-12__30' => [
                            'color' => '',
                            'imageID' => '',
                            'imageURL' => '',
                        ],
                    ],
                    'background-svg-palette-status-s' => true,
                    'background-svg-palette-color-s' => 7,
                    'background-svg-palette-opacity-s' => 0.37,
                    'background-svg-top-s' => 23,
                    'background-svg-left-s' => 31,
                    'background-svg-palette-status-xl-hover' => true,
                    'background-svg-palette-color-xl-hover' => 4,
                    'background-svg-palette-opacity-xl-hover' => 0.92,
                    'background-svg-palette-status-general-hover' => true,
                    'background-svg-palette-color-general-hover' => 4,
                    'background-svg-palette-opacity-general-hover' => 0.92,
                    'background-svg-top-xl-hover' => 57,
                    'background-svg-top-general-hover' => 57,
                    'background-svg-left-xl-hover' => 39,
                    'background-svg-left-general-hover' => 39,
                    'background-svg-palette-status-xxl-hover' => true,
                    'background-svg-palette-color-xxl-hover' => 3,
                    'background-svg-palette-opacity-xxl-hover' => 0.17,
                    'background-svg-top-xxl-hover' => 16,
                    'background-svg-left-xxl-hover' => 11,
                    'background-svg-palette-status-s-hover' => true,
                    'background-svg-palette-color-s-hover' => 8,
                    'background-svg-palette-opacity-s-hover' => 0.92,
                    'background-svg-top-s-hover' => 10,
                    'background-svg-left-s-hover' => 72,
                ] + $this->get_general_size_and_position_attributes([
                    'type' => 'svg',
                    'is_responsive' => true,
                    'is_hover' => true,
                ]),
            ],
        ];

        $result = $this->get_block_background_normal_and_hover_styles($attributes);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_different_layers_onces_created_on_normal_and_other_on_hover()
    {
        $target = 'maxi-test';
        $attributes = [
            'target' => $target,
            'is_hover' => false,
            'block_style' => 'light',
            'background-layers' => [
                [
                    'type' => 'color',
                    'is_hover' => false,
                    'display-general' => 'block',
                    'isHover-general' => false,
                    'background-palette-status-general' => true,
                    'background-palette-color-general' => 1,
                    'order' => 2,
                    'background-palette-status-xl-hover' => true,
                    'background-palette-color-xl-hover' => 4,
                    'background-palette-status-general-hover' => true,
                    'background-palette-color-general-hover' => 4,
                ],
                [
                    'type' => 'shape',
                    'is_hover' => false,
                    'display-general' => 'block',
                    'isHover-general' => false,
                    'background-svg-palette-status-general' => true,
                    'background-svg-palette-color-general' => 4,
                    'background-svg-SVGElement' => '<svg fill="undefined" data-fill="" viewBox="2.1999988555908203, 2.5000007152557373, 31.674436569213867, 31" class="tick-5-maxi-svg" data-item="group-maxi-12__svg"><path d="M31.2 14.4c.3 1.2.5 2.4.5 3.6 0 7.7-6.3 13.9-14 13.9C10.1 32 3.8 25.7 3.8 18s6.3-13.9 14-13.9c2.2 0 4.2.5 6 1.4l1-1.3c-2.1-1.1-4.5-1.7-7-1.7-8.6 0-15.6 7-15.6 15.5 0 8.6 7 15.5 15.5 15.5 8.6 0 15.5-7 15.5-15.5 0-1.8-.3-3.5-.9-5.1l-1.1 1.5zm2.3-8.2l-3.9-2.9a.95.95 0 0 0-1.3.2l-1.5 1.9-1 1.3L18 16.9a.97.97 0 0 1-1.4.1l-4.5-4.5a.85.85 0 0 0-1.3 0L7.5 16c-.3.3-.3.9 0 1.2l9 9.8c.4.4 1 .4 1.4 0l12.3-15.2 1.1-1.3 2.4-2.9c.3-.5.2-1.1-.2-1.4z" fill=""/></svg>',
                    'background-svg-SVGData' => [
                        'group-maxi-12__81' => [
                            'color' => '',
                            'imageID' => '',
                            'imageURL' => '',
                        ],
                    ],
                    'background-svg-top-unit-general' => '%',
                    'background-svg-wrapper-position-top-general' => '10',
                    'background-svg-wrapper-position-top-unit-general' => 'px',
                    'background-svg-wrapper-position-right-general' => '10',
                    'background-svg-wrapper-position-right-unit-general' => 'px',
                    'background-svg-wrapper-position-bottom-general' => '10',
                    'background-svg-wrapper-position-bottom-unit-general' => 'px',
                    'background-svg-wrapper-position-left-general' => '10',
                    'background-svg-wrapper-position-left-unit-general' => 'px',
                    'background-svg-wrapper-position-sync-general' => 'all',
                    'background-svg-wrapper-width-general' => 100,
                    'background-svg-wrapper-width-unit-general' => '%',
                    'background-svg-wrapper-height-general' => 100,
                    'background-svg-wrapper-height-unit-general' => '%',
                    'order' => 3,
                    'background-svg-palette-status-xl' => true,
                    'background-svg-palette-color-xl' => 4,
                ] + $this->get_general_size_and_position_attributes([ 'type' => 'svg', 'is_responsive' => false]),
                [
                    'type' => 'video',
                    'is_hover' => false,
                    'display-general' => 'block',
                    'isHover-general' => false,
                    'background-video-mediaURL' => 'https://www.youtube.com/watch?v=CXSV98tr51A',
                    'background-video-loop' => false,
                    'background-video-playOnMobile-general' => false,
                    'background-video-opacity-general' => 1,
                    'background-video-reduce-border-general' => false,
                    'order' => 4,
                ],
            ],
            'background-layers-hover' => [
                [
                    'type' => 'image',
                    'is_hover' => true,
                    'display-general' => 'none',
                    'display-general-hover' => 'block',
                    'isHover-general' => false,
                    'isHover-general-hover' => false,
                    'background-image-size-general' => 'auto',
                    'background-image-size-general-hover' => 'auto',
                    'background-image-width-general' => 100,
                    'background-image-width-general-hover' => 600,
                    'background-image-width-unit-general' => '%',
                    'background-image-width-unit-general-hover' => '%',
                    'background-image-height-general' => 100,
                    'background-image-height-general-hover' => 600,
                    'background-image-height-unit-general' => '%',
                    'background-image-height-unit-general-hover' => '%',
                    'background-image-repeat-general' => 'no-repeat',
                    'background-image-repeat-general-hover' => 'no-repeat',
                    'background-image-position-general' => 'center center',
                    'background-image-position-general-hover' => 'center center',
                    'background-image-position-width-unit-general' => '%',
                    'background-image-position-width-unit-general-hover' => '%',
                    'background-image-position-width-general' => 0,
                    'background-image-position-width-general-hover' => 0,
                    'background-image-position-height-unit-general' => '%',
                    'background-image-position-height-unit-general-hover' => '%',
                    'background-image-position-height-general' => 0,
                    'background-image-position-height-general-hover' => 0,
                    'background-image-origin-general' => 'padding-box',
                    'background-image-origin-general-hover' => 'padding-box',
                    'background-image-clip-general' => 'border-box',
                    'background-image-clip-general-hover' => 'border-box',
                    'background-image-attachment-general' => 'scroll',
                    'background-image-attachment-general-hover' => 'scroll',
                    'background-image-opacity-general' => 1,
                    'background-image-opacity-general-hover' => 1,
                    'background-image-parallax-status' => false,
                    'background-image-parallax-speed' => 4,
                    'background-image-parallax-direction' => 'up',
                    'order' => 0,
                    'background-image-width-xl-hover' => 600,
                    'background-image-height-xl-hover' => 600,
                ],
                [
                    'type' => 'shape',
                    'is_hover' => true,
                    'display-general' => 'none',
                    'display-general-hover' => 'block',
                    'isHover-general' => false,
                    'isHover-general-hover' => false,
                    'background-svg-palette-status-general' => true,
                    'background-svg-palette-status-general-hover' => true,
                    'background-svg-palette-color-general' => 5,
                    'background-svg-palette-color-general-hover' => 2,
                    'background-svg-SVGElement' => '<svg viewBox="2.590501546859741, 2.455554962158203, 30.95997428894043, 31.187908172607422" class="tick-12-maxi-svg" data-item="group-maxi-12__svg"><path fill="" data-fill="" d="M32.4 16.4c.4-.6.7-1.4.6-2.3-.1-1.3-1-2.3-2.1-2.8.2-.8.1-1.6-.3-2.3-.6-1.2-1.7-1.8-2.9-1.9-.1-.8-.5-1.5-1.1-2.1-1-.9-2.3-1.1-3.4-.7-.4-.7-1-1.3-1.8-1.6-1.2-.5-2.5-.2-3.4.6-.6-.5-1.4-.8-2.2-.8-1.5 0-2.7.9-3.2 2.3-.9-.4-1.9-.5-2.8 0-1.2.5-1.9 1.6-2 2.8-.8.2-1.6.5-2.2 1.1-.9.9-1.2 2.2-.9 3.4-.7.3-1.3.9-1.6 1.7-.5 1.2-.3 2.5.4 3.5-.5.6-.9 1.3-.9 2.2-.1 1.3.6 2.4 1.6 3.1-.3.7-.4 1.6-.1 2.4.4 1.2 1.4 2.1 2.6 2.3 0 .8.2 1.6.8 2.2.8 1 2.1 1.4 3.3 1.2.3.7.8 1.4 1.5 1.8 1.1.6 2.5.6 3.5-.1.5.6 1.2 1 2.1 1.2 1.3.2 2.5-.3 3.2-1.3.7.4 1.5.5 2.3.3 1.3-.3 2.2-1.2 2.6-2.4.8.1 1.6-.1 2.3-.5 1.1-.7 1.6-1.9 1.5-3.1.8-.2 1.5-.6 2-1.3.8-1 .8-2.4.3-3.5.6-.4 1.1-1.1 1.4-1.9.2-1.4-.2-2.6-1.1-3.5zM25.7 14l-9.5 10.1-5.4-5.4 1.7-1.7 3.7 3.7 7.8-8.3 1.7 1.6z"/></svg>',
                    'background-svg-SVGData' => [
                        'group-maxi-12__69' => [
                            'color' => '',
                            'imageID' => '',
                            'imageURL' => '',
                        ],
                    ],
                    'background-svg-top-unit-general' => '%',
                    'background-svg-top-unit-general-hover' => '%',
                    'background-svg-wrapper-position-top-general' => 0,
                    'background-svg-wrapper-position-top-general-hover' => 0,
                    'background-svg-wrapper-position-right-general' => 0,
                    'background-svg-wrapper-position-right-general-hover' => 0,
                    'background-svg-wrapper-position-bottom-general' => 0,
                    'background-svg-wrapper-position-bottom-general-hover' => 0,
                    'background-svg-wrapper-position-left-general' => 0,
                    'background-svg-wrapper-position-top-unit-general' => '%',
                    'background-svg-wrapper-position-right-unit-general' => '%',
                    'background-svg-wrapper-position-bottom-unit-general' => '%',
                    'background-svg-wrapper-position-left-unit-general' => '%',
                    'background-svg-wrapper-width-general' => 100,
                    'background-svg-wrapper-width-general-hover' => 100,
                    'background-svg-wrapper-width-unit-general' => '%',
                    'background-svg-wrapper-width-unit-general-hover' => '%',
                    'background-svg-wrapper-height-general' => 100,
                    'background-svg-wrapper-height-general-hover' => 100,
                    'background-svg-wrapper-height-unit-general' => '%',
                    'background-svg-wrapper-height-unit-general-hover' => '%',
                    'order' => 1,
                    'background-svg-palette-status-xl-hover' => true,
                    'background-svg-palette-color-xl-hover' => 2,
                    'background-svg-palette-opacity-xl-hover' => 0.38,
                    'background-svg-palette-opacity-general-hover' => 0.38,
                ],
            ],
        ];

        $result = $this->get_block_background_normal_and_hover_styles($attributes);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_color_layer_with_border()
    {
        $target = 'maxi-test';
        $result = get_block_background_styles([
            'target' => $target,
            'is_hover' => false,
            'block_style' => 'light',
            'background-layers' => [
                [
                    'type' => 'color',
                    'display-general' => 'block',
                    'background-palette-status-general' => true,
                    'background-palette-color-general' => 1,
                    'background-palette-opacity-general' => 0.07,
                    'background-color-general' => '',
                    'background-color-clip-path-status-general' => true,
                    'background-color-clip-path-general' => 'polygon(50% 0%, 0% 100%, 100% 100%)',
                    'order' => 0,
                ],
            ],
            'border-bottom-left-radius-general' => 180,
            'border-bottom-right-radius-general' => 180,
            'border-bottom-width-general' => 2,
            'border-left-width-general' => 2,
            'border-palette-color-general' => 5,
            'border-palette-color-general-hover' => 6,
            'border-palette-status-general' => true,
            'border-palette-status-general-hover' => true,
            'border-right-width-general' => 2,
            'border-status-hover' => false,
            'border-style-general' => 'solid',
            'border-sync-radius-general' => 'all',
            'border-sync-width-general' => 'all',
            'border-top-left-radius-general' => 180,
            'border-top-right-radius-general' => 180,
            'border-top-width-general' => 2,
            'border-unit-radius-general' => 'px',
            'border-unit-radius-general-hover' => 'px',
            'border-unit-width-general' => 'px',
        ]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_color_layer_different_values_for_border_on_different_responsive_stages_and_hovers()
    {
        $target = 'maxi-test';
        $result = get_block_background_styles([
            'target' => $target,
            'is_hover' => false,
            'block_style' => 'light',
            'background-layers' => [
                [
                    'type' => 'color',
                    'display-general' => 'block',
                    'background-palette-status-general' => true,
                    'background-palette-color-general' => 4,
                    'background-color-clip-path-status-general' => false,
                    'background-color-wrapper-position-sync-general' => 'all',
                    'background-color-wrapper-position-top-unit-general' => 'px',
                    'background-color-wrapper-position-right-unit-general' =>
                        'px',
                    'background-color-wrapper-position-bottom-unit-general' =>
                        'px',
                    'background-color-wrapper-position-left-unit-general' => 'px',
                    'order' => 1,
                    'id' => 1,
                ],
            ],
            'block-background-status-hover' => false,
            'border-palette-status-general' => true,
            'border-palette-color-general' => 5,
            'border-style-general' => 'solid',
            'border-top-width-general' => 5,
            'border-top-width-l' => 10,
            'border-top-width-m' => 0,
            'border-right-width-general' => 10,
            'border-right-width-l' => 15,
            'border-bottom-width-general' => 15,
            'border-bottom-width-l' => 20,
            'border-left-width-general' => 20,
            'border-left-width-l' => 5,
            'border-left-width-m' => 0,
            'border-sync-width-general' => 'none',
            'border-unit-width-general' => 'px',
            'border-sync-radius-general' => 'all',
            'border-unit-radius-general' => 'px',
            'border-palette-status-general-hover' => true,
            'border-palette-color-general-hover' => 3,
            'border-style-general-hover' => 'solid',
            'border-style-m-hover' => 'solid',
            'border-status-hover' => true,
            'border-top-width-general-hover' => 5,
            'border-top-width-l-hover' => 10,
            'border-top-width-m-hover' => 2,
            'border-right-width-general-hover' => 10,
            'border-right-width-l-hover' => 15,
            'border-right-width-m-hover' => 15,
            'border-bottom-width-general-hover' => 15,
            'border-bottom-width-l-hover' => 20,
            'border-bottom-width-m-hover' => 20,
            'border-left-width-general-hover' => 20,
            'border-left-width-l-hover' => 5,
            'border-left-width-m-hover' => 2,
            'border-sync-width-general-hover' => 'none',
            'border-sync-width-m-hover' => 'all',
            'border-unit-width-general-hover' => 'px',
            'border-unit-width-m-hover' => 'px',
            'border-sync-radius-general-hover' => 'all',
            'border-unit-radius-general-hover' => 'px',
        ]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_color_layer_with_row_border_radius()
    {
        $target = 'maxi-test';
        $result = get_block_background_styles([
            'target' => $target,
            'is_hover' => false,
            'block_style' => 'light',
            'background-layers' => [
                [
                    'type' => 'color',
                    'display-general' => 'block',
                    'background-palette-status-general' => true,
                    'background-palette-color-general' => 1,
                    'background-palette-opacity-general' => 0.07,
                    'background-color-general' => '',
                    'order' => 0,
                ],
            ],
            'row_border_radius' => [
                'border-bottom-left-radius-general' => 181,
                'border-bottom-right-radius-general' => 182,
                'border-top-left-radius-general' => 183,
                'border-top-right-radius-general' => 184,
            ],
        ]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_for_color_layer_with_border_radius_and_row_border_radius()
    {
        $target = 'maxi-test';
        $result = get_block_background_styles([
            'target' => $target,
            'is_hover' => false,
            'block_style' => 'light',
            'background-layers' => [
                [
                    'type' => 'color',
                    'display-general' => 'block',
                    'background-palette-status-general' => true,
                    'background-palette-color-general' => 1,
                    'background-palette-opacity-general' => 0.07,
                    'background-color-general' => '',
                    'order' => 0,
                ],
            ],
            'row_border_radius' => [
                'border-bottom-left-radius-general' => 180,
                'border-bottom-right-radius-general' => 181,
                'border-top-left-radius-general' => 182,
                'border-top-right-radius-general' => 183,
            ],
            'border-bottom-left-radius-general' => 160,
            'border-bottom-right-radius-general' => 200,
        ]);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_when_hover_status_is_disabled_but_hover_attributes_are_set()
    {
        $attributes = [
            'block_style' => 'light',
            'background-layers' => [
                [
                    'type' => 'color',
                    'display-general' => 'block',
                    'background-palette-status-general' => true,
                    'background-palette-color-general' => 1,
                    'background-palette-opacity-general' => 0.07,
                    'background-color-general' => '',
                    'background-color-clip-path-general' => true,
                    'order' => 0,
                    'background-palette-status-xl' => true,
                    'background-palette-color-xl' => 1,
                    'background-palette-opacity-xl' => 0.07,
                    'background-color-xl' => '',
                    'background-color-clip-path-xl' => true,
                    'background-color-clip-path-xxl' => 'polygon(20% 0%, 80% 0%, 100% 100%, 0% 100%)',
                    'background-palette-status-xxl' => true,
                    'background-palette-color-xxl' => 2,
                    'background-palette-opacity-xxl' => 0.2,
                    'background-color-xxl' => '',
                    'background-palette-status-l' => true,
                    'background-palette-color-l' => 4,
                    'background-palette-opacity-l' => 0.3,
                    'background-color-l' => '',
                    'background-color-clip-path-l' => 'polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)',
                    'background-palette-status-m' => true,
                    'background-palette-color-m' => 5,
                    'background-palette-opacity-m' => 0.59,
                    'background-color-m' => '',
                    'background-color-clip-path-m' => 'polygon(50% 0%, 80% 10%, 100% 35%, 100% 70%, 80% 90%, 50% 100%, 20% 90%, 0% 70%, 0% 35%, 20% 10%)',
                    'background-palette-status-s' => false,
                    'background-palette-color-s' => 5,
                    'background-palette-opacity-s' => 0.59,
                    'background-color-s' => 'rgba(204,68,68,0.59)',
                    'background-color-clip-path-s' => 'polygon(0% 20%, 60% 20%, 60% 0%, 100% 50%, 60% 100%, 60% 80%, 0% 80%)',
                    'background-color-clip-path-xs' => 'polygon(20% 0%, 0% 20%, 30% 50%, 0% 80%, 20% 100%, 50% 70%, 80% 100%, 100% 80%, 70% 50%, 100% 20%, 80% 0%, 50% 30%)',
                    'background-palette-status-xl-hover' => true,
                    'background-palette-color-xl-hover' => 4,
                    'background-palette-opacity-xl-hover' => 0.59,
                    'background-color-xl-hover' => '',
                    'background-palette-status-general-hover' => true,
                    'background-palette-color-general-hover' => 4,
                    'background-palette-opacity-general-hover' => 0.59,
                    'background-color-general-hover' => '',
                    'background-palette-status-xxl-hover' => true,
                    'background-palette-color-xxl-hover' => 7,
                    'background-palette-opacity-xxl-hover' => 0.22,
                    'background-color-xxl-hover' => '',
                    'background-palette-status-l-hover' => true,
                    'background-palette-color-l-hover' => 1,
                    'background-palette-opacity-l-hover' => 0.59,
                    'background-color-l-hover' => '',
                    'background-palette-status-s-hover' => true,
                    'background-palette-color-s-hover' => 8,
                    'background-palette-opacity-s-hover' => 0.59,
                    'background-color-s-hover' => 'rgba(204,68,68,0.59)',
                    'background-color-clip-path-l-hover' => 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                    'background-color-clip-path-s-hover' => 'polygon(40% 0%, 40% 20%, 100% 20%, 100% 80%, 40% 80%, 40% 100%, 0% 50%)',
                ] + $this->get_general_size_and_position_attributes([
                    'type' => 'color',
                    'is_responsive' => true,
                    'is_hover' => true,
                ]),
            ],
        ];

        $result = $this->get_block_background_normal_and_hover_styles($attributes);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_when_border_attributes_are_default()
    {
        $attributes = [
            'block_style' => 'light',
            'background-layers' => [
                [
                    'type' => 'color',
                    'is_hover' => false,
                    'display-general' => 'block',
                    'background-palette-status-general' => true,
                    'background-palette-color-general' => 1,
                    'background-color-clip-path-status-general' => false,
                    'order' => 1,
                    'id' => 1,
                    'background-palette-status-general-hover' => true,
                    'background-palette-color-general-hover' => 1,
                    'background-palette-opacity-general-hover' => 0,
                    'background-color-wrapper-position-top-unit-general' => 'px',
                    'background-color-wrapper-position-left-unit-general' => 'px',
                    'background-color-wrapper-position-bottom-unit-general' => 'px',
                    'background-color-wrapper-position-right-unit-general' => 'px',
                ],
            ],
            'block-background-status-hover' => true,
            'border-palette-status-general' => true,
            'border-palette-color-general' => 2,
            'border-style-general' => 'solid',
            'border-top-width-general' => 2,
            'border-top-width-xxl' => 4,
            'border-top-width-xl' => 2,
            'border-right-width-general' => 2,
            'border-right-width-xxl' => 4,
            'border-right-width-xl' => 2,
            'border-bottom-width-general' => 2,
            'border-bottom-width-xxl' => 4,
            'border-bottom-width-xl' => 2,
            'border-left-width-general' => 2,
            'border-left-width-xxl' => 4,
            'border-left-width-xl' => 2,
            'border-sync-width-general' => 'all',
            'border-unit-width-general' => 'px',
            'border-sync-radius-general' => 'all',
            'border-unit-radius-general' => 'px',
            'border-status-hover' => true,
            'border-palette-status-general-hover' => true,
            'border-palette-color-general-hover' => 6,
            'border-palette-opacity-general-hover' => 0,
        ];

        $result = $this->get_block_background_normal_and_hover_styles($attributes);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }

    public function test_get_correct_block_background_styles_when_most_border_attributes_are_default()
    {
        $attributes = [
            'block_style' => 'light',
            'background-layers' => [
                [
                    'type' => 'color',
                    'is_hover' => false,
                    'display-general' => 'block',
                    'background-palette-status-general' => true,
                    'background-palette-color-general' => 1,
                    'background-color-clip-path-status-general' => false,
                    'order' => 1,
                    'id' => 1,
                    'background-palette-status-general-hover' => true,
                    'background-palette-color-general-hover' => 1,
                    'background-palette-opacity-general-hover' => 0,
                    'background-color-wrapper-position-top-unit-general' => 'px',
                    'background-color-wrapper-position-left-unit-general' => 'px',
                    'background-color-wrapper-position-bottom-unit-general' => 'px',
                    'background-color-wrapper-position-right-unit-general' => 'px',
                ],
            ],
            'block-background-status-hover' => true,
            'border-palette-status-general' => true,
            'border-palette-color-general' => 2,
            'border-style-general' => 'solid',
            'border-top-width-general' => 2,
            'border-top-width-xxl' => 4,
            'border-top-width-xl' => 2,
            'border-right-width-general' => 2,
            'border-right-width-xxl' => 4,
            'border-right-width-xl' => 2,
            'border-bottom-width-general' => 2,
            'border-bottom-width-xxl' => 4,
            'border-bottom-width-xl' => 2,
            'border-left-width-general' => 2,
            'border-left-width-xxl' => 4,
            'border-left-width-xl' => 2,
            'border-sync-width-general' => 'all',
            'border-unit-width-general' => 'px',
            'border-sync-radius-general' => 'all',
            'border-unit-radius-general' => 'px',
            'border-status-hover' => true,
            'border-palette-status-general-hover' => true,
            'border-palette-color-general-hover' => 6,
            'border-palette-opacity-general-hover' => 0,
            'border-top-width-general-hover' => 3,
        ];

        $result = $this->get_block_background_normal_and_hover_styles($attributes);

        $this->assertMatchesJsonSnapshot(json_encode($result));
    }
}
