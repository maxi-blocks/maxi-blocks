/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { useState, useEffect, useRef } from '@wordpress/element';

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
			script.onerror = () => {
				googleMapsPromise = null;
				reject(new Error('Failed to load Google Maps API script'));
			};
			document.head.appendChild(script);
		});
	}

	return googleMapsPromise;
};

/**
 * Patches Leaflet's drag handler for the Gutenberg API 3 iframe scenario.
 *
 * How the problem arises:
 *   - Block scripts execute in the OUTER frame's JS context (window/document).
 *   - Leaflet's Draggable._onDown registers its temporary mousemove/mouseup
 *     listeners on the outer `document`.
 *   - React portals the block DOM into the editor iframe, so mouse events fire
 *     on the iframe's document, never reaching the outer document's listeners.
 *   - Result: Leaflet never receives mouseup → drag state is stuck forever.
 *
 * The fix:
 *   - Detect the mismatch via map.getContainer().ownerDocument !== document.
 *   - While a drag is active (mouse down on map), forward mousemove and mouseup
 *     from the iframe's document to the outer document where Leaflet listens.
 *   - Coordinates stay in iframe-space, which is fine because Leaflet's drag
 *     only uses deltas between consecutive positions (not absolute coords).
 *
 * @param {L.Map} map - Leaflet map instance.
 */
const applyIframeDragFix = map => {
	const container = map.getContainer();
	const containerDoc = container.ownerDocument;
	const outerDoc = document; // Outer frame document = where Leaflet drag handler listens

	if (containerDoc === outerDoc) {
		console.log(
			'[MapMaxi] Map container is in the same document – no iframe drag fix needed'
		);
		return;
	}

	console.log(
		'[MapMaxi] Map container is inside an iframe document – applying Leaflet drag fix (forwarding iframe events → outer document)'
	);

	let isDragActive = false;

	/**
	 * Dispatch a synthetic mouse event on the outer document so Leaflet's
	 * drag handler (Draggable._onMove / _onUp) receives it.
	 * Coordinates are kept as-is (iframe-space) because Leaflet only uses deltas.
	 *
	 * @param {string}     type - 'mousemove' or 'mouseup'
	 * @param {MouseEvent} e    - Original event from the iframe document.
	 */
	const forwardToOuter = (type, e) => {
		const syntheticEvent = new MouseEvent(type, {
			bubbles: true,
			cancelable: true,
			view: outerDoc.defaultView,
			clientX: e.clientX,
			clientY: e.clientY,
			screenX: e.screenX,
			screenY: e.screenY,
			button: e.button,
			buttons: e.buttons,
			movementX: e.movementX,
			movementY: e.movementY,
		});
		outerDoc.dispatchEvent(syntheticEvent);
	};

	const onIframeMouseMove = e => {
		if (isDragActive) forwardToOuter('mousemove', e);
	};

	const onIframeMouseUp = e => {
		if (!isDragActive) return;
		isDragActive = false;
		// Always forward mouseup so Leaflet's Draggable._onUp fires on the
		// outer document and resets its drag state.  Without this, any
		// mousedown on the map (drag, hold-to-pin, button click inside the
		// map) leaves Leaflet stuck in drag mode because its mouseup listener
		// is registered on the outer document but the event fires in the
		// iframe and never reaches it.
		forwardToOuter('mouseup', e);
		console.log(
			'[MapMaxi] iframe mouseup forwarded to outer document – Leaflet drag state reset'
		);
	};

	// Activate forwarding when the user starts interacting with the map.
	container.addEventListener('mousedown', () => {
		isDragActive = true;
		console.log(
			'[MapMaxi] map mousedown – forwarding iframe events to outer document'
		);
	});

	containerDoc.addEventListener('mousemove', onIframeMouseMove);
	containerDoc.addEventListener('mouseup', onIframeMouseUp);

	map.on('remove', () => {
		containerDoc.removeEventListener('mousemove', onIframeMouseMove);
		containerDoc.removeEventListener('mouseup', onIframeMouseUp);
		console.log(
			'[MapMaxi] Map removed – cleaned up iframe drag fix listeners'
		);
	});
};

const GoogleLayer = ({ apiKey, mapType = 'roadmap' }) => {
	const map = useMap();
	const [loadError, setLoadError] = useState(null);

	useEffect(() => {
		let googleLayer;
		let cancelled = false;

		setLoadError(null);

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

		loadGoogleMapsApi(apiKey)
			.then(addLayer)
			.catch(error => {
				console.error(
					`Google Maps API failed to load: ${JSON.stringify(error?.message)}`
				);
				if (!cancelled) {
					setLoadError(error?.message || 'Unknown error');
				}
			});

		return () => {
			cancelled = true;
			if (googleLayer) {
				map.removeLayer(googleLayer);
			}
		};
	}, [map, apiKey, mapType]);

	if (loadError) {
		return (
			<div className='maxi-map-block__error'>
				{__(
					'Google Maps failed to load. Please check your API key and try again.',
					'maxi-blocks'
				)}
			</div>
		);
	}

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

	const containerRef = useRef(null);
	const [isDraggingMarker, setIsDraggingMarker] = useState(false);
	const [isAddingMarker, setIsAddingMarker] = useState(false);

	const showError = !apiKey && isGoogleMaps;

	const resizeMap = map => {
		if (!map) return;

		const mapSize = map.getSize();
		const containerEl = map.getContainer();

		console.log(
			`[MapMaxi] Map ready – uniqueID: ${JSON.stringify(uniqueID)}, isIframe: ${JSON.stringify(window !== window.parent)}, mapSize: ${JSON.stringify(mapSize)}, containerOffsetHeight: ${JSON.stringify(containerEl?.offsetHeight)}, containerClientHeight: ${JSON.stringify(containerEl?.clientHeight)}`
		);

		const safeInvalidateSize = label => {
			if (map._isDestroyed || !map.getContainer()) return;
			try {
				map.invalidateSize({ animate: false, pan: false, duration: 0 });
				console.log(
					`[MapMaxi] invalidateSize (${label}) – size: ${JSON.stringify(map.getSize())}`
				);
			} catch (e) {
				// Ignore errors during resize
			}
		};

		// Immediate attempt – covers the common case where CSS is already applied.
		safeInvalidateSize('immediate');

		// When the block is newly inserted the container CSS (height: 300px)
		// may not have been applied yet, leaving Leaflet with height 0.  With
		// height 0 every pixel→lat/lng calculation breaks and dragging sends
		// the map to extreme latitudes.  We schedule several deferred attempts
		// so whichever fires after the layout has settled wins.
		requestAnimationFrame(() => safeInvalidateSize('rAF'));
		setTimeout(() => safeInvalidateSize('100ms'), 100);
		setTimeout(() => safeInvalidateSize('500ms'), 500);

		// Apply the drag fix before anything else so Leaflet's internal
		// drag handler is already set up when we start listening on the parent.
		applyIframeDragFix(map);

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

		const container = containerRef.current;

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
			ref={containerRef}
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
