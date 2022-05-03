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
} from '../../extensions/styles';

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
				if (isHover)
					onChangeHoverStroke({
						'svg-line-color-hover': color,
						'svg-line-palette-color-hover': paletteColor,
						'svg-line-palette-status-hover': paletteStatus,
					});
				else
					onChangeStroke({
						'svg-line-color': color,
						'svg-line-palette-color': paletteColor,
						'svg-line-palette-status': paletteStatus,
					});
			}}
			globalProps={{
				target: `${isHover ? 'hover-' : ''}line`,
				type: 'icon',
			}}
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
				if (isHover)
					onChangeHoverFill({
						'svg-fill-color-hover': color,
						'svg-fill-palette-color-hover': paletteColor,
						'svg-fill-palette-status-hover': paletteStatus,
					});
				else
					onChangeFill({
						'svg-fill-color': color,
						'svg-fill-palette-color': paletteColor,
						'svg-fill-palette-status': paletteStatus,
					});
			}}
			globalProps={{
				target: `${isHover ? 'hover-' : ''}fill`,
				type: 'icon',
			}}
			disableOpacity
		/>
	);
};

export const SvgColorControl = props => {
	const { onChangeInline, svgType, maxiSetAttributes } = props;
	const hoverStatus = props['svg-status-hover'];

	return (
		<SettingTabsControl
			items={[
				{
					label: __('Normal state', 'maxi-blocks'),
					content: (
						<>
							{svgType !== 'Line' && (
								<SvgColor
									{...props}
									type='fill'
									label={__('SVG Fill', 'maxi-blocks')}
									onChangeInline={obj =>
										onChangeInline(obj, '[data-fill]')
									}
								/>
							)}
							{svgType !== 'Shape' && (
								<SvgColor
									{...props}
									type='line'
									label={__('SVG Line', 'maxi-blocks')}
									onChangeInline={obj =>
										onChangeInline(obj, '[data-stroke]')
									}
								/>
							)}
						</>
					),
				},
				{
					label: __('Hover state', 'maxi-blocks'),
					content: (
						<>
							<ToggleSwitch
								label={__(
									'Enable SVG Colour Hover',
									'maxi-blocks'
								)}
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
												'SVG Fill',
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
												'SVG Line',
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
	);
};
