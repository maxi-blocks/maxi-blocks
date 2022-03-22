/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getAttributeValue from './getAttributeValue';

/**
 * External dependencies
 */
import { isNil, isEmpty, isBoolean, isNumber, isString, uniq } from 'lodash';

/**
 * Breakpoints
 */
const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Gets an object base on Maxi Blocks breakpoints schema and looks for the last set value
 * for a concrete property in case is not set for the requested breakpoint. Also enables getting
 * normal attribute on hover requests when the hover attribute doesn't exist.
 */
const getLastBreakpointAttributeSingle = (
	target,
	breakpoint,
	attributes,
	isHover,
	avoidXXL
) => {
	const { getBlockAttributes, getSelectedBlockClientId } = select(
		'core/block-editor'
	) || {
		getBlockAttributes: () => null, // Necessary for testing, mocking '@wordpress/data' is too dense
		getSelectedBlockClientId: () => null, // Necessary for testing, mocking '@wordpress/data' is too dense
	};

	const attr = attributes || getBlockAttributes(getSelectedBlockClientId());

	if (isNil(attr)) return false;
	if (isNil(breakpoint))
		return getAttributeValue({
			target,
			props: attr,
			isHover,
			breakpoint,
		});

	const winBreakpoint = select('maxiBlocks')?.receiveWinBreakpoint();

	const attrFilter = attr =>
		!isNil(attr) &&
		(isNumber(attr) || isBoolean(attr) || isString(attr) || !isEmpty(attr));

	let currentAttr =
		attr[
			`${!isEmpty(target) ? `${target}-` : ''}${breakpoint}${
				isHover ? '-hover' : ''
			}`
		];

	if (
		attrFilter(currentAttr) &&
		breakpoint !== 'general' &&
		(winBreakpoint !== 'xxl' || breakpoint === 'xxl')
	)
		return currentAttr;

	let breakpointPosition = breakpoints.indexOf(breakpoint);

	do {
		breakpointPosition -= 1;
		if (!(avoidXXL && breakpoints[breakpointPosition] === 'xxl'))
			currentAttr =
				attr[
					`${!isEmpty(target) ? `${target}-` : ''}${
						breakpoints[breakpointPosition]
					}${isHover ? '-hover' : ''}`
				];
	} while (
		breakpointPosition > 0 &&
		!isNumber(currentAttr) &&
		!isBoolean(currentAttr) &&
		(isEmpty(currentAttr) || isNil(currentAttr))
	);

	if (isHover && !attrFilter(currentAttr))
		currentAttr = getLastBreakpointAttributeSingle(
			target,
			breakpoint,
			attributes,
			false,
			avoidXXL
		);

	// Helps responsive API: when breakpoint is general and the attribute is undefined,
	// check for the win selected breakpoint
	if (!currentAttr && breakpoint === 'general' && winBreakpoint)
		currentAttr = getLastBreakpointAttributeSingle(
			target,
			winBreakpoint,
			attributes,
			isHover,
			winBreakpoint === 'xxl' ? false : avoidXXL
		);

	return currentAttr;
};

const getLastBreakpointAttributeGroup = (
	target,
	breakpoint,
	isHover,
	avoidXXL
) => {
	const { getSelectedBlockClientIds, getBlockAttributes } =
		select('core/block-editor');

	const clientIds = getSelectedBlockClientIds();

	const values = clientIds.map(clientId => {
		const attributes = getBlockAttributes(clientId);

		return getLastBreakpointAttributeSingle(
			target,
			breakpoint,
			attributes,
			isHover,
			avoidXXL
		);
	});

	const flattenValues = uniq(values);
	if (flattenValues.length === 1) return flattenValues[0];

	return null;
};

const getLastBreakpointAttribute = ({
	target,
	breakpoint,
	attributes = null,
	isHover = false,
	forceSingle = false,
	avoidXXL = true,
}) => {
	const { getSelectedBlockCount } = select('core/block-editor') || {
		getSelectedBlockCount: () => 1, // Necessary for testing, mocking '@wordpress/data' is too dense
	};

	if (getSelectedBlockCount() > 1 && !forceSingle)
		return getLastBreakpointAttributeGroup(
			target,
			breakpoint,
			isHover,
			avoidXXL
		);

	return getLastBreakpointAttributeSingle(
		target,
		breakpoint,
		attributes,
		isHover,
		avoidXXL
	);
};

export default getLastBreakpointAttribute;
