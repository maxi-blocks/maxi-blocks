/**
 * WordPress dependencies
 */
import { getBlockAttributes } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import { isArray } from 'lodash';
import { getGroupAttributes } from '@extensions/styles';

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

		return currentAttributes[attribute] === defaultAttributes[attribute];
	});
};

export default getIsActiveTab;
