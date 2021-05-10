/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const getBreakpoints = obj => {
	const defaultBreakpoints = select('maxiBlocks').receiveMaxiBreakpoints();

	return {
		xxl: obj['breakpoints-xl'] || defaultBreakpoints.xl,
		xl: obj['breakpoints-xl'] || defaultBreakpoints.xl,
		l: obj['breakpoints-l'] || defaultBreakpoints.l,
		m: obj['breakpoints-m'] || defaultBreakpoints.m,
		s: obj['breakpoints-s'] || defaultBreakpoints.s,
		xs: obj['breakpoints-xs'] || defaultBreakpoints.xs,
	};
};

export default getBreakpoints;
