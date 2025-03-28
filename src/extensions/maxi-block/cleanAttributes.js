/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getAttributeKey from '@extensions/styles/getAttributeKey';
import getDefaultAttribute from '@extensions/styles/getDefaultAttribute';
import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';
import {
	getHoverAttributeKey,
	getNormalAttributeKey,
	getBreakpointFromAttribute,
	attrExistsOnResponsive,
	getIsHoverAttribute,
	getSimpleLabel,
} from '@extensions/styles/utils';

/**
 * External dependencies
 */
import { isEqual, isNil, isPlainObject, pickBy, toNumber } from 'lodash';

const breakpoints = ['general', 'xl', 'l', 'm', 's', 'xs'];

const getShouldPreserveAttribute = (
	attributes,
	breakpoint,
	key,
	value,
	newAttributes
) => {
	const prevAttrsBreakpoints = [...breakpoints]
		.slice(0, breakpoints.indexOf(breakpoint))
		.filter(
			bp => `${key.replace(`-${breakpoint}`, `-${bp}`)}` in attributes
		);
	const existPrevAttr = prevAttrsBreakpoints.length > 1; // 1 as includes 'general'

	if (existPrevAttr) {
		// In case we are saving an attribute from winBase === deviceType (general + winBase)
		// and there's a previous saved attribute on a higher breakpoint with different value,
		// we save both general and winBase attributes to ensure correct frontend rendering.
		const preserveAttr = prevAttrsBreakpoints
			.filter(bp => bp !== 'general')
			.some(bp => {
				const prevAttr = { ...attributes, ...newAttributes }[
					`${key.replace(`-${breakpoint}`, `-${bp}`)}`
				];

				return !isNil(prevAttr) && !isEqual(prevAttr, value);
			});

		return preserveAttr;
	}

	return false;
};

/**
 * In case we are saving a breakpoint attribute that has the same value as its
 * previous saved valid attribute, it will be returned to its default value.
 */
const flatSameAsPrev = (
	newAttributes,
	attributes,
	clientId,
	defaultAttributes,
	allowXXLOverGeneral,
	isStyleCard
) => {
	const result = {};

	Object.entries(newAttributes).forEach(([key, value]) => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (!breakpoint || breakpoint === 'general') {
			result[key] = value;
			return;
		}

		const isXXL = breakpoint === 'xxl';
		const isHover = getIsHoverAttribute(key);
		const simpleLabel = getSimpleLabel(key, breakpoint);
		if (isXXL) {
			const generalKey = getAttributeKey(
				simpleLabel,
				isHover,
				'',
				'general'
			);
			const generalAttr = attributes[generalKey];

			if (!isNil(generalAttr) && isEqual(generalAttr, value)) {
				if (allowXXLOverGeneral) return;

				const generalDefaultValue =
					defaultAttributes?.[generalKey] ??
					getDefaultAttribute(generalKey, clientId, true);

				// Covers a concrete situation where we've got XXL and XL
				// values by default, but General is undefined. An example
				// is Row Maxi `max-width-unit` attribute.
				if (
					!isStyleCard &&
					key in newAttributes &&
					isNil(generalDefaultValue)
				) {
					result[key] = undefined;
					return;
				}

				if (!isStyleCard && isEqual(generalAttr, value)) {
					result[key] = undefined;

					return;
				}

				if (!isStyleCard) {
					const defaultAttribute =
						defaultAttributes?.[key] ??
						getDefaultAttribute(key, clientId, true);

					result[key] = defaultAttribute;
				}
			}
		} else {
			let breakpointLock = false;

			const higherBreakpoints = breakpoints.slice(
				0,
				breakpoints.indexOf(breakpoint)
			);

			higherBreakpoints.reverse().forEach(breakpoint => {
				if (!breakpointLock) {
					const label = getAttributeKey(
						simpleLabel,
						isHover,
						'',
						breakpoint
					);
					const attribute =
						label in newAttributes
							? newAttributes[label]
							: attributes?.[label];
					const defaultAttribute =
						defaultAttributes?.[label] ??
						getDefaultAttribute(label, clientId, true);

					if (isEqual(value, attribute)) {
						if (isEqual(value, defaultAttribute))
							result[key] = undefined;
						else if (!isStyleCard && breakpoint === 'general') {
							const generalAttr =
								attributes[
									getAttributeKey(
										simpleLabel,
										isHover,
										'',
										'general'
									)
								];

							if (
								!isNil(generalAttr) &&
								isEqual(generalAttr, value)
							) {
								result[key] = undefined;
							}
						} else if (!isStyleCard && breakpoint !== 'general') {
							const currentDefaultAttribute =
								defaultAttributes?.[key] ??
								getDefaultAttribute(key, clientId, true);

							if (!isEqual(value, currentDefaultAttribute))
								result[key] = defaultAttribute;
							else result[key] = currentDefaultAttribute;
						} else if (!isNil(attribute)) breakpointLock = true;
					} else if (!isNil(attribute)) breakpointLock = true;
				}
			});
		}
	});

	return result;
};

/**
 * In case we save an attribute on general breakpoint, and it coincides
 * with its closest breakpoint attribute with same valid value, we will return
 * this last one to its default value making general value prevail above it.
 */
const flatWithGeneral = (
	newAttributes,
	attributes,
	clientId,
	targetClientId,
	defaultAttributes,
	allowXXLOverGeneral,
	isStyleCard
) => {
	const result = {};

	// This is an array of attributes labels used by handleSetAttributes to determine
	// if the new attributes are containing attributes that were saved just before and are
	// the same value but with new added content. For example, it happens with numbers coming
	// from ANC, that they are saved more than once while writing the whole number.
	const { prevSavedAttrs, prevSavedAttrsClientId } =
		select('maxiBlocks/styles').getPrevSavedAttrs();

	Object.entries(newAttributes).forEach(([key, value]) => {
		if (isNil(value)) return;

		const breakpoint = getBreakpointFromAttribute(key);
		const currentClientId = targetClientId ?? clientId;

		if (prevSavedAttrsClientId === currentClientId) {
			prevSavedAttrs.forEach(attr => {
				const prevValue = attributes[attr];
				const attrBreakpoint = getBreakpointFromAttribute(attr);

				/**
				 * In case if after cleaning lower breakpoint attributes,
				 * because they were the same with higher, on the next iteration
				 * if higher attribute different from the previous one by number of digits(1 less or more) or
				 * by value(1 less or more), cleaned lower breakpoint attribute will be restored.
				 */
				if (attr === key && !isNil(prevValue)) {
					const recursiveSum = attrValue => {
						if (isNil(attrValue)) return 0;

						if (isPlainObject(attrValue)) {
							return Object.values(attrValue).reduce(
								(acc, val) => acc + recursiveSum(val),
								0
							);
						}

						return toNumber(attrValue) || 0;
					};

					const prevValueSum = recursiveSum(prevValue);
					const valueSum = recursiveSum(value);

					const isChangingDigitsNumber = (firstValue, secondValue) =>
						firstValue.toString().length + 1 ===
							secondValue.toString().length &&
						secondValue.toString().startsWith(firstValue);

					const isAdjustingNumber = (firstValue, secondValue) =>
						Math.abs(firstValue - secondValue) === 1;

					if (
						isAdjustingNumber(prevValueSum, valueSum) ||
						isChangingDigitsNumber(prevValueSum, valueSum) ||
						isChangingDigitsNumber(valueSum, prevValueSum)
					) {
						const simpleLabel = getSimpleLabel(
							attr,
							attrBreakpoint
						);

						['xxl', ...breakpoints].forEach(breakpoint => {
							if (
								breakpoint === attrBreakpoint ||
								breakpoint === 'general'
							)
								return;

							const label = `${simpleLabel}-${breakpoint}`;

							if (
								prevSavedAttrs.includes(label) &&
								isNil(prevSavedAttrs[label]) &&
								isNil(attributes[label]) &&
								isNil(newAttributes[label])
							)
								result[label] = prevValue;
						});
					}
				}

				if (attr in newAttributes) return;

				const currentBreakpoint =
					select('maxiBlocks').receiveMaxiDeviceType();

				if (attrBreakpoint === 'general') {
					const isHover = getIsHoverAttribute(attr);
					const simpleLabel = getSimpleLabel(attr, attrBreakpoint);

					const generalKey = getAttributeKey(
						simpleLabel,
						isHover,
						'',
						'general'
					);
					const generalAttr = attributes[generalKey];

					if (
						getAttributeKey(
							simpleLabel,
							isHover,
							'',
							currentBreakpoint
						) === key &&
						value.toString().startsWith(generalAttr)
					) {
						result[key] = undefined;
						result[generalKey] = value;
					}

					return;
				}

				const currentAttr = getLastBreakpointAttribute({
					target: getSimpleLabel(attr, attrBreakpoint),
					breakpoint: attrBreakpoint,
					attributes,
				});

				if (attr === key && value.toString().startsWith(currentAttr)) {
					if (currentBreakpoint === 'general') {
						result[key] = undefined;
						result[
							`${getSimpleLabel(key, attrBreakpoint)}-general`
						] = value;
					}
					if (currentBreakpoint === attrBreakpoint)
						result[key] = value;
				}
			});
		}

		if (!breakpoint) {
			result[key] = value;
			return;
		}
		if (breakpoint !== 'general') return;

		const isHover = getIsHoverAttribute(key);
		const simpleLabel = getSimpleLabel(key, breakpoint);

		if (!isStyleCard) {
			const keyOnXXL = getAttributeKey(simpleLabel, isHover, '', 'xxl');
			const attrOnXXL = attributes[keyOnXXL];

			if (
				!isNil(attrOnXXL) &&
				isEqual(value, attrOnXXL) &&
				!allowXXLOverGeneral
			)
				result[keyOnXXL] = undefined;
		}

		let breakpointLock = false;

		breakpoints.forEach(breakpoint => {
			if (breakpointLock || breakpoint === 'general') return;

			const label = getAttributeKey(simpleLabel, isHover, '', breakpoint);
			const attribute = { ...attributes, ...newAttributes }?.[label];

			if (isNil(attribute)) return;

			const defaultAttribute =
				defaultAttributes?.[label] ??
				getDefaultAttribute(label, clientId, true);

			if (isNil(attribute) && isEqual(value, attribute))
				if (!isEqual(value, defaultAttribute))
					result[label] = defaultAttribute;
				else result[label] = undefined;
			else if (!isStyleCard && isEqual(value, attribute))
				result[label] = undefined;
			else if (!isNil(attribute)) breakpointLock = true;
		});
	});

	return result;
};

/**
 * Flat new saving attributes in case they are going to be saved together with same value
 */
const flatNewAttributes = (
	newAttributes,
	attributes,
	clientId,
	defaultAttributes
) => {
	const result = {};

	Object.entries(newAttributes).forEach(([key, value]) => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (!breakpoint || breakpoint === 'general') {
			result[key] = value;
			return;
		}

		const isHover = getIsHoverAttribute(key);
		const simpleLabel = getSimpleLabel(key, breakpoint);
		const generalKey = getAttributeKey(simpleLabel, isHover, '', 'general');
		const existsGeneralAttr = generalKey in newAttributes;

		if (!existsGeneralAttr) return;

		const generalAttr = newAttributes[generalKey];

		if (!isNil(generalAttr) && isEqual(generalAttr, value)) {
			const shouldPreserveAttribute = getShouldPreserveAttribute(
				attributes,
				breakpoint,
				key,
				value,
				newAttributes
			);

			if (shouldPreserveAttribute) result[key] = value;
			else {
				if (breakpoint === 'xxl' && value === generalAttr) {
					result[key] = undefined;
					return;
				}

				const defaultAttribute =
					defaultAttributes?.[key] ??
					getDefaultAttribute(key, clientId, true);

				result[key] = defaultAttribute;
			}
		}
	});

	return result;
};

/**
 * Removes hover attributes that coincide with normal ones.
 */
const removeHoverSameAsNormal = (newAttributes, attributes) => {
	const getValue = key =>
		key in newAttributes ? newAttributes[key] : attributes[key];

	const result = { ...newAttributes };

	Object.entries(newAttributes).forEach(([key]) => {
		const breakpoint = getBreakpointFromAttribute(key);
		// If hover value is on responsive there is possibly hover value on higher breakpoint
		// that will overwrite the responsive value if it is deleted,
		// so need to keep the responsive values.
		if (!breakpoint || breakpoint === 'general') {
			const hoverKey = getHoverAttributeKey(key);
			const hoverValue = getValue(hoverKey);
			const normalValue = getValue(getNormalAttributeKey(key));

			if (
				!hoverKey.includes('menu-item-sub-bg-hover') &&
				!hoverKey.includes('link-hover-palette-sc-status') &&
				isEqual(hoverValue, normalValue) &&
				!isNil(hoverValue) &&
				!getDefaultAttribute(hoverKey)
			) {
				result[hoverKey] = undefined;
			}
		}
	});

	return result;
};

/**
 * Remove lower responsive saved attributes equal to new attributes (not just general).
 */
const flatLowerAttr = (
	newAttributes,
	attributes,
	clientId,
	defaultAttributes,
	isStyleCard
) => {
	const result = {};

	Object.entries(newAttributes).forEach(([key, value]) => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (!breakpoint) {
			result[key] = value;
			return;
		}
		if (breakpoint === 'xxl') return;

		const isGeneral = breakpoint === 'general';
		const isHover = getIsHoverAttribute(key);
		const simpleLabel = getSimpleLabel(key, breakpoint);
		const lowerBreakpoints = breakpoints.slice(
			breakpoints.indexOf(breakpoint) + 1
		);

		let breakpointLock = false;

		lowerBreakpoints.forEach(breakpoint => {
			if (breakpointLock) return;

			const label = getAttributeKey(simpleLabel, isHover, '', breakpoint);
			const attribute = attributes?.[label];

			if (isNil(attribute)) return;

			const defaultAttribute =
				defaultAttributes?.[label] ??
				getDefaultAttribute(label, clientId, true);

			if (!isStyleCard) {
				const generalKey = getAttributeKey(
					simpleLabel,
					isHover,
					'',
					'general'
				);

				if (isEqual(value, attribute)) {
					// Covers a concrete situation where we've got XXL and XL
					// values by default, but General is undefined. An example
					// is Row Maxi `max-width-unit` attribute.
					if (label in newAttributes && isGeneral) {
						const generalDefaultValue =
							defaultAttributes?.[generalKey] ??
							getDefaultAttribute(generalKey, clientId, true);

						if (isNil(generalDefaultValue)) {
							result[label] = generalDefaultValue;

							return;
						}
					} else result[label] = defaultAttribute;

					return;
				}
			}

			if (isGeneral) {
				const baseBreakpoint =
					select('maxiBlocks').receiveBaseBreakpoint();

				if (breakpoint === baseBreakpoint) {
					if (label in newAttributes) return;
					result[label] = defaultAttribute;
					return;
				}
				if (isStyleCard) return;
			}

			const generalKey = getAttributeKey(
				simpleLabel,
				isHover,
				'',
				'general'
			);

			const generalAttribute = {
				...defaultAttributes,
				...attributes,
				...newAttributes,
			}?.[generalKey];

			if (isEqual(attribute, generalAttribute)) {
				const shouldPreserveAttribute = getShouldPreserveAttribute(
					attributes,
					breakpoint,
					label,
					attribute,
					newAttributes
				);

				if (!shouldPreserveAttribute) result[label] = defaultAttribute;

				return;
			}

			if (!isEqual(value, defaultAttribute)) breakpointLock = true;
		});
	});

	return result;
};

/**
 * Ensures that baseBreakpoint attribute value is the same as general attribute value
 * in case a responsive attribute exists with a different value. This ensures that when switching baseBreakpoint,
 * the value on previous baseBreakpoint will be saved.
 *
 * Also ensures a new saved attribute with a breakpoint higher than baseBreakpoint returns
 * general value for baseBreakpoint attribute in order to avoid a visual bug between
 * editor and frontend, as in editor, with baseBreakpoint selected it will show the
 * general value, and in frontend, that value would be overwrite by the higher breakpoint
 * attribute value and its media query.
 */
const preserveBaseBreakpoint = (newAttributes, attributes) => {
	const result = {};
	const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();

	Object.entries(newAttributes).forEach(([key, value]) => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (
			!breakpoint ||
			(breakpoint === 'general' &&
				!attrExistsOnResponsive(
					{ ...attributes, ...newAttributes },
					key,
					baseBreakpoint
				)) ||
			breakpoint === baseBreakpoint ||
			isNil(value)
		)
			return;

		const isHover = getIsHoverAttribute(key);
		const simpleLabel = getSimpleLabel(key, breakpoint);
		const baseLabel = getAttributeKey(
			simpleLabel,
			isHover,
			'',
			baseBreakpoint
		);
		const baseAttr = { ...attributes, ...newAttributes }?.[baseLabel];
		const generalLabel = getAttributeKey(
			simpleLabel,
			isHover,
			'',
			'general'
		);
		const newGeneralAttr = newAttributes?.[generalLabel];
		const generalAttr = { ...attributes, ...newAttributes }?.[generalLabel];

		if (
			(!isNil(newGeneralAttr) &&
				!isEqual(baseAttr, generalAttr) &&
				!isEqual(generalAttr, value)) ||
			(!isNil(generalAttr) &&
				isNil(baseAttr) &&
				!isEqual(generalAttr, value)) ||
			(breakpoint === 'general' && baseAttr !== newGeneralAttr)
		)
			result[baseLabel] = generalAttr;
	});

	return result;
};

const cleanAttributes = ({
	newAttributes,
	attributes,
	clientId,
	targetClientId,
	defaultAttributes,
	allowXXLOverGeneral = false,
	isStyleCard = false,
}) => {
	const containsBreakpoint = Object.keys(newAttributes).some(
		key => !!getBreakpointFromAttribute(key)
	);

	let result = { ...newAttributes };
	// console.log('result', result);

	result = {
		...result,
		...removeHoverSameAsNormal(result, attributes),
	};
	// console.log('result after removeHoverSameAsNormal', result);
	if (!containsBreakpoint) return result;

	result = {
		...result,
		...flatSameAsPrev(
			result,
			attributes,
			clientId,
			defaultAttributes,
			allowXXLOverGeneral,
			isStyleCard
		),
	};
	// console.log('result after flatSameAsPrev', result);
	result = {
		...result,
		...flatWithGeneral(
			result,
			attributes,
			clientId,
			targetClientId,
			defaultAttributes,
			allowXXLOverGeneral,
			isStyleCard
		),
	};
	// console.log('result after flatWithGeneral', result);
	result = {
		...result,
		...flatNewAttributes(result, attributes, clientId, defaultAttributes),
	};
	// console.log('result after flatNewAttributes', result);
	result = {
		...result,
		...flatLowerAttr(
			result,
			attributes,
			clientId,
			defaultAttributes,
			isStyleCard
		),
	};
	// console.log('result after flatLowerAttr', result);
	result = {
		...result,
		...preserveBaseBreakpoint(result, attributes),
	};
	// console.log('result after preserveBaseBreakpoint', result);
	dispatch('maxiBlocks/styles').savePrevSavedAttrs(
		pickBy(result, (value, key) => {
			const breakpoint = getBreakpointFromAttribute(key);
			const simpleLabel = getSimpleLabel(key, breakpoint);
			const higherAttr = getLastBreakpointAttribute({
				target: simpleLabel,
				attributes,
				breakpoint: breakpoints[breakpoints.indexOf(breakpoint) - 1],
			});

			return (
				value !== attributes[key] &&
				(isNil(higherAttr) || attributes[key] !== higherAttr)
			);
		}),
		// For IB we need to check default attributes of target block, while saving previous attributes of trigger block, thus we have two clientIds
		targetClientId ?? clientId
	);
	return result;
};

export default cleanAttributes;
