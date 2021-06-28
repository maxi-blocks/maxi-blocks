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
		'hover',
		'divider',
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
				{ ...styleCards.dark.defaultStyleCard },
				{ ...styleCards.dark.styleCard }
			),
		},
		light: {
			...merge(
				{ ...styleCards.light.defaultStyleCard },
				{ ...styleCards.light.styleCard }
			),
		},
	};
	const settingsToAvoidInGeneral = [
		'font-size',
		'line-height',
		'letter-spacing',
	];
	const elementsForColor = ['divider', 'hover'];

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

			if (
				element === 'button' &&
				obj['background-color-global'] &&
				!isEmpty(obj['background-color'])
			)
				response[`--maxi-${style}-${element}-background-color`] =
					obj['background-color'];
		});

		times(7, n => {
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
	} else SCStyle.innerHTML = createSCStyleString(SCObject);
};

export default updateSCOnEditor;
