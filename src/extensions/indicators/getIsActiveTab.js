/**
 * WordPress dependencies
 */
import { getBlockAttributes } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import { isArray } from 'lodash';
const getIsActiveTab = (
	attributes,
	breakpoint,
	extraIndicators = [],
	extraIndicatorsResponsive = [],
	ignoreIndicator = []
) => {
	const { getBlock, getSelectedBlockClientId } = select('core/block-editor');

	const block = getBlock(getSelectedBlockClientId());

	if (!block) return null;

	const { name, attributes: currentAttributes } = block;

	if (!name.includes('maxi-blocks')) return null;

	const defaultAttributes = getBlockAttributes(name);
	const excludedAttributes = [
		'blockStyle',
		'parentBlockStyle',
		'isFirstOnHierarchy',
		'uniqueID',
		...ignoreIndicator,
	];

	const extractAttributes = items => {
		const attributesArr = [];

		items.forEach(item => {
			for (const [key, value] of Object.entries(item)) {
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

		if (
			attribute.includes('scroll-') &&
			currentAttributes[attribute] === false
		)
			return true;

		if (breakpoint) {
			if (
				isArray(currentAttributes[attribute]) &&
				currentAttributes[attribute].length !== 0
			) {
				return [
					...extractAttributes(currentAttributes[attribute]),
				].every(attr => {
					if (attr.split('-').pop() === breakpoint) {
						return false;
					}

					return true;
				});
			} else if (
				attribute.lastIndexOf(`-${breakpoint}`) ===
				attribute.length - `-${breakpoint}`.length
			) {
				return (
					currentAttributes[attribute] ===
					defaultAttributes[attribute]
				);
			}
		} else {
			if (
				isArray(currentAttributes[attribute]) &&
				currentAttributes[attribute].length === 0
			) {
				return (
					currentAttributes[attribute] !==
					defaultAttributes[attribute]
				);
			} else if (currentAttributes[attribute] === '') return true;
			else
				return (
					currentAttributes[attribute] ===
					defaultAttributes[attribute]
				);
		}

		return true;
	});
};

export default getIsActiveTab;
