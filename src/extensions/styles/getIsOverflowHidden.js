/**
 * Internal dependencies
 */

import getLastBreakpointAttribute from '../attributes/getLastBreakpointAttribute';

export const getIsOverflowHidden = (attributes, breakpoint) =>
	getLastBreakpointAttribute({
		target: 'overflow-y',
		breakpoint,
		attributes,
	}) === 'hidden' &&
	getLastBreakpointAttribute({
		target: 'overflow-x',
		breakpoint,
		attributes,
	}) === 'hidden';

export default getIsOverflowHidden;
