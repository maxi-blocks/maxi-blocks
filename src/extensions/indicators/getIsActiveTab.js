/**
 * WordPress dependencies
 */
import { getBlockAttributes } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import { isArray, isPlainObject, isEmpty } from 'lodash';
import { getGroupAttributes } from '@extensions/styles';

const getIsActiveTab = (
	attributes,
	breakpoint,
	extraIndicators = [],
	extraIndicatorsResponsive = [],
	ignoreIndicator = [],
	ignoreIndicatorGroups = [],
	indicatorContext = null
) => {
	const maxiSettings = select('maxiBlocks').receiveMaxiSettings() || {};
	const { show_indicators: showIndicators } = maxiSettings;

	if (!showIndicators) return false;

	let blockName = indicatorContext?.blockName;
	let currentAttributes = indicatorContext?.currentAttributes;

	if (!blockName || !currentAttributes) {
		const { getBlock, getSelectedBlockClientId } =
			select('core/block-editor');

		const block = getBlock(getSelectedBlockClientId());

		if (!block) return null;

		blockName = block.name;
		currentAttributes = block.attributes;
	}

	if (!blockName.includes('maxi-blocks')) return null;

	const defaultAttributes = getBlockAttributes(blockName);

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
		if (currentAttributes[attribute] === false)
			return !defaultAttributes[attribute];
		// Treat CSS reset values as cleared when default is undefined
		if (
			defaultAttributes[attribute] === undefined &&
			(currentAttributes[attribute] === 'normal' ||
				currentAttributes[attribute] === 'none' ||
				currentAttributes[attribute] === 'unset')
		)
			return true;
		// Treat opacity value of 1 as cleared when default is undefined
		// (1 = 100% opacity is the logical default)
		if (
			attribute.includes('opacity') &&
			currentAttributes[attribute] === 1 &&
			defaultAttributes[attribute] === undefined
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
					return (
						currentAttributes[attribute] ===
						defaultAttributes[attribute]
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
			return (
				currentAttributes[attribute] !== defaultAttributes[attribute]
			);
		}
		if (currentAttributes[attribute] === '') return true;
		// Treat empty objects as cleared (e.g., ariaLabels: {})
		if (
			isPlainObject(currentAttributes[attribute]) &&
			isEmpty(currentAttributes[attribute])
		)
			return true;

		return currentAttributes[attribute] === defaultAttributes[attribute];
	});
};

export default getIsActiveTab;
