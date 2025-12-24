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
import extractRGBValues from './extractRGBValues';

/**
 * External dependencies
 */
import { cloneDeep, merge, times, isEmpty } from 'lodash';
import {
	styleMap,
	elementMap,
	settingMap,
	breakpointMap,
} from '../../../config/css-optimization/variable-map';

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
									`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap[setting]}-${breakpointMap[breakpoint]}`
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
										`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap[setting]}-${breakpointMap[breakpoint]}`
									] = `${getLastBreakpointAttribute({
										target: setting,
										breakpoint,
										attributes: obj,
									})}${unitValue}`;
								} else {
									response[
										`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap[setting]}-${breakpointMap[breakpoint]}`
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
										`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap[setting]}-${breakpointMap[breakpoint]}`
									] = value;
								else {
									// Padding
									const unitSetting = `${setting}-unit`;
									const unitValue =
										obj[`${unitSetting}-${breakpoint}`];
									if (unitValue) {
										response[
											`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap[setting]}-${breakpointMap[breakpoint]}`
										] = `${value}${unitValue}`;
									} else {
										response[
											`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap[setting]}-${breakpointMap[breakpoint]}`
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
									`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap[setting]}-${breakpointMap[breakpoint]}`
								],
								true
							)
						) {
							// In case there's no button font-family, use the paragraph one
							if (
								element === 'button' &&
								isEmpty(
									response[
										`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap[setting]}-${breakpointMap[breakpoint]}`
									].replaceAll('"', '')
								)
							) {
								const pObj = getParsedObj(SC[style].p);

								if (!cleanResponse)
									response[
										`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap[setting]}-${breakpointMap[breakpoint]}`
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
											`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap[setting]}-${breakpointMap[breakpoint]}`
										] = value;
								}
							} else {
								response[
									`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap[setting]}-${breakpointMap[breakpoint]}`
								] = `"${
									response[
										`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap[setting]}-${breakpointMap[breakpoint]}`
									]
								}"`.replaceAll('""', '"'); // Fix for values that already have quotes
							}
						}
					});
				});

			if (obj['color-global'])
				response[`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap.color}`] = getColorString(
					obj,
					null,
					style
				);
			switch (element) {
				case 'button':
					if (obj['background-color-global'])
						response[
							`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap['background-color']}`
						] = getColorString(obj, 'background', style);

					if (obj['hover-background-color-global'])
						response[
							`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap['background-color']}-${settingMap.hover}`
						] = getColorString(obj, 'hover-background', style);
					if (obj['hover-color-global'])
						response[`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap.color}-${settingMap.hover}`] =
							getColorString(obj, 'hover', style);

					if (obj['border-color-global'])
						response[`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap['border-color']}`] =
							getColorString(obj, 'border', style);
					if (obj['hover-border-color-global'])
						response[
							`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap['border-color']}-${settingMap.hover}`
						] = getColorString(obj, 'hover-border', style);

					break;

				case 'icon':
					if (obj['line-color-global'])
						response[`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap.stroke}`] =
							getColorString(obj, 'line', style);

					if (obj['fill-color-global'])
						response[`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap.fill}`] =
							getColorString(obj, 'fill', style);

					if (obj['hover-line-color-global'])
						response[`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap.stroke}-${settingMap.hover}`] =
							getColorString(obj, 'hover-line', style);

					if (obj['hover-fill-color-global'])
						response[`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap.fill}-${settingMap.hover}`] =
							getColorString(obj, 'hover-fill', style);

					break;

				case 'link':
					if (obj['link-color-global'])
						response[`--maxi-${styleMap[style]}-${elementMap[element]}`] = getColorString(
							obj,
							'link',
							style
						);
					if (obj['hover-color-global'])
						response[`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap.hover}`] = getColorString(
							obj,
							'hover',
							style
						);
					if (obj['active-color-global'])
						response[`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap.active}`] =
							getColorString(obj, 'active', style);
					if (obj['visited-color-global'])
						response[`--maxi-${styleMap[style]}-${elementMap[element]}-${settingMap.visited}`] =
							getColorString(obj, 'visited', style);

					break;

				case 'navigation':
					if (obj['menu-item-color-global'])
						response[`--maxi-${styleMap[style]}-${settingMap['menu-item']}`] = getColorString(
							obj,
							'menu-item',
							style
						);
					if (obj['menu-burger-color-global'])
						response[`--maxi-${styleMap[style]}-${settingMap['menu-burger']}`] =
							getColorString(obj, 'menu-burger', style);
					if (obj['menu-item-hover-color-global'])
						response[`--maxi-${styleMap[style]}-${settingMap['menu-item']}-${settingMap.hover}`] =
							getColorString(obj, 'menu-item-hover', style);
					if (obj['menu-item-current-color-global'])
						response[`--maxi-${styleMap[style]}-${settingMap['menu-item']}-${settingMap.current}`] =
							getColorString(obj, 'menu-item-current', style);
					if (obj['menu-item-visited-color-global'])
						response[`--maxi-${styleMap[style]}-${settingMap['menu-item']}-${settingMap.visited}`] =
							getColorString(obj, 'menu-item-visited', style);
					else if (obj['menu-item-color-global'])
						response[`--maxi-${styleMap[style]}-${settingMap['menu-item']}-${settingMap.visited}`] =
							getColorString(obj, 'menu-item', style);
					if (obj['menu-item-sub-bg-color-global'])
						response[`--maxi-${styleMap[style]}-${settingMap['menu-item-sub-bg']}`] =
							getColorString(obj, 'menu-item-sub-bg', style);
					if (obj['menu-item-sub-bg-hover-color-global'])
						response[`--maxi-${styleMap[style]}-${settingMap['menu-item-sub-bg']}-${settingMap.hover}`] =
							getColorString(
								obj,
								'menu-item-sub-bg-hover',
								style
							);
					if (obj['menu-item-sub-bg-current-color-global'])
						response[`--maxi-${styleMap[style]}-${settingMap['menu-item-sub-bg']}-${settingMap.current}`] =
							getColorString(
								obj,
								'menu-item-sub-bg-current',
								style
							);
					if (obj['menu-mobile-bg-color-global'])
						response[`--maxi-${styleMap[style]}-${settingMap['menu-mobile-bg']}`] =
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
					response[`--maxi-${styleMap[style]}-${settingMap.color}-${n + 1}`] =
						SC[style].color[n + 1];
				}
			});

			// Add custom colors to CSS variables - Enhanced handling
			// Custom colors are now expected to be {id: numericGeneratedId, value: string, name: string}
			const customColorsSource =
				styleCards?.[style]?.styleCard?.color?.customColors ||
				styleCards?.color?.customColors || // Check root color.customColors first
				SC[style]?.color?.customColors || // Then SC[style].color.customColors
				SC[style]?.styleCard?.color?.customColors || // Redundant with first line, but for safety
				SC.color?.customColors || // Then SC.color.customColors (global for both styles if specific not found)
				styleCards?.[style]?.defaultStyleCard?.color?.customColors ||
				SC[style]?.defaultStyleCard?.color?.customColors ||
				styleCards?.[style === 'light' ? 'dark' : 'light']?.styleCard
					?.color?.customColors ||
				SC[style === 'light' ? 'dark' : 'light']?.styleCard?.color
					?.customColors ||
				styleCards?.[style === 'light' ? 'dark' : 'light']
					?.defaultStyleCard?.color?.customColors ||
				SC[style === 'light' ? 'dark' : 'light']?.defaultStyleCard
					?.color?.customColors ||
				[];

			const finalCustomColorsArray = Array.isArray(customColorsSource)
				? customColorsSource
				: [];

			if (finalCustomColorsArray.length > 0) {
				finalCustomColorsArray.forEach(colorObj => {
					if (
						!colorObj ||
						typeof colorObj.id !== 'number' ||
						typeof colorObj.value !== 'string'
					)
						return; // Skip malformed

					// Use the numeric colorObj.id directly for the CSS variable
					response[`--maxi-${styleMap[style]}-${settingMap.color}-${colorObj.id}`] =
						extractRGBValues(colorObj.value);
				});
			}
		}
	});

	response['--maxi-active-sc-color'] = activeSCColour;

	return response;
};

export default getSCVariablesObject;
