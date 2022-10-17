/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { getDefaultAttribute, getLastBreakpointAttribute } from '../styles';
import getBreakpointFromAttribute from '../styles/getBreakpointFromAttribute';

/**
 * External dependencies
 */
import { isNil, isEqual } from 'lodash';

const breakpoints = ['general', 'xl', 'l', 'm', 's', 'xs'];

const getSimpleLabel = (key, breakpoint) =>
	key.slice(0, key.length - 1 - breakpoint.length);

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
		const simpleLabel = getSimpleLabel(key, breakpoint);
		const higherBreakpoints = breakpoints.slice(
			0,
			breakpoints.indexOf(breakpoint)
		);

		if (isXXL) {
			const generalAttr = attributes[`${simpleLabel}-general`];

			if (!isNil(generalAttr) && isEqual(generalAttr, value)) {
				// Not sure how it will work with XXL default values on
				// blocks like Button Maxi. Need to test! :)
				const defaultAttribute =
					defaultAttributes?.[key] ??
					getDefaultAttribute(key, clientId, true);

				result[key] = defaultAttribute;
			}
		} else {
			let breakpointLock = false;

			higherBreakpoints.reverse().forEach(breakpoint => {
				if (!breakpointLock) {
					const label = `${simpleLabel}-${breakpoint}`;
					const attribute = attributes?.[label];
					const defaultAttribute =
						defaultAttributes?.[label] ??
						getDefaultAttribute(label, clientId, true);

					if (isEqual(value, attribute))
						if (isEqual(value, defaultAttribute))
							result[key] = undefined;
						else result[key] = defaultAttribute;
					else if (!isNil(attribute)) breakpointLock = true;
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
		const breakpoint = getBreakpointFromAttribute(key);

		if (!isNil(value))
			prevSavedAttrs.forEach(attr => {
				if (Object.prototype.hasOwnProperty.call(newAttributes, attr))
					return;

				const attrBreakpoint = getBreakpointFromAttribute(attr);

				const currentBreakpoint =
					select('maxiBlocks').receiveMaxiDeviceType();

				if (attrBreakpoint === 'general') {
					const simpleLabel = getSimpleLabel(attr, attrBreakpoint);
					const generalAttr = attributes[`${simpleLabel}-general`];

					if (
						`${simpleLabel}-${currentBreakpoint}` === key &&
						value.toString().startsWith(generalAttr)
					) {
						result[key] = undefined;
						result[`${simpleLabel}-general`] = value;
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

		if (!breakpoint) {
			result[key] = value;
			return;
		}
		if (breakpoint !== 'general') return;

		const simpleLabel = getSimpleLabel(key, breakpoint);
		const attrOnXXL = attributes[`${simpleLabel}-xxl`];

		if (!isNil(attrOnXXL) && isEqual(value, attrOnXXL)) {
			const defaultAttribute =
				defaultAttributes?.[key] ??
				getDefaultAttribute(key, clientId, true);

			result[`${simpleLabel}-xxl`] = defaultAttribute;
		}

		let breakpointLock = false;

		breakpoints.forEach(breakpoint => {
			if (breakpointLock || breakpoint === 'general') return;

			const label = `${simpleLabel}-${breakpoint}`;
			const attribute = attributes?.[label];

			if (isNil(attribute)) return;

			const defaultAttribute =
				defaultAttributes?.[label] ??
				getDefaultAttribute(label, clientId, true);

			if (isNil(attribute) && isEqual(value, attribute))
				if (!isEqual(value, defaultAttribute))
					result[label] = defaultAttribute;
				else result[label] = undefined;
			else if (!isNil(attribute)) breakpointLock = true;
		});
	});

	return result;
};

/**
 * Flat new saving attributes in case they are going to be saved together with same value
 */
const flatNewAttributes = (newAttributes, clientId, defaultAttributes) => {
	const result = {};

	Object.entries(newAttributes).forEach(([key, value]) => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (!breakpoint || breakpoint === 'general') {
			result[key] = value;
			return;
		}

		const simpleLabel = getSimpleLabel(key, breakpoint);
		const existsGeneralAttr = Object.prototype.hasOwnProperty.call(
			newAttributes,
			`${simpleLabel}-general`
		);

		if (!existsGeneralAttr) return;

		const generalAttr = newAttributes[`${simpleLabel}-general`];

		if (!isNil(generalAttr) && isEqual(generalAttr, value)) {
			const defaultAttribute =
				defaultAttributes?.[key] ??
				getDefaultAttribute(key, clientId, true);

			result[key] = defaultAttribute;
		}
	});

	return result;
};

/**
 * Removes new saved responsive attributes on base breakpoint that have the same value
 * than the saved general ones.
 */
const removeSameAsGeneral = (newAttributes, attributes) => {
	const result = {};

	Object.entries(newAttributes).forEach(([key, value]) => {
		const breakpoint = getBreakpointFromAttribute(key);

		if (!breakpoint) {
			result[key] = value;
			return;
		}

		const baseBreakpoint = select('maxiBlocks').receiveBaseBreakpoint();
		const baseLabel = key.replace(`-${breakpoint}`, `-${baseBreakpoint}`);
		const baseAttr = attributes?.[baseLabel];

		if (!breakpoint !== 'general') {
			if (key !== baseLabel) result[key] = value;
			else result[baseLabel] = undefined;

			return;
		}

		if (!isNil(baseAttr)) result[baseLabel] = undefined;
		if (Object.prototype.hasOwnProperty.call(newAttributes, baseLabel))
			result[baseLabel] = undefined;

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

		const simpleLabel = getSimpleLabel(key, breakpoint);
		const lowerBreakpoints = breakpoints.slice(
			breakpoints.indexOf(breakpoint) + 1
		);

		let breakpointLock = false;

		if (breakpoint !== 'xxl')
			lowerBreakpoints.forEach(breakpoint => {
				if (breakpointLock) return;

				const label = `${simpleLabel}-${breakpoint}`;
				const attribute = attributes?.[label];

				if (isNil(attribute)) return;

				const defaultAttribute =
					defaultAttributes?.[label] ??
					getDefaultAttribute(label, clientId, true);

				if (isEqual(value, attribute)) {
					result[label] = defaultAttribute;
					return;
				}

				const generalAttribute = {
					...defaultAttributes,
					...attributes,
				}?.[`${simpleLabel}-general`];

				if (isEqual(attribute, generalAttribute)) {
					result[label] = defaultAttribute;
					return;
				}

				if (!isEqual(value, defaultAttribute)) breakpointLock = true;
			});
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

	if (!containsBreakpoint) return newAttributes;

	let result = { ...newAttributes };

	result = {
		...result,
		...removeSameAsGeneral(result, attributes),
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
		...flatNewAttributes(result, clientId, defaultAttributes),
	};
	result = {
		...result,
		...flatLowerAttr(
			newAttributes,
			attributes,
			clientId,
			defaultAttributes
		),
	};

	dispatch('maxiBlocks/styles').savePrevSavedAttrs(result);

	// console.log(result);
	return result;
};

export default cleanAttributes;
