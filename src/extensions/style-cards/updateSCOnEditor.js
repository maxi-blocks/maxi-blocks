/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import {
	getColorRGBAString,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../styles';
import { loadFonts } from '../text/fonts';
import { getSiteEditorIframe } from '../fse';
import { getActiveColourFromSC } from '../../editor/style-cards/utils';

/**
 * External dependencies
 */
import { cloneDeep, isArray, isEmpty, merge, times, uniq } from 'lodash';
import { getTypographyStyles } from '../styles/helpers';

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

export const getSCVariablesObject = (
	styleCards,
	activeSCColour = getActiveColourFromSC(styleCards, 4)
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

	styles.forEach(style => {
		elements.forEach(element => {
			const obj = getParsedObj(SC[style][element]);
			if (!elementsForColor.includes(element))
				settings.forEach(setting => {
					breakpoints.forEach(breakpoint => {
						response[
							`--maxi-${style}-${element}-${setting}-${breakpoint}`
						] = getLastBreakpointAttribute({
							target: setting,
							breakpoint,
							attributes: obj,
						});
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

export const createSCStyleString = SCObject => {
	let response = ':root{';

	Object.entries(SCObject).forEach(([key, val]) => {
		if (val) response += `${key}:${val};`;
	});

	response += '}';

	return response;
};

const getSCFontsData = obj => {
	const response = {};
	let fontName = '';

	Object.entries(obj).forEach(([key, val]) => {
		if (key.includes('font-family')) {
			fontName = val;
			response[fontName] = response[fontName] ?? {
				weight: [],
				style: [],
			};
		}
		if (key.includes('font-weight'))
			response[fontName].weight.push(val?.toString());

		if (key.includes('font-style')) response[fontName].style.push(val);
	});

	if (!isEmpty(response)) {
		Object.entries(response).forEach(([key, val]) => {
			const fontWeight = uniq(val.weight).join();
			const fontStyle = uniq(val.style).join();

			if (fontStyle === 'normal') delete response[key].style;
			else response[key].style = fontStyle;

			response[key].weight = fontWeight;
		});
	}

	return response;
};

const updateSCOnEditor = (
	styleCards,
	activeSCColour,
	rawElements = [document, getSiteEditorIframe()]
) => {
	const SCObject = getSCVariablesObject(
		{ ...cloneDeep(styleCards) },
		activeSCColour
	);
	const allSCFonts = getSCFontsData(SCObject);

	const elements = isArray(rawElements) ? rawElements : [rawElements];

	elements.forEach(element => {
		if (!element) return;

		let SCStyle = element.getElementById('maxi-blocks-sc-vars-inline-css');
		if (!SCStyle) {
			SCStyle = element.createElement('style');
			SCStyle.id = 'maxi-blocks-sc-vars-inline-css';
			SCStyle.innerHTML = createSCStyleString(SCObject);
			// Iframe on creation generates head, then gutenberg generates their own head
			// and in some moment we have two heads, so we need to add SC only to head which is second(gutenberg one)
			const elementHead = Array.from(
				element.querySelectorAll('head')
			).pop();
			elementHead?.appendChild(SCStyle);
			const { saveSCStyles } = dispatch('maxiBlocks/style-cards');

			// Needs a delay, if not Redux returns error 3
			setTimeout(() => saveSCStyles(false), 150);
		} else SCStyle.innerHTML = createSCStyleString(SCObject);

		if (!isEmpty(allSCFonts)) loadFonts(allSCFonts, false, element);
	});
};

export default updateSCOnEditor;
