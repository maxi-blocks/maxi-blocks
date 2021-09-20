/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import CustomColorControl from './customColorControl';
import ColorPaletteControl from './paletteControl';
import FancyRadioControl from '../fancy-radio-control';
import { getBlockStyle, getColorRGBAParts } from '../../extensions/styles';
import { getPaletteColor } from '../../extensions/style-cards';

/**
 * External dependencies
 */
import classnames from 'classnames';
import tinycolor from 'tinycolor2';

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const ColorControl = props => {
	const {
		label,
		className,
		paletteStatus,
		paletteColor,
		paletteOpacity,
		color,
		defaultColor,
		globalProps,
		onChange,
		isHover,
		deviceType,
		clientId,
		disablePalette,
		disableOpacity = false,
		disableColorDisplay = false,
	} = props;

	const classes = classnames(
		'maxi-color-control',
		!disablePalette &&
			`maxi-color-palette-control maxi-color-palette--${getBlockStyle(
				clientId
			)}`,
		className
	);

	const showPalette = !disablePalette && paletteStatus;

	/**
	 * Creates an object with the color variables with RGBA format
	 */
	const getRGBA = colorString =>
		getColorRGBAParts(colorString, true) || {
			rgb: { r: 1, g: 1, b: 1, a: 1 },
		};

	const onChangeValue = obj =>
		onChange({
			paletteStatus,
			paletteColor,
			paletteOpacity,
			color,
			...obj,
		});

	const onReset = () => {
		if (defaultColor) onChange(defaultColor);

		onChange({
			paletteStatus,
			paletteColor,
			paletteOpacity,
			color: `rgba(${getPaletteColor(clientId, paletteColor)},${
				paletteOpacity / 100 || 1
			})`,
		});
	};

	return (
		<div className={classes}>
			{showPalette && (
				<ColorPaletteControl
					label={label}
					value={paletteColor}
					globalProps={globalProps}
					isHover={isHover}
					onChange={obj => onChangeValue(obj)}
					deviceType={deviceType}
					clientId={clientId}
					disableOpacity={disableOpacity}
					opacity={paletteOpacity}
					className={className}
				/>
			)}
			{!disablePalette && (
				<FancyRadioControl
					label={__('Custom Colour', 'maxi-blocks')}
					className='maxi-sc-color-palette__custom'
					selected={paletteStatus}
					options={[
						{ label: __('Yes', 'maxi-blocks'), value: 0 },
						{ label: __('No', 'maxi-blocks'), value: 1 },
					]}
					onChange={val => {
						onChangeValue({
							paletteStatus: val,
							// If palette is disabled, set custom color from palette one
							...(!val && {
								color: `rgba(${getPaletteColor(
									clientId,
									paletteColor
								)},${paletteOpacity / 100 || 1})`,
							}),
							// If palette is set, save the custom color opacity
							...(!disableOpacity &&
								val && {
									paletteOpacity:
										tinycolor(color).getAlpha() * 100 ||
										paletteOpacity,
								}),
						});
					}}
				/>
			)}
			{!showPalette && (
				<CustomColorControl
					label={label}
					color={getRGBA(color)}
					onChangeValue={onChangeValue}
					onReset={onReset}
					disableColorDisplay={disableColorDisplay}
					disableOpacity={disableOpacity}
					clientId={clientId}
				/>
			)}
		</div>
	);
};

export default ColorControl;
