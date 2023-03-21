/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import DropMarkerAlert from '../drop-marker-alert';
import MapEventsListener from '../map-events-listener';
import Markers from '../markers';
import SearchBox from '../search-box';
import { getGroupAttributes } from '../../../../extensions/styles';
import { getMaxiAdminSettingsUrl } from '../../utils';

/**
 * External dependencies
 */
import { MapContainer, TileLayer } from 'react-leaflet';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';

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
	} = attributes;

	const [isDraggingMarker, setIsDraggingMarker] = useState(false);
	const [isAddingMarker, setIsAddingMarker] = useState(false);

	const showError = !apiKey && isGoogleMaps;

	const resizeMap = map => {
		// To get rid of the grey bars, we need to update the map size
		// https://stackoverflow.com/a/71006998
		const resizeObserver = new ResizeObserver(() => map?.invalidateSize());

		const container = document.getElementById(
			`maxi-map-block__container-${uniqueID}`
		);

		if (container) resizeObserver.observe(container);
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
					>
						{isGoogleMaps ? (
							<ReactLeafletGoogleLayer
								apiKey={apiKey}
								callback={Function.prototype}
							/>
						) : (
							<TileLayer
								attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
								url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
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
							'Oops, you can not see the map because you have not set your Google map API key, please navigate to the Maxi Blocks ',
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
