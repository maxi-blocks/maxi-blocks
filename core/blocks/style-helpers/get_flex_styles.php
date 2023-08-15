<?php
function get_flex_styles(array $obj)
{
    $response = [];
    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    foreach ($breakpoints as $breakpoint) {
        $flex_basis = get_last_breakpoint_attribute([
            'target' => 'flex-basis',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]);
        if (isset($flex_basis) && !in_array($flex_basis, ['content', 'max-content', 'min-content', 'fit-content'])) {
            $flex_basis = $flex_basis . get_last_breakpoint_attribute([
                    'target' => 'flex-basis-unit',
                    'breakpoint' => $breakpoint,
                    'attributes' => $obj,
                ]);
        }

        $flex_grow = get_last_breakpoint_attribute([
            'target' => 'flex-grow',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]);

        $flex_shrink = get_last_breakpoint_attribute([
            'target' => 'flex-shrink',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]);

        $flex_wrap = get_last_breakpoint_attribute([
            'target' => 'flex-wrap',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]);

        $flex_order = get_last_breakpoint_attribute([
            'target' => 'order',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]);

        $justify_content = get_last_breakpoint_attribute([
            'target' => 'justify-content',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]);

        $flex_direction = get_last_breakpoint_attribute([
            'target' => 'flex-direction',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]);

        $align_items = get_last_breakpoint_attribute([
            'target' => 'align-items',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]);

        $align_content = get_last_breakpoint_attribute([
            'target' => 'align-content',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]);

        $row_gap_props = get_last_breakpoint_attribute([
            'target' => 'row-gap',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]);

        $column_gap = get_last_breakpoint_attribute([
            'target' => 'column-gap',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]);


        if (isset($flex_basis) || isset($flex_grow) || isset($flex_shrink)) {
            $response[$breakpoint]['flex'] = ($flex_grow ?? '') . ' ' . ($flex_shrink ?? '') . ' ' . ($flex_basis ?? '');
        }
        if (isset($flex_wrap)) {
            $response[$breakpoint]['flex-wrap'] = $flex_wrap;
        }
        if (isset($flex_order)) {
            $response[$breakpoint]['order'] = $flex_order;
        }
        if (isset($justify_content)) {
            $response[$breakpoint]['justify-content'] = $justify_content;
        }
        if (isset($flex_direction)) {
            $response[$breakpoint]['flex-direction'] = $flex_direction;
        }
        if (isset($align_items)) {
            $response[$breakpoint]['align-items'] = $align_items;
        }
        if (isset($align_content)) {
            $response[$breakpoint]['align-content'] = $align_content;
        }
        if (isset($row_gap_props)) {
            $response[$breakpoint]['row-gap'] = ($row_gap_props ?? '') . get_last_breakpoint_attribute([ 'target' => 'row-gap-unit', 'breakpoint' => $breakpoint, 'attributes' => $obj]);
        }
        if (isset($column_gap)) {
            $response[$breakpoint]['column-gap'] = ($column_gap ?? '') . get_last_breakpoint_attribute([ 'target' => 'column-gap-unit', 'breakpoint' => $breakpoint, 'attributes' => $obj]);
        }

        if (empty($response[$breakpoint])) {
            unset($response[$breakpoint]);
        }
    }

    return $response;
}
