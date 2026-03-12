/**
 * WordPress dependencies
 */
import { useEffect, useRef, useState } from '@wordpress/element';

/**
 * Internal dependencies
 */
import { getNewMarker, getUpdatedMarkers } from '@blocks/map-maxi/utils';

/**
 * External dependencies
 */
import { useMapEvents } from 'react-leaflet';

const MapEventsListener = props => {
	const {
		isAddingMarker,
		isDraggingMarker,
		isSelected,
		mapMarkers,
		mapMaxZoom,
		mapMinZoom,
		maxiSetAttributes,
		setIsAddingMarker,
		setIsDraggingMarker,
	} = props;

	const [isFirstClick, setIsFirstClick] = useState(true);
	const delayRef = useRef(null);

	useEffect(() => {
		setIsFirstClick(prev => {
			const next = isSelected === prev ? !isSelected : prev;
			console.log(
				`[MapEventsListener] isSelected changed to ${JSON.stringify(isSelected)} – isFirstClick: ${JSON.stringify(prev)} → ${JSON.stringify(next)}`
			);
			return next;
		});
	}, [isSelected]);

	const timeout = 300;

	const mapEvents = useMapEvents({
		mousedown: event => {
			const elementClicked =
				event.originalEvent.target.nodeName.toLowerCase();

			console.log(
				`[MapEventsListener] mousedown – elementClicked: ${JSON.stringify(elementClicked)}, isDraggingMarker: ${JSON.stringify(isDraggingMarker)}, isFirstClick: ${JSON.stringify(isFirstClick)}, isSelected: ${JSON.stringify(isSelected)}`
			);

			if (elementClicked === 'div') {
				setIsDraggingMarker(false);
			}
			if (!isDraggingMarker && !isFirstClick) {
				console.log(
					'[MapEventsListener] Scheduling pin-drop timer (hold to add marker)'
				);
				delayRef.current = setTimeout(() => {
					console.log(
						'[MapEventsListener] Hold threshold reached – setIsAddingMarker(true)'
					);
					setIsAddingMarker(true);
					setTimeout(() => {
						// If hangs for too long, stop it.
						setIsAddingMarker(false);
					}, timeout * 5);
				}, timeout);
			} else {
				console.log(
					`[MapEventsListener] Pin-drop skipped – isDraggingMarker: ${JSON.stringify(isDraggingMarker)}, isFirstClick: ${JSON.stringify(isFirstClick)}`
				);
			}
		},
		drag: () => {
			console.log('[MapEventsListener] drag – cancelling pin-drop timer');
			clearTimeout(delayRef.current);
			setIsAddingMarker(false);
			setIsDraggingMarker(false);
		},
		mouseup: event => {
			clearTimeout(delayRef.current);

			console.log(
				`[MapEventsListener] mouseup – isAddingMarker: ${JSON.stringify(isAddingMarker)}, latlng: ${JSON.stringify(event.latlng)}`
			);

			if (isAddingMarker) {
				const { lat, lng } = event.latlng;
				const newMarker = getNewMarker([lat, lng], mapMarkers);

				console.log(
					`[MapEventsListener] Dropping marker at lat: ${JSON.stringify(lat)}, lng: ${JSON.stringify(lng)}`
				);

				maxiSetAttributes({
					'map-markers': getUpdatedMarkers(mapMarkers, newMarker),
				});
				setIsAddingMarker(false);
				setTimeout(() => {
					setIsDraggingMarker(false);
				}, timeout * 2);
			}
		},
		moveend: () => {
			const { lat, lng } = mapEvents.getCenter();

			console.log(
				`[MapEventsListener] moveend – new center: ${JSON.stringify({ lat, lng })}`
			);

			maxiSetAttributes({
				'map-latitude': lat,
				'map-longitude': lng,
			});
		},
		zoomend: () => {
			const newZoom = mapEvents.getZoom();

			console.log(
				`[MapEventsListener] zoomend – new zoom: ${JSON.stringify(newZoom)}`
			);

			maxiSetAttributes({
				'map-zoom': newZoom,
			});
		},
	});

	useEffect(() => {
		mapEvents.setMinZoom(mapMinZoom);
		mapEvents.setMaxZoom(mapMaxZoom);
	}, [mapMinZoom, mapMaxZoom]);

	useEffect(() => {
		return () => {
			clearTimeout(delayRef.current);
		};
	}, []);

	return null;
};

export default MapEventsListener;
