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
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet.gridlayer.googlemutant';

const GoogleLayer = ({ apiKey, mapType = 'roadmap' }) => {
	const map = useMap();

	useEffect(() => {
		let script;
		if (!window.google || !window.google.maps) {
			script = document.createElement('script');
			script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&loading=async`;
			script.async = true;
			script.defer = true;
			script.onload = () => {
				L.gridLayer
					.googleMutant({
						type: mapType,
						maxZoom: 20,
					})
					.addTo(map);
			};
			document.head.appendChild(script);
		} else {
			L.gridLayer
				.googleMutant({
					type: mapType,
					maxZoom: 20,
				})
				.addTo(map);
		}

		return () => {
			if (script) {
				document.head.removeChild(script);
			}
		};
	}, [map, apiKey, mapType]);

	return null;
};

const getOSMTileLayer = mapType => {
	const tileUrls = {
		standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		humanitarian: 'https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png',
		cycle: 'https://{s}.tile-cyclosm.openstreetmap.fr/cyclosm/{z}/{x}/{y}.png',
		transport:
			'https://{s}.tile.thunderforest.com/transport/{z}/{x}/{y}.png',
	};

	return tileUrls[mapType] || tileUrls.standard;
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

	// Setup resize handler without returning a cleanup function
	const resizeMap = map => {
		if (!map) return;

		// Get container element
		const container = document.getElementById(
			`maxi-map-block__container-${uniqueID}`
		);

		if (!container) return;

		// Create and use resize observer
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

		// Start observing
		resizeObserver.observe(container);

		// Attach cleanup to map's remove event
		map.on('remove', () => {
			resizeObserver.unobserve(container);
			resizeObserver.disconnect();
		});
	};

	return (
		<div
			className='maxi-map-block__container'
			id={`maxi-map-block__container-${uniqueID}`}
		>
			{!showError && (
				<>
					<MapContainer
						center={[mapLatitude, mapLongitude]}
						minZoom={mapMinZoom}
						maxZoom={mapMaxZoom}
						zoom={mapZoom}
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
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								url={getOSMTileLayer(mapType)}
							/>
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
