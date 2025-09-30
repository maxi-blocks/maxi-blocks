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

	useEffect(() => {
		if (globalStatus && !paletteStatus)
			onChange({
				paletteSCStatus: true,
				paletteStatus,
				paletteColor,
				paletteOpacity,
				color,
			});
	}, [globalStatus]);

	// Force palette mode when paletteOnly is enabled
	useEffect(() => {
		if (paletteOnly && !paletteStatus) {
			onChange({
				paletteStatus: true,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paletteOnly]);

	// When paletteOnly is enabled, ensure we can edit even if a style card is active
	useEffect(() => {
		if (paletteOnly && globalStatus && !paletteSCStatus) {
			onChange({
				paletteSCStatus: true,
			});
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [paletteOnly, globalStatus]);

	const showPalette = (!disablePalette && paletteStatus) || paletteOnly;

	/**
	 * Creates an object with the color variables with RGBA format
	 */
	const getRGBA = colorString =>
		getColorRGBAParts(colorString, true) || {
			rgb: { r: 1, g: 1, b: 1, a: 1 },
		};

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

	const onChangeInlineValue = obj =>
		onChangeInline
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
					onChange={val => {
						// Prevent enabling custom colour when a style card lock is active
						if (globalStatus && !paletteSCStatus && val) return;
						let initialCustomColor = 'transparent';
						if (val) {
							if (
								typeof paletteColor === 'number' &&
								customColors
							) {
								if (paletteColor >= 1 && paletteColor <= 8) {
									initialCustomColor = `rgba(${getPaletteColor(
										{
											clientId,
											color: paletteColor,
											blockStyle,
										}
									)},${paletteOpacity || 1})`;
								} else {
									const matchedCustomColor =
										customColors.find(
											cc => cc.id === paletteColor
										);
									if (matchedCustomColor) {
										initialCustomColor =
											matchedCustomColor.value;
									} else if (
										color &&
										typeof color === 'string'
									) {
										initialCustomColor = color;
									}
								}
							} else if (color && typeof color === 'string') {
								initialCustomColor = color;
							}
						}

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
