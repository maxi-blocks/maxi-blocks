/**
 * WordPress dependencies
 */
import { getBlockAttributes } from '@wordpress/blocks';
import { Children } from '@wordpress/element';

/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
import { isObject, compact, uniq, intersection } from 'lodash';
import { getIsValid } from '../styles';

const getPropsFromChildren = (items, excludedEntries = []) => {
	const response = [];
	const keyResponse = [];

	const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	const getProps = item => {
		if (!isObject(item)) return;

		// Gets extraIndicators in cases where the prop is send to the component
		// with other label. Just need to be set on the lowest level of the tab item
		if ('extraIndicators' in item)
			item.extraIndicators.forEach(indicator => response.push(indicator));

		if ('extraIndicatorsResponsive' in item) {
			console.log('extra!!!');
			item.extraIndicatorsResponsive.forEach(indicator => {
				console.log(`extra: ${indicator}`);
				breakpoints.forEach(breakpoint =>
					response.push(`${indicator}-${breakpoint}`)
				);
			});
		}

		if ('props' in item) {
			if ('content' in item) getProps(item.content);
			if ('children' in item.props)
				getProps(Children.toArray(item.props.children));
			if ('items' in item.props) getProps(item.props.items);

			Object.entries(item.props).forEach(([key, val]) => {
				keyResponse.push(key);
				if (!excludedEntries.includes(key) && getIsValid(val, true)) {
					if (isObject(val))
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

	console.log(`response: ${compact(uniq(response))}`);

	return compact(uniq(response));
};

export const getMaxiAttrsFromChildren = ({
	items,
	blockName,
	excludedEntries,
}) => {
	const blockAttributesKeys = Object.keys(getBlockAttributes(blockName));
	const blockPropsKeys = getPropsFromChildren(items, excludedEntries);

	return intersection(blockAttributesKeys, blockPropsKeys);
};

export default getPropsFromChildren;
