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

const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

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
 * Helper function to check if a key is a unit key
 */
const isUnitKey = key => key.includes('-unit');

/**
 * Helper function to get the linked value key from a unit key
 */
const getValueKeyFromUnitKey = key => {
	// Replace the '-unit-{breakpoint}' with '-{breakpoint}'
	if (key.includes('-unit-')) {
		return key.replace('-unit-', '-');
	}
	// Handle case where it might be just '-unit' at the end
	return key.replace('-unit', '');
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
	allowXXLOverGeneral
) => {
	console.log('=============== flatWithGeneral ===================');
	console.log('flatWithGeneral - Input parameters:', {
		newAttributes,
		attributes,
		clientId,
		targetClientId,
		defaultAttributes,
		allowXXLOverGeneral,
	});

	const result = {};

	const { prevSavedAttrs, prevSavedAttrsClientId } =
		select('maxiBlocks/styles').getPrevSavedAttrs();

	console.log('flatWithGeneral - Previous saved attributes:', {
		prevSavedAttrs,
		prevSavedAttrsClientId,
	});

	Object.entries(newAttributes).forEach(([key, value]) => {
		console.log('flatWithGeneral - Processing attribute:', {
			key,
			value,
		});

		if (isNil(value)) {
			console.log('flatWithGeneral - Skipping nil value for key:', key);
			return;
		}

		const breakpoint = getBreakpointFromAttribute(key);
		const currentClientId = targetClientId ?? clientId;

		console.log('flatWithGeneral - Attribute details:', {
			breakpoint,
			currentClientId,
		});

		if (prevSavedAttrsClientId === currentClientId) {
			console.log(
				'flatWithGeneral - Processing previous saved attributes for matching clientId'
			);

			prevSavedAttrs.forEach(attr => {
				const prevValue = attributes[attr];
				const attrBreakpoint = getBreakpointFromAttribute(attr);

				console.log('flatWithGeneral - Previous attribute details:', {
					attr,
					prevValue,
					attrBreakpoint,
				});

				if (attr === key && !isNil(prevValue)) {
					console.log(
						'flatWithGeneral - Found matching previous attribute'
					);

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

					console.log('flatWithGeneral - Value sums:', {
						prevValueSum,
						valueSum,
					});

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
						console.log(
							'flatWithGeneral - Number adjustment detected'
						);

						const simpleLabel = getSimpleLabel(
							attr,
							attrBreakpoint
						);

						breakpoints.forEach(breakpoint => {
							if (
								breakpoint === attrBreakpoint ||
								breakpoint === 'general'
							)
								return;

							const label = `${simpleLabel}-${breakpoint}`;

							console.log(
								'flatWithGeneral - Processing breakpoint:',
								{
									breakpoint,
									label,
								}
							);

							if (
								prevSavedAttrs.includes(label) &&
								isNil(prevSavedAttrs[label]) &&
								isNil(attributes[label]) &&
								isNil(newAttributes[label])
							) {
								console.log(
									'flatWithGeneral - Restoring previous value for label:',
									label
								);
								result[label] = prevValue;
							}
						});
					}
				}

				if (attr in newAttributes) {
					console.log(
						'flatWithGeneral - Attribute exists in newAttributes:',
						attr
					);
					return;
				}

				const currentBreakpoint =
					select('maxiBlocks').receiveMaxiDeviceType();

				console.log(
					'flatWithGeneral - Current device breakpoint:',
					currentBreakpoint
				);

				if (attrBreakpoint === 'general') {
					const isHover = getIsHoverAttribute(attr);
					const simpleLabel = getSimpleLabel(attr, attrBreakpoint);

					console.log(
						'flatWithGeneral - Processing general breakpoint:',
						{
							isHover,
							simpleLabel,
						}
					);

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
						console.log(
							'flatWithGeneral - Updating general attributes:',
							{
								key,
								generalKey,
							}
						);
						result[key] = value;
						result[generalKey] = value;
					}

					return;
				}

				const currentAttr = getLastBreakpointAttribute({
					target: getSimpleLabel(attr, attrBreakpoint),
					breakpoint: attrBreakpoint,
					attributes,
				});

				console.log(
					'flatWithGeneral - Current attribute value:',
					currentAttr
				);

				if (attr === key && value.toString().startsWith(currentAttr)) {
					console.log(
						'flatWithGeneral - Value matches current attribute'
					);

					if (currentBreakpoint === 'general') {
						result[key] = value;
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
			console.log('flatWithGeneral - No breakpoint for key:', key);
			result[key] = value;
			return;
		}
		if (breakpoint !== 'general') {
			const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();

			console.log(
				'flatWithGeneral - Processing non-general breakpoint:',
				{
					breakpoint,
					baseBreakpoint,
				}
			);

			// Check if current breakpoint is higher than base breakpoint
			const isHigherBreakpoint =
				breakpoints.indexOf(breakpoint) <
				breakpoints.indexOf(baseBreakpoint);

			console.log('flatWithGeneral - Breakpoint comparison:', {
				isHigherBreakpoint,
				breakpointIndex: breakpoints.indexOf(breakpoint),
				baseBreakpointIndex: breakpoints.indexOf(baseBreakpoint),
			});

			if (isHigherBreakpoint) {
				const simpleLabel = getSimpleLabel(key, breakpoint);
				const isHover = getIsHoverAttribute(key);

				console.log('flatWithGeneral - Processing higher breakpoint:', {
					simpleLabel,
					isHover,
				});

				// Get the previous value at the breakpoint we're changing
				const previousValue = attributes?.[key];

				console.log('flatWithGeneral - Previous value:', {
					key,
					previousValue,
				});

				// Handle unit keys and their linked values
				let previousUnitValue;
				let unitValue;
				let valueKey;
				let previousLinkedValue;
				let linkedValue;

				if (isUnitKey(key)) {
					// For unit keys, get the linked value key and its values
					valueKey = getValueKeyFromUnitKey(key);
					previousLinkedValue = attributes?.[valueKey];
					linkedValue = newAttributes[valueKey];

					console.log('flatWithGeneral - Unit key processing:', {
						valueKey,
						previousLinkedValue,
						linkedValue,
					});
				} else {
					// For regular keys, get the unit key and its values
					const unitKey = `${getAttributeKey(
						simpleLabel,
						isHover,
						'',
						'unit'
					)}-${breakpoint}`;
					previousUnitValue = attributes?.[unitKey];
					unitValue = newAttributes[unitKey];

					console.log('flatWithGeneral - Regular key processing:', {
						unitKey,
						previousUnitValue,
						unitValue,
					});
				}

				// Get all breakpoints between current and base (inclusive)
				const breakpointsToUpdate = breakpoints.slice(
					breakpoints.indexOf(breakpoint),
					breakpoints.indexOf(baseBreakpoint) + 1
				);

				console.log('flatWithGeneral - Breakpoints to update:', {
					breakpointsToUpdate,
					from: breakpoint,
					to: baseBreakpoint,
				});

				// Update each breakpoint, skipping those with unique values
				breakpointsToUpdate.forEach(bp => {
					const bpKey = getAttributeKey(simpleLabel, isHover, '', bp);

					console.log(
						'flatWithGeneral - Processing update breakpoint:',
						{
							bp,
							bpKey,
						}
					);

					// Handle unit keys and their linked values
					let bpUnitKey;
					let currentBpUnitValue;
					let bpValueKey;
					let currentBpLinkedValue;

					if (isUnitKey(key)) {
						// For unit keys, get the linked value key and its value
						bpValueKey = getValueKeyFromUnitKey(bpKey);
						currentBpLinkedValue = attributes?.[bpValueKey];

						console.log('flatWithGeneral - Breakpoint unit key:', {
							bpValueKey,
							currentBpLinkedValue,
						});
					} else {
						// For regular keys, get the unit key and its value
						bpUnitKey = `${getAttributeKey(
							simpleLabel,
							isHover,
							'',
							'unit'
						)}-${bp}`;
						currentBpUnitValue = attributes?.[bpUnitKey];

						console.log(
							'flatWithGeneral - Breakpoint regular key:',
							{
								bpUnitKey,
								currentBpUnitValue,
							}
						);
					}

					// Check if this breakpoint has a unique value
					const currentBpValue = attributes?.[bpKey];

					console.log('flatWithGeneral - Current breakpoint value:', {
						currentBpValue,
						previousValue,
					});

					// If current value matches the previous value at the changed breakpoint,
					// it means this breakpoint was inheriting that value (not unique)
					const matchesPreviousValue = isEqual(
						currentBpValue,
						previousValue
					);

					let matchesPreviousUnit;
					if (isUnitKey(key)) {
						// For unit keys, compare the linked values
						matchesPreviousUnit = isEqual(
							currentBpLinkedValue,
							previousLinkedValue
						);
					} else {
						// For regular keys, compare the unit values
						matchesPreviousUnit = isEqual(
							currentBpUnitValue,
							previousUnitValue
						);
					}

					console.log('flatWithGeneral - Value comparisons:', {
						matchesPreviousValue,
						matchesPreviousUnit,
					});

					// Update if this breakpoint was inheriting the value we're changing
					if (matchesPreviousValue && matchesPreviousUnit) {
						console.log(
							'flatWithGeneral - Updating inherited value:',
							{
								bpKey,
								value,
							}
						);

						result[bpKey] = value;
						if (isUnitKey(key) && linkedValue !== undefined) {
							// For unit keys, update the linked value
							result[bpValueKey] = linkedValue;
							console.log(
								'flatWithGeneral - Updated linked value:',
								{
									bpValueKey,
									linkedValue,
								}
							);
						} else if (!isUnitKey(key) && unitValue) {
							// For regular keys, update the unit value
							result[bpUnitKey] = unitValue;
							console.log(
								'flatWithGeneral - Updated unit value:',
								{
									bpUnitKey,
									unitValue,
								}
							);
						}
					}
				});

				// Update general only if it matches the previous value at changed breakpoint
				const generalKey = getAttributeKey(
					simpleLabel,
					isHover,
					'',
					'general'
				);
				const generalValue = attributes?.[generalKey];

				// Handle unit keys and their linked values for general breakpoint
				let generalUnitKey;
				let generalUnitValue;
				let generalValueKey;
				let generalLinkedValue;

				if (isUnitKey(key)) {
					// For unit keys, get the linked value key and its value
					generalValueKey = getValueKeyFromUnitKey(generalKey);
					generalLinkedValue = attributes?.[generalValueKey];
				} else {
					// For regular keys, get the unit key and its value
					generalUnitKey = `${getAttributeKey(
						simpleLabel,
						isHover,
						'',
						'unit'
					)}-general`;
					generalUnitValue = attributes?.[generalUnitKey];
				}

				let matchesGeneralCondition;
				if (isUnitKey(key)) {
					// For unit keys, check if general linked value matches previous linked value
					matchesGeneralCondition =
						isEqual(generalValue, previousValue) &&
						isEqual(generalLinkedValue, previousLinkedValue);
				} else {
					// For regular keys, check if general value and unit match previous values
					matchesGeneralCondition =
						isEqual(generalValue, previousValue) &&
						isEqual(generalUnitValue, previousUnitValue);
				}

				if (matchesGeneralCondition) {
					result[generalKey] = value;
					if (isUnitKey(key) && linkedValue !== undefined) {
						// For unit keys, update the linked general value
						result[generalValueKey] = linkedValue;
					} else if (!isUnitKey(key) && unitValue) {
						// For regular keys, update the general unit value
						result[generalUnitKey] = unitValue;
					}
				}
			}
		}
		const isHover = getIsHoverAttribute(key);
		const simpleLabel = getSimpleLabel(key, breakpoint);

		let breakpointLock = false;

		breakpoints.forEach(breakpoint => {
			if (breakpointLock) {
				console.log(
					'flatWithGeneral - Breakpoint locked, skipping:',
					breakpoint
				);
				return;
			}

			const label = getAttributeKey(simpleLabel, isHover, '', breakpoint);
			const attribute = { ...attributes, ...newAttributes }?.[label];

			console.log('flatWithGeneral - Processing breakpoint iteration:', {
				breakpoint,
				label,
				attribute,
				value,
			});

			if (isNil(attribute) && isEqual(value, attribute)) {
				console.log('flatWithGeneral - Nil attribute match found');

				// Handle unit keys and their linked values
				let unitValue;
				let defaultUnitValue;
				let valueKey;
				let linkedValue;
				let defaultLinkedValue;

				if (isUnitKey(key)) {
					// For unit keys, get the linked value key and its values
					valueKey = getValueKeyFromUnitKey(label);
					linkedValue = attributes[valueKey];
					const defaultValueKey = getValueKeyFromUnitKey(
						`${getAttributeKey(
							simpleLabel,
							isHover,
							'',
							'general'
						)}`
					);
					defaultLinkedValue = defaultAttributes?.[defaultValueKey];

					console.log('flatWithGeneral - Unit key values:', {
						valueKey,
						linkedValue,
						defaultValueKey,
						defaultLinkedValue,
					});
				} else {
					// For regular keys, get the unit key and its values
					const unitKey = `${getAttributeKey(
						simpleLabel,
						isHover,
						'',
						'unit'
					)}-${breakpoint}`;
					unitValue = newAttributes[unitKey];
					const defaultUnitKey = `${getAttributeKey(
						simpleLabel,
						isHover,
						'',
						'unit'
					)}-general`;
					defaultUnitValue = defaultAttributes?.[defaultUnitKey];

					console.log('flatWithGeneral - Regular key values:', {
						unitKey,
						unitValue,
						defaultUnitKey,
						defaultUnitValue,
					});
				}

				const defaultAttribute =
					defaultAttributes?.[label] ??
					getDefaultAttribute(label, clientId, true);

				console.log('flatWithGeneral - Default attribute:', {
					label,
					defaultAttribute,
				});

				let compareCondition;
				if (isUnitKey(key)) {
					// For unit keys, check linked value against default
					compareCondition =
						!isEqual(value, defaultAttribute) &&
						!isEqual(linkedValue, defaultLinkedValue);
				} else {
					// For regular keys, check unit value against default
					compareCondition =
						!isEqual(value, defaultAttribute) &&
						!isEqual(unitValue, defaultUnitValue);
				}

				console.log('flatWithGeneral - Compare condition:', {
					compareCondition,
					isUnitKey: isUnitKey(key),
				});

				if (compareCondition) {
					console.log(
						'flatWithGeneral - Setting default attribute:',
						{
							label,
							defaultAttribute,
						}
					);
					result[label] = defaultAttribute;
				} else {
					console.log('flatWithGeneral - Setting undefined:', label);
					result[label] = undefined;
				}
			} else if (!isNil(attribute)) {
				console.log('flatWithGeneral - Setting breakpoint lock:', {
					breakpoint,
					attribute,
				});
				breakpointLock = true;
			}
		});
	});

	console.log('flatWithGeneral - Final result:', result);
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

		const isGeneral = breakpoint === 'general';
		const isHover = getIsHoverAttribute(key);
		const simpleLabel = getSimpleLabel(key, breakpoint);
		const lowerBreakpoints =
			breakpoint === 'general'
				? breakpoints.slice(
						breakpoints.indexOf(
							select('maxiBlocks').receiveBaseBreakpoint()
						) + 1
				  )
				: breakpoints.slice(breakpoints.indexOf(breakpoint) + 1);

		let breakpointLock = false;

		lowerBreakpoints.forEach(breakpoint => {
			if (breakpointLock) {
				return;
			}

			const label = getAttributeKey(simpleLabel, isHover, '', breakpoint);
			const attribute = attributes?.[label];
			if (isNil(attribute)) return;

			const defaultAttribute =
				defaultAttributes?.[label] ??
				getDefaultAttribute(label, clientId, true);
			// Handle unit keys and their linked values
			let unitValue;
			let unitValueGeneral;
			let valueKey;
			let linkedValue;
			let linkedValueGeneral;

			if (isUnitKey(key)) {
				// For unit keys, get the linked value key and its values
				valueKey = getValueKeyFromUnitKey(label);
				linkedValue = attributes[valueKey];
				const valueKeyGeneral = getValueKeyFromUnitKey(
					`${getAttributeKey(simpleLabel, isHover, '', 'general')}`
				);
				linkedValueGeneral = newAttributes[valueKeyGeneral];
			} else {
				// For regular keys, get the unit key and its values
				const unitKey = `${getAttributeKey(
					simpleLabel,
					isHover,
					'',
					'unit'
				)}-${breakpoint}`;
				unitValue = attributes[unitKey];
				const unitKeyGeneral = `${getAttributeKey(
					simpleLabel,
					isHover,
					'',
					'unit'
				)}-general`;
				unitValueGeneral = newAttributes[unitKeyGeneral];
				const unitValueDefault = attributes[unitKeyGeneral];

				if (
					value !== attribute &&
					unitValue === undefined &&
					unitValueDefault !== undefined
				) {
					unitValue = unitValueDefault;
					result[unitKey] = unitValue;
				}
			}

			let compareCondition;
			if (isUnitKey(key)) {
				// For unit keys, check if linked value matches general linked value
				compareCondition =
					linkedValue !== undefined &&
					!isEqual(linkedValue, linkedValueGeneral);
			} else {
				// For regular keys, check if unit value matches general unit value
				compareCondition =
					unitValue !== undefined &&
					!isEqual(unitValue, unitValueGeneral);
			}

			if (compareCondition) return;

			if (isEqual(value, attribute)) {
				if (label in newAttributes && isGeneral) {
					const generalKey = getAttributeKey(
						simpleLabel,
						isHover,
						'',
						'general'
					);
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
}) => {
	const containsBreakpoint = Object.keys(newAttributes).some(
		key => !!getBreakpointFromAttribute(key)
	);

	let result = { ...newAttributes };
	console.log('result', result);

	result = {
		...result,
		...removeHoverSameAsNormal(result, attributes),
	};
	console.log('result after removeHoverSameAsNormal', result);
	if (!containsBreakpoint) return result;

	result = {
		...result,
		...flatWithGeneral(
			result,
			attributes,
			clientId,
			targetClientId,
			defaultAttributes,
			allowXXLOverGeneral
		),
	};
	console.log('result after flatWithGeneral', result);
	result = {
		...result,
		...flatLowerAttr(result, attributes, clientId, defaultAttributes),
	};
	console.log('result after flatLowerAttr', result);
	result = {
		...result,
		...preserveBaseBreakpoint(result, attributes),
	};
	console.log('result after preserveBaseBreakpoint', result);
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
		targetClientId ?? clientId
	);
	console.log('result after savePrevSavedAttrs', result);
	return result;
};

export default cleanAttributes;
