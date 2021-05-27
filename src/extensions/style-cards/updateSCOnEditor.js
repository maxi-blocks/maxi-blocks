/**
 * Internal dependencies
 */
import { getLastBreakpointAttribute } from '../styles';

/**
 * External dependencies
 */
import { times } from 'lodash';

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
			...styleCards.styleCardDefaults.dark,
			...styleCards.styleCard.dark,
		},
		light: {
			...styleCards.styleCardDefaults.light,
			...styleCards.styleCard.light,
		},
	};
	const settingToAvoidInGeneral = [
		'font-size',
		'line-height',
		'letter-spacing',
	];

	styles.forEach(style => {
		elements.forEach(element => {
			if (element !== 'divider')
				settings.forEach(setting => {
					breakpoints.forEach(breakpoint => {
						if (
							!(
								breakpoint === 'general' &&
								settingToAvoidInGeneral.includes(setting)
							)
						)
							response[
								`--maxi-${style}-${element}-${setting}-${breakpoint}`
							] = getLastBreakpointAttribute(
								`${element}-${setting}`,
								breakpoint,
								SC[style]
							);
					});
				});

			if (SC[style][`${element}-color-global`])
				response[`--maxi-${style}-${element}-color`] =
					SC[style][`${element}-color`];
		});

		times(7, n => {
			response[`--maxi-${style}-color-${n + 1}`] =
				SC[style][`color-${n + 1}`];
		});
	});

	return response;
};

const createSCStyleString = SCObject => {
	let response = ':root{';

	Object.entries(SCObject).forEach(([key, val]) => {
		response += `${key}:${val};`;
	});

	response += '}';

	return response;
};

const updateSCOnEditor = styleCards => {
	const SCObject = getSCVariablesObject(styleCards);
	let SCStyle = document.getElementById('maxi-blocks-sc-vars-inline-css');

	if (!SCStyle) {
		SCStyle = document.createElement('style');
		SCStyle.id = 'maxi-blocks-sc-vars-inline-css';
		SCStyle.innerHTML = createSCStyleString(SCObject);
		document.head.appendChild(SCStyle);
	} else SCStyle.innerHTML = createSCStyleString(SCObject);
};

export default updateSCOnEditor;
