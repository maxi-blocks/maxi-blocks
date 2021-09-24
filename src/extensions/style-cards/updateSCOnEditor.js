/**
 * WordPress dependencies
 */
import { dispatch } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getGroupAttributes, getLastBreakpointAttribute } from '../styles';

/**
 * External dependencies
 */
import { times, isEmpty, merge, cloneDeep } from 'lodash';
import { getTypographyStyles } from '../styles/helpers';

const getParsedObj = obj => {
	const newObj = cloneDeep(obj);

	const typographyObj = getGroupAttributes(
		newObj,
		'typography',
		false,
		'',
		true
	);

	Object.keys(typographyObj).forEach(key => delete newObj[key]);

	Object.entries(getTypographyStyles({ obj: typographyObj })).forEach(
		([breakpoint, value]) => {
			Object.entries(value).forEach(([key, val]) => {
				newObj[`${key}-${breakpoint}`] = val;
			});
		}
	);

	return newObj;
};

export const getSCVariablesObject = styleCards => {
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
	];
	const SC = {
		dark: {
			...merge(
				{ ...cloneDeep(styleCards.dark.defaultStyleCard) },
				{ ...cloneDeep(styleCards.dark.styleCard) }
			),
		},
		light: {
			...merge(
				{ ...cloneDeep(styleCards.light.defaultStyleCard) },
				{ ...cloneDeep(styleCards.light.styleCard) }
			),
		},
	};
	const settingsToAvoidInGeneral = [
		'font-size',
		'line-height',
		'letter-spacing',
	];
	const elementsForColor = ['divider', 'icon', 'link'];

	styles.forEach(style => {
		elements.forEach(element => {
			const obj = getParsedObj(SC[style][element]);

			if (!elementsForColor.includes(element))
				settings.forEach(setting => {
					breakpoints.forEach(breakpoint => {
						if (
							!(
								breakpoint === 'general' &&
								settingsToAvoidInGeneral.includes(setting)
							)
						)
							response[
								`--maxi-${style}-${element}-${setting}-${breakpoint}`
							] = getLastBreakpointAttribute(
								setting,
								breakpoint,
								obj
							);
					});
				});

			if (obj['color-global'] && !isEmpty(obj.color))
				response[`--maxi-${style}-${element}-color`] = obj.color;

			switch (element) {
				case 'button':
					if (
						obj['background-color-global'] &&
						!isEmpty(obj['background-color'])
					)
						response[
							`--maxi-${style}-${element}-background-color`
						] = obj['background-color'];

					if (
						obj['hover-background-color-global'] &&
						!isEmpty(obj['hover-background-color'])
					)
						response[
							`--maxi-${style}-${element}-background-color-hover`
						] = obj['hover-background-color'];

					if (
						obj['hover-color-global'] &&
						!isEmpty(obj['hover-color'])
					)
						response[`--maxi-${style}-${element}-color-hover`] =
							obj['hover-color'];

					if (
						obj['border-color-global'] &&
						!isEmpty(obj['border-color'])
					)
						response[`--maxi-${style}-${element}-border-color`] =
							obj['border-color'];
					if (
						obj['hover-border-color-global'] &&
						!isEmpty(obj['hover-border-color'])
					)
						response[
							`--maxi-${style}-${element}-border-color-hover`
						] = obj['hover-border-color'];

					break;

				case 'icon':
					if (obj['line-global'] && !isEmpty(obj.line))
						response[`--maxi-${style}-${element}-line`] = obj.line;

					if (obj['fill-global'] && !isEmpty(obj.fill))
						response[`--maxi-${style}-${element}-fill`] = obj.fill;

					break;

				case 'link':
					if (obj['link-color-global'])
						response[`--maxi-${style}-link`] = obj['link-color'];
					if (obj['hover-color-global'])
						response[`--maxi-${style}-link-hover`] =
							obj['hover-color'];
					if (obj['active-color-global'])
						response[`--maxi-${style}-link-active`] =
							obj['active-color'];
					if (obj['visited-color-global'])
						response[`--maxi-${style}-link-visited`] =
							obj['visited-color'];

					break;

				default:
					return false;
			}
		});

		times(8, n => {
			response[`--maxi-${style}-color-${n + 1}`] = SC[style].color[n + 1];
		});
	});

	return response;
};

export const createSCStyleString = SCObject => {
	let response = ':root{';

	Object.entries(SCObject).forEach(([key, val]) => {
		response += `${key}:${val};`;
	});

	response += '}';

	return response;
};

const updateSCOnEditor = styleCards => {
	const SCObject = getSCVariablesObject({ ...cloneDeep(styleCards) });
	let SCStyle = document.getElementById('maxi-blocks-sc-vars-inline-css');

	if (!SCStyle) {
		SCStyle = document.createElement('style');
		SCStyle.id = 'maxi-blocks-sc-vars-inline-css';
		SCStyle.innerHTML = createSCStyleString(SCObject);
		document.head.appendChild(SCStyle);

		const { saveSCStyles } = dispatch('maxiBlocks/style-cards');
		saveSCStyles(false);
	} else SCStyle.innerHTML = createSCStyleString(SCObject);
};

export default updateSCOnEditor;
