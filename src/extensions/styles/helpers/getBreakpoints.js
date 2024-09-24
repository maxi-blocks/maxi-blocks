/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

const getBreakpoints = obj => {
	const defaultBreakpoints = select('maxiBlocks').receiveMaxiBreakpoints();

	return {
		xxl: obj['breakpoints-xl'] || defaultBreakpoints.xl || 1920,
		xl: obj['breakpoints-xl'] || defaultBreakpoints.xl || 1920,
		l: obj['breakpoints-l'] || defaultBreakpoints.l || 1366,
		m: obj['breakpoints-m'] || defaultBreakpoints.m || 1024,
		s: obj['breakpoints-s'] || defaultBreakpoints.s || 767,
		xs: obj['breakpoints-xs'] || defaultBreakpoints.xs || 480,
	};
};

export default getBreakpoints;
