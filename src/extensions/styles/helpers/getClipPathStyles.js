import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 *
 * @param {Object} obj Block clip-path properties
 */
const getClipPathStyles = ({ obj, isHover = false }) => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {
			...(getLastBreakpointAttribute({
				target: 'clip-path',
				breakpoint,
				attributes: obj,
				isHover,
			}) &&
				(isHover
					? obj['clip-path-status-hover']
					: getLastBreakpointAttribute({
							target: 'clip-path-status',
							breakpoint,
							attributes: obj,
							isHover,
					  })) && {
					'clip-path': getLastBreakpointAttribute({
						target: 'clip-path',
						breakpoint,
						attributes: obj,
						isHover,
					}),
				}),
		};
	});

	return response;
};

export default getClipPathStyles;
