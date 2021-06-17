/**
 * External dependencies
 */
import { isNil, isEmpty } from 'lodash';

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
export const getShapeDividerSVGStyles = (obj, location) => {
	const response = {
		label: 'Shape Divider SVG',
		general: {},
	};

	if (
		obj[`palette-custom-shape-divider-${location}-color`] &&
		!isEmpty(obj[`shape-divider-${location}-color`])
	)
		response.general.fill = obj[`shape-divider-${location}-color`];

	return response;
};
