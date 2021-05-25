/**
 * External dependencies
 */
import { isNil } from 'lodash';

const getMapStyles = (obj, target) => {
	const response = {
		label: 'Map',
		general: {},
	};

	if (obj['palette-custom-marker-title-color'] && !isNil(obj['map-marker-text-color']) && target === 'title')
		response.general.color = obj['map-marker-text-color'];

	if (obj['palette-custom-marker-address-color'] && !isNil(obj['map-marker-address-color']) && target === 'address')
		response.general.color = obj['map-marker-address-color'];

	return response;
};

export default getMapStyles;
