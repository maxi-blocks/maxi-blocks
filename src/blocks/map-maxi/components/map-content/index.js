/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect } from '@wordpress/element';

/**
 * Internal dependencies
 */
import DropMarkerAlert from '@blocks/map-maxi/components/drop-marker-alert';
import MapEventsListener from '@blocks/map-maxi/components/map-events-listener';
import Markers from '@blocks/map-maxi/components/markers';
import SearchBox from '@blocks/map-maxi/components/search-box';
import { getGroupAttributes } from '@extensions/styles';
import { getMaxiAdminSettingsUrl } from '@blocks/map-maxi/utils';

/**
 * External dependencies
 */
import { MapContainer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.gridlayer.googlemutant';

let googleMapsPromise = null;

const loadGoogleMapsApi = apiKey => {
	if (window.google?.maps) {
		return Promise.resolve();
	}

	if (!googleMapsPromise) {
		googleMapsPromise = new Promise((resolve, reject) => {
			const script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
			script.async = true;
			script.defer = true;
			script.onload = resolve;
			script.onerror = reject;
			document.head.appendChild(script);
		});
	}

	return googleMapsPromise;
};

const GoogleLayer = ({ apiKey, mapType = 'roadmap' }) => {
	const map = useMap();

	useEffect(() => {
		let googleLayer;
		let cancelled = false;

		// Clear existing layers
		map.eachLayer(layer => {
			if (layer._url === undefined) {
				// Not a tile layer
				map.removeLayer(layer);
			}
		});

		const addLayer = () => {
			if (cancelled) return;
			googleLayer = L.gridLayer
				.googleMutant({
					type: mapType,
					maxZoom: 22,
				})
				.addTo(map);
		};

		loadGoogleMapsApi(apiKey).then(addLayer);

		return () => {
			cancelled = true;
			if (googleLayer) {
				map.removeLayer(googleLayer);
			}
		};
	}, [map, apiKey, mapType]);

	return null;
};

const OSMLayer = ({ mapType = 'standard' }) => {
	const map = useMap();

	useEffect(() => {
		// Clear existing tile layers
		map.eachLayer(layer => {
			if (layer._url !== undefined) {
				// Is a tile layer
				map.removeLayer(layer);
			}
		});

		const tileUrls = {
			standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
			humanitarian:
				'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
			cycle: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
			transport:
				'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
		};

		const url = tileUrls[mapType] || tileUrls.standard;

		const osmLayer = L.tileLayer(url, {
			attribution:
				'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
			maxZoom: 18,
		}).addTo(map);

		return () => {
			map.removeLayer(osmLayer);
		};
	}, [map, mapType]);

	return null;
};

const MapContent = props => {
	const {
		apiKey,
		attributes,
		isFirstClick,
		isGoogleMaps,
		isSelected,
		maxiSetAttributes,
	} = props;
	const {
		uniqueID,
		'map-latitude': mapLatitude,
		'map-longitude': mapLongitude,
		'map-markers': mapMarkers,
		'map-max-zoom': mapMaxZoom,
		'map-min-zoom': mapMinZoom,
		'map-zoom': mapZoom,
		'map-type': mapType = 'roadmap',
	} = attributes;

	const [isDraggingMarker, setIsDraggingMarker] = useState(false);
	const [isAddingMarker, setIsAddingMarker] = useState(false);

	const showError = !apiKey && isGoogleMaps;

	const resizeMap = map => {
		if (!map) return;

		// To get rid of the grey bars, we need to update the map size
		const resizeObserver = new ResizeObserver(() => {
			if (map && !map._isDestroyed && map.getContainer()) {
				requestAnimationFrame(() => {
					try {
						map.invalidateSize({
							animate: false,
							pan: false,
							duration: 0,
						});
					} catch (e) {
						// Ignore errors during resize
					}
				});
			}
		});

		const container = document.getElementById(
			`maxi-map-block__container-${uniqueID}`
		);

		if (container) {
			resizeObserver.observe(container);
		}

		// Cleanup function
		return () => {
			if (container) {
				resizeObserver.unobserve(container);
				resizeObserver.disconnect();
			}
		};
	};

	return (
		<div
			className='maxi-map-block__container'
			id={`maxi-map-block__container-${uniqueID}`}
		>
			{!showError && (
				<>
					<MapContainer
						key={`map-container-${uniqueID}`}
						center={[mapLatitude, mapLongitude]}
						minZoom={mapMinZoom}
						maxZoom={
							isGoogleMaps ? mapMaxZoom : Math.min(mapMaxZoom, 18)
						}
						zoom={mapZoom || 4}
						whenReady={map => resizeMap(map.target)}
						tap={false}
						dragging
						touchZoom
						doubleClickZoom
						scrollWheelZoom
						zoomControl
						trackResize
					>
						{isGoogleMaps ? (
							<GoogleLayer apiKey={apiKey} mapType={mapType} />
						) : (
							<OSMLayer mapType={mapType} />
						)}
						<MapEventsListener
							isAddingMarker={isAddingMarker}
							isDraggingMarker={isDraggingMarker}
							isFirstClick={isFirstClick}
							isSelected={isSelected}
							mapMarkers={mapMarkers}
							mapMaxZoom={mapMaxZoom}
							mapMinZoom={mapMinZoom}
							maxiSetAttributes={maxiSetAttributes}
							setIsAddingMarker={setIsAddingMarker}
							setIsDraggingMarker={setIsDraggingMarker}
						/>
						<Markers
							attributes={getGroupAttributes(attributes, [
								'map',
								'mapMarker',
								'mapPopup',
								'mapPopupText',
							])}
							maxiSetAttributes={maxiSetAttributes}
							setIsDraggingMarker={setIsDraggingMarker}
						/>
						<SearchBox
							mapMarkers={mapMarkers}
							maxiSetAttributes={maxiSetAttributes}
						/>
					</MapContainer>
					<DropMarkerAlert isAddingMarker={isAddingMarker} />
				</>
			)}
			{showError && (
				<div className='maxi-map-block__not-found'>
					<p>
						{__(
							'Oops, you can not see the map because you have not set your Google map API key, please navigate to the MaxiBlocks ',
							'maxi-blocks'
						)}
						<a
							target='_blank'
							href={getMaxiAdminSettingsUrl()}
							rel='noreferrer'
						>
							{__(
								'Settings > Google Maps API key',
								'maxi-blocks'
							)}
						</a>
					</p>
				</div>
			)}
		</div>
	);
};

export default MapContent;
