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
			response.general.color = `var(--maxi-${parentBlockStyle}-color-${obj['map-marker-palette-text-color']})`;
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
			response.general.color = `var(--maxi-${parentBlockStyle}-color-${obj['map-marker-palette-address-color']})`;
	}

	return response;
};

export default getMapStyles;
