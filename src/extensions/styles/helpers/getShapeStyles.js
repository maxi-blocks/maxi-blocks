/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getShapeStyles = (obj, target) => {
	const response = {
		label: 'Shape',
		general: {},
	};

	if (target === 'svg' && !isNil(obj['shape-width']))
		response.general.width = `${obj['shape-width']}${obj['shape-width-unit']}`;

	if (
		!obj['shape-palette-fill-color-status'] &&
		target === 'path' &&
		!isNil(obj['shape-fill-color'])
	)
		response.general.fill = obj['shape-fill-color'];

	return response;
};

export default getShapeStyles;
