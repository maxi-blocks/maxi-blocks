/**
 * WordPress dependencies
 */
import { getBlockAttributes } from '@wordpress/blocks';
import { Children } from '@wordpress/element';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */

/**
 * External dependencies
 */
import { isObject, compact, uniq, intersection } from 'lodash';
import { getIsValid } from '@extensions/styles';

const getPropsFromChildren = (items, excludedEntries = []) => {
	const response = [];
	const keyResponse = [];
	const ignoreResponse = [];

	const currentBreakpoint =
		select('maxiBlocks').receiveMaxiDeviceType() || 'general';

	const getProps = item => {
		if (!isObject(item)) return;
		if ('indicatorProps' in item) {
			response.push(...item.indicatorProps);
			return;
		}

		if (
			'_ignore' in item &&
			(isObject(item._ignore) || Array.isArray(item._ignore))
		) {
			if (Array.isArray(item._ignore))
				item._ignore.forEach(indicator => ignoreResponse.push(indicator));
			else
				Object.values(item._ignore).forEach(val => {
					if (Array.isArray(val))
						val.forEach(indicator => ignoreResponse.push(indicator));
				});
		}

		// Gets extraIndicators in cases where the prop is send to the component
		// with other label. Just need to be set on the lowest level of the tab item
		if ('extraIndicators' in item)
			item.extraIndicators.forEach(indicator => response.push(indicator));

		if ('extraIndicatorsResponsive' in item) {
			item.extraIndicatorsResponsive.forEach(indicator =>
				response.push(`${indicator}-${currentBreakpoint}`)
			);
		}

		if ('props' in item) {
			if ('content' in item) getProps(item.content);
			if ('children' in item.props)
				getProps(Children.toArray(item.props.children));

			if ('items' in item.props) getProps(item.props.items);

			Object.entries(item.props).forEach(([key, val]) => {
				keyResponse.push(key);
				if (key === '_ignore') {
					if (Array.isArray(val))
						val.forEach(indicator => ignoreResponse.push(indicator));
					else if (isObject(val))
						Object.values(val).forEach(ignoreVal => {
							if (Array.isArray(ignoreVal))
								ignoreVal.forEach(indicator =>
									ignoreResponse.push(indicator)
								);
						});
					return;
				}
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

	const ignoreSet = new Set(ignoreResponse);
	const filteredResponse = response.filter(
		attribute => !ignoreSet.has(attribute)
	);
	return compact(uniq(filteredResponse));
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
