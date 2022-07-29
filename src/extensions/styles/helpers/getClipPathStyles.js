import getLastBreakpointAttribute from '../getLastBreakpointAttribute';
/**
 * General
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 *
 * @param {Object} obj Block clip-path properties
 */
const getClipPathStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		response[breakpoint] = {
			...(getLastBreakpointAttribute({
				target: 'clip-path',
				breakpoint,
				attributes: obj,
			}) &&
				getLastBreakpointAttribute({
					target: 'clip-path-status',
					breakpoint,
					attributes: obj,
				}) && {
					'clip-path': getLastBreakpointAttribute({
						target: 'clip-path',
						breakpoint,
						attributes: obj,
					}),
				}),
		};
	});

	return response;
};

export default getClipPathStyles;
