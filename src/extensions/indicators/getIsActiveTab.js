/**
 * WordPress dependencies
 */
import { getBlockAttributes } from '@wordpress/blocks';
import { select } from '@wordpress/data';
import { isArray, isEqual, isEmpty, isPlainObject } from 'lodash';
import {
	getDefaultAttribute,
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '@extensions/styles';
import { getDefaultSCValue } from '@extensions/style-cards';
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
	const { receiveMaxiSelectedStyleCard } = select('maxiBlocks/style-cards');

	const selectedBlockClientId = getSelectedBlockClientId();
	const block = getBlock(selectedBlockClientId);

	if (!block) return null;

	const { name, attributes: currentAttributes } = block;
	const styleCard = receiveMaxiSelectedStyleCard()?.value || {};
	const blockStyle = currentAttributes.blockStyle?.replace('maxi-', '');
	const textLevel = currentAttributes.textLevel;

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

	const isNumericValue = value =>
		(typeof value === 'number' ||
			(typeof value === 'string' && value.trim() !== '')) &&
		!Number.isNaN(Number(value));

	const clipPathBreakpoints = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

	const getClipPathStatusTarget = attribute =>
		attribute
			.replace(/-hover$/, '')
			.replace(/-(general|xxl|xl|l|m|s|xs)$/, '')
			.replace('clip-path', 'clip-path-status');

	const getAltSelectorKey = attribute => {
		if (attribute === 'mediaAlt') return 'altSelector';
		if (attribute === 'altSelector') return 'altSelector';
		if (attribute.endsWith('mediaAlt'))
			return attribute.replace(/mediaAlt$/, 'altSelector');
		if (attribute === 'background-image-parallax-alt')
			return 'background-image-parallax-alt-selector';
		if (attribute === 'background-image-parallax-alt-selector')
			return 'background-image-parallax-alt-selector';
		return null;
	};

	const areEquivalent = (left, right) => {
		if (isNumericValue(left) && isNumericValue(right))
			return Number(left) === Number(right);

		return isEqual(left, right);
	};

	const mergeDefaults = (defaultValue, currentValue) => {
		if (!isPlainObject(defaultValue)) {
			return currentValue === undefined ? defaultValue : currentValue;
		}

		if (!isPlainObject(currentValue)) return defaultValue;

		const merged = {};
		const defaultKeys = Object.keys(defaultValue);

		defaultKeys.forEach(key => {
			merged[key] = mergeDefaults(defaultValue[key], currentValue[key]);
		});

		Object.keys(currentValue).forEach(key => {
			if (!defaultKeys.includes(key)) {
				merged[key] = currentValue[key];
			}
		});

		return merged;
	};

	const getStyleCardDefault = attribute => {
		if (!styleCard || !blockStyle) return null;

		const scValue = getDefaultSCValue({
			target: attribute,
			SC: styleCard,
			SCStyle: blockStyle,
			groupAttr: textLevel,
		});

		if (scValue !== null && scValue !== undefined) return scValue;

		const fallbackValue = getDefaultSCValue({
			target: attribute,
			SC: styleCard,
			SCStyle: blockStyle,
		});

		if (fallbackValue !== null && fallbackValue !== undefined)
			return fallbackValue;

		const breakpointMatch = attribute.match(
			/-(xxl|xl|l|m|s|xs)$/
		);

		if (!breakpointMatch) return null;

		const generalAttribute = attribute.replace(
			`-${breakpointMatch[1]}`,
			'-general'
		);

		return getDefaultSCValue({
			target: generalAttribute,
			SC: styleCard,
			SCStyle: blockStyle,
			groupAttr: textLevel,
		}) ?? getDefaultSCValue({
			target: generalAttribute,
			SC: styleCard,
			SCStyle: blockStyle,
		});
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
		if (currentAttributes[attribute] === null) return true;
		if (currentAttributes[attribute] === false) return true;
		if (
			attribute.startsWith('icon-') &&
			currentAttributes['icon-content'] === ''
		)
			return true;
		if (
			attribute.startsWith('icon-') &&
			currentAttributes['icon-inherit'] === true &&
			/(stroke|fill|background|border|box-shadow|gradient)/.test(attribute)
		)
			return true;
		if (
			attribute.startsWith('hover-') &&
			currentAttributes['hover-type'] === 'none'
		)
			return true;
		if (
			name.includes('image-maxi') &&
			attribute === 'mediaAlt' &&
			currentAttributes.altSelector !== 'custom'
		)
			return true;
		if (
			name.includes('image-maxi') &&
			attribute === 'altSelector' &&
			currentAttributes.altSelector !== 'custom'
		)
			return true;
		const altSelectorKey = getAltSelectorKey(attribute);
		if (
			altSelectorKey &&
			altSelectorKey in currentAttributes &&
			currentAttributes[altSelectorKey] !== 'custom'
		)
			return true;
		if (
			attribute.includes('clip-path-status') &&
			currentAttributes[attribute] === false
		)
			return true;
		if (attribute.includes('clip-path') && !attribute.includes('clip-path-status')) {
			const isHover = attribute.includes('hover');
			const clipPathStatusTarget = getClipPathStatusTarget(attribute);
			const hasBreakpointStatus = clipPathBreakpoints.some(bp => {
				const statusKey = `${clipPathStatusTarget}-${bp}${
					isHover ? '-hover' : ''
				}`;

				return statusKey in currentAttributes;
			});
			const clipPathStatus = hasBreakpointStatus
				? getLastBreakpointAttribute({
						target: clipPathStatusTarget,
						breakpoint: breakpoint ?? 'general',
						attributes: currentAttributes,
						isHover,
				  })
				: currentAttributes[
						`${clipPathStatusTarget}${isHover ? '-hover' : ''}`
				  ];

			if (!clipPathStatus) return true;
		}
		if (
			attribute.includes('clip-path') &&
			!attribute.includes('clip-path-status') &&
			(currentAttributes[attribute] === 'none' ||
				currentAttributes[attribute] === '')
		)
			return true;
		const resolvedDefault = getDefaultAttribute(
			attribute,
			selectedBlockClientId
		);

		if (breakpoint) {
			const breakpointAttributeChecker = bp => {
				if (currentAttributes[attribute] === undefined) return true;
				if (currentAttributes[attribute] === null) return true;
				if (currentAttributes[attribute] === false) return true;
				if (currentAttributes[attribute] === '') return true;
				if (
					['none', 'unset'].includes(currentAttributes[attribute]) &&
					defaultAttributes[attribute] == null
				)
					return true;
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
					isArray(currentAttributes[attribute]) &&
					currentAttributes[attribute].length === 0
				) {
					if (defaultAttributes[attribute] == null) return true;
					return isEqual(
						currentAttributes[attribute],
						defaultAttributes[attribute]
					);
				}
				if (
					attribute.lastIndexOf(`-${bp}`) ===
					attribute.length - `-${bp}`.length
				) {
					if (areEquivalent(currentAttributes[attribute], resolvedDefault))
						return true;

					if (
						defaultAttributes[attribute] == null &&
						isEqual(
							currentAttributes[attribute],
							getStyleCardDefault(attribute)
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

					if (
						defaultAttributes[generalAttribute] == null &&
						isEqual(
							currentAttributes[attribute],
							getStyleCardDefault(generalAttribute)
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
			if (resolvedDefault == null) return true;
			return areEquivalent(currentAttributes[attribute], resolvedDefault);
		}

		const breakpointMatch = attribute.match(/-(xxl|xl|l|m|s|xs)$/);
		if (breakpointMatch) {
			const generalAttribute = attribute.replace(
				`-${breakpointMatch[1]}`,
				'-general'
			);
			const resolvedAttributeDefault = getDefaultAttribute(
				attribute,
				selectedBlockClientId
			);
			const resolvedGeneralDefault = getDefaultAttribute(
				generalAttribute,
				selectedBlockClientId
			);

			if (
				(defaultAttributes[attribute] == null ||
					defaultAttributes[generalAttribute] != null) &&
				isEqual(currentAttributes[attribute], resolvedGeneralDefault)
			)
				return true;

			if (
				isEqual(currentAttributes[attribute], resolvedAttributeDefault)
			)
				return true;

			if (
				defaultAttributes[attribute] == null &&
				isEqual(
					currentAttributes[attribute],
					getStyleCardDefault(attribute)
				)
			)
				return true;

			if (
				defaultAttributes[attribute] == null &&
				isEqual(
					currentAttributes[attribute],
					getStyleCardDefault(generalAttribute)
				)
			)
				return true;
		}

		if (attribute === 'transition' && currentAttributes[attribute]) {
			const resolvedTransitionDefault = resolvedDefault ?? {};
			const normalizedTransition = mergeDefaults(
				resolvedTransitionDefault,
				currentAttributes[attribute]
			);

			if (
				Object.values(currentAttributes[attribute]).every(value =>
					value === 0 ? false : isEmpty(value)
				)
			) {
				return true;
			}

			if (
				resolvedDefault &&
				areEquivalent(normalizedTransition, resolvedTransitionDefault)
			) {
				return true;
			}
		}

		if (
			defaultAttributes[attribute] == null &&
			areEquivalent(
				currentAttributes[attribute],
				getStyleCardDefault(attribute)
			)
		)
			return true;

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

		if (
			['none', 'unset'].includes(currentAttributes[attribute]) &&
			defaultAttributes[attribute] == null
		)
			return true;

		if (currentAttributes[attribute] === '') return true;

		return areEquivalent(currentAttributes[attribute], resolvedDefault);
	});
};

export default getIsActiveTab;
