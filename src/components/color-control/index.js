/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';

/**
 * Internal dependencies
 */
import CustomColorControl from './customColorControl';
import ColorPaletteControl from './paletteControl';
import ToggleSwitch from '../toggle-switch';
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
		blockStyle: rawBlockStyle,
		disableOpacity = false,
		disableColorDisplay = false,
	} = props;

	const blockStyle = rawBlockStyle
		? rawBlockStyle.replace('maxi-', '')
		: getBlockStyle(clientId);

	const classes = classnames(
		'maxi-color-control',
		!disablePalette &&
			paletteStatus &&
			`maxi-color-palette-control maxi-color-palette--${blockStyle}`,
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

	/**
	 * TODO: reset is working just on Custom Color and when pressing
	 * the reset of the opacity, which is not much UX.
	 *
	 * https://github.com/yeahcan/UX-UI/issues/8
	 */
	const onReset = () => {
		if (defaultColor) onChange(defaultColor);

		onChange({
			paletteStatus,
			paletteColor,
			paletteOpacity,
			color: `rgba(${getPaletteColor(
				clientId,
				paletteColor,
				blockStyle
			)},${paletteOpacity || 1})`,
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
				<ToggleSwitch
					label={__('Set custom colour', 'maxi-blocks')}
					selected={!paletteStatus}
					onChange={val => {
						onChangeValue({
							paletteStatus: !val,
							// If palette is disabled, set custom color from palette one
							...(val && {
								color: `rgba(${getPaletteColor(
									clientId,
									paletteColor,
									blockStyle
								)},${paletteOpacity || 1})`,
							}),
							// If palette is set, save the custom color opacity
							...(!disableOpacity &&
								!val && {
									paletteOpacity:
										tinycolor(color).getAlpha() ||
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
