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

// TO DO: need a better way to get the admin url
export const getMaxiAdminSettingsUrl = (tab = 'maxi_blocks_settings') => {
	const currentUrl = window.location.href;
	const wpAdminUrl = currentUrl.substring(0, currentUrl.lastIndexOf('/'));
	const maxiAdminSettingsUrl = `${wpAdminUrl}/admin.php?page=maxi-blocks-dashboard&tab=${tab}`;
	return maxiAdminSettingsUrl;
};
