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

const getValueFromKeys = (value, keys) =>
	keys.reduce((acc, key) => acc?.[key], value);

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
	avoidXXL,
	keys,
	forceUseBreakpoint = false
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
		return getValueFromKeys(
			getAttributeValue({
				target,
				props: attr,
				isHover,
				breakpoint,
			}),
			keys
		);

	const currentBreakpoint =
		select('maxiBlocks')?.receiveMaxiDeviceType() ?? 'general';

	const baseBreakpoint = select('maxiBlocks')?.receiveBaseBreakpoint();

	const attrFilter = attr =>
		!isNil(attr) &&
		(isNumber(attr) || isBoolean(attr) || isString(attr) || !isEmpty(attr));

	// In case that breakpoint is general and baseBreakpoint attribute exists,
	// give priority to baseBreakpoint attribute just when the currentBreakpoint it's 'general'
	// or the baseBreakpoint is different from 'xxl' and currentBreakpoint
	if (
		!forceUseBreakpoint &&
		breakpoint === 'general' &&
		(currentBreakpoint === 'general' ||
			(baseBreakpoint !== 'xxl' && currentBreakpoint !== baseBreakpoint))
	) {
		const baseBreakpointAttr = getLastBreakpointAttributeSingle(
			target,
			baseBreakpoint,
			attributes,
			isHover,
			avoidXXL,
			keys
		);

		if (attrFilter(baseBreakpointAttr)) return baseBreakpointAttr;
	}

	let currentAttr = getValueFromKeys(
		attr[
			`${!isEmpty(target) ? `${target}-` : ''}${breakpoint}${
				isHover ? '-hover' : ''
			}`
		],
		keys
	);

	if (
		attrFilter(currentAttr) &&
		(baseBreakpoint !== 'xxl' || breakpoint === 'xxl')
	)
		return currentAttr;

	let breakpointPosition = breakpoints.indexOf(breakpoint);

	while (
		breakpointPosition > 0 &&
		!isNumber(currentAttr) &&
		!isBoolean(currentAttr) &&
		(isEmpty(currentAttr) || isNil(currentAttr))
	) {
		breakpointPosition -= 1;

		if (!(avoidXXL && breakpoints[breakpointPosition] === 'xxl'))
			currentAttr = getValueFromKeys(
				attr[
					`${!isEmpty(target) ? `${target}-` : ''}${
						breakpoints[breakpointPosition]
					}${isHover ? '-hover' : ''}`
				],
				keys
			);
	}

	if (isHover && !attrFilter(currentAttr))
		currentAttr = getLastBreakpointAttributeSingle(
			target,
			breakpoint,
			attributes,
			false,
			avoidXXL,
			keys
		);

	// Helps responsive API: when breakpoint is general and the attribute is undefined,
	// check for the win selected breakpoint
	if (!currentAttr && breakpoint === 'general' && baseBreakpoint)
		currentAttr = getLastBreakpointAttributeSingle(
			target,
			baseBreakpoint,
			attributes,
			isHover,
			baseBreakpoint === 'xxl' ? false : avoidXXL,
			keys
		);

	return currentAttr;
};

const getLastBreakpointAttributeGroup = (
	target,
	breakpoint,
	isHover,
	avoidXXL,
	keys
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
			avoidXXL,
			keys
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
	keys = [],
	forceUseBreakpoint = false,
}) => {
	const { getSelectedBlockCount } = select('core/block-editor') || {
		getSelectedBlockCount: () => 1, // Necessary for testing, mocking '@wordpress/data' is too dense
	};

	if (getSelectedBlockCount() > 1 && !forceSingle)
		return getLastBreakpointAttributeGroup(
			target,
			breakpoint,
			isHover,
			avoidXXL,
			keys,
			forceUseBreakpoint
		);

	return getLastBreakpointAttributeSingle(
		target,
		breakpoint,
		attributes,
		isHover,
		avoidXXL,
		keys,
		forceUseBreakpoint
	);
};

export default getLastBreakpointAttribute;
