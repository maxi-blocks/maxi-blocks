/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';

/**
 * External dependencies
 */
import { isNil, isEmpty, isNumber } from 'lodash';

export const getShapeDividerStyles = (obj, location) => {
	const response = {
		label: 'Shape Divider',
		general: {},
	};

	if (!isNil(obj[`shape-divider-${location}-opacity`]))
		response.general.opacity = obj[`shape-divider-${location}-opacity`];

	if (!isNil(obj[`shape-divider-${location}-height`]))
		response.general.height = `${obj[`shape-divider-${location}-height`]}${
			obj[`shape-divider-${location}-height-unit`]
		}`;

	return response;
};

export const getShapeDividerSVGStyles = (obj, location, parentBlockStyle) => {
	const response = {
		label: 'Shape Divider SVG',
		general: {},
	};

	if (
		!obj[`shape-divider-${location}-palette-status`] &&
		!isEmpty(obj[`shape-divider-${location}-color`])
	)
		response.general.fill = obj[`shape-divider-${location}-color`];
	else if (
		obj[`shape-divider-${location}-palette-status`] &&
		isNumber(obj[`shape-divider-palette-${location}-color`])
	) {
		response.general.fill = getColorRGBAString({
			firstVar: `color-${obj[`shape-divider-palette-${location}-color`]}`,
			opacity: obj[`shape-divider-palette-${location}-opacity`],
			blockStyle: parentBlockStyle,
		});
	}

	return response;
};
