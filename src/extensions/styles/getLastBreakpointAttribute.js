/**
 * WordPress dependencies
 */
const { select } = wp.data;

/**
 * External dependencies
 */
import { isNil, isEmpty, isBoolean, isNumber, uniq } from 'lodash';

/**
 * Breakpoints
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Gets an object base on Maxi Blocks breakpoints schema and looks for the last set value
 * for a concrete property in case is not set for the requested breakpoint
 */
const getLastBreakpointAttributeSingle = (
	target,
	breakpoint,
	attributes,
	isHover
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
		!isNumber(currentAttr) &&
		(isEmpty(currentAttr) || isNil(currentAttr))
	);

	return currentAttr;
};

const getLastBreakpointAttributeGroup = (target, breakpoint, isHover) => {
	const { getSelectedBlockClientIds, getBlockAttributes } = select(
		'core/block-editor'
	);

	const clientIds = getSelectedBlockClientIds();

	const values = clientIds.map(clientId => {
		const attributes = getBlockAttributes(clientId);

		return getLastBreakpointAttributeSingle(
			target,
			breakpoint,
			attributes,
			isHover
		);
	});

	const flattenValues = uniq(values);
	if (flattenValues.length === 1) return flattenValues[0];

	return null;
};

const getLastBreakpointAttribute = (
	target,
	breakpoint,
	attributes = null,
	isHover = false
) => {
	const { getSelectedBlockCount } = select('core/block-editor');

	if (getSelectedBlockCount() > 1)
		return getLastBreakpointAttributeGroup(target, breakpoint, isHover);
	return getLastBreakpointAttributeSingle(
		target,
		breakpoint,
		attributes,
		isHover
	);
};

export default getLastBreakpointAttribute;
