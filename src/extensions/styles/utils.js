/**
 * Internal dependencies
 */
import { scrollTypes } from './defaults/scroll';

/**
 * External dependencies
 */
import { cloneDeep, isBoolean, isEmpty, isNil, isNumber, round } from 'lodash';
import getAttributeKey from './getAttributeKey';

const BREAKPOINTS = ['general', 'xxl', 'xl', 'l', 'm', 's', 'xs'];

/**
 * Checks if a value is valid, if cleaned is false, it will always return true
 *
 * @param {any}     val     Value to check
 * @param {boolean} cleaned Whether the value has been cleaned
 * @returns {boolean} True if valid, false otherwise
 */
export const getIsValid = (val, cleaned = false) => {
	if (!cleaned) return true;
	return (
		val || isNumber(val) || isBoolean(val) || (isEmpty(val) && !isNil(val))
	);
};

/**
 * Validates a transform origin value
 *
 * @param {any} val Value to validate
 * @returns {any|boolean} Validated value or false if invalid
 */
export const validateOriginValue = val => {
	const isNumeric = val => {
		if (typeof val !== 'string') return false;
		return !Number.isNaN(val) && !Number.isNaN(parseFloat(val));
	};
	const words = ['top', 'bottom', 'left', 'right', 'center', 'middle'];

	if (isNumeric(val)) return Number(val);
	if (words.includes(val)) return val;

	return false;
};

/**
 * Gets the parallax layers for a given unique ID
 *
 * @param {string} uniqueID The unique ID of the element
 * @param {Array}  bgLayers The background layers
 * @returns {Object} The parallax layers
 */
export const getParallaxLayers = (uniqueID, bgLayers) => {
	if (!bgLayers || isEmpty(bgLayers)) {
		return {};
	}

	const response = bgLayers.filter(
		({ type, 'background-image-parallax-status': parallaxStatus }) =>
			type === 'image' && parallaxStatus
	);

	return { [uniqueID]: response };
};

/**
 * Checks if the background layers have parallax layers
 *
 * @param {Array} bgLayers The background layers
 * @returns {boolean} True if there are parallax layers, false otherwise
 */
export const getHasParallax = bgLayers => !isEmpty(getParallaxLayers(bgLayers));

/**
 * Gets the video layers for a given unique ID
 *
 * @param {string} uniqueID The unique ID of the element
 * @param {Array}  bgLayers The background layers
 * @returns {Object} The video layers
 */
const getVideoLayers = (uniqueID, bgLayers) => {
	const response = bgLayers?.filter(layer => layer.type === 'video');

	if (!response || isEmpty(response)) return null;
	return { [uniqueID]: response };
};

/**
 * Checks if the background layers have video layers
 *
 * @param {string} uniqueID The unique ID of the element
 * @param {Array}  bgLayers The background layers
 * @returns {boolean} True if there are video layers, false otherwise
 */
export const getHasVideo = (uniqueID, bgLayers) =>
	!isEmpty(getVideoLayers(uniqueID, bgLayers));

/**
 * Gets the scroll effects for a given unique ID
 *
 * @param {string} uniqueID The unique ID of the element
 * @param {Object} scroll   The scroll object
 * @returns {Object} The scroll effects
 */
export const getScrollEffects = (uniqueID, scroll) => {
	const availableScrollTypes = scrollTypes.filter(type => {
		return scroll[`scroll-${type}-status-general`];
	});

	const response = {};

	Object.entries(scroll).forEach(([key, value]) => {
		const scrollType = availableScrollTypes.find(type =>
			key.includes(`-${type}-`)
		);

		if (!scrollType) return;

		if (!response[scrollType]) response[scrollType] = {};
		response[scrollType][key] = value;
	});

	if (!response || isEmpty(response)) return null;

	response.scroll_effects = true;
	return { [uniqueID]: response };
};

/**
 * Checks if the scroll effects have scroll effects
 *
 * @param {string} uniqueID The unique ID of the element
 * @param {Object} scroll   The scroll object
 * @returns {boolean} True if there are scroll effects, false otherwise
 */
export const getHasScrollEffects = (uniqueID, scroll) =>
	!isEmpty(getScrollEffects(uniqueID, scroll));

/**
 * Checks if the background layers have DC layers
 *
 * @param {Array} bgLayers The background layers
 * @returns {boolean} True if there are DC layers, false otherwise
 */
export const getHasDC = bgLayers =>
	bgLayers?.some(layer => layer && layer['dc-status']);

/**
 * Splits the number value and unit
 *
 * @param {string} val The value
 * @returns {Object} The value and unit
 */
export const splitValueAndUnit = val => {
	const matches = val.match(/^(-?\d*\.?\d+)(.*)$/);
	const value = parseFloat(matches[1]);
	const unit = matches[2].trim();

	return { value, unit };
};

/**
 * Gets the relations for a given unique ID of the block
 *
 * @param {string} uniqueID  The unique ID of the block
 * @param {Array}  relations The relations
 * @returns {Object} The relations
 */
export const getRelations = (uniqueID, relations) => {
	if (isEmpty(relations)) return null;

	const newRelations = cloneDeep(relations);

	newRelations.forEach(relation => {
		relation.trigger = `${uniqueID}${
			relation.isButton ? ' .maxi-button-block__button' : ''
		}`;
	});

	return newRelations;
};

/**
 * Gets the hover attribute key from a normal attribute key
 *
 * @param {string} key The normal attribute key
 * @returns {string} The hover attribute key
 */
export const getHoverAttributeKey = key =>
	key.includes('-hover') ? key : `${key}-hover`;

/**
 * Gets the normal attribute key from a hover attribute key
 *
 * @param {string} hoverKey The hover attribute key
 * @returns {string} The normal attribute key
 */
export const getNormalAttributeKey = hoverKey => hoverKey.replace(/-hover/, '');

/**
 * Gets the breakpoint from an attribute key
 *
 * @param {string} rawTarget The raw target
 * @returns {string} The breakpoint
 */
export const getBreakpointFromAttribute = rawTarget => {
	const target = getNormalAttributeKey(rawTarget);
	const lastDash = target.lastIndexOf('-');

	if (lastDash <= -1) return false;

	const breakpoint = target.slice(lastDash).replace('-', '');

	if (!BREAKPOINTS.includes(breakpoint)) return false;

	return breakpoint;
};

/**
 * Gets the attribute key without the breakpoint
 *
 * @param {string} key The attribute key
 * @returns {string} The attribute key without the breakpoint
 */
export const getAttrKeyWithoutBreakpoint = key => {
	const breakpoint = getBreakpointFromAttribute(key);

	const regex = new RegExp(`-${breakpoint}(?!.*-${breakpoint})`);

	return key.replace(regex, '');
};

/**
 * Gets the simple label from an attribute key
 *
 * @param {string} key        The attribute key
 * @param {string} breakpoint The breakpoint
 * @returns {string} The simple label
 */
export const getSimpleLabel = (key, breakpoint) =>
	getNormalAttributeKey(key).slice(0, -(breakpoint.length + 1));

/**
 * Checks if an attribute key is a hover attribute
 *
 * @param {string} key The attribute key
 * @returns {boolean} True if the attribute key is a hover attribute, false otherwise
 */
export const getIsHoverAttribute = key => key.includes('-hover');

/**
 * Checks if an attribute exists on a responsive breakpoint
 *
 * @param {Object} attributes     The attributes
 * @param {string} key            The attribute key
 * @param {string} baseBreakpoint The base breakpoint
 * @returns {boolean} True if the attribute exists on the responsive breakpoint, false otherwise
 */
export const attrExistsOnResponsive = (attributes, key, baseBreakpoint) => {
	const isHover = getIsHoverAttribute(key);
	const breakpoint = getBreakpointFromAttribute(key);
	const baseKey = getSimpleLabel(key, breakpoint);
	return BREAKPOINTS.filter(
		breakpoint => breakpoint !== baseBreakpoint && breakpoint !== 'general'
	).some(
		breakpoint =>
			!isNil(
				attributes[getAttributeKey(baseKey, isHover, null, breakpoint)]
			)
	);
};

/**
 * Replaces the breakpoint in an attribute key
 *
 * @param {string} key        The attribute key
 * @param {string} breakpoint The breakpoint
 * @returns {string} The attribute key with the new breakpoint
 */
export const replaceAttrKeyBreakpoint = (key, breakpoint) =>
	`${getAttrKeyWithoutBreakpoint(key)}-${breakpoint}`;

/**
 * Gets the transition timing function
 *
 * @param {string}        hoverTransitionEasing   The hover transition easing
 * @param {Array<number>} hoverTransitionEasingCB The hover transition easing cubic-bezier
 * @returns {string} The transition timing function
 */
export const getTransitionTimingFunction = (
	hoverTransitionEasing,
	hoverTransitionEasingCB
) => {
	if (hoverTransitionEasing !== 'cubic-bezier') {
		return hoverTransitionEasing;
	}

	if (isNil(hoverTransitionEasingCB)) {
		return 'ease';
	}

	return `cubic-bezier(${hoverTransitionEasingCB
		.map(value => round(value, 4))
		.join()})`;
};

/**
 * Checks if a number value is valid
 *
 * @param {string | number | undefined} val Value to check
 * @returns {boolean}                      True if valid, false otherwise
 */
export const isValidNumber = val => {
	if (typeof val === 'number') {
		return Number.isFinite(val);
	}

	if (typeof val === 'string' && val.trim() !== '') {
		const parsed = +val;
		return Number.isFinite(parsed);
	}

	return false;
};
