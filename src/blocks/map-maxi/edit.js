/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, withMaxiProps } from '../../extensions/maxi-block';
import { Toolbar } from '../../components';
import MaxiBlock, { getMaxiBlockAttributes } from '../../components/maxi-block';
import { getGroupAttributes } from '../../extensions/styles';
import getStyles from './styles';
import { defaultMarkers } from './defaultMarkers';

/**
 * External dependencies
 */
import { isEmpty } from 'lodash';
import { Loader } from '@googlemaps/js-api-loader';

/**
 * Content
 */
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
		const { attributes, blockFullWidth, apiKey } = this.props;
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

		if (apiKey) {
			const loader = new Loader({
				apiKey,
				version: 'weekly',
				libraries: ['places'],
			});

			loader
				.load()
				.then(() => {
					return new google.maps.Map(this.blockRef.current, {
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
						(!isEmpty(mapMarkerText) ||
							!isEmpty(mapMarkerAddress)) &&
							infowindow.open(map, marker);
					});
				})
				.catch(ex => {
					console.error('outer', ex.message);
				});
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
				{apiKey ? (
					<div
						className='maxi-map-container'
						id={`map-container-${uniqueID}`}
					/>
				) : (
					<p className='maxi-map-block__not-found'>
						{__(
							'Oops, you can not see the map because, you have not set your Google map API key, please navigate to the Maxi Block',
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
