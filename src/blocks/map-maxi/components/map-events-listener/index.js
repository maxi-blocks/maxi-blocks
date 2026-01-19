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
		setIsFirstClick(prev =>
			isSelected === prev ? !isSelected : prev
		);
	}, [isSelected]);

	const timeout = 300;

	const mapEvents = useMapEvents({
		mousedown: event => {
			const elementClicked =
				event.originalEvent.target.nodeName.toLowerCase();
			if (elementClicked === 'div') {
				setIsDraggingMarker(false);
			}
			if (!isDraggingMarker && !isFirstClick) {
				delayRef.current = setTimeout(() => {
					setIsAddingMarker(true);
					setTimeout(() => {
						// If hangs for too long, stop it.
						setIsAddingMarker(false);
					}, timeout * 5);
				}, timeout);
			}
		},
		drag: () => {
			clearTimeout(delayRef.current);
			setIsAddingMarker(false);
			setIsDraggingMarker(false);
		},
		mouseup: event => {
			clearTimeout(delayRef.current);

			if (isAddingMarker) {
				const { lat, lng } = event.latlng;
				const newMarker = getNewMarker([lat, lng], mapMarkers);

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

			maxiSetAttributes({
				'map-latitude': lat,
				'map-longitude': lng,
			});
		},
		zoomend: () => {
			const newZoom = mapEvents.getZoom();

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
