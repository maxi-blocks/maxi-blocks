/**
 * WordPress dependencies
 */
import { getBlockAttributes } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import { isArray, isPlainObject } from 'lodash';
import { getGroupAttributes } from '@extensions/styles';

/**
 * Extract actual default value from attribute definition object.
 * getBlockAttributes returns { type, default } objects, not raw defaults.
 *
 * @param {*} attrDef The attribute definition (or raw value)
 * @return {*} The actual default value
 */
const getDefaultValue = attrDef =>
	isPlainObject(attrDef) && 'default' in attrDef ? attrDef.default : attrDef;

/**
 * Compare current value with default, handling numeric string comparison.
 * Returns true if values are equal (not modified).
 *
 * @param {*} currentValue The current attribute value
 * @param {*} defaultValue The default value (from getDefaultValue)
 * @return {boolean} True if equal (not modified)
 */
const valuesAreEqual = (currentValue, defaultValue) => {
	// If no default is registered, treat as "not modified" (don't trigger indicator)
	// This handles responsive breakpoint values that don't have explicit defaults
	if (defaultValue === undefined) return true;

	if (currentValue === defaultValue) return true;

	// Handle numeric string comparison (e.g., '15' vs 15)
	if (
		!isNaN(Number(currentValue)) &&
		!isNaN(Number(defaultValue))
	) {
		return Number(currentValue) === Number(defaultValue);
	}

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
	const maxiSettings = select('maxiBlocks').receiveMaxiSettings() || {};
	const { show_indicators: showIndicators } = maxiSettings;

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
			for (const [key] of Object.entries(item)) {
				attributesArr.push(key);
			}
		});

		return attributesArr;
	};

	return ![
		...attributes,
		...extraIndicators,
		...extraIndicatorsResponsive,
	].every(attribute => {
		if (excludedAttributes.includes(attribute)) return true;
		if (!(attribute in defaultAttributes)) return true;
		if (currentAttributes[attribute] === undefined) return true;
		if (currentAttributes[attribute] === false) return true;
		// Treat opacity value of 1 as cleared when default is undefined
		// (1 = 100% opacity is the logical default)
		if (
			attribute.includes('opacity') &&
			currentAttributes[attribute] === 1 &&
			getDefaultValue(defaultAttributes[attribute]) === undefined
		)
			return true;

		if (breakpoint) {
			const breakpointAttributeChecker = bp => {
				if (
					isArray(currentAttributes[attribute]) &&
					currentAttributes[attribute].length !== 0
				) {
					return [
						...extractAttributes(currentAttributes[attribute]),
					].every(attr => {
						if (attr.split('-').pop() === bp) {
							return false;
						}

						return true;
					});
				}
				if (
					attribute.lastIndexOf(`-${bp}`) ===
					attribute.length - `-${bp}`.length
				) {
					return valuesAreEqual(
						currentAttributes[attribute],
						getDefaultValue(defaultAttributes[attribute])
					);
				}

				return true;
			};

			let result = breakpointAttributeChecker(breakpoint);

			const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();

			if (result && baseBreakpoint === breakpoint)
				result = breakpointAttributeChecker('general');

			return result;
		}
		if (
			isArray(currentAttributes[attribute]) &&
			currentAttributes[attribute].length === 0
		) {
			return !valuesAreEqual(
				currentAttributes[attribute],
				getDefaultValue(defaultAttributes[attribute])
			);
		}
		if (currentAttributes[attribute] === '') return true;

		return valuesAreEqual(
			currentAttributes[attribute],
			getDefaultValue(defaultAttributes[attribute])
		);
	});
};

export default getIsActiveTab;
