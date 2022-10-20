/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import ColorControl from '../color-control';
import ManageHoverTransitions from '../manage-hover-transitions';
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

	const onChange = val => {
		const { color, paletteColor, paletteStatus } = val;

		const isNeededType = isHover
			? svgType === 'Filled'
			: type === 'line'
			? svgType !== 'Shape'
			: svgType !== 'Line';

		const paletteStr = type === 'line' ? 'stroke' : 'fill';
		const colorStr =
			isNeededType &&
			getColorRGBAString({
				firstVar: `icon-${paletteStr}`,
				secondVar: `color-${paletteColor}`,
				opacity: 1,
				blockStyle,
			});
		const onChangeObject = {
			[`svg-${type}-color${isHover ? '-hover' : ''}`]: color,
			[`svg-${type}-palette-color${isHover ? '-hover' : ''}`]:
				paletteColor,
			[`svg-${type}-palette-status${isHover ? '-hover' : ''}`]:
				paletteStatus,
			content: (isHover ? setSVGContentHover : setSVGContent)(
				content,
				paletteStatus ? colorStr : color,
				paletteStr
			),
		};

		if (type === 'line') {
			(isHover ? onChangeHoverStroke : onChangeStroke)(onChangeObject);
		} else {
			(isHover ? onChangeHoverFill : onChangeFill)(onChangeObject);
		}
	};

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
			onChange={onChange}
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
			onChange={onChange}
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

	const onChangeProps = {
		onChangeFill: obj => {
			maxiSetAttributes(obj);

			if (cleanInlineStyles && svgType !== 'Line')
				cleanInlineStyles('[data-fill]');
		},
		onChangeStroke: obj => {
			maxiSetAttributes(obj);

			if (cleanInlineStyles && svgType !== 'Shape')
				cleanInlineStyles('[data-stroke]');
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
							<ManageHoverTransitions />

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
