/**
 * Internal dependencies
 */
import getAttributeKey from '@extensions/styles/getAttributeKey';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates image width styles object
 *
 * @param {Object}  obj         Block size properties
 * @param {boolean} useInitSize Flag to determine if initial size should be used
 * @param {number|Object} mediaWidth Width of the media element
 */
const getImgWidthStyles = (obj, useInitSize, mediaWidth) => {
	const response = {};
	const generalAttrKey = getAttributeKey(
		'img-width',
		false,
		false,
		'general'
	);
	const generalValue = obj[generalAttrKey];
	const getMediaWidth = breakpoint =>
		typeof mediaWidth === 'object'
			? mediaWidth[breakpoint] ?? mediaWidth.general
			: mediaWidth;

	breakpoints.forEach(breakpoint => {
		const attrKey = getAttributeKey('img-width', false, false, breakpoint);
		const value = obj[attrKey];
		const hasResponsiveMediaWidth =
			typeof mediaWidth === 'object' &&
			breakpoint !== 'general' &&
			mediaWidth[breakpoint] !== undefined &&
			mediaWidth[breakpoint] !== null;
		const breakpointMediaWidth = getMediaWidth(breakpoint);
		if (value || (useInitSize && generalValue && hasResponsiveMediaWidth))
			response[breakpoint] = {
				width: !useInitSize
					? `${value}%`
					: `${breakpointMediaWidth}px`,
			};
	});

	return { imgWidth: response };
};

export default getImgWidthStyles;
