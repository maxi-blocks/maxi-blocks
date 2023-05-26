/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getActiveColourFromSC } from '../../editor/style-cards/utils';
import {
	getAttributesValue,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../attributes';
import { getSiteEditorIframe } from '../fse';
import { getColorRGBAString } from '../styles';
import { getTypographyStyles } from '../styles/helpers';
import { loadFonts } from '../text/fonts';

/**
 * External dependencies
 */
import { cloneDeep, isArray, isEmpty, merge, times, uniq } from 'lodash';

const getColorString = (obj, target, style) => {
	const prefix = target ? `${target}-` : '';
	const paletteStatus = getAttributesValue({
		target: '_ps',
		prefix,
		props: obj,
	});
	const paletteColor = getAttributesValue({
		target: '_pc',
		prefix,
		props: obj,
	});
	const paletteOpacity = getAttributesValue({
		target: '_po',
		prefix,
		props: obj,
	});
	const color = getAttributesValue({
		target: '_cc',
		prefix,
		props: obj,
	});

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
		true,
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

			if (obj['_col.g'])
				response[`--maxi-${style}-${element}-color`] = getColorString(
					obj,
					null,
					style
				);
			switch (element) {
				case 'button':
					if (obj['bc.g'])
						response[
							`--maxi-${style}-${element}-background-color`
						] = getColorString(obj, 'b', style);

					if (obj['h-bc.g'])
						response[
							`--maxi-${style}-${element}-background-color-hover`
						] = getColorString(obj, 'h-b', style);
					if (obj['h_col.g'])
						response[`--maxi-${style}-${element}-color-hover`] =
							getColorString(obj, 'h', style);

					if (obj['bo_col.g'])
						response[`--maxi-${style}-${element}-border-color`] =
							getColorString(obj, 'bo', style);
					if (obj['h-bo_col.g'])
						response[
							`--maxi-${style}-${element}-border-color-hover`
						] = getColorString(obj, 'h-bo', style);

					break;

				case 'icon':
					if (obj['li_col.g'])
						response[`--maxi-${style}-${element}-stroke`] =
							getColorString(obj, 'li', style);

					if (obj['f_col.g'])
						response[`--maxi-${style}-${element}-fill`] =
							getColorString(obj, 'f', style);

					if (obj['h-li_col.g'])
						response[`--maxi-${style}-${element}-stroke-hover`] =
							getColorString(obj, 'h-li', style);

					if (obj['h-f_col.g'])
						response[`--maxi-${style}-${element}-fill-hover`] =
							getColorString(obj, 'h-f', style);

					break;

				case 'link':
					if (obj['_l_col.g'])
						response[`--maxi-${style}-link`] = getColorString(
							obj,
							'_l',
							style
						);
					if (obj['h_col.g'])
						response[`--maxi-${style}-link-hover`] = getColorString(
							obj,
							'h',
							style
						);
					if (obj['a_col.g'])
						response[`--maxi-${style}-link-active`] =
							getColorString(obj, 'a', style);
					if (obj['vi_col.g'])
						response[`--maxi-${style}-link-visited`] =
							getColorString(obj, 'vi', style);

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
