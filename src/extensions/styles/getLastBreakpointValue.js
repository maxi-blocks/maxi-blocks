/**
 * WordPress dependencies
 */
const { select } = wp.data;

/**
 * External dependencies
 */
import { isNil, isEmpty, isBoolean, isNumber } from 'lodash';

/**
 * Breakpoints
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Gets an object base on Maxi Blocks breakpoints schema and looks for the last set value
 * for a concrete property in case is not set for the requested breakpoint
 */
const getLastBreakpointValue = (
	target,
	breakpoint,
	attributes = null,
	isHover = false
) => {
	const { getBlockAttributes, getSelectedBlockClientId } = select(
		'core/block-editor'
	);

	const attr = attributes || getBlockAttributes(getSelectedBlockClientId());
	let currentAttr = attr[`${target}-${breakpoint}${isHover ? '-hover' : ''}`];

	if (
		!isNil(currentAttr) &&
		(isNumber(currentAttr) ||
			isBoolean(currentAttr) ||
			!isEmpty(currentAttr))
	)
		return currentAttr;

	let breakpointPosition = breakpoints.indexOf(breakpoint);

	do {
		breakpointPosition -= 1;
		currentAttr =
			attr[
				`${target}-${breakpoints[breakpointPosition]}${
					isHover ? '-hover' : ''
				}`
			];
	} while (
		breakpointPosition > 0 &&
		(isEmpty(currentAttr) || isNil(currentAttr))
	);

	return currentAttr;
};

export default getLastBreakpointValue;
