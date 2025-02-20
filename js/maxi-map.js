/* eslint-disable no-undef */
window.onload = () => {
	const apiKey = maxiMap[1];
	const mapItems = [];

	for (const key in maxiMap[0]) {
		// Filtering unwanted properties from the prototype
		if (!Object.prototype.hasOwnProperty.call(maxiMap[0], key)) {
			console.warn('Skipping prototype property', key);
		} else {
			let obj;

			if (typeof maxiMap[0][key] === 'string') {
				try {
					obj = JSON.parse(maxiMap[0][key]);
				} catch (e) {
					console.error('Invalid JSON string', e);
				}
			} else if (
				typeof maxiMap[0][key] === 'object' &&
				maxiMap[0][key] !== null
			) {
				obj = maxiMap[0][key];
			} else {
				console.error(
					'The value is neither an object nor a string',
					maxiMap[0][key]
				);
			}

			if (obj) {
				obj.id = key; // Save the key (map id) in the object
				mapItems.push(obj);
			}
		}
	}

	const isGoogleProvider = mapItems.some(
		item => item['map-provider'] === 'googlemaps'
	);
	const isGoogleScriptsNeeded = isGoogleProvider && apiKey;

	const loadElement = (elementName, properties, callback) => {
		const element = document.createElement(elementName);
		if (properties) {
			Object.keys(properties).forEach(key => {
				element[key] = properties[key];
			});
		}

		element.onload = callback;
		document.body.appendChild(element);
	};

	const loadElements = (elements, callback) => {
		const promises = elements.map(element => {
			if (!element) {
				return;
			}

			const elementName = element.elementName ?? 'script';

			return new Promise(resolve => {
				loadElement(elementName, element.properties, resolve);
			});
		});

		Promise.all(promises)
			.then(() => {
				callback();
			})
			.catch(error => {
				console.log(error);
			});
	};

	loadElements(
		[
			isGoogleScriptsNeeded && {
				properties: {
					src: `https://maps.googleapis.com/maps/api/js?key=${apiKey}&callback=Function.prototype`,
					async: true,
					defer: true,
				},
			},
			{
				elementName: 'link',
				properties: {
					href: 'https://unpkg.com/leaflet@1.8.0/dist/leaflet.css',
					rel: 'stylesheet',
					integrity:
						'sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ==',
					crossOrigin: '',
				},
			},
			{
				properties: {
					src: 'https://unpkg.com/leaflet@1.8.0/dist/leaflet.js',
					integrity:
						'sha512-BB3hKbKWOc9Ez/TAwyWxNXeoV9c1v6FIeYiBieIWkpLjauysF18NzgR1MBNBXf8/KABdlkX68nAhlwcDFLGPCQ==',
					crossOrigin: '',
				},
			},
			isGoogleScriptsNeeded && {
				properties: {
					src: 'https://unpkg.com/leaflet.gridlayer.googlemutant@latest/dist/Leaflet.GoogleMutant.js',
				},
			},
		],
		() => {
			mapItems.map(item => {
				const {
					id: uniqueID,
					'map-dragging': mapDragging,
					'map-touch-zoom': mapTouchZoom,
					'map-double-click-zoom': mapDoubleClickZoom,
					'map-scroll-wheel-zoom': mapScrollWheelZoom,
					'map-latitude': mapLatitude,
					'map-longitude': mapLongitude,
					'map-zoom': mapZoom,
					'map-markers': mapMarkers,
					'map-marker-icon': mapMarkerIcon,
					'map-marker-heading-level': mapMarkerHeadingLevel,
					'map-min-zoom': mapMinZoom,
					'map-max-zoom': mapMaxZoom,
					ariaLabels,
				} = item;

				const map = L.map(`maxi-map-block__container-${uniqueID}`, {
					dragging: mapDragging,
					touchZoom: mapTouchZoom,
					doubleClickZoom: mapDoubleClickZoom,
					scrollWheelZoom: mapScrollWheelZoom,
					minZoom: mapMinZoom,
					maxZoom: mapMaxZoom,
				}).setView([mapLatitude, mapLongitude], mapZoom);

				isGoogleScriptsNeeded
					? L.gridLayer
							.googleMutant({
								type: 'roadmap', // valid values are 'roadmap', 'satellite', 'terrain' and 'hybrid'
							})
							.addTo(map)
					: L.tileLayer(
							'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
							{
								attribution:
									'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
							}
					  ).addTo(map);

				const markerIcon = L.divIcon({
					html: mapMarkerIcon,
					iconSize: [null, null],
				});

				mapMarkers?.map(marker => {
					const { latitude, longitude, heading, description } =
						marker;

					const ariaLabel = ariaLabels?.popup
						? `aria-label='${ariaLabels.popup}'`
						: '';
					const popupContent = `
					<div class='maxi-map-block__popup' ${ariaLabel}>
						<div class='maxi-map-block__popup__content'>
						${
							heading &&
							`<${mapMarkerHeadingLevel} class='maxi-map-block__popup__content__title'>${heading}</${mapMarkerHeadingLevel}>`
						}
						${
							description &&
							`<p class='maxi-map-block__popup__content__description'>${description}</p>`
						}
						</div>
					</div>
					`;

					if (heading === '' && description === '') {
						L.marker([latitude, longitude], {
							icon: markerIcon,
						}).addTo(map);
					} else
						L.marker([latitude, longitude], {
							icon: markerIcon,
						})
							.addTo(map)
							.bindPopup(popupContent)
							.openPopup();
				});
			});
		}
	);
};
