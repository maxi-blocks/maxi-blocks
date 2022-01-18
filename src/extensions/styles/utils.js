/**
 * External dependencies
 */
import { isNumber, isBoolean, isEmpty, isNil } from 'lodash';

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
	const words = ['top', 'bottom', 'left', 'right', 'centre', 'middle'];

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

export const getHasVideo = (uniqueID, bgLayers) =>
	!isEmpty(getVideoLayers(uniqueID, bgLayers));
