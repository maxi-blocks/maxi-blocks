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

export const getIsValid = (val, cleaned = false) => {
	if (!cleaned) return true;
	return (
		val || isNumber(val) || isBoolean(val) || (isEmpty(val) && !isNil(val))
	);
};

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

export const getHasParallax = bgLayers => !isEmpty(getParallaxLayers(bgLayers));

const getVideoLayers = (uniqueID, bgLayers) => {
	const response = bgLayers?.filter(layer => layer.type === 'video');

	if (!response || isEmpty(response)) return null;
	return { [uniqueID]: response };
};

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

export const getHasVideo = (uniqueID, bgLayers) =>
	!isEmpty(getVideoLayers(uniqueID, bgLayers));

export const getHasScrollEffects = (uniqueID, scroll) =>
	!isEmpty(getScrollEffects(uniqueID, scroll));

export const getHasDC = bgLayers =>
	bgLayers?.some(layer => layer && layer['dc-status']);

export const splitValueAndUnit = val => {
	const unit = val.split(/\d+/g)[1].trim();
	const value = +val.split(unit)[0].trim();

	return { value, unit };
};

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

export const getHoverAttributeKey = key =>
	key.includes('-hover') ? key : `${key}-hover`;

// Accepts (possibly) hover attribute key and returns normal key.
export const getNormalAttributeKey = hoverKey => hoverKey.replace(/-hover/, '');

export const getBreakpointFromAttribute = rawTarget => {
	const target = getNormalAttributeKey(rawTarget);
	const lastDash = target.lastIndexOf('-');

	if (lastDash <= -1) return false;

	const breakpoint = target.slice(lastDash).replace('-', '');

	if (!BREAKPOINTS.includes(breakpoint)) return false;

	return breakpoint;
};

export const getAttrKeyWithoutBreakpoint = key => {
	const breakpoint = getBreakpointFromAttribute(key);

	const regex = new RegExp(`-${breakpoint}(?!.*-${breakpoint})`);

	return key.replace(regex, '');
};

export const getSimpleLabel = (key, breakpoint) =>
	getNormalAttributeKey(key).slice(0, -(breakpoint.length + 1));

export const getIsHoverAttribute = key => key.includes('-hover');

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

export const replaceAttrKeyBreakpoint = (key, breakpoint) =>
	`${getAttrKeyWithoutBreakpoint(key)}-${breakpoint}`;

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
export const isValidNumber = val => Number.isFinite(val) || !isEmpty(val);
