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

/**
 * Styles
 */
import './editor.scss';

/**
 * Component
 */
const ColorControl = props => {
	const {
		label = '',
		className,
		paletteStatus,
		paletteColor,
		paletteOpacity,
		color,
		defaultColorAttributes,
		globalProps,
		onChangeInline,
		onChange,
		isHover,
		deviceType,
		clientId,
		disablePalette,
		blockStyle: rawBlockStyle,
		disableOpacity = false,
		disableColorDisplay = false,
		isToolbar = false,
		prefix = '',
		avoidBreakpointForDefault = false,
		noColorPrefix,
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

	const colorObj = {
		paletteStatus,
		paletteColor,
		paletteOpacity,
		color,
	};

	const onChangeInlineValue = obj =>
		onChangeInline
			? onChangeInline({
					...colorObj,
					...obj,
			  })
			: onChange(obj);

	const getDefaultColorAttribute = target =>
		getDefaultAttribute(
			getAttributeKey(
				target,
				isHover,
				prefix,
				avoidBreakpointForDefault ? '' : deviceType
			)
		);
	const onReset = () => {
		let defaultColorAttr = defaultColorAttributes;

		if (!defaultColorAttr) {
			defaultColorAttr = {};

			defaultColorAttr.paletteStatus =
				getDefaultColorAttribute('palette-status');
			defaultColorAttr.paletteColor =
				getDefaultColorAttribute('palette-color');
			defaultColorAttr.paletteOpacity =
				getDefaultColorAttribute('palette-opacity');
			defaultColorAttr.color = getDefaultColorAttribute('color');
		}

		if (showPalette)
			onChange({
				paletteColor: defaultColorAttr.paletteColor,
			});
		else {
			const defaultColor = `rgba(${getPaletteColor({
				clientId,
				color: paletteColor || defaultColorAttr.paletteColor,
				blockStyle,
			})},${paletteOpacity || 1})`;

			onChange({
				color: defaultColor,
			});
		}
	};

	const onResetOpacity = () => {
		const opacity =
			defaultColorAttributes?.paletteOpacity ??
			getDefaultAttribute(
				getAttributeKey(
					'palette-opacity',
					isHover,
					prefix,
					!avoidBreakpointForDefault ? deviceType : null
				)
			);

		const { color: rgbaColor } = getColorRGBAParts(color);

		onChange({
			paletteOpacity: opacity,
			...(!paletteStatus && {
				color:
					rgbaColor &&
					`rgba(${getColorRGBAParts(color).color},${opacity || 1})`,
			}),
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
					onChange={onChange}
					deviceType={deviceType}
					clientId={clientId}
					disableOpacity={disableOpacity}
					opacity={paletteOpacity}
					className={className}
					onReset={onReset}
					onResetOpacity={onResetOpacity}
					noColorPrefix={noColorPrefix}
				/>
			)}
			{!disablePalette && (
				<ToggleSwitch
					label={__('Set custom colour', 'maxi-blocks')}
					selected={!paletteStatus}
					onChange={val => {
						onChange({
							paletteStatus: !val,
							// If palette is disabled, set custom color from palette one
							...(val
								? {
										color: `rgba(${getPaletteColor({
											clientId,
											color: paletteColor,
											blockStyle,
										})},${paletteOpacity || 1})`,
								  }
								: { color: undefined }),
						});
					}}
				/>
			)}
			{!showPalette && (
				<CustomColorControl
					label={label}
					color={getRGBA(color)}
					onChangeInlineValue={onChangeInlineValue}
					onChangeValue={onChange}
					onReset={onReset}
					onResetOpacity={onResetOpacity}
					disableColorDisplay={disableColorDisplay}
					disableOpacity={disableOpacity}
					clientId={clientId}
					isToolbar={isToolbar}
				/>
			)}
		</div>
	);
};

export default ColorControl;
