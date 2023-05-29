/**
 * WordPress dependencies
 */
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getAttributesValue from './getAttributesValue';

/**
 * External dependencies
 */
import {
	isNil,
	isEmpty,
	isBoolean,
	isNumber,
	isString,
	uniq,
	isArray,
} from 'lodash';

/**
 * Breakpoints
 */
const breakpoints = ['g', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const getValueFromKeys = (value, keys) =>
	keys.reduce((acc, key) => acc?.[key], value);

/**
 * Gets an object base on Maxi Blocks breakpoints schema and looks for the last set value
 * for a concrete property in case is not set for the requested breakpoint. Also enables getting
 * normal attribute on hover requests when the hover attribute doesn't exist.
 */
const getLastBreakpointAttributeSingle = (
	rawTarget,
	breakpoint,
	attributes,
	isHover,
	avoidXXL,
	prefix,
	keys
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
			getAttributesValue({
				target: rawTarget,
				props: attr,
				isHover,
				breakpoint,
				prefix,
			}),
			keys
		);

	const currentBreakpoint =
		select('maxiBlocks')?.receiveMaxiDeviceType() ?? 'g';
	const baseBreakpoint = select('maxiBlocks')?.receiveBaseBreakpoint();

	const attrFilter = attr =>
		!isNil(attr) &&
		(isNumber(attr) || isBoolean(attr) || isString(attr) || !isEmpty(attr));

	// In case that breakpoint is g and baseBreakpoint attribute exists,
	// give priority to baseBreakpoint attribute just when the currentBreakpoint it's 'g'
	// or the baseBreakpoint is different from 'xxl' and currentBreakpoint
	if (
		breakpoint === 'g' &&
		(currentBreakpoint === 'g' ||
			(baseBreakpoint !== 'xxl' && currentBreakpoint !== baseBreakpoint))
	) {
		const baseBreakpointAttr = getLastBreakpointAttributeSingle(
			rawTarget,
			baseBreakpoint,
			attributes,
			isHover,
			avoidXXL,
			prefix,
			keys
		);

		if (attrFilter(baseBreakpointAttr)) return baseBreakpointAttr;
	}

	let currentAttr = getValueFromKeys(
		getAttributesValue({
			target: rawTarget,
			props: attr,
			breakpoint,
			isHover,
			allowNil: true,
			prefix,
		}),
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
				getAttributesValue({
					target: rawTarget,
					props: attr,
					breakpoint: breakpoints[breakpointPosition],
					isHover,
					allowNil: true,
					prefix,
				}),
				keys
			);
	}

	if (isHover && !attrFilter(currentAttr))
		currentAttr = getLastBreakpointAttributeSingle(
			rawTarget,
			breakpoint,
			attributes,
			false,
			avoidXXL,
			prefix,
			keys
		);

	// Helps responsive API: when breakpoint is g and the attribute is undefined,
	// check for the win selected breakpoint
	if (!currentAttr && breakpoint === 'g' && baseBreakpoint)
		currentAttr = getLastBreakpointAttributeSingle(
			rawTarget,
			baseBreakpoint,
			attributes,
			isHover,
			baseBreakpoint === 'xxl' ? false : avoidXXL,
			prefix,
			keys
		);

	return currentAttr;
};

const getLastBreakpointAttributeGroup = (
	target,
	breakpoint,
	isHover,
	avoidXXL,
	prefix,
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
			prefix,
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
	prefix = '',
	returnObj = false,
}) => {
	if (isArray(target))
		return returnObj
			? target.reduce((acc, item) => {
					acc[item] = getLastBreakpointAttribute({
						target: item,
						breakpoint,
						attributes,
						isHover,
						avoidXXL,
						prefix,
						keys,
					});

					return acc;
			  }, {})
			: target.map(item =>
					getLastBreakpointAttribute({
						target: item,
						breakpoint,
						attributes,
						isHover,
						avoidXXL,
						prefix,
						keys,
					})
			  );

	const { getSelectedBlockCount } = select('core/block-editor') || {
		getSelectedBlockCount: () => 1, // Necessary for testing, mocking '@wordpress/data' is too dense
	};

	if (getSelectedBlockCount() > 1 && !forceSingle)
		return getLastBreakpointAttributeGroup(
			target,
			breakpoint,
			isHover,
			avoidXXL,
			prefix,
			keys
		);

	return getLastBreakpointAttributeSingle(
		target,
		breakpoint,
		attributes,
		isHover,
		avoidXXL,
		prefix,
		keys
	);
};

export default getLastBreakpointAttribute;
