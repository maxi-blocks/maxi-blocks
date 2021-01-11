/**
 * External dependencies
 */
import { isNumber } from 'lodash';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getSizeStyles = (obj, isHover = false) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		let boxShadowString = '';

		isNumber(
			obj[`box-shadow-horizontal-${breakpoint}${isHover ? '-hover' : ''}`]
		) &&
			(boxShadowString += `${
				obj[
					`box-shadow-horizontal-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			}px `);
		isNumber(
			obj[`box-shadow-vertical-${breakpoint}${isHover ? '-hover' : ''}`]
		) &&
			(boxShadowString += `${
				obj[
					`box-shadow-vertical-${breakpoint}${
						isHover ? '-hover' : ''
					}`
				]
			}px `);
		isNumber(
			obj[`box-shadow-blur-${breakpoint}${isHover ? '-hover' : ''}`]
		) &&
			(boxShadowString += `${
				obj[`box-shadow-blur-${breakpoint}${isHover ? '-hover' : ''}`]
			}px `);
		!!obj[`box-shadow-color-${breakpoint}${isHover ? '-hover' : ''}`] &&
			(boxShadowString +=
				obj[
					`box-shadow-color-${breakpoint}${isHover ? '-hover' : ''}`
				]);

		response[breakpoint] = {
			filter: `drop-shadow(${boxShadowString.trim()})`,
			'box-shadow': 0,
		};
	});

	return response;
};

export default getSizeStyles;
