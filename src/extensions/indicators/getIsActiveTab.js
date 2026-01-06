/**
 * WordPress dependencies
 */
import { getBlockAttributes } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import { isArray, isEqual, isEmpty, isPlainObject } from 'lodash';
import { getGroupAttributes } from '@extensions/styles';
import getColumnDefaultValue from '@extensions/column-templates/getColumnDefaultValue';

const getIsActiveTab = (
	attributes,
	breakpoint,
	extraIndicators = [],
	extraIndicatorsResponsive = [],
	ignoreIndicator = [],
	ignoreIndicatorGroups = []
) => {
	const { show_indicators: showIndicators } =
		(typeof window !== 'undefined' && window.maxiSettings) || {};

	if (!showIndicators) return false;

	const { getBlock, getSelectedBlockClientId, getBlockRootClientId } =
		select('core/block-editor');

	const selectedBlockClientId = getSelectedBlockClientId();
	const block = getBlock(selectedBlockClientId);

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

	let columnDefaultSize;

	const getColumnDefaultSize = () => {
		if (columnDefaultSize !== undefined) return columnDefaultSize;

		const rootClientId = getBlockRootClientId(selectedBlockClientId);
		const rootBlock = rootClientId ? getBlock(rootClientId) : null;
		if (!rootBlock) {
			columnDefaultSize = null;
			return columnDefaultSize;
		}

		const rowPattern = getGroupAttributes(rootBlock.attributes, 'rowPattern');
		const columnSizes = getGroupAttributes(
			currentAttributes,
			'columnSize'
		);

		columnDefaultSize = getColumnDefaultValue(
			rowPattern,
			columnSizes,
			selectedBlockClientId,
			'general'
		);

		return columnDefaultSize;
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
				if (currentAttributes[attribute] === undefined) return true;
				if (currentAttributes[attribute] === false) return true;
				if (currentAttributes[attribute] === '') return true;
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
					if (
						isEqual(
							currentAttributes[attribute],
							defaultAttributes[attribute]
						)
					)
						return true;

					const generalAttribute = attribute.replace(
						`-${bp}`,
						'-general'
					);

					if (
						generalAttribute in defaultAttributes &&
						isEqual(
							currentAttributes[attribute],
							defaultAttributes[generalAttribute]
						)
					)
						return true;

					return false;
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
			return isEqual(
				currentAttributes[attribute],
				defaultAttributes[attribute]
			);
		}

		if (
			attribute === 'transition' &&
			currentAttributes[attribute] &&
			Object.values(currentAttributes[attribute]).every(value =>
				isEmpty(value)
			)
		) {
			return true;
		}

		if (
			name.includes('column-maxi') &&
			attribute === 'column-size-general'
		) {
			const defaultSize = getColumnDefaultSize();
			if (defaultSize !== null && currentAttributes[attribute] === defaultSize)
				return true;
		}

		// Check if background layers have any non-color layer
		if (attribute === 'background-layers') {
			const hasNonColorLayer = currentAttributes[attribute].some(
				layer => layer.type !== 'color'
			);
			if (!hasNonColorLayer) return true;
		}

		if (
			isPlainObject(currentAttributes[attribute]) &&
			isEmpty(currentAttributes[attribute]) &&
			defaultAttributes[attribute] == null
		)
			return true;

		if (currentAttributes[attribute] === '') return true;

		return isEqual(
			currentAttributes[attribute],
			defaultAttributes[attribute]
		);
	});
};

export default getIsActiveTab;
