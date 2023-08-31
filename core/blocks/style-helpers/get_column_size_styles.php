<?php

function get_column_num($columns_size, $unique_id, $breakpoint)
{
    if (!$columns_size) {
        return null;
    }

    $k = 0;
    $acc = 0;
    $column_size_matrix = [];

    foreach ($columns_size as $key => $value) {
        $size = get_last_breakpoint_attribute([
            'target' => 'column-size',
            'breakpoint' => $breakpoint,
            'attributes' => $value,
        ]);

        if ($size) {
            $acc += $size;

            if ($acc > 100) {
                $k += 1;
                $acc = $size;
            }

            if (!isset($column_size_matrix[$k])) {
                $column_size_matrix[$k] = [];
            }

            $column_size_matrix[$k][] = $key;
        }
    }

    $result = [];

    foreach ($column_size_matrix as $column_unique_id) {
        if (in_array($unique_id, $column_unique_id)) {
            $result[] = $column_unique_id;
        }
    }

    return count($result) > 0 ? count($result[0]) : null;
}

function get_column_size_styles($obj, $row_gap_props, $unique_id)
{
    $response = [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

    if(!isset($row_gap_props['row-gap-general'])) {
        $row_gap_props['row-gap-general'] = 20;
    }

    if(!isset($row_gap_props['row-gap-unit-general'])) {
        $row_gap_props['row-gap-unit-general'] = 'px';
    }

    if(!isset($row_gap_props['column-gap-general'])) {
        $row_gap_props['column-gap-general'] = 2.5;
    }
    if(!isset($row_gap_props['column-gap-unit-general'])) {
        $row_gap_props['column-gap-unit-general'] = '%';
    }

    write_log($unique_id);
    write_log('$row_gap_props');
    write_log($row_gap_props);

    foreach ($breakpoints as $breakpoint) {
        $fit_content = get_last_breakpoint_attribute([
            'target' => 'column-fit-content',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]);
        $column_size = get_last_breakpoint_attribute([
            'target' => 'column-size',
            'breakpoint' => $breakpoint,
            'attributes' => $obj,
        ]);

        if ($fit_content) {
            $response[$breakpoint] = [
                'width' => 'fit-content',
                'flex-basis' => 'fit-content',
            ];
        } elseif (is_numeric($column_size) || is_numeric($row_gap_props["column-gap-$breakpoint"])) {
            $column_num = get_column_num(
                $row_gap_props['column_size'],
                $unique_id,
                $breakpoint
            );

            $gap_num = $column_num - 1;
            $gap = (get_last_breakpoint_attribute([
                'target' => 'column-gap',
                'breakpoint' => $breakpoint,
                'attributes' => $row_gap_props,
            ]) * $gap_num) / $column_num;
            write_log('gap');
            write_log($gap);
            $gap_unit = get_last_breakpoint_attribute([
                'target' => 'column-gap-unit',
                'breakpoint' => $breakpoint,
                'attributes' => $row_gap_props,
            ]);
            write_log('gap_unit');
            write_log($gap_unit);

            $gap_value = $gap ? round($gap, 4) . $gap_unit : '0px';

            write_log('gap_value');
            write_log($gap_value);

            $value = $column_size !== 100
                ? "calc({$column_size}% - {$gap_value})"
                : '100%';

            $response[$breakpoint] = [
                'width' => $value,
                'flex-basis' => $value,
            ];
        }
    }

    return $response;
}
