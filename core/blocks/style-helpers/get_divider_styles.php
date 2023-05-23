<?php

function get_divider_styles($obj, $target, $block_style, $is_hover = false, $prefix = '', $useBottomBorder = false) {
	$response = [
		'label' => 'Divider',
		'general' => [],
	];

    $breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	$get_color = function ($breakpoint) use ($obj, $prefix, $is_hover, $block_style) {
		$paletteStatus = $obj['paletteStatus'];
		$paletteSCStatus = $obj['paletteSCStatus'];
		$palette_color = $obj[$prefix . 'divider-border-' . $breakpoint];
		$palette_opacity = $obj['palette_opacity'];
		$color = $obj['color'];

		if ($paletteStatus && is_numeric($palette_color)) {
			return [
				'border-color' =>$paletteSCStatus ? get_color_rgba_string(
								'color-' . $palette_color,
								$palette_opacity,
                                $block_style,
                )
						: get_color_rgba_string(
								$prefix . 'divider-color',
								'color-' . $palette_color,
								$palette_opacity,
                                $block_style,
				),
			];
		}

		return ['border-color' => $color];
	};

	$get_prev_breakpoint = function ($breakpoint) use ($breakpoints) {
		$index = array_search($breakpoint, $breakpoints);
		return $breakpoints[$index - 1] ?? 'general';
	};

	foreach ($breakpoints as $breakpoint) {
		if ($target === 'line') {
			$is_horizontal =
				get_last_breakpoint_attribute(
					$prefix . 'line-orientation',
					$breakpoint,
					$obj,
					$is_hover
				) === 'horizontal';

			$divider_border_style = get_last_breakpoint_attribute(
				$prefix . 'divider-border-style',
				$breakpoint,
				$obj,
				$is_hover
			);

			$position_horizontal = $useBottomBorder ? 'bottom' : 'top';
			$position_vertical = 'right';

			$divider_line_weight = $is_horizontal
				? get_last_breakpoint_attribute(
						$prefix . 'divider-border-top-width',
						$breakpoint,
						$obj,
						$is_hover
				  )
				: get_last_breakpoint_attribute(
						$prefix . 'divider-border-' . $position_vertical . '-width',
						$breakpoint,
						$obj,
						$is_hover
				  );
			$divider_line_weight_unit =
				get_last_breakpoint_attribute(
					$is_horizontal
						? $prefix . 'divider-border-top-unit'
						: $prefix . 'divider-border-' . $position_vertical . '-unit',
					$breakpoint,
					$obj,
					$is_hover
				) ?? 'px';

			$divider_size = $is_horizontal
				? get_last_breakpoint_attribute(
						$prefix . 'divider-width',
						$breakpoint,
						$obj,
						$is_hover
				  )
				: get_last_breakpoint_attribute(
						$prefix . 'divider-height',
						$breakpoint,
						$obj,
						$is_hover
				  );
			$divider_size_unit =
				get_last_breakpoint_attribute(
					$prefix . 'divider-width-unit',
					$breakpoint,
					$obj,
					$is_hover
				) ?? 'px';

			$divider_border_radius = get_last_breakpoint_attribute(
				$prefix . 'divider-border-radius',
				$breakpoint,
				$obj,
				$is_hover
			);

            $response[$breakpoint] = [
				...$get_color($breakpoint),
            ];

            if ($divider_border_style === 'solid') {
               if($divider_border_radius) {
                    array_push($response[$breakpoint], [
                        'border-radius' => $divider_border_radius . 'px',
                    ]);
               } else if (
                    get_last_breakpoint_attribute(
					    $prefix . 'divider-border-radius',
						$get_prev_breakpoint($breakpoint),
						$obj,
						$is_hover
					)
                ) {
                    array_push($response[$breakpoint], [
                        'border-radius' => '0px',
                    ]);
               } 
            }

            if($is_horizontal) {
                array_push($response[$breakpoint], [
                    'border-' . $position_horizontal . '-style' => $divider_border_style,
                    'border-' . $position_vertical . '-style' => 'none',
                ]);

                if(isset($divider_line_weight)) {
                    array_push($response[$breakpoint], [
                        'border-' . $position_horizontal . '-width' => $divider_line_weight . $divider_line_weight_unit,
                        'height' => $divider_line_weight . $divider_line_weight_unit,
                    ]);
                }

                if(isset($divider_size)) {
                    array_push($response[$breakpoint], [
                        'width' => $divider_size . $divider_size_unit,
                    ]);
                }
            } else {
                array_push($response[$breakpoint], [
                    'border-' . $position_horizontal . '-style' => 'none',
                    'border-' . $position_vertical . '-style' => $divider_border_style,
                ]);

                if(isset($divider_line_weight)) {
                    array_push($response[$breakpoint], [
                        'border-' . $position_vertical . '-width' => $divider_line_weight . $divider_line_weight_unit,
                        'width' => $divider_line_weight . $divider_line_weight_unit,
                    ]);
                }

                if(isset($divider_size)) {
                    array_push($response[$breakpoint], [
                        'height' => $divider_size . $divider_size_unit,
                    ]);
                }
            }

		} else {
			$response[$breakpoint] = [
				'flex-direction' => 'row',
				'align-items' => $obj['line-vertical-' . $breakpoint]
					? $obj['line-vertical-' . $breakpoint]
					: get_last_breakpoint_attribute(
							$prefix . 'line-vertical',
							$breakpoint,
							$obj,
							$is_hover
					  ),
				'justify-content' => $obj['line-horizontal-' . $breakpoint]
					? $obj['line-horizontal-' . $breakpoint]
					: get_last_breakpoint_attribute(
							$prefix . 'line-horizontal',
							$breakpoint,
							$obj,
							$is_hover
					  ),
			];
		}
	}

	return $response;
}
