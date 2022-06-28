/**
 * WordPress dependencies
 */
import { getBlockAttributes } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import { cloneDeep, isArray, isEmpty, isEqual, isNil, isObject } from 'lodash';
import { getGroupAttributes } from '../styles';
import { getObject } from '../../components/background-control/utils';

const breakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

const filterAttribute = attribute => {
	if (isObject(attribute)) {
		const filteredAttribute = cloneDeep(attribute);

		const filterObject = obj => {
			Object.keys(obj).forEach(key => {
				if (isObject(obj[key])) {
					filterObject(obj[key]);
				}

				if (isNil(obj[key])) {
					delete obj[key];
				}
			});
		};

		filterObject(filteredAttribute);

		return filteredAttribute;
	}

	return attribute;
};

const getIsActiveTab = (
	attributes,
	breakpoint,
	extraIndicators = [],
	extraIndicatorsResponsive = [],
	ignoreIndicator = [],
	ignoreIndicatorGroups = [],
	isBgLayersHover = false
) => {
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

	const extractAttributes = (
		items,
		defaultItems,
		bgLayers = false,
		transitionType = false
	) => {
		const attributesArr = [];

		const extractingAttributes = (
			items,
			attributesArr,
			defaultAttributes,
			bgLayers,
			transitionType
		) => {
			Object.entries(items).forEach(([key, value]) => {
				if ((isArray(value) || isObject(value)) && value.length !== 0) {
					let copiedValue = { ...value };

					let currentDefaultAttributes = defaultAttributes?.[key];

					// Transitions
					if (
						transitionType &&
						(copiedValue?.[transitionType.block] ||
							copiedValue?.[transitionType.canvas])
					) {
						copiedValue =
							copiedValue[transitionType.block] ||
							copiedValue[transitionType.canvas];

						currentDefaultAttributes =
							currentDefaultAttributes[transitionType.block] ||
							currentDefaultAttributes[transitionType.canvas];
					}

					// Background layers
					if (bgLayers && copiedValue?.type) {
						currentDefaultAttributes = {
							...getObject(
								copiedValue.type,
								breakpoint,
								true,
								bgLayers
							),
							...getObject(
								copiedValue.type,
								breakpoint,
								false,
								bgLayers
							),
							'display-general': copiedValue.isHover
								? 'none'
								: 'block',
							'display-general-hover': 'block',
						};

						// To not affect hover state indicators by changes in normal state attributes
						isBgLayersHover &&
							Object.keys(copiedValue).forEach(key => {
								if (!key.includes('hover')) {
									delete copiedValue[key];
								}
							});
					}

					extractingAttributes(
						copiedValue,
						attributesArr,
						currentDefaultAttributes,
						bgLayers
					);
				} else if (
					value !== defaultAttributes[key] &&
					!attributesArr.includes(key)
				) {
					attributesArr.push(key);
				}
			});
		};

		extractingAttributes(
			items,
			attributesArr,
			defaultItems,
			bgLayers,
			transitionType
		);

		return attributesArr;
	};

	const getIsBreakpointAttribute = (attribute, breakpoint) => {
		const hoverLength = attribute.includes('-hover') ? 6 : 0;

		return (
			attribute.includes(`-${breakpoint}`) &&
			attribute.lastIndexOf(`-${breakpoint}`) ===
				attribute.length - `-${breakpoint}`.length - hoverLength
		);
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
					!breakpoints.some(bp =>
						getIsBreakpointAttribute(attribute, bp)
					) &&
					(isObject(currentAttributes[attribute]) ||
						isArray(currentAttributes[attribute])) &&
					!isEmpty(currentAttributes[attribute])
				) {
					return [
						...extractAttributes(
							currentAttributes[attribute],
							defaultAttributes[attribute],
							attribute === 'background-layers' ||
								attribute === 'background-layers-hover'
								? currentAttributes[attribute]
								: false,
							attribute === 'transition'
								? {
										canvas: currentAttributes[
											'transition-canvas-selected'
										],
										block: currentAttributes[
											'transition-block-selected'
										],
								  }
								: false
						),
					].every(attr => {
						if (getIsBreakpointAttribute(attr, bp)) {
							return false;
						}

						return true;
					});
				}

				if (getIsBreakpointAttribute(attribute, bp)) {
					return isEqual(
						filterAttribute(currentAttributes[attribute]),
						filterAttribute(defaultAttributes[attribute])
					);
				}

				return true;
			};

			let result = breakpointAttributeChecker(breakpoint);

			const winBreakpoint = select('maxiBlocks').receiveWinBreakpoint();

			if (result && winBreakpoint === breakpoint)
				result = breakpointAttributeChecker('general');

			if (!isNil(result)) {
				return result;
			}
		}
		if (
			isArray(currentAttributes[attribute]) &&
			currentAttributes[attribute].length === 0
		) {
			return !isEqual(
				filterAttribute(currentAttributes[attribute]),
				filterAttribute(defaultAttributes[attribute])
			);
		}
		if (currentAttributes[attribute] === '') return true;

		return isEqual(
			filterAttribute(currentAttributes[attribute]),
			filterAttribute(defaultAttributes[attribute])
		);
	});
};

export default getIsActiveTab;
