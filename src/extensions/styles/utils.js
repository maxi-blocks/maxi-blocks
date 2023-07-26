/**
 * External dependencies
 */
import { cloneDeep, isNumber, isBoolean, isEmpty, isNil } from 'lodash';
import getBreakpointFromAttribute from './getBreakpointFromAttribute';

export const getIsValid = (val, cleaned = false) =>
	(cleaned &&
		(val ||
			isNumber(val) ||
			isBoolean(val) ||
			(isEmpty(val) && !isNil(val)))) ||
	!cleaned;

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
	const response = bgLayers?.filter(
		layer =>
			layer.type === 'image' && layer['background-image-parallax-status']
	);

	if (!response || isEmpty(response)) return null;
	return { [uniqueID]: response };
};

export const getHasParallax = bgLayers => !isEmpty(getParallaxLayers(bgLayers));

const getVideoLayers = (uniqueID, bgLayers) => {
	const response = bgLayers?.filter(layer => layer.type === 'video');

	if (!response || isEmpty(response)) return null;
	return { [uniqueID]: response };
};

const getScrollEffects = (uniqueID, scroll) => {
	const response = Object.fromEntries(
		Object.entries(scroll).filter(
			([key]) =>
				key.includes('-status-') &&
				!key.includes('reverse') &&
				!key.includes('preview') &&
				scroll[key]
		)
	);

	if (!response || isEmpty(response)) return null;
	return { [uniqueID]: response };
};

export const getHasVideo = (uniqueID, bgLayers) =>
	!isEmpty(getVideoLayers(uniqueID, bgLayers));

export const getHasScrollEffects = (uniqueID, scroll) =>
	!isEmpty(getScrollEffects(uniqueID, scroll));

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

export const getAttrKeyWithoutBreakpoint = key => {
	const breakpoint = getBreakpointFromAttribute(key);

	const regex = new RegExp(`-${breakpoint}(?!.*-${breakpoint})`);

	return key.replace(regex, '');
};

export const replaceAttrKeyBreakpoint = (key, breakpoint) =>
	`${getAttrKeyWithoutBreakpoint(key)}-${breakpoint}`;
