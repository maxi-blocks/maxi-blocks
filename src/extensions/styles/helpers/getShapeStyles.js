/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';

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
		response.general[
			'max-width'
		] = `${obj['shape-width']}${obj['shape-width-unit']}`;
		response.general[
			'max-height'
		] = `${obj['shape-width']}${obj['shape-width-unit']}`;
	}

	if (target === 'path') {
		if (obj['shape-fill-palette-status'] && obj['shape-fill-palette-color'])
			response.general.fill = getColorRGBAString({
				firstVar: `color-${obj['shape-fill-palette-color']}`,
				opacity: obj['shape-fill-palette-opacity'],
				blockStyle: parentBlockStyle,
			});
		else if (
			!obj['shape-fill-palette-status'] &&
			!isNil(obj['shape-fill-color'])
		)
			response.general.fill = obj['shape-fill-color'];
	}

	return response;
};

export default getShapeStyles;
