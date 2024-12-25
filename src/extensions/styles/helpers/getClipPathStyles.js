/**
 * Internal dependencies
 */
import getAttributeValue from '@extensions/styles/getAttributeValue';
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';

/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 *
 * @param {Object} obj Block clip-path properties
 */
const getClipPathStyles = ({ obj, isHover = false, isIB = false }) => {
	const response = {};

	let omitClipPath = !isHover && !isIB;
	breakpoints.forEach(breakpoint => {
		const currentClipPath = getAttributeValue({
			target: 'clip-path',
			props: obj,
			isHover,
			breakpoint,
		});

		omitClipPath = omitClipPath
			? !currentClipPath || currentClipPath === 'none'
			: false;
		if (omitClipPath) return;

		response[breakpoint] = {
			...(currentClipPath &&
				(isHover
					? obj['clip-path-status-hover']
					: getLastBreakpointAttribute({
							target: 'clip-path-status',
							breakpoint,
							attributes: obj,
							isHover,
					  })) && {
					'clip-path': currentClipPath,
				}),
		};
	});

	return response;
};

export default getClipPathStyles;
