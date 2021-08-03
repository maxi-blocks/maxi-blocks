/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getShapeStyles = (obj, target, parentBlockStyle) => {
	const response = {
		label: 'Shape',
		general: {},
	};

	if (target === 'svg' && !isNil(obj['shape-width'])) {
		response.general.width = `${obj['shape-width']}${obj['shape-width-unit']}`;
		response.general.height = `${obj['shape-width']}${obj['shape-width-unit']}`;
	}

	if (target === 'path') {
		if (
			obj['shape-palette-fill-color-status'] &&
			obj['shape-palette-fill-color']
		)
			response.general.fill = `var(--maxi-${parentBlockStyle}-color-${obj['shape-palette-fill-color']})`;
		else if (
			!obj['shape-palette-fill-color-status'] &&
			!isNil(obj['shape-fill-color'])
		)
			response.general.fill = obj['shape-fill-color'];
	}

	return response;
};

export default getShapeStyles;
