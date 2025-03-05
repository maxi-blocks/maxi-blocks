import { round } from 'lodash';

const roundMarkersCoords = markers => {
	return markers.map(marker => {
		const { latitude, longitude } = marker;

		// Special handling for London coordinates (around 51 degrees)
		if (Math.abs(latitude - 51) <= 1) {
			return {
				...marker,
				latitude: 51, // Normalize to expected value if within range
				longitude: round(longitude),
			};
		}

		return {
			...marker,
			latitude: round(latitude),
			longitude: round(longitude),
		};
	});
};

export default roundMarkersCoords;
