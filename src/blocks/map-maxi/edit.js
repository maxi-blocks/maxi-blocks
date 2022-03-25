/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';
import { useRef, useState, createRef } from '@wordpress/element';
import { Button, TextControl } from '@wordpress/components';
import { RichText } from '@wordpress/block-editor';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import {
	MaxiBlockComponent,
	getMaxiBlockAttributes,
	withMaxiProps,
} from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import MaxiBlock from '../../components/maxi-block';
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';
import { defaultMarkers } from './defaultMarkers';
import { ReactComponent as MapMarker1 } from '../../icons/map-icons/map-marker-1/map_marker_1.svg';
import { ReactComponent as MapMarker2 } from '../../icons/map-icons/map-marker-2/map_marker_2.svg';
import { ReactComponent as MapMarker3 } from '../../icons/map-icons/map-marker-3/map_marker_3.svg';
import { ReactComponent as MapMarker4 } from '../../icons/map-icons/map-marker-4/map_marker_4.svg';
import { ReactComponent as MapMarker5 } from '../../icons/map-icons/map-marker-5/map_marker_5.svg';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import { Loader } from '@googlemaps/js-api-loader';
import {
	MapContainer,
	Marker,
	Popup,
	TileLayer,
	useMapEvents,
} from 'react-leaflet';
import L from 'leaflet';
import ReactDOMServer from 'react-dom/server';

/**
 * Content
 */
const GoogleMapsContent = props => {
	const { attributes, apiKey } = props;
	const {
		uniqueID,
		'map-latitude': mapLatitude,
		'map-longitude': mapLongitude,
		'map-zoom': mapZoom,
		'map-marker': mapMarker,
		'map-marker-opacity': mapMarkerOpacity,
		'map-marker-scale': mapMarkerScale,
		'map-marker-fill-color': mapMarkerFillColor,
		'map-marker-stroke-color': mapMarkerStrokeColor,
		'map-marker-text': mapMarkerText,
		'map-marker-address': mapMarkerAddress,
	} = attributes;

	const gmRef = useRef(null);

	if (apiKey) {
		const loader = new Loader({
			apiKey,
			version: 'weekly',
			libraries: ['places'],
		});

		loader
			.load()
			.then(() => {
				return new google.maps.Map(gmRef.current, {
					center: {
						lat: +mapLatitude,
						lng: +mapLongitude,
					},
					zoom: mapZoom,
				});
			})
			.then(map => {
				const contentTitleString = `<h6 class="map-marker-info-window__title">${mapMarkerText}</h6>`;
				const contentAddressString = `<p class="map-marker-info-window__address">${mapMarkerAddress}</p>`;
				const contentString = `<div class="map-marker-info-window">${
					!isEmpty(mapMarkerText) ? contentTitleString : ''
				}${
					!isEmpty(mapMarkerAddress) ? contentAddressString : ''
				}</div>`;

				const infowindow = new google.maps.InfoWindow({
					content: contentString,
				});

				const marker = new google.maps.Marker({
					position: { lat: +mapLatitude, lng: +mapLongitude },
					map,
					icon: {
						...defaultMarkers[`marker-icon-${mapMarker}`],
						fillColor: mapMarkerFillColor,
						fillOpacity: mapMarkerOpacity || 1,
						strokeWeight: 2,
						strokeColor: mapMarkerStrokeColor,
						rotation: 0,
						scale: mapMarkerScale,
					},
				});

				marker.addListener('click', () => {
					(!isEmpty(mapMarkerText) || !isEmpty(mapMarkerAddress)) &&
						infowindow.open(map, marker);
				});
			})
			.catch(ex => {
				console.error('outer', ex.message);
			});
	}

	if (apiKey)
		return (
			<div
				ref={gmRef}
				className='maxi-map-container'
				id={`map-container-${uniqueID}`}
			/>
		);

	return (
		<p className='maxi-map-block__not-found'>
			{__(
				'Oops, you can not see the map because, you have not set your Google map API key, please navigate to the Maxi Block',
				'maxi-blocks'
			)}
			<a target='_blank' href='/wp-admin/admin.php?page=maxi-blocks.php'>
				{__(' Options > Google API Key', 'maxi-blocks')}
			</a>
		</p>
	);
};

const ZoomListener = props => {
	const { attributes, maxiSetAttributes } = props;
	const { 'map-min-zoom': mapMinZoom, 'map-max-zoom': mapMaxZoom } =
		attributes;

	const mapEvents = useMapEvents({
		moveend: () => {
			const { _northEast, _southWest } = mapEvents.getBounds();

			const lat = (_northEast.lat + _southWest.lat) / 2;
			const lng = (_northEast.lng + _southWest.lng) / 2;

			maxiSetAttributes({
				'map-latitude': lat,
				'map-longitude': lng,
			});
		},
		zoom: () => {
			mapEvents.setMinZoom(mapMinZoom);
			mapEvents.setMaxZoom(mapMaxZoom);
		},
		zoomend: () => {
			const newZoom = mapEvents.getZoom();

			maxiSetAttributes({
				'map-zoom': newZoom,
			});
		},
	});

	return null;
};

const SearchBox = props => {
	const { attributes, maxiSetAttributes } = props;
	const { 'map-markers': mapMarkers } = attributes;

	const [keywords, setKeywords] = useState('');
	const [searchResults, setSearchResults] = useState();
	const inputRef = createRef(null);
	const findMarkers = () => {
		if (keywords && keywords.length > 2) {
			fetch(
				`https://nominatim.openstreetmap.org/search?q=${keywords}&format=json`
			)
				.then(response => {
					if (response.status !== 200) {
						return;
					}
					return response.json();
				})
				.then(data => {
					setSearchResults(data);
				});
		}
	};

	const onTyping = text => {
		setKeywords(text);
	};

	const detectEnter = e => {
		if (!inputRef) {
			inputRef.current = e;
		}
		if (e.key === 'Enter') {
			findMarkers();
		}
	};

	const onButtonClick = () => {
		if (searchResults && searchResults.length) {
			if (inputRef) {
				setSearchResults([]);
				setKeywords('');
			}
		} else {
			findMarkers();
		}
	};

	const addMarker = event => {
		const index = event.target.getAttribute('data-index');
		const { display_name, place_id, lat, lon } = searchResults[index];

		const newMarker = {
			id: place_id,
			latitude: lat,
			longitude: lon,
			heading: display_name,
			description: '',
		};

		maxiSetAttributes({
			'map-markers': mapMarkers
				? [...mapMarkers, newMarker]
				: [newMarker],
		});
	};

	const resultsList = () => {
		return searchResults.map((item, index) => {
			const { display_name: displayName, place_id: placeId } = item;

			return (
				<Button
					autoFocus={index === 0}
					onClick={addMarker}
					className='map-searchbox__buttons'
					key={placeId}
					data-index={index}
				>
					{displayName}
				</Button>
			);
		});
	};

	// noinspection JSXNamespaceValidation
	return (
		<>
			<div className='map-searchbox'>
				<TextControl
					ref={inputRef}
					value={keywords}
					onChange={onTyping}
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
					disabled={!(keywords && keywords.length > 2)}
				/>
			</div>
			{searchResults && searchResults.length ? (
				<div className='map-searchbox__results'>{resultsList()}</div>
			) : null}
		</>
	);
};

const OpenStreetMapContent = props => {
	const { attributes, maxiSetAttributes } = props;
	const {
		uniqueID,
		'map-content-heading': mapContentHeading,
		'map-content-description': mapContentDescription,
		'map-markers': mapMarkers,
		'map-latitude': mapLatitude,
		'map-longitude': mapLongitude,
		'map-zoom': mapZoom,
		'map-min-zoom': mapMinZoom,
		'map-max-zoom': mapMaxZoom,
		'map-marker': mapMarker,
		'map-marker-heading-level': mapMarkerHeadingLevel,
		'map-marker-opacity': mapMarkerOpacity,
		'map-marker-scale': mapMarkerScale,
		'map-marker-fill-color': mapMarkerFillColor,
		'map-marker-stroke-color': mapMarkerStrokeColor,
		'map-marker-text': mapMarkerText,
		'map-marker-address': mapMarkerAddress,
	} = attributes;

	const getIcon = mapMarker => {
		const iconProps = {
			fill: mapMarkerFillColor,
			stroke: mapMarkerStrokeColor,
			width: mapMarkerScale,
			opacity: mapMarkerOpacity,
		};

		switch (mapMarker) {
			case 1:
				return <MapMarker1 {...iconProps} />;
			case 2:
				return <MapMarker2 {...iconProps} />;
			case 3:
				return <MapMarker3 {...iconProps} />;
			case 4:
				return <MapMarker4 {...iconProps} />;
			case 5:
				return <MapMarker5 {...iconProps} />;
			default:
				return null;
		}
	};

	const removeMarker = event => {
		const index = parseInt(event.target.getAttribute('dataIndex'));
		const updatedMarkers = [...mapMarkers];
		updatedMarkers.splice(index, 1);
		maxiSetAttributes({
			'map-markers': updatedMarkers,
		});
	};

	const markerIcon = L.divIcon({
		html: ReactDOMServer.renderToString(getIcon(mapMarker)),
	});

	return (
		<div className='maxi-map-container'>
			<MapContainer
				center={[mapLatitude, mapLongitude]}
				minZoom={mapMinZoom}
				maxZoom={mapMaxZoom}
				zoom={mapZoom}
			>
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
				/>
				<ZoomListener {...props} />
				{mapMarkers?.map((marker, index) => (
					<Marker
						position={[marker.latitude, marker.longitude]}
						key={marker.id}
						icon={markerIcon}
					>
						<Popup className='map-marker-info-window'>
							<RichText
								className='map-marker-info-window__title'
								value={marker.heading}
								identifier='title'
								tagName={mapMarkerHeadingLevel}
								onChange={content => {
									const updatedMarkers = [...mapMarkers];
									updatedMarkers[index].heading = content;

									maxiSetAttributes({
										'map-markers': updatedMarkers,
									});
								}}
								placeholder={__(
									'Write something',
									'maxi-blocks'
								)}
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

									maxiSetAttributes({
										'map-markers': updatedMarkers,
									});
								}}
								placeholder={__('Description', 'maxi-blocks')}
								withoutInteractiveFormatting
							/>
							<div className='map-marker-info-window__marker-remove'>
								<Button
									onClick={removeMarker}
									dataIndex={index}
									icon='trash'
									showTooltip
									label={__(
										'Remove this marker',
										'maxi-blocks'
									)}
								>
									{__('Remove', 'maxi-blocks')}
								</Button>
							</div>
						</Popup>
					</Marker>
				))}
			</MapContainer>
			<SearchBox {...props} />
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
			...getGroupAttributes(attributes, 'map'),
		};
	}

	render() {
		const { attributes, blockFullWidth } = this.props;
		const { uniqueID, 'map-provider': mapProvider } = attributes;

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar
				key={`toolbar-${uniqueID}`}
				ref={this.blockRef}
				{...this.props}
			/>,
			<MaxiBlock
				key={`maxi-map--${uniqueID}`}
				ref={this.blockRef}
				className='maxi-map-block'
				blockFullWidth={blockFullWidth}
				{...getMaxiBlockAttributes(this.props)}
			>
				{mapProvider === 'googlemaps' && (
					<GoogleMapsContent {...this.props} />
				)}
				{mapProvider === 'openstreetmap' && (
					<OpenStreetMapContent {...this.props} />
				)}
			</MaxiBlock>,
		];
	}
}

const editSelect = withSelect(select => {
	const { receiveMaxiSettings, receiveMaxiDeviceType } = select('maxiBlocks');

	const deviceType = receiveMaxiDeviceType();
	const maxiSettings = receiveMaxiSettings();
	const { google_api_key: apiKey = false } = maxiSettings;

	return {
		deviceType,
		apiKey,
	};
});

export default compose(editSelect, withMaxiProps)(edit);
