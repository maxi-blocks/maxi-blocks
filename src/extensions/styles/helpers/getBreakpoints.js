/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getAttributeKey from '../getAttributeKey';

const getBreakpoints = obj => {
	const defaultBreakpoints = select('maxiBlocks').receiveMaxiBreakpoints();

	return {
		xxl: obj[getAttributeKey('breakpoints-xl')] || defaultBreakpoints.xl,
		xl: obj[getAttributeKey('breakpoints-xl')] || defaultBreakpoints.xl,
		l: obj[getAttributeKey('breakpoints-l')] || defaultBreakpoints.l,
		m: obj[getAttributeKey('breakpoints-m')] || defaultBreakpoints.m,
		s: obj[getAttributeKey('breakpoints-s')] || defaultBreakpoints.s,
		xs: obj[getAttributeKey('breakpoints-xs')] || defaultBreakpoints.xs,
	};
};

export default getBreakpoints;
