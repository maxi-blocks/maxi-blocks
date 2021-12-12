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
			!obj['map-marker-text-palette-status'] &&
			!isNil(obj['map-marker-text-color'])
		)
			response.general.color = obj['map-marker-text-color'];
		else if (
			obj['map-marker-text-palette-status'] &&
			obj['map-marker-text-palette-color']
		)
			response.general.color = getColorRGBAString({
				firstVar: `color-${obj['map-marker-text-palette-color']}`,
				opacity: obj['map-marker-palette-text-opacity'],
				blockStyle: parentBlockStyle,
			});
	}

	if (target === 'address') {
		if (
			!obj['map-marker-address-palette-status'] &&
			!isNil(obj['map-marker-address-color'])
		)
			response.general.color = obj['map-marker-address-color'];
		else if (
			obj['map-marker-address-palette-status'] &&
			obj['map-marker-address-palette-color']
		)
			response.general.color = getColorRGBAString({
				firstVar: `color-${obj['map-marker-address-palette-color']}`,
				opacity: obj['map-marker-palette-address-opacity'],
				blockStyle: parentBlockStyle,
			});
	}

	return response;
};

export default getMapStyles;
