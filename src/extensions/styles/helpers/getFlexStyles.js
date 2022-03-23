import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates flex styles object
 */
const getFlexStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const flexGrow = getLastBreakpointAttribute({
			target: 'flex-grow',
			breakpoint,
			attributes: obj,
		});

		const flexShrink = getLastBreakpointAttribute({
			target: 'flex-shrink',
			breakpoint,
			attributes: obj,
		});

		const flexBasis = getLastBreakpointAttribute({
			target: 'flex-basis',
			breakpoint,
			attributes: obj,
		});

		response[breakpoint] = {
			...((flexBasis || flexGrow || flexShrink) && {
				flex: `${flexGrow || 0} ${flexShrink || 1} ${
					flexBasis || 'auto'
				}`,
			}),
			'flex-wrap': getLastBreakpointAttribute({
				target: 'flex-wrap',
				breakpoint,
				attributes: obj,
			}),
			'flex-flow': getLastBreakpointAttribute({
				target: 'flex-flow',
				breakpoint,
				attributes: obj,
			}),
			order: getLastBreakpointAttribute({
				target: 'order',
				breakpoint,
				attributes: obj,
			}),
			'justify-content': getLastBreakpointAttribute({
				target: 'justify-content',
				breakpoint,
				attributes: obj,
			}),
			'flex-direction': getLastBreakpointAttribute({
				target: 'flex-direction',
				breakpoint,
				attributes: obj,
			}),
			'align-items': getLastBreakpointAttribute({
				target: 'align-items',
				breakpoint,
				attributes: obj,
			}),
			'align-content': getLastBreakpointAttribute({
				target: 'align-content',
				breakpoint,
				attributes: obj,
			}),
			gap: getLastBreakpointAttribute({
				target: 'gap',
				breakpoint,
				attributes: obj,
			}),
			'row-gap': getLastBreakpointAttribute({
				target: 'row-gap',
				breakpoint,
				attributes: obj,
			}),
			'column-gap': getLastBreakpointAttribute({
				target: 'column-gap',
				breakpoint,
				attributes: obj,
			}),
		};
	});

	return response;
};

export default getFlexStyles;
