/**
 * Internal dependencies
 */
import getAttributesValue from '../../attributes/getAttributesValue';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates size styles object
 *
 * @param {Object} obj Block size properties
 */
const getOpacityStyles = (obj, isHover = false, prefix = '') => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const value = getAttributesValue({
			target: 'opacity',
			props: obj,
			isHover,
			breakpoint,
			prefix,
		});

		response[breakpoint] = {
			...(value !== undefined &&
				value !== '' && {
					opacity: value,
				}),
		};
	});

	return response;
};

export default getOpacityStyles;
