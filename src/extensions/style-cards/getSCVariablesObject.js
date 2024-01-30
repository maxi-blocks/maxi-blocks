/**
 * Internal dependencies
 */

import getColorRGBAString from '../styles/getColorRGBAString';
import getGroupAttributes from '../styles/getGroupAttributes';
import { getIsValid } from '../styles/utils';
import getLastBreakpointAttribute from '../styles/getLastBreakpointAttribute';
import { getActiveColourFromSC } from '../../editor/style-cards/utils';
import getTypographyStyles from '../styles/helpers/getTypographyStyles';

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
	const SC = {
		dark: {
			...merge(
				{ ...cloneDeep(styleCards?.dark?.defaultStyleCard) },
				{ ...cloneDeep(styleCards?.dark?.styleCard) }
			),
		},
		light: {
			...merge(
				{ ...cloneDeep(styleCards?.light?.defaultStyleCard) },
				{ ...cloneDeep(styleCards?.light?.styleCard) }
			),
		},
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
					if (obj['menu-item-hover-color-global'])
						response[`--maxi-${style}-menu-item-hover`] =
							getColorString(obj, 'menu-item-hover', style);
					if (obj['menu-item-current-color-global'])
						response[`--maxi-${style}-menu-item-current`] =
							getColorString(obj, 'menu-item-current', style);
					if (obj['menu-item-visited-color-global'])
						response[`--maxi-${style}-menu-item-visited`] =
							getColorString(obj, 'menu-item-visited', style);
					else
						response[`--maxi-${style}-menu-item-visited`] =
							getColorString(obj, 'menu-item', style);

					break;

				default:
					break;
			}
		});
		if (SC[style].color) {
			times(8, n => {
				if (SC[style].color[n + 1]) {
					response[`--maxi-${style}-color-${n + 1}`] =
						SC[style].color[n + 1];
				}
			});
		}
	});

	response['--maxi-active-sc-color'] = activeSCColour;

	return response;
};

export default getSCVariablesObject;
