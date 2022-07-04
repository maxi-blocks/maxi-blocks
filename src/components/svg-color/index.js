/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import SettingTabsControl from '../setting-tabs-control';
import ToggleSwitch from '../toggle-switch';
import {
	getGroupAttributes,
	setHoverAttributes,
	getColorRGBAString,
} from '../../extensions/styles';
import { setSVGContent, setSVGContentHover } from '../../extensions/svg';

/**
 * SvgColor
 */
export const SvgColor = props => {
	const {
		type,
		label,
		onChangeInline = null,
		onChangeFill,
		onChangeStroke,
		onChangeHoverFill,
		onChangeHoverStroke,
		isHover = false,
		svgType,
		blockStyle,
		content,
	} = props;

	return type === 'line' ? (
		<ColorControl
			label={label}
			isHover={isHover}
			className='maxi-color-control__SVG-line-color'
			color={
				isHover
					? props['svg-line-color-hover']
					: props['svg-line-color']
			}
			prefix='svg-line-'
			avoidBreakpointForDefault
			paletteColor={
				isHover
					? props['svg-line-palette-color-hover']
					: props['svg-line-palette-color']
			}
			paletteStatus={
				isHover
					? props['svg-line-palette-status-hover']
					: props['svg-line-palette-status']
			}
			onChangeInline={({ color }) =>
				onChangeInline &&
				onChangeInline({ stroke: color }, '[data-stroke]')
			}
			onChange={({ color, paletteColor, paletteStatus }) => {
				const isNeededType = isHover
					? svgType === 'Filled'
					: svgType !== 'Shape';

				const lineColorStr =
					isNeededType &&
					getColorRGBAString({
						firstVar: 'icon-stroke',
						secondVar: `color-${paletteColor}`,
						opacity: 1,
						blockStyle,
					});

				if (isHover)
					onChangeHoverStroke({
						'svg-line-color-hover': color,
						'svg-line-palette-color-hover': paletteColor,
						'svg-line-palette-status-hover': paletteStatus,
						content: setSVGContentHover(
							content,
							paletteStatus ? lineColorStr : paletteColor,
							'stroke'
						),
					});
				else
					onChangeStroke({
						'svg-line-color': color,
						'svg-line-palette-color': paletteColor,
						'svg-line-palette-status': paletteStatus,
						content: setSVGContent(
							content,
							paletteStatus ? lineColorStr : paletteColor,
							'stroke'
						),
					});
			}}
			globalProps={{
				target: `${isHover ? 'hover-' : ''}line`,
				type: 'icon',
			}}
			noColorPrefix
			disableOpacity
		/>
	) : (
		<ColorControl
			label={label}
			isHover={isHover}
			className='maxi-color-control__SVG-fill-color'
			color={
				isHover
					? props['svg-fill-color-hover']
					: props['svg-fill-color']
			}
			prefix='svg-fill-'
			avoidBreakpointForDefault
			paletteColor={
				isHover
					? props['svg-fill-palette-color-hover']
					: props['svg-fill-palette-color']
			}
			paletteStatus={
				isHover
					? props['svg-fill-palette-status-hover']
					: props['svg-fill-palette-status']
			}
			onChangeInline={({ color }) =>
				onChangeInline && onChangeInline({ fill: color }, '[data-fill]')
			}
			onChange={({ color, paletteColor, paletteStatus }) => {
				const isNeededType = isHover
					? svgType === 'Filled'
					: svgType !== 'Line';

				const fillColorStr =
					isNeededType &&
					getColorRGBAString({
						firstVar: 'icon-fill',
						secondVar: `color-${paletteColor}`,
						opacity: 1,
						blockStyle,
					});

				if (isHover)
					onChangeHoverFill({
						'svg-fill-color-hover': color,
						'svg-fill-palette-color-hover': paletteColor,
						'svg-fill-palette-status-hover': paletteStatus,
						content: setSVGContentHover(
							content,
							paletteStatus ? fillColorStr : paletteColor,
							'fill'
						),
					});
				else
					onChangeFill({
						'svg-fill-color': color,
						'svg-fill-palette-color': paletteColor,
						'svg-fill-palette-status': paletteStatus,
						content:
							fillColorStr &&
							setSVGContent(
								content,
								paletteStatus ? fillColorStr : paletteColor,
								'fill'
							),
					});
			}}
			globalProps={{
				target: `${isHover ? 'hover-' : ''}fill`,
				type: 'icon',
			}}
			noColorPrefix
			disableOpacity
		/>
	);
};

export const SvgColorControl = props => {
	const {
		onChangeInline,
		svgType,
		maxiSetAttributes,
		cleanInlineStyles,
		disableHover = false,
	} = props;
	const hoverStatus = props['svg-status-hover'];
	console.log(svgType);

	const onChangeProps = {
		onChangeFill: obj => {
			maxiSetAttributes(obj);
			if (svgType !== 'Line') cleanInlineStyles('[data-fill]');
		},
		onChangeStroke: obj => {
			maxiSetAttributes(obj);

			if (svgType !== 'Shape') cleanInlineStyles('[data-stroke]');
		},
		onChangeHoverFill: obj => {
			maxiSetAttributes(obj);
		},
		onChangeHoverStroke: obj => {
			maxiSetAttributes(obj);
		},
	};
	const normalSvgColor = (
		<>
			{svgType !== 'Line' && (
				<SvgColor
					{...props}
					{...onChangeProps}
					type='fill'
					label={__('Icon fill', 'maxi-blocks')}
					onChangeInline={obj => onChangeInline(obj, '[data-fill]')}
				/>
			)}
			{svgType !== 'Shape' && (
				<SvgColor
					{...props}
					{...onChangeProps}
					type='line'
					label={__('Icon line', 'maxi-blocks')}
					onChangeInline={obj => onChangeInline(obj, '[data-stroke]')}
				/>
			)}
		</>
	);

	return !disableHover ? (
		<SettingTabsControl
			items={[
				{
					label: __('Normal state', 'maxi-blocks'),
					content: normalSvgColor,
				},
				{
					label: __('Hover state', 'maxi-blocks'),
					content: (
						<>
							<ToggleSwitch
								label={__('Enable hover colour', 'maxi-blocks')}
								selected={hoverStatus}
								className='maxi-svg-status-hover'
								onChange={val => {
									maxiSetAttributes({
										...(val &&
											setHoverAttributes(
												{
													...getGroupAttributes(
														props,
														'svg',
														false
													),
												},
												{
													...getGroupAttributes(
														props,
														'svg',
														true
													),
												}
											)),
										'svg-status-hover': val,
									});
								}}
							/>
							{hoverStatus && (
								<>
									{svgType !== 'Line' && (
										<SvgColor
											{...props}
											{...onChangeProps}
											type='fill'
											label={__(
												'Icon fill hover',
												'maxi-blocks'
											)}
											onChangeInline={null}
											isHover
										/>
									)}
									{svgType !== 'Shape' && (
										<SvgColor
											{...props}
											{...onChangeProps}
											type='line'
											label={__(
												'Icon line hover',
												'maxi-blocks'
											)}
											onChangeInline={null}
											isHover
										/>
									)}
								</>
							)}
						</>
					),
				},
			]}
		/>
	) : (
		normalSvgColor
	);
};
