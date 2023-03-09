/**
 * Internal dependencies
 */
import getAttributeValue from '../getAttributeValue';
import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

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
		const currentClipPath = getLastBreakpointAttribute({
			target: 'clip-path',
			breakpoint,
			attributes: obj,
			isHover,
		});

		omitClipPath = omitClipPath ? currentClipPath === 'none' : false;
		if (omitClipPath) return;

		response[breakpoint] = {
			...(currentClipPath &&
				(isHover
					? getAttributeValue({
							target: 'clip-path-status',
							props: obj,
							isHover,
					  })
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
