/**
 * Internal dependencies
 */

import getColorRGBAString from '@extensions/styles/getColorRGBAString';
import getGroupAttributes from '@extensions/styles/getGroupAttributes';
import { getIsValid } from '@extensions/styles/utils';
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';
import { getActiveColourFromSC } from '@editor/style-cards/utils';
import getTypographyStyles from '@extensions/styles/helpers/getTypographyStyles';
import replaceUndefinedWithNull from './utils';

/**
 * External dependencies
 */
import { cloneDeep, merge, times, isEmpty } from 'lodash';

const getColorString = (obj, target, style) => {
	const prefix = target ? `${target}-` : '';
	const paletteStatus = obj[`${prefix}palette-status`];
	const paletteColor = obj[`${prefix}palette-color`];
	const paletteOpacity = obj[`${prefix}palette-opacity`];
	const color = obj[`${prefix}color`];

	return paletteStatus
		? getColorRGBAString({
				firstVar: `color-${paletteColor}`,
				blockStyle: style,
				opacity: paletteOpacity,
		  })
		: color;
};

const getParsedObj = obj => {
	const newObj = { ...cloneDeep(obj) };

	const typographyObj = getGroupAttributes(
		newObj,
		'typography',
		false,
		'',
		true
	);

	Object.keys(typographyObj).forEach(key => delete newObj[key]);

	Object.entries(
		getTypographyStyles({
			obj: typographyObj,
			disableGlobals: true,
			isStyleCards: true,
		})
	).forEach(([breakpoint, value]) => {
		Object.entries(value).forEach(([key, val]) => {
			newObj[`${key}-${breakpoint}`] = val;
		});
	});

	return newObj;
};

/**
 * Extract RGB values from a color string to use in CSS variables
 *
 * @param {string} colorValue - The color string (rgba, hex, etc.)
 * @return {string} The RGB values as a comma-separated string
 */
const extractRGBValues = colorValue => {
	// Extract RGB values if it's an rgba format
	if (colorValue.startsWith('rgba(') || colorValue.startsWith('rgb(')) {
		const matches = colorValue.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/);
		if (matches && matches.length >= 4) {
			return `${matches[1]}, ${matches[2]}, ${matches[3]}`;
		}
	} else if (colorValue.startsWith('#')) {
		// Convert HEX to RGB
		const hex = colorValue.slice(1);
		// Handle both 3-digit and 6-digit hex codes
		const fullHex =
			hex.length === 3
				? `${hex[0]}${hex[0]}${hex[1]}${hex[1]}${hex[2]}${hex[2]}`
				: hex;

		// Parse hex values to RGB without bitwise operations
		const r = parseInt(fullHex.substring(0, 2), 16);
		const g = parseInt(fullHex.substring(2, 4), 16);
		const b = parseInt(fullHex.substring(4, 6), 16);
		return `${r}, ${g}, ${b}`;
	}

	// Return as is if no pattern matches
	return colorValue;
};

const getSCVariablesObject = (
	styleCards,
	rawActiveSCColour,
	cleanResponse = false
) => {
	const response = {};
	const styles = ['light', 'dark'];
	const elements = [
		'button',
		'p',
		'h1',
		'h2',
		'h3',
		'h4',
		'h5',
		'h6',
		'icon',
		'divider',
		'link',
		'navigation',
	];
	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];
	const settings = [
		'font-family',
		'font-size',
		'font-style',
		'font-weight',
		'line-height',
		'text-decoration',
		'text-transform',
		'letter-spacing',
		'white-space',
		'word-spacing',
		'margin-bottom',
		'text-indent',
		'padding-bottom',
		'padding-top',
		'padding-left',
		'padding-right',
	];

	const mergeStyleCards = (defaultStyleCard, styleCard) =>
		merge(
			{
				...cloneDeep(replaceUndefinedWithNull(defaultStyleCard)),
			},
			{
				...cloneDeep(replaceUndefinedWithNull(styleCard)),
			}
		);

	const SC = {
		dark: mergeStyleCards(
			styleCards?.dark?.defaultStyleCard,
			styleCards?.dark?.styleCard
		),
		light: mergeStyleCards(
			styleCards?.light?.defaultStyleCard,
			styleCards?.light?.styleCard
		),
	};
	const elementsForColor = ['divider', 'icon', 'link'];

	const activeSCColour =
		rawActiveSCColour ?? getActiveColourFromSC(styleCards, 4);

	styles.forEach(style => {
		elements.forEach(element => {
			const obj = getParsedObj(SC[style][element]);
			if (!elementsForColor.includes(element))
				settings.forEach(setting => {
					const isFontFamily = setting === 'font-family';

					breakpoints.forEach(breakpoint => {
						if (!cleanResponse) {
							if (!setting.includes('padding'))
								response[
									`--maxi-${style}-${element}-${setting}-${breakpoint}`
								] = getLastBreakpointAttribute({
									target: setting,
									breakpoint,
									attributes: obj,
								});
							else {
								const unitSetting = `${setting}-unit`;
								const unitValue = getLastBreakpointAttribute({
									target: unitSetting,
									breakpoint,
									attributes: obj,
								});
								if (unitValue) {
									response[
										`--maxi-${style}-${element}-${setting}-${breakpoint}`
									] = `${getLastBreakpointAttribute({
										target: setting,
										breakpoint,
										attributes: obj,
									})}${unitValue}`;
								} else {
									response[
										`--maxi-${style}-${element}-${setting}-${breakpoint}`
									] = `${getLastBreakpointAttribute({
										target: setting,
										breakpoint,
										attributes: obj,
									})}px`;
								}
							}
						} else {
							const value = obj[`${setting}-${breakpoint}`];

							if (getIsValid(value, true)) {
								if (!setting.includes('padding'))
									response[
										`--maxi-${style}-${element}-${setting}-${breakpoint}`
									] = value;
								else {
									// Padding
									const unitSetting = `${setting}-unit`;
									const unitValue =
										obj[`${unitSetting}-${breakpoint}`];
									if (unitValue) {
										response[
											`--maxi-${style}-${element}-${setting}-${breakpoint}`
										] = `${value}${unitValue}`;
									} else {
										response[
											`--maxi-${style}-${element}-${setting}-${breakpoint}`
										] = `${value}px`;
									}
								}
							}
						}

						// Font family needs quotes for values that has space in middle
						if (
							isFontFamily &&
							getIsValid(
								response[
									`--maxi-${style}-${element}-${setting}-${breakpoint}`
								],
								true
							)
						) {
							// In case there's no button font-family, use the paragraph one
							if (
								element === 'button' &&
								isEmpty(
									response[
										`--maxi-${style}-${element}-${setting}-${breakpoint}`
									].replaceAll('"', '')
								)
							) {
								const pObj = getParsedObj(SC[style].p);

								if (!cleanResponse)
									response[
										`--maxi-${style}-${element}-${setting}-${breakpoint}`
									] = getLastBreakpointAttribute({
										target: setting,
										breakpoint,
										attributes: pObj,
									});
								else {
									const value =
										pObj[`${setting}-${breakpoint}`];

									if (getIsValid(value, true))
										response[
											`--maxi-${style}-${element}-${setting}-${breakpoint}`
										] = value;
								}
							} else {
								response[
									`--maxi-${style}-${element}-${setting}-${breakpoint}`
								] = `"${
									response[
										`--maxi-${style}-${element}-${setting}-${breakpoint}`
									]
								}"`.replaceAll('""', '"'); // Fix for values that already have quotes
							}
						}
					});
				});

			if (obj['color-global'])
				response[`--maxi-${style}-${element}-color`] = getColorString(
					obj,
					null,
					style
				);
			switch (element) {
				case 'button':
					if (obj['background-color-global'])
						response[
							`--maxi-${style}-${element}-background-color`
						] = getColorString(obj, 'background', style);

					if (obj['hover-background-color-global'])
						response[
							`--maxi-${style}-${element}-background-color-hover`
						] = getColorString(obj, 'hover-background', style);
					if (obj['hover-color-global'])
						response[`--maxi-${style}-${element}-color-hover`] =
							getColorString(obj, 'hover', style);

					if (obj['border-color-global'])
						response[`--maxi-${style}-${element}-border-color`] =
							getColorString(obj, 'border', style);
					if (obj['hover-border-color-global'])
						response[
							`--maxi-${style}-${element}-border-color-hover`
						] = getColorString(obj, 'hover-border', style);

					break;

				case 'icon':
					if (obj['line-color-global'])
						response[`--maxi-${style}-${element}-stroke`] =
							getColorString(obj, 'line', style);

					if (obj['fill-color-global'])
						response[`--maxi-${style}-${element}-fill`] =
							getColorString(obj, 'fill', style);

					if (obj['hover-line-color-global'])
						response[`--maxi-${style}-${element}-stroke-hover`] =
							getColorString(obj, 'hover-line', style);

					if (obj['hover-fill-color-global'])
						response[`--maxi-${style}-${element}-fill-hover`] =
							getColorString(obj, 'hover-fill', style);

					break;

				case 'link':
					if (obj['link-color-global'])
						response[`--maxi-${style}-link`] = getColorString(
							obj,
							'link',
							style
						);
					if (obj['hover-color-global'])
						response[`--maxi-${style}-link-hover`] = getColorString(
							obj,
							'hover',
							style
						);
					if (obj['active-color-global'])
						response[`--maxi-${style}-link-active`] =
							getColorString(obj, 'active', style);
					if (obj['visited-color-global'])
						response[`--maxi-${style}-link-visited`] =
							getColorString(obj, 'visited', style);

					break;

				case 'navigation':
					if (obj['menu-item-color-global'])
						response[`--maxi-${style}-menu-item`] = getColorString(
							obj,
							'menu-item',
							style
						);
					if (obj['menu-burger-color-global'])
						response[`--maxi-${style}-menu-burger`] =
							getColorString(obj, 'menu-burger', style);
					if (obj['menu-item-hover-color-global'])
						response[`--maxi-${style}-menu-item-hover`] =
							getColorString(obj, 'menu-item-hover', style);
					if (obj['menu-item-current-color-global'])
						response[`--maxi-${style}-menu-item-current`] =
							getColorString(obj, 'menu-item-current', style);
					if (obj['menu-item-visited-color-global'])
						response[`--maxi-${style}-menu-item-visited`] =
							getColorString(obj, 'menu-item-visited', style);
					else if (obj['menu-item-color-global'])
						response[`--maxi-${style}-menu-item-visited`] =
							getColorString(obj, 'menu-item', style);
					if (obj['menu-item-sub-bg-color-global'])
						response[`--maxi-${style}-menu-item-sub-bg`] =
							getColorString(obj, 'menu-item-sub-bg', style);
					if (obj['menu-item-sub-bg-hover-color-global'])
						response[`--maxi-${style}-menu-item-sub-bg-hover`] =
							getColorString(
								obj,
								'menu-item-sub-bg-hover',
								style
							);
					if (obj['menu-item-sub-bg-current-color-global'])
						response[`--maxi-${style}-menu-item-sub-bg-current`] =
							getColorString(
								obj,
								'menu-item-sub-bg-current',
								style
							);
					if (obj['menu-mobile-bg-color-global'])
						response[`--maxi-${style}-menu-mobile-bg`] =
							getColorString(obj, 'menu-mobile-bg', style);

					break;

				default:
					break;
			}
		});
		if (SC[style].color) {
			// Add standard palette colors
			times(8, n => {
				if (SC[style].color[n + 1]) {
					response[`--maxi-${style}-color-${n + 1}`] =
						SC[style].color[n + 1];
				}
			});

			// Add custom colors to CSS variables - Enhanced handling
			const customColors =
				styleCards?.[style]?.styleCard?.color?.customColors ||
				styleCards?.color?.customColors ||
				SC[style].color.customColors ||
				[];

			if (customColors.length > 0) {
				customColors.forEach((colorValue, index) => {
					if (!colorValue) return; // Skip empty colors

					// Add the CSS variable with extracted RGB values
					response[`--maxi-${style}-color-custom-${index}`] =
						extractRGBValues(colorValue);
				});
			}
		}
	});

	response['--maxi-active-sc-color'] = activeSCColour;

	return response;
};

export default getSCVariablesObject;
