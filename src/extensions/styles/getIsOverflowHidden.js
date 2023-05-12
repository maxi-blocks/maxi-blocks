/**
 * Internal dependencies
 */

import getLastBreakpointAttribute from '../attributes/getLastBreakpointAttribute';

export const getIsOverflowHidden = (attributes, breakpoint) =>
	getLastBreakpointAttribute({
		target: '_oy',
		breakpoint,
		attributes,
	}) === 'hidden' &&
	getLastBreakpointAttribute({
		target: '_ox',
		breakpoint,
		attributes,
	}) === 'hidden';

export default getIsOverflowHidden;
