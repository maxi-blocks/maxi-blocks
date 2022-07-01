/**
 * WordPress dependencies
 */
import { getBlockAttributes } from '@wordpress/blocks';
import { Children } from '@wordpress/element';

/**
 * Internal dependencies
 */
import getResponsiveAttributeKeys from './getResponsiveAttributeKeys';

/**
 * External dependencies
 */
import { isObject, compact, uniq, intersection } from 'lodash';
import { getIsValid } from '../styles';

const getPropsFromChildren = (items, excludedEntries = []) => {
	const response = [];
	const keyResponse = [];

	const getProps = item => {
		if (!isObject(item)) return;
		if ('indicatorProps' in item) {
			response.push(...item.indicatorProps);
			return;
		}

		// Gets extraIndicators in cases where the prop is send to the component
		// with other label. Just need to be set on the lowest level of the tab item
		if ('extraIndicators' in item)
			item.extraIndicators.forEach(indicator => response.push(indicator));

		if ('extraIndicatorsResponsive' in item) {
			response.push(
				...getResponsiveAttributeKeys(item.extraIndicatorsResponsive)
			);
		}

		if ('props' in item) {
			if ('children' in item.props)
				getProps(Children.toArray(item.props.children));

			if ('items' in item.props) getProps(item.props.items);
			if ('options' in item.props)
				response.push(
					...['background-layers', 'background-layers-hover']
				);

			Object.entries(item.props).forEach(([key, val]) => {
				keyResponse.push(key);
				if (!excludedEntries.includes(key) && getIsValid(val, true)) {
					if (
						isObject(val) &&
						(key === 'transition' || key.includes('custom-css'))
					) {
						response.push(key);
					} else if (
						isObject(val) &&
						key !== 'allAttributes' &&
						key !== 'options'
					)
						Object.keys(val).forEach(subKey =>
							response.push(subKey)
						);
					else !response.includes(key) && response.push(key);
				}
			});
		} else
			Object.values(item).forEach(val => isObject(val) && getProps(val));
	};

	getProps(items);

	return compact(uniq(response));
};

export const getMaxiAttrsFromChildren = ({
	items,
	blockName,
	excludedEntries,
}) => {
	if (!blockName || !blockName.includes('maxi-blocks')) return null;

	const blockAttributesKeys = Object?.keys(getBlockAttributes(blockName));
	const blockPropsKeys = getPropsFromChildren(items, excludedEntries);

	return intersection(blockAttributesKeys, blockPropsKeys);
};

export default getPropsFromChildren;
