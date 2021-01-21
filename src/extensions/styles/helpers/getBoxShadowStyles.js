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
const getBoxShadowStyles = (obj, isHover = false, dropShadow = false) => {
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
		isNumber(
			obj[`box-shadow-spread-${breakpoint}${isHover ? '-hover' : ''}`]
		) &&
			!dropShadow &&
			(boxShadowString += `${
				obj[`box-shadow-spread-${breakpoint}${isHover ? '-hover' : ''}`]
			}px `);
		!!obj[`box-shadow-color-${breakpoint}${isHover ? '-hover' : ''}`] &&
			(boxShadowString +=
				obj[
					`box-shadow-color-${breakpoint}${isHover ? '-hover' : ''}`
				]);

		response[breakpoint] = dropShadow
			? {
					filter: `drop-shadow(${boxShadowString.trim()})`,
			  }
			: {
					'box-shadow': `${boxShadowString.trim()}`,
			  };
	});

	return response;
};

export default getBoxShadowStyles;
