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
		xxl: obj[getAttributeKey('_bp-xl')] || defaultBreakpoints.xl,
		xl: obj[getAttributeKey('_bp-xl')] || defaultBreakpoints.xl,
		l: obj[getAttributeKey('_bp-l')] || defaultBreakpoints.l,
		m: obj[getAttributeKey('_bp-m')] || defaultBreakpoints.m,
		s: obj[getAttributeKey('_bp-s')] || defaultBreakpoints.s,
		xs: obj[getAttributeKey('_bp-xs')] || defaultBreakpoints.xs,
	};
};

export default getBreakpoints;
