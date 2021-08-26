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

	if (target === 'icon') {
		if (!isNil(obj['icon-spacing']) && !isNil(obj['icon-position']))
			obj['icon-position'] === 'left'
				? (response.general[
						'margin-right'
				  ] = `${obj['icon-spacing']}px`)
				: (response.general[
						'margin-left'
				  ] = `${obj['icon-spacing']}px`);

		if (!isNil(obj['icon-size']))
			response.general['max-width'] = `${obj['icon-size']}px`;
	}

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
