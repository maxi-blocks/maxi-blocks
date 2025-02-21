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

// Helper to detect if we're in an iframe or site editor canvas
const isInIframe = () => {
	try {
		// Check for standard iframe
		const inStandardIframe = window.self !== window.top;

		// Check for WordPress site editor iframe
		const editorCanvas = document.querySelector(
			'.edit-site-visual-editor__editor-canvas, .editor-canvas'
		);

		// Check if we're inside the editor canvas iframe
		const inEditorCanvas = !!editorCanvas && window.self === window.top;

		return inStandardIframe || inEditorCanvas;
	} catch (e) {
		return true;
	}
};

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
	const [mapInstance, setMapInstance] = useState(null);

	const showError = !apiKey && isGoogleMaps;

	const resizeMap = map => {
		if (!map) return;

		setMapInstance(map);

		// Special handling for iframe contexts
		const inIframe = isInIframe();
		if (inIframe) {
			// Force immediate resize
			map.invalidateSize({ animate: false, pan: false });

			// Disable tap handling
			map.options.tap = false;

			// Reset all handlers
			map._handlers.forEach(handler => {
				if (handler._map) {
					if (handler.disable) handler.disable();
				}
			});

			// Re-enable handlers with proper options
			map.dragging.enable();
			map.touchZoom.enable();
			map.doubleClickZoom.enable();
			map.scrollWheelZoom.enable();

			// Remove all existing handlers
			map.off();

			let isDragging = false;
			let startPoint = null;

			const handleMouseDown = e => {
				const { originalEvent } = e;

				console.debug('Mouse down event:', {
					button: originalEvent.button,
					buttons: originalEvent.buttons,
					target: originalEvent.target,
					isDragging,
					type: originalEvent.type,
					pointerType: originalEvent.pointerType,
					clientX: originalEvent.clientX,
					clientY: originalEvent.clientY,
				});

				// Store the initial mouse position
				startPoint = L.point(
					originalEvent.clientX,
					originalEvent.clientY
				);

				// Start dragging on left click + drag or right click
				if (originalEvent.buttons === 1 || originalEvent.button === 2) {
					isDragging = true;
					map.dragging.enable();
					// Prevent text selection during drag
					document.body.style.userSelect = 'none';
				} else {
					map.dragging.disable();
				}
			};

			const handleMouseMove = e => {
				const { originalEvent } = e;

				console.debug('Mouse move event:', {
					isDragging,
					startPoint,
					clientX: originalEvent.clientX,
					clientY: originalEvent.clientY,
					buttons: originalEvent.buttons,
					type: originalEvent.type,
				});

				if (!isDragging || !startPoint) return;

				const currentPoint = L.point(
					originalEvent.clientX,
					originalEvent.clientY
				);
				const offset = currentPoint.subtract(startPoint);

				console.debug('Move calculation:', {
					currentPoint: currentPoint.toString(),
					startPoint: startPoint.toString(),
					offset: offset.toString(),
				});

				if (offset.x !== 0 || offset.y !== 0) {
					// Negate the offset to match the drag direction
					map.panBy(offset.multiplyBy(-1));
					startPoint = currentPoint;
				}
			};

			const handleMouseUp = e => {
				const { originalEvent } = e;

				console.debug('Mouse up event:', {
					button: originalEvent.button,
					buttons: originalEvent.buttons,
					isDragging,
					isMarkerIcon: originalEvent.target.classList.contains(
						'leaflet-marker-icon'
					),
					type: originalEvent.type,
					clientX: originalEvent.clientX,
					clientY: originalEvent.clientY,
				});

				document.body.style.userSelect = '';

				const wasDragging = isDragging;
				isDragging = false;
				startPoint = null;
				map.dragging.disable();

				// Only fire click if we haven't dragged and it's a left click
				if (!wasDragging && originalEvent.button === 0) {
					if (
						!originalEvent.target.classList.contains(
							'leaflet-marker-icon'
						)
					) {
						// Prevent duplicate events by only handling MouseEvent
						if (
							originalEvent instanceof MouseEvent &&
							!(originalEvent instanceof PointerEvent)
						) {
							console.debug('Firing click event');
							map.fire('click', e);
						}
					}
				}
			};

			// Add our custom event handlers
			map.on('mousedown', handleMouseDown);
			map.on('mousemove', handleMouseMove);
			map.on('mouseup', handleMouseUp);

			// Handle touch events
			let touchStartPoint = null;

			map.on('touchstart', e => {
				console.debug('Touch start event:', {
					touches: e.originalEvent.touches.length,
					clientX: e.originalEvent.touches[0]?.clientX,
					clientY: e.originalEvent.touches[0]?.clientY,
				});

				const touch = e.originalEvent.touches[0];
				touchStartPoint = L.point(touch.clientX, touch.clientY);
			});

			map.on('touchmove', e => {
				console.debug('Touch move event:', {
					touchStartPoint,
					isDragging,
					touches: e.originalEvent.touches.length,
				});

				if (!touchStartPoint) return;

				const touch = e.originalEvent.touches[0];
				const currentPoint = L.point(touch.clientX, touch.clientY);
				const offset = currentPoint.subtract(touchStartPoint);

				if (offset.x !== 0 || offset.y !== 0) {
					isDragging = true;
					// Negate the offset for touch dragging too
					map.panBy(offset.multiplyBy(-1));
					touchStartPoint = currentPoint;
				}
			});

			map.on('touchend', e => {
				console.debug('Touch end event:', {
					isDragging,
					touches: e.originalEvent.touches.length,
				});

				const wasDragging = isDragging;
				isDragging = false;
				touchStartPoint = null;

				if (!wasDragging) {
					map.fire('click', e);
				}
			});

			// Debug listener for click events
			map.on('click', e => {
				console.debug('Map click event fired:', {
					latlng: e.latlng,
					type: e.originalEvent.type,
					target: e.originalEvent.target,
				});
			});
		}

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
		const cleanup = () => {
			if (container) {
				resizeObserver.unobserve(container);
				resizeObserver.disconnect();
			}
		};

		return cleanup;
	};

	// Handle iframe-specific updates
	useEffect(() => {
		if (!mapInstance || !isInIframe()) {
			return;
		}

		const handleIframeResize = () => {
			mapInstance.invalidateSize({ animate: false, pan: false });
		};

		window.addEventListener('resize', handleIframeResize);

		// Cleanup function
		const cleanup = () => {
			window.removeEventListener('resize', handleIframeResize);
		};

		return cleanup;
	}, [mapInstance]);

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
