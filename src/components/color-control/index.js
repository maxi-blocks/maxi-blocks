/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useSelect } from '@wordpress/data';
import { useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import CustomColorControl from './customColorControl';
import ColorPaletteControl from './paletteControl';
import ToggleSwitch from '@components/toggle-switch';
import {
	getBlockStyle,
	getColorRGBAParts,
	getAttributeKey,
	getDefaultAttribute,
} from '@extensions/styles';
import { getPaletteColor } from '@extensions/style-cards';

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
		label = '',
		className,
		paletteStatus,
		paletteSCStatus,
		paletteColor,
		paletteOpacity,
		color,
		defaultColorAttributes,
		onReset,
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
		paletteOnly = false,
	} = props;

	const {
		globalStatus,
		globalPaletteColor,
		globalPaletteOpacity,
		customColors,
	} = useSelect(select => {
		const { receiveSelectedStyleCardValue } = select(
			'maxiBlocks/style-cards'
		);

		const prefix = globalProps?.target
			? isHover && !globalProps?.target.includes('hover')
				? `hover-${globalProps?.target}-`
				: `${globalProps?.target}-`
			: '';

		const globalStatus = globalProps
			? receiveSelectedStyleCardValue(
					`${prefix}color-global`,
					globalProps ? getBlockStyle(clientId) : null,
					globalProps?.type
			  )
			: false;
		const globalPaletteColor = globalProps
			? receiveSelectedStyleCardValue(
					`${prefix}palette-color`,
					globalProps ? getBlockStyle(clientId) : null,
					globalProps?.type
			  )
			: false;
		const globalPaletteOpacity = globalProps
			? receiveSelectedStyleCardValue(
					`${prefix}palette-opacity`,
					globalProps ? getBlockStyle(clientId) : null,
					globalProps?.type
			  )
			: false;
		const customColors =
			receiveSelectedStyleCardValue('customColors', null, 'color') || [];

		return {
			globalStatus,
			globalPaletteColor,
			globalPaletteOpacity: globalPaletteOpacity || 1,
			customColors,
		};
	});

	const blockStyle = rawBlockStyle
		? rawBlockStyle.replace('maxi-', '')
		: getBlockStyle(clientId);

	const classes = classnames(
		'maxi-color-control',
		!disablePalette &&
			(paletteStatus || paletteOnly) &&
			`maxi-color-palette-control maxi-color-palette--${blockStyle}`,
		className
	);

	/**
	 * Creates an object with the color variables with RGBA format
	 */
	const getRGBA = colorString =>
		getColorRGBAParts(colorString, true) || {
			rgb: { r: 1, g: 1, b: 1, a: 1 },
		};

	/**
	 * Computes the initial custom colour with opacity applied consistently.
	 * Extracted for testability and to simplify the ToggleSwitch handler.
	 */
	const getInitialCustomColor = ({
		paletteColor: pColor,
		customColors: cColors,
		color: currentColor,
		paletteOpacity: pOpacity,
		clientId: cId,
		blockStyle: bStyle,
	}) => {
		const opacity = pOpacity || 1;

		if (typeof pColor === 'number' && cColors) {
			// Standard palette colours (1-8)
			if (pColor >= 1 && pColor <= 8) {
				return `rgba(${getPaletteColor({
					clientId: cId,
					color: pColor,
					blockStyle: bStyle,
				})},${opacity})`;
			}

			// Custom colours from style card
			const matchedCustomColor = cColors.find(cc => cc.id === pColor);
			if (matchedCustomColor) {
				// Apply opacity consistently for custom colours
				const tc = tinycolor(matchedCustomColor.value);
				tc.setAlpha(opacity);
				return tc.toRgbString();
			}
		}

		// Fallback to existing color string with opacity applied
		if (currentColor && typeof currentColor === 'string') {
			const tc = tinycolor(currentColor);
			tc.setAlpha(opacity);
			return tc.toRgbString();
		}

		return 'transparent';
	};

	// Define colorObj and onChangeValue BEFORE useEffects that use them
	const colorObj = {
		paletteStatus,
		paletteSCStatus,
		paletteColor,
		paletteOpacity,
		color,
	};

	const onChangeValue = obj =>
		onChange({
			...colorObj,
			...obj,
		});

	useEffect(() => {
		if (globalStatus && !paletteStatus)
			onChangeValue({
				paletteSCStatus: true,
			});
	}, [globalStatus, paletteStatus, onChange, paletteColor, paletteOpacity, paletteSCStatus, color]);

	// Force palette mode when paletteOnly is enabled
	useEffect(() => {
		if (paletteOnly && !paletteStatus) {
			onChangeValue({
				paletteStatus: true,
			});
		}
	}, [paletteOnly, paletteStatus, onChange, paletteColor, paletteOpacity, paletteSCStatus, color]);

	// When paletteOnly is enabled, ensure we can edit even if a style card is active
	useEffect(() => {
		if (paletteOnly && globalStatus && !paletteSCStatus) {
			onChangeValue({
				paletteSCStatus: true,
			});
		}
	}, [paletteOnly, globalStatus, paletteSCStatus, onChange, paletteStatus, paletteColor, paletteOpacity, color]);

	const showPalette = (!disablePalette && paletteStatus) || paletteOnly;

	const onChangeInlineValue = obj =>
		typeof onChangeInline === 'function'
			? onChangeInline({
					...colorObj,
					...obj,
			  })
			: onChangeValue(obj);

	const onResetValues = () => {
		if (onReset)
			onReset({
				showPalette,
				paletteStatus,
				paletteSCStatus,
				paletteColor,
				paletteOpacity,
				color,
			});
		else {
			let defaultColorAttr = defaultColorAttributes;

			if (!defaultColorAttr) {
				defaultColorAttr = {};

				const getDefaultColorAttribute = target =>
					getDefaultAttribute(
						getAttributeKey(
							target,
							isHover,
							prefix,
							avoidBreakpointForDefault ? '' : deviceType
						)
					);

				defaultColorAttr.paletteStatus =
					getDefaultColorAttribute('palette-status');
				defaultColorAttr.paletteSCStatus =
					getDefaultColorAttribute('palette-sc-status');
				defaultColorAttr.paletteColor =
					getDefaultColorAttribute('palette-color');
				defaultColorAttr.paletteOpacity =
					getDefaultColorAttribute('palette-opacity');
				defaultColorAttr.color = getDefaultColorAttribute('color');
			}

			if (showPalette)
				onChange({
					paletteStatus: defaultColorAttr.paletteStatus,
					paletteColor: defaultColorAttr.paletteColor,
					paletteOpacity: paletteOpacity || 1,
					color,
				});
			else {
				let defaultColor;

				if (typeof paletteColor === 'number' && paletteColor >= 1000) {
					const customIndex = paletteColor - 1000;
					defaultColor =
						customColors?.[customIndex]?.value ||
						color ||
						'rgba(0, 0, 0, 1)';
				} else {
					defaultColor = `rgba(${getPaletteColor({
						clientId,
						color: paletteColor,
						blockStyle,
					})},${paletteOpacity || 1})`;
				}

				onChange({
					paletteStatus,
					paletteColor,
					paletteOpacity,
					color: defaultColor,
					isReset: true,
				});
			}
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

		onChange({
			paletteStatus,
			paletteSCStatus,
			paletteColor,
			paletteOpacity: opacity,
			...(color && {
				color: `rgba(${getColorRGBAParts(color).color},${
					opacity || 1
				})`,
			}),
			isReset: true,
		});
	};

	return (
		<div className={classes}>
			{globalStatus && (
				<ToggleSwitch
					label={__('Override style card palette', 'maxi-blocks')}
					selected={paletteSCStatus}
					onChange={val =>
						onChangeValue({
							paletteSCStatus: val,
							// If SC palette status is disabled, and palette status is also disabled,
							// we need to ensure we set the palettes back to show the SC global property
							...(!val &&
								!paletteStatus && {
									paletteStatus: true,
									color: `rgba(${getPaletteColor({
										clientId,
										color: paletteColor,
										blockStyle,
									})},${paletteOpacity || 1})`,
								}),
						})
					}
				/>
			)}
			{/* Disabled wrapper should not include the Set custom colour toggle so that users can always deselect back to palette */}
			<div
				className={classnames(
					globalStatus &&
						!paletteSCStatus &&
						!paletteOnly &&
						'maxi-color-control--disabled'
				)}
			>
				{showPalette && (
					<ColorPaletteControl
						label={label}
						value={paletteColor}
						paletteSCStatus={paletteSCStatus}
						onChange={obj => onChangeValue(obj)}
						disableOpacity={disableOpacity}
						opacity={paletteOpacity}
						onReset={onResetValues}
						onResetOpacity={onResetOpacity}
						globalStatus={globalStatus}
						globalPaletteColor={globalPaletteColor}
						globalPaletteOpacity={globalPaletteOpacity}
					/>
				)}
				{!showPalette && (
					<CustomColorControl
						label={label}
						color={getRGBA(color)}
						onChangeInlineValue={onChangeInlineValue}
						onChangeValue={onChangeValue}
						onReset={onResetValues}
						onResetOpacity={onResetOpacity}
						disableColorDisplay={disableColorDisplay}
						disableOpacity={disableOpacity}
						clientId={clientId}
						isToolbar={isToolbar}
					/>
				)}
			</div>
			{/* Keep Set custom colour toggle outside disabled wrapper so it can always be toggled off */}
			{!disablePalette && !paletteOnly && (
				<ToggleSwitch
					label={__('Set custom colour', 'maxi-blocks')}
					selected={!paletteStatus}
					// Disable toggle when style card lock prevents enabling custom colour
					disabled={globalStatus && !paletteSCStatus && paletteStatus}
					onChange={val => {
						const initialCustomColor = val
							? getInitialCustomColor({
									paletteColor,
									customColors,
									color,
									paletteOpacity,
									clientId,
									blockStyle,
							  })
							: 'transparent';

						onChangeValue({
							paletteStatus: !val,
							...(val && {
								color: initialCustomColor,
							}),
							...(!disableOpacity &&
								!val &&
								color && {
									paletteOpacity:
										tinycolor(color).getAlpha() ||
										paletteOpacity,
								}),
						});
					}}
				/>
			)}
		</div>
	);
};

export default ColorControl;
