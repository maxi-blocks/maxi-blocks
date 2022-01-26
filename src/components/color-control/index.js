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
import {
	getBlockStyle,
	getColorRGBAParts,
	getAttributeKey,
	getDefaultAttribute,
} from '../../extensions/styles';
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
		defaultColorAttributes,
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
		prefix = '',
		useBreakpoint = false,
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

	const onReset = () => {
		let defaultColorAttr = defaultColorAttributes || null;

		if (!defaultColorAttr) {
			if (disablePalette) {
				if (defaultColor)
					onChange({
						color: defaultColor,
					});
			} else {
				defaultColorAttr = {};
				defaultColorAttr.paletteStatus = getDefaultAttribute(
					getAttributeKey(
						'',
						isHover,
						`${prefix}palette-status`,
						useBreakpoint ? 'general' : ''
					)
				);
				defaultColorAttr.paletteColor = getDefaultAttribute(
					getAttributeKey(
						'',
						isHover,
						`${prefix}palette-color`,
						useBreakpoint ? 'general' : ''
					)
				);
				defaultColorAttr.paletteOpacity = getDefaultAttribute(
					getAttributeKey(
						'',
						isHover,
						`${prefix}palette-opacity`,
						useBreakpoint ? 'general' : ''
					)
				);
				defaultColorAttr.color = getDefaultAttribute(
					getAttributeKey(
						'',
						isHover,
						`${prefix}color`,
						useBreakpoint ? 'general' : ''
					)
				);
			}
		}

		if (showPalette)
			onChange({
				paletteStatus: defaultColorAttr.paletteStatus,
				paletteColor: defaultColorAttr.paletteColor,
				paletteOpacity: paletteOpacity || 1,
				color,
			});
		else {
			onChange({
				paletteStatus,
				paletteColor,
				paletteOpacity,
				color: `rgba(${getPaletteColor({
					clientId,
					color: paletteColor || defaultColorAttr.paletteColor,
					blockStyle,
				})},${paletteOpacity || 1})`,
			});
		}
	};

	const onResetOpacity = () => {
		const opacity =
			defaultColorAttributes && defaultColorAttributes.paletteOpacity
				? defaultColorAttributes.paletteOpacity
				: getDefaultAttribute(
						getAttributeKey(
							'',
							isHover,
							`${prefix}palette-opacity`,
							'general'
						)
				  );
		onChange({
			paletteStatus,
			paletteColor,
			paletteOpacity: opacity,
			color: `rgba(${getColorRGBAParts(color).color},${opacity || 1})`,
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
					onReset={onReset}
					onResetOpacity={onResetOpacity}
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
								color: `rgba(${getPaletteColor({
									clientId,
									color: paletteColor,
									blockStyle,
								})},${paletteOpacity || 1})`,
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
					onResetOpacity={onResetOpacity}
					disableColorDisplay={disableColorDisplay}
					disableOpacity={disableOpacity}
					clientId={clientId}
				/>
			)}
		</div>
	);
};

export default ColorControl;
