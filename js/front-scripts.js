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

const getDeviceType = () => {
	const ua = navigator.userAgent;
	if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(ua)) {
		return 'tablet';
	}
	if (
		/Mobile|iP(hone|od|ad)|Android|BlackBerry|IEMobile|Kindle|Silk-Accelerated|(hpw|web)OS|Opera M(obi|ini)/.test(
			ua
		)
	) {
		return 'mobile';
	}
	return 'desktop';
};

// Map
window.onload = () => {
	if (google_map_api_options.google_api_key !== '') {
		const script = document.createElement('script');
		script.src = `https://maps.googleapis.com/maps/api/js?key=${google_map_api_options.google_api_key}&callback=initMap`;
		script.async = true;
		script.defer = true;

		document.head.appendChild(script);
	}
};

window.initMap = function () {
	Object.values(maxi_custom_data.custom_data).map(item => {
		const el = document.getElementById(`map-container-${item.uniqueID}`);

		if (el) {
			const mapCordinate = {
				lat: +item['map-latitude'],
				lng: +item['map-longitude'],
			};

			const map = new google.maps.Map(
				document.getElementById(`map-container-${item.uniqueID}`),
				{
					zoom: item['map-zoom'],
					center: mapCordinate,
				}
			);

			const contentTitleString = `<h6 class="map-marker-info-window__title">${item['map-marker-text']}</h6>`;
			const contentAddressString = `<p class="map-marker-info-window__address">${item['map-marker-address']}</p>`;
			const contentString = `<div class="map-marker-info-window">${
				item['map-marker-text'] !== '' ? contentTitleString : ''
			}${
				item['map-marker-address'] !== '' ? contentAddressString : ''
			}</div>`;

			const infowindow = new google.maps.InfoWindow({
				content: contentString,
			});

			const marker = new google.maps.Marker({
				position: mapCordinate,
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

// Background Video Actions
const videoPlayerElements = document.querySelectorAll(
	'.maxi-background-displayer__video-player'
);
videoPlayerElements.forEach(videoPlayerElement => {
	if (videoPlayerElement) {
		const videoEnd = videoPlayerElement.getAttribute('data-end');
		const videoType = videoPlayerElement.getAttribute('data-type');

		// Make youtube & vimeo videos cover the container
		if (videoType === 'youtube' || videoType === 'vimeo') {
			const setVideoSize = () => {
				const iframeElement =
					videoPlayerElement.querySelector('iframe');
				const reduceBorder = videoPlayerElement.classList.contains(
					'maxi-background-displayer__video-player--no-border'
				);
				const elWidth = videoPlayerElement.offsetWidth;
				const elHeight = videoPlayerElement.offsetHeight;

				const proportion = reduceBorder ? 2.4 : 1.77;

				const hasBorder = elWidth / elHeight < proportion;

				// Avoids Y axis black border
				if (hasBorder) {
					const landscapeProportion =
						proportion - elWidth / elHeight + 1;
					const portraitProportion =
						proportion + (elHeight / elWidth - 1) * 2;

					const newScale =
						landscapeProportion < proportion
							? landscapeProportion
							: portraitProportion;

					iframeElement.style.transform = `translate(-50%, -50%) scale(${
						newScale * 1.033
					})`; // increase of 33% to ensure
				} else iframeElement.style.transform = null;

				const isLandscape = elWidth > elHeight * 1.77;

				const newHeight = isLandscape ? elWidth / 1.77 : elHeight;

				iframeElement.style.height = `${newHeight}px`; // 1.77 is the aspect ratio 16:9
			};

			window.addEventListener('resize', setVideoSize);
			setVideoSize();
		}

		if (videoType === 'vimeo' && videoEnd) {
			const scriptsArray = Array.from(window.document.scripts);

			const vimeoIsMounted = scriptsArray.findIndex(
				script => script.getAttribute('id') === 'maxi-vimeo-sdk'
			);

			if (vimeoIsMounted === -1) {
				const script = document.createElement('script');
				script.src = 'https://player.vimeo.com/api/player.js';
				script.id = 'maxi-vimeo-sdk';
				script.async = true;
				script.onload = () => {
					// Cleanup onload handler
					script.onload = null;

					// Pause all vimeo videos on the page at the endTime
					containerElems.forEach(function (elem) {
						const videoPlayerElement = elem.querySelector(
							'.maxi-background-displayer__video-player'
						);
						const videoEnd =
							videoPlayerElement.getAttribute('data-end');
						const videoType =
							videoPlayerElement.getAttribute('data-type');

						if (videoType === 'vimeo' && videoEnd) {
							const player = new Vimeo.Player(
								videoPlayerElement.querySelector('iframe')
							);

							player.on('timeupdate', function (data) {
								if (data.seconds > videoEnd) {
									player.pause();
								}
							});
						}
					});
				};
				document.body.appendChild(script);
			}
		}
	}
});
