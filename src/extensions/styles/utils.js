/**
 * Internal dependencies
 */
import getAttributeKey from '../attributes/getAttributeKey';

/**
 * External dependencies
 */
import { cloneDeep, isEmpty } from 'lodash';

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
			layer.type === 'image' && layer[getAttributeKey({ key: 'bi_pa.s' })]
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
				key.includes('.s') &&
				!key.includes('_sr') &&
				!key.includes('.ps') &&
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
		relation.tr = `${uniqueID}${
			relation.ibt ? ' .maxi-button-block__button' : ''
		}`;
	});

	return newRelations;
};
