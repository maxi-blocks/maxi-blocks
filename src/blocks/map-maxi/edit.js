/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { useEffect, useState } from '@wordpress/element';
import { Button, TextControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import { getGroupAttributes } from '../../extensions/styles';
import { getNewMarker, getUpdatedMarkers } from './utils';
import getStyles from './styles';
import * as mapMarkerIcons from '../../icons/map-icons/markers';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMap,
	useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';

/**
 * Content
 */
const MapEventsListener = props => {
	const {
		isAddingMarker,
		isDraggingMarker,
		isFirstClick,
		mapMarkers,
		mapMaxZoom,
		mapMinZoom,
		maxiSetAttributes,
		setIsAddingMarker,
		setIsDraggingMarker,
	} = props;

	const timeout = 300;
	let delay;

	const mapEvents = useMapEvents({
		mousedown: event => {
			const elementClicked =
				event.originalEvent.target.nodeName.toLowerCase();
			if (elementClicked === 'div') {
				setIsDraggingMarker(false);
			}
			if (!isDraggingMarker && isFirstClick) {
				delay = setTimeout(() => {
					setIsAddingMarker(true);
					setTimeout(() => {
						// If hangs for too long, stop it.
						setIsAddingMarker(false);
					}, timeout * 5);
				}, timeout);
			}
		},
		drag: () => {
			clearTimeout(delay);
			setIsAddingMarker(false);
			setIsDraggingMarker(false);
		},
		mouseup: event => {
			clearTimeout(delay);

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
			const { _northEast, _southWest } = mapEvents.getBounds();

			const lat = (_northEast.lat + _southWest.lat) / 2;
			const lng = (_northEast.lng + _southWest.lng) / 2;

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

	return null;
};

const SearchBox = props => {
	const { attributes, maxiSetAttributes } = props;

	const { 'map-markers': mapMarkers } = attributes;

	const map = useMap();

	const [keywords, setKeywords] = useState('');
	const [searchResults, setSearchResults] = useState();

	const findMarkers = async () => {
		if (keywords && keywords.length > 2) {
			const response = await fetch(
				`https://nominatim.openstreetmap.org/search?q=${keywords}&format=json`
			);

			if (response.status !== 200) {
				return;
			}

			const data = await response.json();

			setSearchResults(data);
		}
	};

	const detectEnter = event => {
		if (event.key === 'Enter') {
			findMarkers();
		}
	};

	const clearSearchBox = () => {
		setSearchResults([]);
		setKeywords('');
	};

	const onButtonClick = () => {
		if (searchResults && searchResults.length) {
			clearSearchBox();
		} else {
			findMarkers();
		}
	};

	const onAddMarker = event => {
		const index = event.target.getAttribute('data-index');
		const { lat, lon } = searchResults[index];

		const newMarker = getNewMarker([lat, lon], mapMarkers);

		map.flyTo([lat, lon]);
		maxiSetAttributes({
			'map-markers': getUpdatedMarkers(mapMarkers, newMarker),
		});
		clearSearchBox();
	};

	const resultsList = () => {
		return searchResults.map((item, index) => {
			const { display_name: displayName, place_id: placeId } = item;

			return (
				<Button
					onClick={onAddMarker}
					className='map-searchbox__buttons'
					key={placeId}
					data-index={index}
				>
					{displayName}
				</Button>
			);
		});
	};

	return (
		<>
			<div className='map-searchbox'>
				<TextControl
					value={keywords}
					onChange={setKeywords}
					onKeyDown={detectEnter}
					placeholder={__('Enter your keywords…', 'maxi-blocks')}
				/>
				<Button
					onClick={onButtonClick}
					icon={
						searchResults && searchResults.length > 0
							? 'no'
							: 'search'
					}
					showTooltip
					label={
						searchResults && searchResults.length > 0
							? __('Clear results', 'maxi-blocks')
							: __('Find locations', 'maxi-blocks')
					}
					disabled={
						!((keywords && keywords.length > 2) || searchResults)
					}
				/>
			</div>
			{searchResults && searchResults.length ? (
				<div className='map-searchbox__results'>{resultsList()}</div>
			) : null}
		</>
	);
};

const Markers = props => {
	const { attributes, maxiSetAttributes, setIsDraggingMarker } = props;
	const {
		'map-marker-heading-level': mapMarkerHeadingLevel,
		'map-marker-icon': mapMarkerIcon,
		'map-markers': mapMarkers,
		'map-popup': mapPopup,
	} = attributes;

	if (isEmpty(mapMarkers)) return null;

	const removeMarker = event => {
		const index = parseInt(event.target.getAttribute('dataindex'));
		const updatedMarkers = [...mapMarkers];
		updatedMarkers.splice(index, 1);
		maxiSetAttributes({
			'map-markers': updatedMarkers,
		});
	};

	const updateMarkers = updatedMarkers => {
		maxiSetAttributes({
			'map-markers': updatedMarkers,
		});
	};

	const markerIcon = L.divIcon({
		html: mapMarkerIcon,
	});

	return mapMarkers.map((marker, index) => (
		<Marker
			position={[marker.latitude, marker.longitude]}
			key={marker.id}
			icon={markerIcon}
			draggable
			eventHandlers={{
				dragstart: () => {
					setIsDraggingMarker(true);
				},
				dragend: event => {
					const { lat, lng } = event.target._latlng;
					const updatedMarkers = [...mapMarkers];
					updatedMarkers[index] = {
						...updatedMarkers[index],
						latitude: lat,
						longitude: lng,
					};

					updateMarkers(updatedMarkers);
					setIsDraggingMarker(false);
				},
				mouseover: () => {
					setIsDraggingMarker(true);
				},
			}}
		>
			<Popup closeButton={false}>
				<div
					className={`map-marker-info-window map-marker-info-window__${mapPopup}`}
				>
					<div className='map-marker-info-window__content'>
						<RichText
							className='map-marker-info-window__title'
							value={marker.heading}
							identifier='title'
							tagName={mapMarkerHeadingLevel}
							onChange={content => {
								const updatedMarkers = [...mapMarkers];
								updatedMarkers[index].heading = content;

								updateMarkers(updatedMarkers);
							}}
							placeholder={__('Title', 'maxi-blocks')}
							withoutInteractiveFormatting
						/>
						<RichText
							className='map-marker-info-window__address'
							value={marker.description}
							identifier='description'
							tagName='p'
							onChange={content => {
								const updatedMarkers = [...mapMarkers];
								updatedMarkers[index].description = content;

								updateMarkers(updatedMarkers);
							}}
							placeholder={__('Description', 'maxi-blocks')}
							withoutInteractiveFormatting
						/>
						<div className='map-marker-info-window__marker-remove'>
							<Button
								onClick={removeMarker}
								dataindex={index}
								icon='trash'
								showTooltip
								label={__('Remove this marker', 'maxi-blocks')}
							>
								{__('Remove', 'maxi-blocks')}
							</Button>
						</div>
					</div>
				</div>
			</Popup>
		</Marker>
	));
};

const MapContent = props => {
	const {
		attributes,
		maxiSetAttributes,
		isFirstClick,
		isGoogleMaps,
		apiKey,
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

	const alert = isAddingMarker ? (
		<div className='map-alert'>
			{__('Release to drop a marker here', 'maxi-blocks')}
		</div>
	) : null;

	return (
		<div className='maxi-map-container' id={`map-container-${uniqueID}`}>
			{(isGoogleMaps && apiKey) || !isGoogleMaps ? (
				<>
					<MapContainer
						center={[mapLatitude, mapLongitude]}
						minZoom={mapMinZoom}
						maxZoom={mapMaxZoom}
						zoom={mapZoom}
					>
						{isGoogleMaps ? (
							<ReactLeafletGoogleLayer apiKey={apiKey} />
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
							mapMarkers={mapMarkers}
							mapMaxZoom={mapMaxZoom}
							mapMinZoom={mapMinZoom}
							maxiSetAttributes={maxiSetAttributes}
							setIsAddingMarker={setIsAddingMarker}
							setIsDraggingMarker={setIsDraggingMarker}
						/>
						<Markers
							attributes={getGroupAttributes(attributes, 'map')}
							maxiSetAttributes={maxiSetAttributes}
							setIsDraggingMarker={setIsDraggingMarker}
						/>
						<SearchBox {...props} />
					</MapContainer>
					{alert}
				</>
			) : (
				<p className='maxi-map-block__not-found'>
					{__(
						'Oops, you can not see the map because you have not set your Google map API key, please navigate to the Maxi Block',
						'maxi-blocks'
					)}
					<a
						target='_blank'
						href='/wp-admin/admin.php?page=maxi-blocks.php'
					>
						{__(' Options > Google API Key', 'maxi-blocks')}
					</a>
				</p>
			)}
		</div>
	);
};
class edit extends MaxiBlockComponent {
	constructor(...args) {
		super(...args);

		this.state = {
			isFirstClick: false,
		};
	}

	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { attributes } = this.props;

		return {
			map: [
				{
					uniqueID: attributes.uniqueID,
					...getGroupAttributes(attributes, 'map'),
				},
			],
		};
	}

	maxiBlockDidUpdate(prevProps) {
		// Prevent showing alert on first click to map
		const { isSelected } = this.props;

		if (
			(prevProps.isSelected === isSelected &&
				this.state.isFirstClick !== isSelected) ||
			(prevProps.isSelected && !isSelected)
		) {
			this.setState({
				isFirstClick: isSelected,
			});
		}
	}

	render() {
		const { attributes, maxiSetAttributes } = this.props;
		const {
			uniqueID,
			'map-provider': mapProvider,
			'map-marker-icon': mapMarkerIcon,
		} = attributes;

		const getApiKey = () => {
			const { receiveMaxiSettings } = select('maxiBlocks');

			const maxiSettings = receiveMaxiSettings();

			const key = maxiSettings?.google_api_key;

			if (key) return key;
			return false;
		};

		if (!mapMarkerIcon) {
			maxiSetAttributes({
				'map-marker-icon': ReactDOMServer.renderToString(
					mapMarkerIcons.mapMarker1
				),
			});

			return null;
		}

		return [
			<Inspector
				key={`block-settings-${uniqueID}`}
				{...this.props}
				apiKey={getApiKey()}
			/>,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
			/>,
			<MaxiBlock
				key={`maxi-map--${uniqueID}`}
				ref={this.blockRef}
				className='maxi-map-block'
				{...getMaxiBlockAttributes(this.props)}
			>
				<MapContent
					{...this.props}
					isFirstClick={this.state.isFirstClick}
					isGoogleMaps={mapProvider === 'googlemaps'}
					apiKey={getApiKey()}
				/>
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
