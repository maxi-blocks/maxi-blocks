/**
 * External dependencies
 */
import { isEmpty } from 'lodash';

const getMarkerId = mapMarkers =>
	mapMarkers && !isEmpty(mapMarkers)
		? mapMarkers.reduce((markerA, markerB) =>
				markerA.id > markerB.id ? markerA : markerB
		  ).id + 1
		: 0;

const getNewMarker = ([lat, lon], mapMarkers) => {
	const newMarker = {
		id: getMarkerId(mapMarkers),
		latitude: lat,
		longitude: lon,
		heading: '',
		description: '',
	};

	return newMarker;
};

const getUpdatedMarkers = (mapMarkers, newMarker) =>
	mapMarkers ? [...mapMarkers, newMarker] : [newMarker];

export { getNewMarker, getUpdatedMarkers };
