/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getIconStyles = (obj, target, parentBlockStyle, isIconInherit = true) => {
	const response = {
		label: 'Icon',
		general: {},
	};

	if (target === 'svg') {
		if (!obj['icon-palette-color-status'] && !isNil(obj['icon-color'])) {
			response.general.fill = 'none';
			response.general.stroke = obj['icon-color'];
		} else if (
			obj['icon-palette-color-status'] &&
			obj['icon-palette-color']
		) {
			response.general.fill = 'none';
			response.general.stroke = getColorRGBAString({
				firstVar: `color-${obj['icon-palette-color']}`,
				opacity: obj['icon-palette-opacity'],
				blockStyle: parentBlockStyle,
			});
		}
	}

	if (target === 'svg' && isIconInherit) {
		if (!obj['palette-color-status-general'] && obj['color-general']) {
			response.general.fill = 'none';
			response.general.stroke = obj['color-general'];
		} else if (
			obj['palette-color-status-general'] &&
			obj['palette-color-general']
		) {
			response.general.fill = 'none';
			response.general.stroke = getColorRGBAString({
				firstVar: `color-${obj['palette-color-general']}`, // not sure about this values...
				opacity: obj['palette-opacity-general'], // not sure about this values...
				blockStyle: parentBlockStyle,
			});
		}
	}

	return response;
};

export default getIconStyles;
