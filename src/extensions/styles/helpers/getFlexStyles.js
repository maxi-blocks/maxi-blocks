import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Generates flex styles object
 */
const getFlexStyles = obj => {
	const response = {};

	breakpoints.forEach(breakpoint => {
		const flexWrap = getLastBreakpointAttribute({
			target: 'flex-wrap',
			breakpoint,
			attributes: obj,
		});

		const flexFlow = getLastBreakpointAttribute({
			target: 'flex-flow',
			breakpoint,
			attributes: obj,
		});

		const flexGrow =
			getLastBreakpointAttribute({
				target: 'flex-grow',
				breakpoint,
				attributes: obj,
			}) || 0;

		const flexShrink =
			getLastBreakpointAttribute({
				target: 'flex-shrink',
				breakpoint,
				attributes: obj,
			}) || 1;

		const flexBasis =
			getLastBreakpointAttribute({
				target: 'flex-basis',
				breakpoint,
				attributes: obj,
			}) || 'auto';

		response[breakpoint] = {
			flex: `${flexGrow} ${flexShrink} ${flexBasis}`,
			...(flexWrap && {
				'flex-wrap': flexWrap,
			}),
			...(flexFlow && {
				'flex-flow': flexFlow,
			}),
		};
	});

	return response;
};

export default getFlexStyles;
