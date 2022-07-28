/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { select } from '@wordpress/data';
import { useEffect, useState, renderToString } from '@wordpress/element';
import { Button, TextControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import { MaxiBlock, getMaxiBlockAttributes } from '../../components/maxi-block';
import {
	getGroupAttributes,
	getLastBreakpointAttribute,
} from '../../extensions/styles';
import { getNewMarker, getUpdatedMarkers } from './utils';
import getStyles from './styles';
import copyPasteMapping from './copy-paste-mapping';
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
import ReactLeafletGoogleLayer from 'react-leaflet-google-layer';

/**
 * Content
 */
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

	useEffect(() => {
		isSelected === isFirstClick && setIsFirstClick(!isSelected);
	}, [isSelected]);

	const timeout = 300;
	let delay;

	const mapEvents = useMapEvents({
		mousedown: event => {
			const elementClicked =
				event.originalEvent.target.nodeName.toLowerCase();
			if (elementClicked === 'div') {
				setIsDraggingMarker(false);
			}
			if (!isDraggingMarker && !isFirstClick) {
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

	return null;
};

const SearchBox = props => {
	const { attributes, maxiSetAttributes } = props;

	const { 'map-markers': mapMarkers } = attributes;

	const map = useMap();

	const [keywords, setKeywords] = useState('');
	const [searchResults, setSearchResults] = useState();

	const findMarkers = async keywords => {
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

	const handleKeyDown = event => {
		if (event.key === 'Enter') {
			findMarkers(keywords);
		}
	};

	const clearSearchBox = () => {
		setSearchResults([]);
		setKeywords('');
	};

	const handleButtonClick = () => {
		if (searchResults && searchResults.length) {
			clearSearchBox();
		} else {
			findMarkers();
		}
	};

	const handleAddMarker = index => {
		const { lat, lon } = searchResults[index];
		const newMarker = getNewMarker([lat, lon], mapMarkers);

		map.flyTo([lat, lon]);

		maxiSetAttributes({
			'map-markers': getUpdatedMarkers(mapMarkers, newMarker),
		});

		clearSearchBox();
	};

	const renderResultsList = () => {
		return searchResults.map((item, index) => {
			const { display_name: displayName, place_id: placeId } = item;

			return (
				<Button
					className='maxi-map-block__search-box-results__button'
					key={placeId}
					onClick={() => handleAddMarker(index)}
				>
					{displayName}
				</Button>
			);
		});
	};

	return (
		<>
			<div className='maxi-map-block__search-box'>
				<TextControl
					value={keywords}
					onChange={keyWords => setKeywords(keyWords)}
					onKeyDown={event => handleKeyDown(event)}
					placeholder={__('Enter your keywords…', 'maxi-blocks')}
				/>
				<Button
					onClick={() => handleButtonClick()}
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
				<div className='maxi-map-block__search-box-results'>
					{renderResultsList()}
				</div>
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
	} = attributes;

	if (isEmpty(mapMarkers)) return null;

	const markerIcon = L.divIcon({
		html: mapMarkerIcon,
	});

	const handleRemoveMarker = (event, index) => {
		event.stopPropagation();

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

	return mapMarkers.map((marker, index) => {
		const { id, latitude, longitude } = marker;

		return (
			<Marker
				position={[latitude, longitude]}
				key={id}
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
					<div className='maxi-map-block__popup'>
						<div className='maxi-map-block__popup__content'>
							<RichText
								className='maxi-map-block__popup__content__title'
								value={marker.heading}
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
								className='maxi-map-block__popup__content__description'
								value={marker.description}
								onChange={content => {
									const updatedMarkers = [...mapMarkers];
									updatedMarkers[index].description = content;

									updateMarkers(updatedMarkers);
								}}
								placeholder={__('Description', 'maxi-blocks')}
								withoutInteractiveFormatting
							/>
							<div className='maxi-map-block__popup__content__marker-remove'>
								<Button
									icon='trash'
									label={__(
										'Remove this marker',
										'maxi-blocks'
									)}
									onClick={event =>
										handleRemoveMarker(event, index)
									}
									showTooltip
								>
									{__('Remove', 'maxi-blocks')}
								</Button>
							</div>
						</div>
					</div>
				</Popup>
			</Marker>
		);
	});
};

const DropMarkerAlert = ({ isAddingMarker }) => {
	return isAddingMarker ? (
		<div className='maxi-map-block__alert'>
			{__('Release to drop a marker here', 'maxi-blocks')}
		</div>
	) : null;
};

const MapContent = props => {
	const {
		apiKey,
		attributes,
		deviceType,
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

	return (
		<div
			className='maxi-map-block__container'
			id={`maxi-map-block__container-${uniqueID}`}
		>
			{(isGoogleMaps && apiKey) || !isGoogleMaps ? (
				<>
					<MapContainer
						center={[mapLatitude, mapLongitude]}
						minZoom={mapMinZoom}
						maxZoom={mapMaxZoom}
						zoom={mapZoom}
						style={{
							height: ['height', 'height-unit'].reduce(
								(acc, key) => {
									const value = getLastBreakpointAttribute({
										target: key,
										breakpoint: deviceType,
										attributes,
									});

									return `${acc}${value}`;
								},
								''
							),
						}}
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
							])}
							maxiSetAttributes={maxiSetAttributes}
							setIsDraggingMarker={setIsDraggingMarker}
						/>
						<SearchBox {...props} />
					</MapContainer>
					<DropMarkerAlert isAddingMarker={isAddingMarker} />
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
	get getStylesObject() {
		return getStyles(this.props.attributes);
	}

	get getMaxiCustomData() {
		const { attributes } = this.props;

		return {
			map: [
				{
					uniqueID: attributes.uniqueID,
					...getGroupAttributes(attributes, [
						'map',
						'mapMarker',
						'mapPopup',
						'mapInteraction',
					]),
				},
			],
		};
	}

	render() {
		const { attributes, maxiSetAttributes, isSelected } = this.props;
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
				'map-marker-icon': renderToString(mapMarkerIcons.mapMarker1),
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
				copyPasteMapping={copyPasteMapping}
			/>,
			<MaxiBlock
				key={`maxi-map--${uniqueID}`}
				ref={this.blockRef}
				className='maxi-map-block'
				{...getMaxiBlockAttributes(this.props)}
			>
				<MapContent
					{...this.props}
					apiKey={getApiKey()}
					isFirstClick={this.state.isFirstClick}
					isGoogleMaps={mapProvider === 'googlemaps'}
					isSelected={isSelected}
				/>
			</MaxiBlock>,
		];
	}
}

export default withMaxiProps(edit);
