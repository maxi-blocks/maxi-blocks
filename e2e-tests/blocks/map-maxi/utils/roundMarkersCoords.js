import { round } from 'lodash';

const roundMarkersCoords = markers => {
	return markers.map(marker => {
		const { latitude, longitude } = marker;

		return {
			...marker,
			latitude: round(latitude, 1),
			longitude: round(longitude, 1),
		};
	});
};

export default roundMarkersCoords;
