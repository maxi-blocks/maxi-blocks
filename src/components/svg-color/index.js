/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

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
const SvgColor = props => {
	const { type, label, onChange, isHover = false } = props;

	return (
		<>
			{type === 'line' ? (
				<ColorControl
					label={label}
					isHover={isHover}
					className='maxi-color-control__SVG-line-color'
					color={props['svg-line-color']}
					prefix='svg-line-'
					paletteColor={props['svg-line-palette-color']}
					paletteStatus={props['svg-line-palette-status']}
					onChange={({ color, paletteColor, paletteStatus }) => {
						onChange({
							'svg-line-color': color,
							'svg-line-palette-color': paletteColor,
							'svg-line-palette-status': paletteStatus,
						});
					}}
					globalProps={{
						target: 'line',
						type: 'icon',
					}}
					disableOpacity
				/>
			) : (
				<ColorControl
					label={label}
					isHover={isHover}
					className='maxi-color-control__SVG-fill-color'
					color={props['svg-fill-color']}
					prefix='svg-fill-'
					paletteColor={props['svg-fill-palette-color']}
					paletteStatus={props['svg-fill-palette-status']}
					onChange={({ color, paletteColor, paletteStatus }) => {
						onChange({
							'svg-fill-color': color,
							'svg-fill-palette-color': paletteColor,
							'svg-fill-palette-status': paletteStatus,
						});
					}}
					globalProps={{
						target: 'fill',
						type: 'icon',
					}}
					disableOpacity
				/>
			)}
		</>
	);
};

const SvgColorControl = props => {
	const { onChange, svgType, maxiSetAttributes } = props;
	const [hoverStatus, setHoverStatus] = useState(props['svg-status-hover']);

	return (
		<SettingTabsControl
			items={[
				{
					label: __('Normal state', 'maxi-blocks'),
					content: (
						<>
							{svgType !== 'Line' && (
								<SvgColor
									type='fill'
									label={__('SVG Fill', 'maxi-blocks')}
									onChange={onChange}
									{...props}
								/>
							)}
							{svgType !== 'Shape' && (
								<SvgColor
									type='line'
									label={__('SVG Line', 'maxi-blocks')}
									onChange={onChange}
									{...props}
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
									console.log(val);
									setHoverStatus(val);
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
											type='fill'
											label={__(
												'SVG Fill',
												'maxi-blocks'
											)}
											onChange={onChange}
											isHover
											{...props}
										/>
									)}
									{svgType !== 'Shape' && (
										<SvgColor
											type='line'
											label={__(
												'SVG Line',
												'maxi-blocks'
											)}
											onChange={onChange}
											isHover
											{...props}
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

export default SvgColorControl;
