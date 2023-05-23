<?php

function get_column_num($columnsSize, $clientId, $breakpoint) {
	if (!$columnsSize) {
		return null;
	}

	$k = 0;
	$acc = 0;
	$columnSizeMatrix = [];

	foreach ($columnsSize as $key => $value) {
		$size = get_last_breakpoint_attribute(
			'column-size',
			$breakpoint,
			$value,
		);

		if ($size) {
			$acc += $size;

			if ($acc > 100) {
				$k += 1;
				$acc = $size;
			}

			if (!isset($columnSizeMatrix[$k])) {
				$columnSizeMatrix[$k] = [];
			}

			$columnSizeMatrix[$k][] = $key;
		}
	}

	$row = array_filter($columnSizeMatrix, function ($row) use ($clientId) {
		return in_array($clientId, $row);
	});

	return count($row) > 0 ? count($row[0]) : null;
}

function get_column_size_styles($obj, $rowGapProps, $clientId) {
	$response = [];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	foreach ($breakpoints as $breakpoint) {
		$fitContent = get_last_breakpoint_attribute(
			'column-fit-content',
			$breakpoint,
			$obj,
		);
		$columnSize = get_last_breakpoint_attribute(
			'column-size',
			$breakpoint,
			$obj,
		);

		if ($fitContent) {
			$response[$breakpoint] = [
				'width' => 'fit-content',
				'flex-basis' => 'fit-content',
			];
		} elseif (is_numeric($columnSize) || is_numeric($rowGapProps["column-gap-{$breakpoint}"])) {
			$columnNum = get_column_num(
				$rowGapProps['columnsSize'],
				$clientId,
				$breakpoint
			);

			$gapNum = $columnNum - 1;
			$gap = ($rowGapProps['column-gap'] * $gapNum) / $columnNum;
			$gapUnit = $rowGapProps['column-gap-unit'];

			$gapValue = $gap ? round($gap, 4) . $gapUnit : '0px';

			$value = $columnSize !== 100
				? "calc({$columnSize}% - {$gapValue})"
				: '100%';

			$response[$breakpoint] = [
				'width' => $value,
				'flex-basis' => $value,
			];
		}
	}

	return $response;
}
