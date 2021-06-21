/**
 * Internal dependencies
 */
import defaultBoxShadow from '../defaults/boxShadow';
import defaultBoxShadowHover from '../defaults/boxShadowHover';

/**
 * External dependencies
 */
import { round } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getBoxShadowStyles = ({
	obj,
	isHover = false,
	dropShadow = false,
	parentBlockStyle,
}) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		let boxShadowString = '';
		const horizontal =
			obj[
				`box-shadow-horizontal-${breakpoint}${isHover ? '-hover' : ''}`
			];
		const defaultHorizontal =
			(!isHover &&
				defaultBoxShadow[`box-shadow-horizontal-${breakpoint}`]
					.default) ||
			defaultBoxShadowHover[
				[`box-shadow-horizontal-${breakpoint}-hover`].default
			];
		const vertical =
			obj[`box-shadow-vertical-${breakpoint}${isHover ? '-hover' : ''}`];
		const defaultVertical =
			(!isHover &&
				defaultBoxShadow[`box-shadow-vertical-${breakpoint}`]
					.default) ||
			defaultBoxShadowHover[[`box-shadow-vertical-${breakpoint}-hover`]]
				.default;
		const blur =
			obj[`box-shadow-blur-${breakpoint}${isHover ? '-hover' : ''}`];
		const defaultBlur =
			(!isHover &&
				defaultBoxShadow[`box-shadow-blur-${breakpoint}`].default) ||
			defaultBoxShadowHover[[`box-shadow-blur-${breakpoint}-hover`]]
				.default;
		const spread =
			obj[`box-shadow-spread-${breakpoint}${isHover ? '-hover' : ''}`];
		const defaultSpread =
			(!isHover &&
				defaultBoxShadow[`box-shadow-spread-${breakpoint}`].default) ||
			defaultBoxShadowHover[[`box-shadow-spread-${breakpoint}-hover`]]
				.default;
		const defaultColor =
			(!isHover &&
				defaultBoxShadow[`box-shadow-color-${breakpoint}`].default) ||
			defaultBoxShadowHover[[`box-shadow-color-${breakpoint}-hover`]]
				.default;

		let color;

		if (breakpoint === 'general') {
			color = obj[
				`box-shadow-palette-color-status-${breakpoint}${
					isHover ? '-hover' : ''
				}`
			]
				? defaultColor
				: obj[
						`box-shadow-color-${breakpoint}${
							isHover ? '-hover' : ''
						}`
				  ];
		} else {
			color = obj[
				`box-shadow-palette-color-status-${breakpoint}${
					isHover ? '-hover' : ''
				}`
			]
				? `var(--maxi-${parentBlockStyle}-color-${
						obj[
							`box-shadow-palette-color-${breakpoint}${
								isHover ? '-hover' : ''
							}`
						]
				  })`
				: obj[
						`box-shadow-color-${breakpoint}${
							isHover ? '-hover' : ''
						}`
				  ];
		}

		const isNotDefault =
			(horizontal !== defaultHorizontal && horizontal !== 0) ||
			(vertical !== defaultVertical && vertical !== 0) ||
			(blur !== defaultBlur && blur !== 0) ||
			(spread !== defaultSpread && spread !== 0) ||
			color !== defaultColor;

		if (isNotDefault && dropShadow) {
			const blurValue = round(blur / 3);

			boxShadowString += `${horizontal || 0}px `;
			boxShadowString += `${vertical || 0}px `;
			boxShadowString += `${blurValue || 0}px `;
			boxShadowString += color || defaultColor;

			response[breakpoint] = {
				filter: `drop-shadow(${boxShadowString.trim()})`,
			};
		} else if (isNotDefault) {
			boxShadowString += `${horizontal || 0}px `;
			boxShadowString += `${vertical || 0}px `;
			boxShadowString += `${blur || 0}px `;
			boxShadowString += `${spread || 0}px `;
			boxShadowString += color || defaultColor;

			response[breakpoint] = {
				'box-shadow': `${boxShadowString.trim()}`,
			};
		}
	});

	return response;
};

export default getBoxShadowStyles;
