/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getAttributeKey from '../styles/getAttributeKey';
import getBreakpointFromAttribute from '../styles/getBreakpointFromAttribute';
import getDefaultAttribute from '../styles/getDefaultAttribute';
import getLastBreakpointAttribute from '../styles/getLastBreakpointAttribute';
import { getHoverAttributeKey, getNormalAttributeKey } from '../styles/utils';

/**
 * External dependencies
 */
import { isEqual, isNil, isPlainObject, pickBy, toNumber } from 'lodash';

const breakpoints = ['general', 'xl', 'l', 'm', 's', 'xs'];

const getSimpleLabel = (key, breakpoint) =>
	getNormalAttributeKey(key).slice(0, -(breakpoint.length + 1));

const getIsHover = key => key.includes('-hover');

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

		if (preserveAttr) return true;
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
	defaultAttributes
) => {
	const result = {};

	Object.entries(newAttributes).forEach(([key, value]) => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (!breakpoint || breakpoint === 'general') {
			result[key] = value;
			return;
		}

		const isXXL = breakpoint === 'xxl';
		const isHover = getIsHover(key);
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
				const generalDefaultValue =
					defaultAttributes?.[generalKey] ??
					getDefaultAttribute(generalKey, clientId, true);

				// Covers a concrete situation where we've got XXL and XL
				// values by default, but General is undefined. An example
				// is Row Maxi `max-width-unit` attribute.
				if (key in newAttributes && isNil(generalDefaultValue)) {
					result[key] = undefined;

					return;
				}

				if (isEqual(generalAttr, value)) {
					result[key] = undefined;

					return;
				}

				const defaultAttribute =
					defaultAttributes?.[key] ??
					getDefaultAttribute(key, clientId, true);

				result[key] = defaultAttribute;
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
					const attribute = attributes?.[label];
					const defaultAttribute =
						defaultAttributes?.[label] ??
						getDefaultAttribute(label, clientId, true);

					if (isEqual(value, attribute)) {
						if (isEqual(value, defaultAttribute))
							result[key] = undefined;
						else if (breakpoint === 'general') {
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
						} else if (breakpoint !== 'general') {
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
	defaultAttributes
) => {
	const result = {};

	// This is an array of attributes labels used by handleSetAttributes to determine
	// if the new attributes are containing attributes that were saved just before and are
	// the same value but with new added content. For example, it happens with numbers coming
	// from ANC, that they are saved more than once while writing the whole number.
	const prevSavedAttrs = select('maxiBlocks/styles').getPrevSavedAttrs();

	Object.entries(newAttributes).forEach(([key, value]) => {
		if (isNil(value)) return;

		const breakpoint = getBreakpointFromAttribute(key);

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
					const simpleLabel = getSimpleLabel(attr, attrBreakpoint);

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
							isNil(attributes[label])
						)
							result[label] = prevValue;
					});
				}
			}

			if (attr in newAttributes) return;

			const currentBreakpoint =
				select('maxiBlocks').receiveMaxiDeviceType();

			if (attrBreakpoint === 'general') {
				const isHover = getIsHover(attr);
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
					result[`${getSimpleLabel(key, attrBreakpoint)}-general`] =
						value;
				}
				if (currentBreakpoint === attrBreakpoint) result[key] = value;
			}
		});

		if (!breakpoint) {
			result[key] = value;
			return;
		}
		if (breakpoint !== 'general') return;

		const isHover = getIsHover(key);
		const simpleLabel = getSimpleLabel(key, breakpoint);
		const keyOnXXL = getAttributeKey(simpleLabel, isHover, '', 'xxl');
		const attrOnXXL = attributes[keyOnXXL];

		if (!isNil(attrOnXXL) && isEqual(value, attrOnXXL))
			result[keyOnXXL] = undefined;

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
			else if (isEqual(value, attribute)) result[label] = undefined;
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

		const isHover = getIsHover(key);
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
 * Removes new saved responsive attributes on base breakpoint that have the same value
 * than the saved general ones.
 */
const removeSameAsGeneral = (
	newAttributes,
	attributes,
	clientId,
	defaultAttributes
) => {
	const result = {};

	Object.entries(newAttributes).forEach(([key, value]) => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (!breakpoint) {
			result[key] = value;
			return;
		}

		const shouldPreserveAttribute = getShouldPreserveAttribute(
			attributes,
			breakpoint,
			key,
			value,
			newAttributes
		);

		if (shouldPreserveAttribute) {
			result[key] = value;
			return;
		}

		const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();
		const baseLabel = key.replace(`-${breakpoint}`, `-${baseBreakpoint}`);
		const baseAttr = attributes?.[baseLabel];
		const defaultBaseAttribute =
			defaultAttributes?.[baseLabel] ??
			getDefaultAttribute(baseLabel, clientId, true);

		if (breakpoint !== 'general') {
			if (key !== baseLabel || !isNil(defaultBaseAttribute))
				result[key] = value;
			else result[baseLabel] = undefined;

			return;
		}

		if (
			isNil(defaultBaseAttribute) ||
			isEqual(defaultBaseAttribute, newAttributes[baseLabel])
		) {
			if (!isNil(baseAttr)) result[baseLabel] = undefined;
			if (baseLabel in newAttributes) result[baseLabel] = undefined;
		}

		result[key] = value;
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
	defaultAttributes
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
		const isHover = getIsHover(key);
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
			if (isGeneral) {
				const baseBreakpoint =
					select('maxiBlocks').receiveBaseBreakpoint();

				if (breakpoint === baseBreakpoint) {
					if (label in newAttributes) return;
					result[label] = defaultAttribute;
					return;
				}
			}

			const generalAttribute = {
				...defaultAttributes,
				...attributes,
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
 * Ensures a new saved attribute with a breakpoint higher than baseBreakpoint returns
 * general value for baseBreakpoint attribute in order to avoid a visual bug between
 * editor and frontend, as in editor, with baseBreakpoint selected it will show the
 * general value, and in frontend, that value would be overwrite by the higher breakpoint
 * attribute value and its media query.
 */
const preserveBaseBreakpoint = (newAttributes, attributes) => {
	const result = {};

	Object.entries(newAttributes).forEach(([key, value]) => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (!breakpoint || breakpoint === 'general' || isNil(value)) return;

		const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();
		const isHigherThanBase =
			breakpoints.indexOf(breakpoint) <
				breakpoints.indexOf(baseBreakpoint) && breakpoint !== 'xxl';

		if (!isHigherThanBase) return;

		const isHover = getIsHover(key);
		const simpleLabel = getSimpleLabel(key, breakpoint);
		const baseLabel = getAttributeKey(
			simpleLabel,
			isHover,
			'',
			baseBreakpoint
		);
		const baseAttr = { ...attributes, ...newAttributes }?.[baseLabel];
		const generalAttr = { ...attributes, ...newAttributes }?.[
			getAttributeKey(simpleLabel, isHover, '', 'general')
		];

		if (!isEqual(baseAttr, generalAttr) && !isEqual(generalAttr, value))
			result[baseLabel] = generalAttr;
	});

	return result;
};

const cleanAttributes = ({
	newAttributes,
	attributes,
	clientId,
	defaultAttributes,
}) => {
	const containsBreakpoint = Object.keys(newAttributes).some(
		key => !!getBreakpointFromAttribute(key)
	);

	let result = { ...newAttributes };

	result = {
		...result,
		...removeHoverSameAsNormal(result, attributes),
	};

	if (!containsBreakpoint) return result;

	result = {
		...result,
		...removeSameAsGeneral(result, attributes, clientId, defaultAttributes),
	};
	result = {
		...result,
		...flatSameAsPrev(result, attributes, clientId, defaultAttributes),
	};
	result = {
		...result,
		...flatWithGeneral(result, attributes, clientId, defaultAttributes),
	};
	result = {
		...result,
		...flatNewAttributes(result, attributes, clientId, defaultAttributes),
	};
	result = {
		...result,
		...flatLowerAttr(result, attributes, clientId, defaultAttributes),
	};
	result = {
		...result,
		...preserveBaseBreakpoint(result, attributes),
	};

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
		})
	);

	return result;
};

export default cleanAttributes;
