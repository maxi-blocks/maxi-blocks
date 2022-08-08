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
			onChange={obj => {
				const isNeededType = isHover
					? svgType === 'Filled'
					: svgType !== 'Shape';

				const lineColorStr =
					obj.paletteStatus ??
					props[`svg-line-palette-status${isHover ? '-hover' : ''}`]
						? isNeededType &&
						  getColorRGBAString({
								firstVar: 'icon-stroke',
								secondVar: `color-${
									obj.paletteColor ??
									props[
										`svg-line-palette-color${
											isHover ? '-hover' : ''
										}`
									]
								}`,
								opacity: 1,
								blockStyle,
						  })
						: obj.paletteColor ??
						  props[
								`svg-line-palette-color${
									isHover ? '-hover' : ''
								}`
						  ];

				if (isHover)
					onChangeHoverStroke({
						...('color' in obj && {
							'svg-line-color-hover': obj.color,
						}),
						...('paletteColor' in obj && {
							'svg-line-palette-color-hover': obj.paletteColor,
						}),
						...('paletteStatus' in obj && {
							'svg-line-palette-status-hover': obj.paletteStatus,
						}),
						content: setSVGContentHover(
							content,
							lineColorStr,
							'stroke'
						),
					});
				else
					onChangeStroke({
						...('color' in obj && {
							'svg-line-color': obj.color,
						}),
						...('paletteColor' in obj && {
							'svg-line-palette-color': obj.paletteColor,
						}),
						...('paletteStatus' in obj && {
							'svg-line-palette-status': obj.paletteStatus,
						}),
						content: setSVGContent(content, lineColorStr, 'stroke'),
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
			onChange={obj => {
				const isNeededType = isHover
					? svgType === 'Filled'
					: svgType !== 'Line';

				const fillColorStr =
					obj.paletteStatus ??
					props[`svg-fill-palette-status${isHover ? '-hover' : ''}`]
						? isNeededType &&
						  getColorRGBAString({
								firstVar: 'icon-fill',
								secondVar: `color-${
									obj.paletteColor ??
									props[
										`svg-fill-palette-color${
											isHover ? '-hover' : ''
										}`
									]
								}`,
								opacity: 1,
								blockStyle,
						  })
						: obj.paletteColor ??
						  props[
								`svg-fill-palette-color${
									isHover ? '-hover' : ''
								}`
						  ];

				if (isHover)
					onChangeHoverFill({
						...('color' in obj && {
							'svg-fill-color-hover': obj.color,
						}),
						...('paletteColor' in obj && {
							'svg-fill-palette-color-hover': obj.paletteColor,
						}),
						...('paletteStatus' in obj && {
							'svg-fill-palette-status-hover': obj.paletteStatus,
						}),
						content: setSVGContentHover(
							content,
							fillColorStr,
							'fill'
						),
					});
				else
					onChangeFill({
						...('color' in obj && {
							'svg-fill-color': obj.color,
						}),
						...('paletteColor' in obj && {
							'svg-fill-palette-color': obj.paletteColor,
						}),
						...('paletteStatus' in obj && {
							'svg-fill-palette-status': obj.paletteStatus,
						}),
						content:
							fillColorStr &&
							setSVGContent(content, fillColorStr, 'fill'),
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
		disableHover = false,
	} = props;
	const hoverStatus = props['svg-status-hover'];

	const normalSvgColor = (
		<>
			{svgType !== 'Line' && (
				<SvgColor
					{...props}
					type='fill'
					label={__('Icon fill', 'maxi-blocks')}
					onChangeInline={obj => onChangeInline(obj, '[data-fill]')}
				/>
			)}
			{svgType !== 'Shape' && (
				<SvgColor
					{...props}
					type='line'
					label={__('Icon line', 'maxi-blocks')}
					onChangeInline={obj => onChangeInline(obj, '[data-stroke]')}
				/>
			)}
		</>
	);

	const ignoreIndicatorResponsive = ['svg-width', 'svg-stroke'];

	return !disableHover ? (
		<SettingTabsControl
			items={[
				{
					label: __('Normal state', 'maxi-blocks'),
					content: normalSvgColor,
					ignoreIndicatorResponsive,
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
					ignoreIndicatorResponsive,
				},
			]}
		/>
	) : (
		normalSvgColor
	);
};
