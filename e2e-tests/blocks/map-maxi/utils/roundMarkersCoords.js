import { round } from 'lodash';

const roundMarkersCoords = markers => {
	return markers.map(marker => {
		const { latitude, longitude } = marker;

		return {
			...marker,
			latitude: round(latitude),
			longitude: round(longitude),
		};
	});
};

export default roundMarkersCoords;
