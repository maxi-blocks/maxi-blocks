/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getAttributeKey from '../../attributes/getAttributeKey';

const getBreakpoints = obj => {
	const defaultBreakpoints = select('maxiBlocks').receiveMaxiBreakpoints();

	return {
		xxl: obj[getAttributeKey({ key: '_bp-xl' })] || defaultBreakpoints.xl,
		xl: obj[getAttributeKey({ key: '_bp-xl' })] || defaultBreakpoints.xl,
		l: obj[getAttributeKey({ key: '_bp-l' })] || defaultBreakpoints.l,
		m: obj[getAttributeKey({ key: '_bp-m' })] || defaultBreakpoints.m,
		s: obj[getAttributeKey({ key: '_bp-s' })] || defaultBreakpoints.s,
		xs: obj[getAttributeKey({ key: '_bp-xs' })] || defaultBreakpoints.xs,
	};
};

export default getBreakpoints;
