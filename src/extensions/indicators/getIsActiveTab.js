/**
 * WordPress dependencies
 */
import { getBlockAttributes } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import {
	isArray,
	isEqual,
	isUndefined,
	isNull,
	isEmpty,
	isObject,
	isNil,
} from 'lodash';
import { getGroupAttributes, getDefaultAttribute } from '@extensions/styles';

// Module-level cache to avoid recomputing defaults across renders
const effectiveDefaultCache = new Map(); // key: `${blockName}|${attr}|${baseBreakpoint}` → value

const isPrimitive = val =>
	typeof val === 'string' ||
	typeof val === 'number' ||
	typeof val === 'boolean';

const isEffectivelyEqual = (val1, val2) => {
	if (val1 === val2) return true;

	// Cheap path for primitives
	if (isPrimitive(val1) && isPrimitive(val2)) return false;

	const isVal1Empty =
		isUndefined(val1) ||
		isNull(val1) ||
		val1 === '' ||
		val1 === 0 ||
		val1 === false ||
		(isArray(val1) && isEmpty(val1)) ||
		(isObject(val1) && isEmpty(val1));
	const isVal2Empty =
		isUndefined(val2) ||
		isNull(val2) ||
		val2 === '' ||
		val2 === 0 ||
		val2 === false ||
		(isArray(val2) && isEmpty(val2)) ||
		(isObject(val2) && isEmpty(val2));

	if (isVal1Empty && isVal2Empty) return true;

	return isEqual(val1, val2);
};

const resolveEffectiveDefault = (attributeKey, blockName, baseBreakpoint) => {
	const cacheKey = `${blockName}|${attributeKey}|${baseBreakpoint}`;
	if (effectiveDefaultCache.has(cacheKey)) {
		return effectiveDefaultCache.get(cacheKey);
	}

	let def = getDefaultAttribute(attributeKey, null, false, blockName);

	if (isNil(def)) {
		const alignmentRegex =
			/(\b|-)alignment-(general|xxl|xl|l|m|s|xs)(-hover)?$/;
		if (alignmentRegex.test(attributeKey)) def = 'left';
	}

	effectiveDefaultCache.set(cacheKey, def);
	return def;
};

const isCurrentValueDefault = (
	currentValue,
	attributeKey,
	blockName,
	baseBreakpoint
) => {
	const effectiveDefault = resolveEffectiveDefault(
		attributeKey,
		blockName,
		baseBreakpoint
	);

	// Direct check: if current value equals effective default, it's default
	if (currentValue === effectiveDefault) return true;

	// For alignment specifically: if no value is set and default is 'left', it's default
	if (isNil(currentValue) && effectiveDefault === 'left') return true;

	return false;
};

const getIsActiveTab = (
	attributes,
	breakpoint,
	extraIndicators = [],
	extraIndicatorsResponsive = [],
	ignoreIndicator = [],
	ignoreIndicatorGroups = []
) => {
	const { show_indicators: showIndicators } =
		select('maxiBlocks').receiveMaxiSettings();
	if (!showIndicators) return false;

	const { getBlock, getSelectedBlockClientId } = select('core/block-editor');
	const block = getBlock(getSelectedBlockClientId());
	if (!block) return null;

	const { name, attributes: currentAttributes } = block;
	if (!name.includes('maxi-blocks')) return null;

	const defaultAttributes = getBlockAttributes(name);

	const ignoreAttributes = [];
	ignoreIndicatorGroups.forEach(group => {
		ignoreAttributes.push(
			...Object.keys(getGroupAttributes(currentAttributes, group))
		);
	});

	const excludedAttributes = [
		'blockStyle',
		'isFirstOnHierarchy',
		'uniqueID',
		'svgType',
		...ignoreIndicator,
		...ignoreAttributes,
	];

	const extractAttributes = items => {
		const attributesArr = [];
		items.forEach(item => {
			for (const [key] of Object.entries(item)) attributesArr.push(key);
		});
		return attributesArr;
	};

	// Precompute baseBreakpoint and effective defaults for all attributes we will check
	const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();
	const attrsToCheck = [
		...attributes,
		...extraIndicators,
		...extraIndicatorsResponsive,
	].filter(
		attr => !excludedAttributes.includes(attr) && attr in defaultAttributes
	);

	const effectiveDefaults = new Map();
	for (const attr of attrsToCheck) {
		effectiveDefaults.set(
			attr,
			resolveEffectiveDefault(attr, name, baseBreakpoint)
		);
	}

	return !attrsToCheck.every(attribute => {
		// Simple script: if current value equals default, return true (no dot)
		if (
			isCurrentValueDefault(
				currentAttributes[attribute],
				attribute,
				name,
				baseBreakpoint
			)
		) {
			return true;
		}

		if (breakpoint) {
			const breakpointAttributeChecker = bp => {
				if (
					isArray(currentAttributes[attribute]) &&
					currentAttributes[attribute].length !== 0
				) {
					return extractAttributes(
						currentAttributes[attribute]
					).every(attr => {
						if (attr.split('-').pop() === bp) {
							return isCurrentValueDefault(
								currentAttributes[attribute],
								attribute,
								name,
								baseBreakpoint
							);
						}
						return true;
					});
				}

				if (
					attribute.lastIndexOf(`-${bp}`) ===
					attribute.length - `-${bp}`.length
				) {
					return isCurrentValueDefault(
						currentAttributes[attribute],
						attribute,
						name,
						baseBreakpoint
					);
				}

				return true;
			};

			let result = breakpointAttributeChecker(breakpoint);
			if (result && baseBreakpoint === breakpoint) {
				result = breakpointAttributeChecker('general');
			}
			return result;
		}

		return false; // If not default, show dot
	});
};

export default getIsActiveTab;
