// Default Map Markers
const defaultMarkers = {
	'marker-icon-1': {
		path: 'M 20.20,9.70 C 20.20,5.20 16.50,1.50 12.00,1.50 7.50,1.50 3.80,5.10 3.80,9.70 3.80,16.70 12.00,22.60 12.00,22.60 12.00,22.60 20.20,16.70 20.20,9.70 Z M 12.00,6.10 C 13.90,6.10 15.50,7.70 15.50,9.60 15.50,11.50 13.90,13.10 12.00,13.10 10.10,13.10 8.50,11.50 8.50,9.60 8.50,7.70 10.10,6.10 12.00,6.10 Z',
	},
	'marker-icon-2': {
		path: 'M18.1,16.2l-5.5,5.5c-0.3,0.3-0.9,0.3-1.2,0l-5.5-5.5C2.6,12.8,2.6,7.4,5.9,4l0,0C9.3,0.6,14.7,0.6,18,4l0,0C21.4,7.4,21.4,12.8,18.1,16.2z',
	},
	'marker-icon-3': {
		path: 'M20,10c0,3.5-2.2,6.5-5.4,7.6L12,22l-2.6-4.4C6.2,16.5,4,13.4,4,10c0-4.4,3.6-8,8-8S20,5.6,20,10z M12,7 c-1.7,0-3,1.3-3,3s1.3,3,3,3s3-1.3,3-3S13.7,7,12,7z',
	},
	'marker-icon-4': {
		path: 'M4.9,12.6c0,0,1.8,0,2.4,0c3.2,0.1,2.9,1.2,5.9,1.2s2.9-1.2,5.9-1.2V2c-2.9,0-2.9,1.2-5.9,1.2S10.2,2,7.3,2H4.9v20',
	},
	'marker-icon-5': {
		path: 'M 4.00,22.30 C 4.00,22.30 4.00,22.30 4.00,22.30 4.00,22.30 9.20,22.30 9.20,22.30 9.20,22.30 9.20,22.30 9.20,22.30M 20.00,1.70 C 20.00,1.70 6.60,1.70 6.60,1.70 6.60,1.70 6.70,13.10 6.70,13.10 6.70,13.10 20.00,13.10 20.00,13.10 20.00,13.10 15.10,7.40 15.10,7.40 15.10,7.40 20.00,1.70 20.00,1.70 Z M 6.60,1.70 C 6.60,1.70 6.60,22.30 6.60,22.30',
	},
};

// Map
window.onload = () => {
	// eslint-disable-next-line no-undef
	if (google_map_api_options.google_api_key !== '') {
		const script = document.createElement('script');
		// eslint-disable-next-line no-undef
		script.src = `https://maps.googleapis.com/maps/api/js?key=${google_map_api_options.google_api_key}&callback=initMap`;
		script.async = true;
		script.defer = true;

		document.head.appendChild(script);
	}
};

// eslint-disable-next-line func-names
window.initMap = function () {
	// eslint-disable-next-line no-undef
	Object.values(maxi_custom_data.custom_data).forEach(item => {
		const el = document.getElementById(`map-container-${item.uniqueID}`);

		if (el) {
			const mapCoordinate = {
				lat: +item['map-latitude'],
				lng: +item['map-longitude'],
			};

			// eslint-disable-next-line no-undef
			const map = new google.maps.Map(
				document.getElementById(`map-container-${item.uniqueID}`),
				{
					zoom: item['map-zoom'],
					center: mapCoordinate,
				}
			);

			const contentTitleString = `<h6 class="map-marker-info-window__title">${item['map-marker-text']}</h6>`;
			const contentAddressString = `<p class="map-marker-info-window__address">${item['map-marker-address']}</p>`;
			const contentString = `<div class="map-marker-info-window">${
				item['map-marker-text'] !== '' ? contentTitleString : ''
			}${
				item['map-marker-address'] !== '' ? contentAddressString : ''
			}</div>`;

			// eslint-disable-next-line no-undef
			const infowindow = new google.maps.InfoWindow({
				content: contentString,
			});

			// eslint-disable-next-line no-undef
			const marker = new google.maps.Marker({
				position: mapCoordinate,
				map,
				icon: {
					...defaultMarkers[`marker-icon-${item['map-marker']}`],
					fillColor: item['map-marker-fill-color'],
					fillOpacity: item['map-marker-opacity'],
					strokeWeight: 2,
					strokeColor: item['map-marker-stroke-color'],
					rotation: 0,
					scale: item['map-marker-scale'],
				},
			});

			marker.addListener('click', () => {
				(item['map-marker-text'] !== '' ||
					item['map-marker-address'] !== '') &&
					infowindow.open(map, marker);
			});
		}
	});
};
