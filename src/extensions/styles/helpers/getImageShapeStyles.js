/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * External dependencies
 */
import { isEmpty, isNumber } from 'lodash';

/**
 * Internal dependencies
 */
import getLastBreakpointAttribute from '../../attributes/getLastBreakpointAttribute';

/**
 * Generates overflow styles object
 *
 * @param {Object} obj Block overflow properties
 */
const getImageShapeStyles = (
	target = 'svg',
	obj,
	prefix = '',
	ignoreGeneralOmit = false
) => {
	const response = {};

	let omitTransformScale = true;

	breakpoints.forEach(breakpoint => {
		let transformString = '';
		const {
			[`${prefix}image-shape-scale`]: scale,
			[`${prefix}image-shape-rotate`]: rotate,
			[`${prefix}image-shape-flip-x`]: flipX,
			[`${prefix}image-shape-flip-y`]: flipY,
		} = getLastBreakpointAttribute({
			target: [
				`${prefix}image-shape-scale`,
				`${prefix}image-shape-rotate`,
				`${prefix}image-shape-flip-x`,
				`${prefix}image-shape-flip-y`,
			],
			breakpoint,
			attributes: obj,
			prefix,
		});

		if (isNumber(scale)) {
			omitTransformScale = omitTransformScale ? scale === 100 : false;
			const calculationNumbers =
				target === 'svg' ? [scale, 100] : [100, scale];

			if (
				(breakpoint === 'general' && ignoreGeneralOmit) ||
				!(scale === 100 && omitTransformScale)
			)
				transformString += `scale(${
					calculationNumbers[0] / calculationNumbers[1]
				}) `;
		}

		if (isNumber(rotate)) {
			if (target === 'svg') transformString += `rotate(${rotate}deg) `;
			if (target === 'image')
				if ((flipX && !flipY) || (!flipX && flipY))
					transformString += `rotate(${rotate}deg) `;
				else transformString += `rotate(${-rotate}deg) `;
		}

		if (flipX) transformString += 'scaleX(-1) ';
		if (flipY) transformString += 'scaleY(-1) ';

		const transformObj = {
			...(!isEmpty(transformString) && { transform: transformString }),
		};

		if (!isEmpty(transformObj)) response[breakpoint] = transformObj;
	});

	return response;
};

export default getImageShapeStyles;
