/**
 * Internal dependencies
 */
import getColorRGBAString from '../getColorRGBAString';

/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getMapStyles = (obj, target, parentBlockStyle) => {
	const response = {
		label: 'Map',
		general: {},
	};

	if (target === 'title') {
		if (
			!obj['map-marker-palette-text-color-status'] &&
			!isNil(obj['map-marker-text-color'])
		)
			response.general.color = obj['map-marker-text-color'];
		else if (
			obj['map-marker-palette-text-color-status'] &&
			obj['map-marker-palette-text-color']
		)
			response.general.color = getColorRGBAString({
				firstVar: `color-${obj['map-marker-palette-text-color']}`,
				opacity: obj['map-marker-palette-text-opacity'],
				blockStyle: parentBlockStyle,
			});
	}

	if (target === 'address') {
		if (
			!obj['map-marker-palette-address-color-status'] &&
			!isNil(obj['map-marker-address-color'])
		)
			response.general.color = obj['map-marker-address-color'];
		else if (
			obj['map-marker-palette-address-color-status'] &&
			obj['map-marker-palette-address-color']
		)
			response.general.color = getColorRGBAString({
				firstVar: `color-${obj['map-marker-palette-address-color']}`,
				opacity: obj['map-marker-palette-address-opacity'],
				blockStyle: parentBlockStyle,
			});
	}

	return response;
};

export default getMapStyles;
