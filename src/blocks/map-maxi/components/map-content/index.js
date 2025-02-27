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

// Debug utility - set to true during development, false in production
const DEBUG_MODE = true;

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

	// Track marker adding state in a global variable for iframe access
	useEffect(() => {
		// Make the marker adding state available globally for iframe context
		window.maxiMapAddingMarker = isAddingMarker;

		return () => {
			// Clean up when component unmounts
			delete window.maxiMapAddingMarker;
		};
	}, [isAddingMarker]);

	const showError = !apiKey && isGoogleMaps;

	// Setup resize handler without returning a cleanup function
	const resizeMap = map => {
		if (!map) return;

		// Get container element - first try in the main document
		let container = document.getElementById(
			`maxi-map-block__container-${uniqueID}`
		);

		// If container not found, check if we're in an iframe (FSE or tablet/mobile previews)
		if (!container) {
			// First try the editor-canvas iframe (common in FSE)
			const editorIframe = document.querySelector(
				'iframe[name="editor-canvas"]'
			);

			if (editorIframe && editorIframe.contentDocument) {
				container = editorIframe.contentDocument.getElementById(
					`maxi-map-block__container-${uniqueID}`
				);
			}

			// If still not found, try checking all iframes
			if (!container) {
				const iframes = document.querySelectorAll('iframe');
				for (let i = 0; i < iframes.length && !container; i += 1) {
					try {
						// Only access if we have permission (same-origin)
						if (iframes[i].contentDocument) {
							container = iframes[
								i
							].contentDocument.getElementById(
								`maxi-map-block__container-${uniqueID}`
							);
							if (container) break;
						}
					} catch (e) {
						// Skip iframes we can't access due to same-origin policy
					}
				}
			}
		}

		if (!container) return;

		// Debug map properties related to interaction and events
		if (DEBUG_MODE) {
			// eslint-disable-next-line no-console
			console.log('Map debug info:', {
				// Container info
				container: container.id,
				containerInIframe:
					window !== container.ownerDocument.defaultView,

				// Map state
				mapExists: !!map,
				mapCenter: map.getCenter(),
				mapZoom: map.getZoom(),
				mapSize: map.getSize(),
				mapPixelOrigin: map.getPixelOrigin(),

				// Interaction settings
				dragging: map.options.dragging,
				touchZoom: map.options.touchZoom,
				doubleClickZoom: map.options.doubleClickZoom,
				scrollWheelZoom: map.options.scrollWheelZoom,
				boxZoom: map.options.boxZoom,
				keyboard: map.options.keyboard,
				inertia: map.options.inertia,
				zoomControl: map.options.zoomControl,

				// Handlers status
				dragEnabled: map.dragging && map.dragging.enabled(),
				touchZoomEnabled: map.touchZoom && map.touchZoom.enabled(),
				doubleClickZoomEnabled:
					map.doubleClickZoom && map.doubleClickZoom.enabled(),
				scrollWheelZoomEnabled:
					map.scrollWheelZoom && map.scrollWheelZoom.enabled(),
				boxZoomEnabled: map.boxZoom && map.boxZoom.enabled(),
				keyboardEnabled: map.keyboard && map.keyboard.enabled(),

				// DOM info
				mapPane: map.getPane('mapPane') ? 'exists' : 'missing',
				tilePane: map.getPane('tilePane') ? 'exists' : 'missing',
				overlayPane: map.getPane('overlayPane') ? 'exists' : 'missing',

				// Event capture
				hasInteraction: map._handlers && map._handlers.length > 0,
				handlerCount: map._handlers ? map._handlers.length : 0,
			});
		}

		// Fix for iframe-specific issues
		const isInIframe = window !== container.ownerDocument.defaultView;
		if (isInIframe) {
			// Fix for map container in iframe
			const mapContainer = map.getContainer();
			if (mapContainer) {
				// Ensure the map container has proper CSS for iframe context
				mapContainer.style.position = 'relative';
				mapContainer.style.touchAction = 'none'; // Prevent browser handling of touch events
				mapContainer.style.msTouchAction = 'none';
				mapContainer.style.userSelect = 'none';
				mapContainer.style.webkitUserSelect = 'none';

				// Fix for iframe border capturing events
				try {
					// Try to find the iframe element that contains our map
					const iframes = document.querySelectorAll('iframe');
					for (let i = 0; i < iframes.length; i += 1) {
						try {
							if (
								iframes[i].contentDocument &&
								iframes[i].contentDocument.getElementById(
									container.id
								)
							) {
								// Found our iframe, apply styles to it
								iframes[i].style.pointerEvents = 'auto';
								// If the iframe has a parent with pointer-events: none, fix it
								let parent = iframes[i].parentElement;
								while (parent) {
									const computedStyle =
										window.getComputedStyle(parent);
									if (
										computedStyle.pointerEvents === 'none'
									) {
										parent.style.pointerEvents = 'auto';
									}
									parent = parent.parentElement;
								}
								break;
							}
						} catch (e) {
							// Skip iframes we can't access
						}
					}
				} catch (e) {
					// Ignore errors when trying to access iframe
				}

				// Fix for leaflet-dragging class not being applied correctly in iframes
				const handleMouseDown = () => {
					// Force add the leaflet-dragging class to the document element
					if (map.dragging && map.dragging._enabled) {
						// Get the correct document context (iframe's document)
						const doc = container.ownerDocument;
						doc.documentElement.classList.add('leaflet-dragging');

						// Remove it on mouseup anywhere in the iframe document
						const handleMouseUp = () => {
							doc.documentElement.classList.remove(
								'leaflet-dragging'
							);
							doc.removeEventListener('mouseup', handleMouseUp);
						};

						doc.addEventListener('mouseup', handleMouseUp);
					}
				};

				mapContainer.addEventListener('mousedown', handleMouseDown);

				// Fix for mouse capture issues in iframe
				const doc = container.ownerDocument;
				const handleIframeMouseMove = e => {
					// If we're dragging but the mouse has moved outside the map container,
					// we need to simulate the mousemove on the map to keep dragging working
					if (
						doc.documentElement.classList.contains(
							'leaflet-dragging'
						)
					) {
						// Ensure the map continues to receive events even if mouse moves outside
						if (!e._leafletPointerMoved) {
							const newEvt = new MouseEvent('mousemove', {
								clientX: e.clientX,
								clientY: e.clientY,
								screenX: e.screenX,
								screenY: e.screenY,
								ctrlKey: e.ctrlKey,
								shiftKey: e.shiftKey,
								altKey: e.altKey,
								metaKey: e.metaKey,
							});
							newEvt._leafletPointerMoved = true;
							mapContainer.dispatchEvent(newEvt);
						}
					}
				};

				// Add the event listener to the iframe's document
				doc.addEventListener('mousemove', handleIframeMouseMove);

				// Fix for touch events in iframe
				const handleTouchStart = e => {
					// Prevent default to avoid scrolling the page
					if (map.dragging && map.dragging._enabled) {
						e.preventDefault();
						// Add dragging class to indicate active touch
						doc.documentElement.classList.add('leaflet-dragging');
					}
				};

				const handleTouchEnd = () => {
					doc.documentElement.classList.remove('leaflet-dragging');
				};

				// Add touch event listeners
				mapContainer.addEventListener('touchstart', handleTouchStart, {
					passive: false,
				});
				mapContainer.addEventListener('touchend', handleTouchEnd);

				// Fix for stuck dragging state in iframe
				const forceDragEnd = () => {
					// Force end any ongoing drag operation
					if (
						map.dragging &&
						map.dragging._enabled &&
						map.dragging._draggable
					) {
						// Manually trigger the dragend event
						if (map.dragging._draggable._onUp) {
							try {
								map.dragging._draggable._onUp({
									type: 'mouseup',
									// Create a synthetic event with minimal required properties
									originalEvent: new MouseEvent('mouseup'),
								});
							} catch (e) {
								// Fallback if the above fails
								map.dragging._draggable.finishDrag();
							}
						}

						// Ensure dragging class is removed
						doc.documentElement.classList.remove(
							'leaflet-dragging'
						);

						// Reset any internal dragging state
						if (map.dragging._draggable._moved) {
							map.dragging._draggable._moved = false;
						}
					}
				};

				// Add event listeners to detect when dragging might get stuck
				doc.addEventListener('mouseup', () => {
					// Use a small timeout to ensure the normal drag end has a chance to complete
					setTimeout(forceDragEnd, 100);
				});

				// Also handle mouse leaving the iframe entirely
				doc.addEventListener('mouseleave', forceDragEnd);

				// Handle blur events on the window which can happen when clicking outside
				doc.defaultView.addEventListener('blur', forceDragEnd);

				// Clean up on map removal
				map.on('remove', () => {
					doc.removeEventListener('mousemove', handleIframeMouseMove);
					doc.removeEventListener('mouseleave', forceDragEnd);
					doc.defaultView.removeEventListener('blur', forceDragEnd);
					mapContainer.removeEventListener(
						'mousedown',
						handleMouseDown
					);
					mapContainer.removeEventListener(
						'touchstart',
						handleTouchStart
					);
					mapContainer.removeEventListener(
						'touchend',
						handleTouchEnd
					);
				});

				// Force a recalculation of the map's size and position
				setTimeout(() => {
					map.invalidateSize({
						animate: false,
						pan: false,
						duration: 0,
					});
				}, 100);

				// Fix for dragging issues after dropping pins
				// This ensures dragging is re-enabled after any marker interaction
				const resetDraggingAfterMarkerInteraction = () => {
					// Force re-enable dragging if it's disabled
					if (map.dragging && !map.dragging._enabled) {
						map.dragging.enable();
					}

					// Reset any stuck state
					doc.documentElement.classList.remove('leaflet-dragging');

					// Ensure the map is properly initialized for dragging
					if (map.dragging && map.dragging._draggable) {
						// Reset the moved state
						if (map.dragging._draggable._moved) {
							map.dragging._draggable._moved = false;
						}

						// Reset any active markers
						if (map._layers) {
							Object.values(map._layers).forEach(layer => {
								if (
									layer instanceof L.Marker &&
									layer.dragging
								) {
									if (layer.dragging._dragging) {
										layer.dragging._dragging = false;
									}
								}
							});
						}
					}
				};

				// Add event listeners for marker interactions
				mapContainer.addEventListener('click', () => {
					// Short delay to let marker placement complete
					setTimeout(resetDraggingAfterMarkerInteraction, 50);
				});

				// Also reset on mouseup to ensure dragging works after any interaction
				doc.addEventListener(
					'mouseup',
					resetDraggingAfterMarkerInteraction
				);

				// Update the cleanup to include our new event listeners
				const originalRemoveHandler = map._events.remove[0].fn;
				map.off('remove', originalRemoveHandler);
				map.on('remove', () => {
					// Call the original handler first
					originalRemoveHandler();

					// Then remove our additional listeners
					doc.removeEventListener('mousemove', handleIframeMouseMove);
					doc.removeEventListener('mouseleave', forceDragEnd);
					doc.defaultView.removeEventListener('blur', forceDragEnd);
					doc.removeEventListener(
						'mouseup',
						resetDraggingAfterMarkerInteraction
					);
					mapContainer.removeEventListener(
						'mousedown',
						handleMouseDown
					);
					mapContainer.removeEventListener(
						'touchstart',
						handleTouchStart
					);
					mapContainer.removeEventListener(
						'touchend',
						handleTouchEnd
					);
					mapContainer.removeEventListener(
						'click',
						resetDraggingAfterMarkerInteraction
					);
				});
			}
		}

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
						whenReady={mapEvent => {
							const map = mapEvent.target;

							// Call the resize function which now includes iframe fixes
							resizeMap(map);

							// Additional iframe-specific fixes that need to happen immediately
							const isInIframe = window !== window.parent;
							if (isInIframe) {
								// Enable tap for touch devices in iframe context
								if (map.tap && !map.tap._enabled) {
									map.tap.enable();
								}

								// Make sure the map gets focus when interacted with
								const mapContainer = map.getContainer();
								if (mapContainer) {
									mapContainer.tabIndex = 0; // Make focusable
									mapContainer.addEventListener(
										'mouseenter',
										() => {
											mapContainer.focus();
										}
									);

									// Fix for marker dropping in iframe
									// Override the map's _handleDOMEvent method to ensure proper event handling
									const originalHandleDOMEvent =
										map._handleDOMEvent;
									map._handleDOMEvent = function (e) {
										// Force the map to be the target for click events
										// This helps with marker placement
										if (
											e.type === 'click' ||
											e.type === 'dblclick'
										) {
											// Make sure the event target is the map container or a child
											if (
												!mapContainer.contains(e.target)
											) {
												return;
											}

											// If we're in marker adding mode, ensure the event is processed
											if (window.maxiMapAddingMarker) {
												// Create a new event with the map container as target
												const newEvent =
													new e.constructor(
														e.type,
														e
													);
												Object.defineProperty(
													newEvent,
													'target',
													{
														writable: false,
														value: mapContainer,
													}
												);

												// Call the original handler with our modified event
												originalHandleDOMEvent.call(
													this,
													newEvent
												);

												// Ensure dragging is re-enabled after marker placement
												setTimeout(() => {
													// Force re-enable dragging
													if (
														map.dragging &&
														!map.dragging._enabled
													) {
														map.dragging.enable();
													}

													// Reset any stuck state
													const doc =
														mapContainer.ownerDocument;
													if (doc) {
														doc.documentElement.classList.remove(
															'leaflet-dragging'
														);
													}
												}, 100);

												return;
											}
										}

										// Call the original handler for all other events
										originalHandleDOMEvent.call(this, e);
									};

									// Also patch the map's dragging handler to ensure it works after marker interactions
									if (map.dragging && map.dragging._enabled) {
										// Store the original _onDown method
										const originalOnDown =
											map.dragging._draggable._onDown;

										// Override it to ensure it works after marker placement
										map.dragging._draggable._onDown =
											function (e) {
												// Reset any stuck state before handling the event
												const doc =
													mapContainer.ownerDocument;
												if (
													doc &&
													doc.documentElement.classList.contains(
														'leaflet-dragging'
													)
												) {
													doc.documentElement.classList.remove(
														'leaflet-dragging'
													);
												}

												// Call the original handler
												originalOnDown.call(this, e);
											};
									}
								}
							}
						}}
						tap={false} // Default disabled, we'll enable it in iframe context if needed
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
