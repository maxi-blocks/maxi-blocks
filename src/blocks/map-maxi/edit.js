/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect, withDispatch } from '@wordpress/data';
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
import { Toolbar, RawHTML } from '../../components';
import MaxiBlock from '../../components/maxi-block';
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';
import { defaultMarkers } from './defaultMarkers';
import * as mapMarkerIcons from '../../icons/map-icons/markers';
import * as mapPopupIcons from '../../icons/map-icons/popups';

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

const getMarkerUniqueId = mapMarkers =>
	mapMarkers && !isEmpty(mapMarkers)
		? mapMarkers.reduce((markerA, markerB) =>
				markerA.id > markerB.id ? markerA : markerB
		  ).id + 1
		: 0;

const MapListener = props => {
	const { attributes, maxiSetAttributes } = props;
	const {
		'map-min-zoom': mapMinZoom,
		'map-max-zoom': mapMaxZoom,
		'map-is-dragging-marker': mapIsDraggingMarker,
		'map-adding-marker': mapAddingMarker,
		'map-markers': mapMarkers,
	} = attributes;
	const timeout = 300;
	let delay;

	const mapEvents = useMapEvents({
		mousedown: event => {
			const elementClicked =
				event.originalEvent.target.nodeName.toLowerCase();
			if (elementClicked === 'div') {
				maxiSetAttributes({ 'map-is-dragging-marker': false });
			}
			if (mapIsDraggingMarker === false) {
				delay = setTimeout(() => {
					maxiSetAttributes({ 'map-adding-marker': ' pinning' });
					setTimeout(() => {
						// If hangs for too long, stop it.
						maxiSetAttributes({ 'map-adding-marker': '' });
					}, timeout * 5);
				}, timeout);
			}
		},
		drag: () => {
			clearTimeout(delay);
			maxiSetAttributes({
				'map-adding-marker': '',
				'map-is-dragging-marker': false,
			});
		},
		mouseup: event => {
			clearTimeout(delay);
			if (mapAddingMarker) {
				const newMarker = {
					id: getMarkerUniqueId(mapMarkers),
					latitude: event.latlng.lat,
					longitude: event.latlng.lng,
					heading: '',
					description: '',
					text: '',
				};
				maxiSetAttributes({
					'map-markers': [...mapMarkers, newMarker],
					'map-adding-marker': '',
				});
				setTimeout(() => {
					maxiSetAttributes({ 'map-is-dragging-marker': false });
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

	const getHeadingAndDescription = string => {
		const words = string.split(' ');
		const heading = words[0];
		const description = words.slice(1).join(' ');

		return { heading, description };
	};

	const addMarker = event => {
		const index = event.target.getAttribute('data-index');
		const { display_name: displayName, lat, lon } = searchResults[index];
		const { heading, description } = getHeadingAndDescription(displayName);

		const newMarker = {
			id: getMarkerUniqueId(mapMarkers),
			latitude: lat,
			longitude: lon,
			heading,
			description,
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
		'map-adding-marker': mapAddingMarker,
		'map-marker-icon': mapMarkerIcon,
		'map-popup-icon': mapPopupIcon,
	} = attributes;

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

	const alert =
		mapAddingMarker === ' pinning' ? (
			<div className='map-alert'>
				{__('Release to drop a marker here', 'maxi-blocks')}
			</div>
		) : null;

	return (
		<div className='maxi-map-container' id={`map-container-${uniqueID}`}>
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
				<MapListener {...props} />
				{mapMarkers?.map((marker, index) => (
					<Marker
						position={[marker.latitude, marker.longitude]}
						key={marker.id}
						icon={markerIcon}
						draggable
						eventHandlers={{
							dragstart: () => {
								maxiSetAttributes({
									'map-is-dragging-marker': true,
								});
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
								maxiSetAttributes({
									'map-is-dragging-marker': false,
								});
							},
							mouseover: () => {
								maxiSetAttributes({
									'map-is-dragging-marker': true,
								});
							},
						}}
					>
						<Popup
							className='map-marker-info-window'
							closeButton={false}
						>
							<RawHTML>{mapPopupIcon}</RawHTML>
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
										updatedMarkers[index].description =
											content;

										updateMarkers(updatedMarkers);
									}}
									placeholder={__(
										'Description',
										'maxi-blocks'
									)}
									withoutInteractiveFormatting
								/>
								<div className='map-marker-info-window__marker-remove'>
									<Button
										onClick={removeMarker}
										dataindex={index}
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
							</div>
						</Popup>
					</Marker>
				))}
			</MapContainer>
			<SearchBox {...props} />
			{alert}
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
		const { attributes, blockFullWidth, maxiSetAttributes } = this.props;
		const {
			uniqueID,
			'map-provider': mapProvider,
			'map-marker-icon': mapMarkerIcon,
			'map-popup-icon': mapPopupIcon,
		} = attributes;

		if (!mapMarkerIcon || !mapPopupIcon) {
			if (!mapMarkerIcon) {
				maxiSetAttributes({
					'map-marker-icon': ReactDOMServer.renderToString(
						mapMarkerIcons.mapMarker1
					),
				});
			}

			if (!mapPopupIcon) {
				maxiSetAttributes({
					'map-popup-icon': ReactDOMServer.renderToString(
						mapPopupIcons.mapPopup1
					),
				});
			}

			return null;
		}

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

const editDispatch = withDispatch((dispatch, ownProps) => {
	const {
		attributes: {
			'map-marker-icon': mapMarkerIcon,
			'map-popup-icon': mapPopupIcon,
		},
		maxiSetAttributes,
	} = ownProps;

	const changeSVGStrokeWidth = width => {
		if (width) {
			const regexLineToChange = new RegExp('stroke-width:.+?(?=})', 'g');
			const changeTo = `stroke-width:${width}`;

			const regexLineToChange2 = new RegExp(
				'stroke-width=".+?(?=")',
				'g'
			);
			const changeTo2 = `stroke-width="${width}`;

			const newContent = mapPopupIcon
				.replace(regexLineToChange, changeTo)
				.replace(regexLineToChange2, changeTo2);
			console.log(newContent);
			maxiSetAttributes({
				'map-popup-icon': newContent,
			});
		}
	};

	const changeSVGContentWithBlockStyle = (fillColor, strokeColor) => {
		const fillRegExp = new RegExp('fill:([^none])([^\\}]+)', 'g');
		const fillStr = `fill:${fillColor}`;

		const fillRegExp2 = new RegExp('fill=[^-]([^none])([^\\"]+)', 'g');
		const fillStr2 = ` fill="${fillColor}`;

		const strokeRegExp = new RegExp('stroke:([^none])([^\\}]+)', 'g');
		const strokeStr = `stroke:${strokeColor}`;

		const strokeRegExp2 = new RegExp('stroke=[^-]([^none])([^\\"]+)', 'g');
		const strokeStr2 = ` stroke="${strokeColor}`;

		const newContent = ownProps.attributes['map-marker-icon']
			.replace(fillRegExp, fillStr)
			.replace(fillRegExp2, fillStr2)
			.replace(strokeRegExp, strokeStr)
			.replace(strokeRegExp2, strokeStr2);

		maxiSetAttributes({ 'map-marker-icon': newContent });
	};

	const changeSVGContent = (color, type, attribute) => {
		const fillRegExp = new RegExp(`${type}:".+?(?=")`, 'g');
		const fillStr = `${type}:${color}`;

		const fillRegExp2 = new RegExp(`${type}=".+?(?=")`, 'g');
		const fillStr2 = ` ${type}="${color}`;
		console.log(ownProps.attributes[attribute]);
		const newContent = ownProps.attributes[attribute]
			.replace(fillRegExp, fillStr)
			.replace(fillRegExp2, fillStr2);

		console.log(newContent, color, type);

		maxiSetAttributes({ [attribute]: newContent });
	};

	return {
		changeSVGStrokeWidth,
		changeSVGContent,
		changeSVGContentWithBlockStyle,
	};
});

export default compose(editSelect, withMaxiProps, editDispatch)(edit);
