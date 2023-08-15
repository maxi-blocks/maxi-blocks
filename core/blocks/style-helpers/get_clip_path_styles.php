<?php

function get_clip_path_styles($params)
{
    if (!is_array($params) || !isset($params['obj'])) {
        return [];
    }
    $obj = $params['obj'];
    $is_hover = isset($params['is_hover']) ? $params['is_hover'] : false;
    $is_IB = isset($params['is_IB']) ? $params['is_IB'] : false;

    $response = [];

    $omit_clip_path = !$is_hover && !$is_IB;

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $current_clip_path =  get_last_breakpoint_attribute([
        'target' => 'clip-path',
        'breakpoint' => $breakpoint,
        'attributes' => $obj,
        'is_hover' => $is_hover,
    ]);

        $omit_clip_path = $omit_clip_path ? $current_clip_path === 'none' : false;

        if ($omit_clip_path) {
            continue;
        }

        $response[$breakpoint] = [];

        if ($current_clip_path &&
            (
                $is_hover ?
                $obj['clip-path-status-hover'] :
                get_last_breakpoint_attribute([
                    'target' => 'clip-path-status',
                    'breakpoint' => $breakpoint,
                    'attributes' => $obj,
                    'is_hover' => $is_hover,
              ])
            )
        ) {
            $response[$breakpoint]['clip-path'] = $current_clip_path;
        }
    }

    return $response;
}
