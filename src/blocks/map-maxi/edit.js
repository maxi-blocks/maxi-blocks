/**
 * WordPress dependencies
 */
import { compose } from '@wordpress/compose';
import { withSelect } from '@wordpress/data';

/**
 * Internal dependencies
 */
import Inspector from './inspector';
import { MaxiBlockComponent, Toolbar } from '../../components';
import MaxiBlock, {
	getMaxiBlockBlockAttributes,
} from '../../components/maxi-block';
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

	get getCustomData() {
		const { uniqueID } = this.props.attributes;

		const motionStatus = !isEmpty(this.props.attributes['entrance-type']);

		return {
			[uniqueID]: {
				...(motionStatus && {
					...getGroupAttributes(this.props.attributes, 'map'),
				}),
			},
		};
	}

	render() {
		const { attributes } = this.props;
		const { uniqueID } = attributes;

		const classes = 'maxi-map-block';

		const mapApiKey = attributes['map-api-key'];
		const mapLatitude = +attributes['map-latitude'];
		const mapLongitude = +attributes['map-longitude'];
		const mapZoom = +attributes['map-zoom'];
		const mapMarker = attributes['map-marker'];
		const mapMarkerOpacity = attributes['map-marker-opacity'];
		const mapMarkerScale = attributes['map-marker-scale'];
		const mapMarkerFillColor = attributes['map-marker-fill-color'];
		const mapMarkerStrokeColor = attributes['map-marker-stroke-color'];
		const mapMarkerText = attributes['map-marker-text'];
		const mapMarkerAddress = attributes['map-marker-address'];

		const loader = new Loader({
			apiKey: mapApiKey,
			version: 'weekly',
			libraries: ['places'],
		});

		loader
			.load()
			.then(() => {
				return new google.maps.Map(document.getElementById('map'), {
					center: {
						lat: mapLatitude,
						lng: mapLongitude,
					},
					zoom: mapZoom,
				});
			})
			.then(map => {
				const contentTitleString = `<h3 class="map-marker-info-window__title">${mapMarkerText}</h3>`;
				const contentAddressString = `<address>${mapMarkerAddress}</address>`;
				const contentString = `<div class="map-marker-info-window">${
					!isEmpty(mapMarkerText) ? contentTitleString : ''
				}${
					!isEmpty(mapMarkerAddress) ? contentAddressString : ''
				}</div>`;
				const infowindow = new google.maps.InfoWindow({
					content: contentString,
				});
				const marker = new google.maps.Marker({
					position: { lat: mapLatitude, lng: mapLongitude },
					map,
					title: 'Uluru (Ayers Rock)',
					icon: {
						...defaultMarkers[`marker-icon-${mapMarker}`],
						fillColor: mapMarkerFillColor,
						fillOpacity: mapMarkerOpacity,
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
				className={classes}
				{...getMaxiBlockBlockAttributes(this.props)}
			>
				<div
					className='maxi-map-container'
					id='map'
					style={{ height: '300px' }}
				></div>
			</MaxiBlock>,
		];
	}
}

const editSelect = withSelect(select => {
	const deviceType = select('maxiBlocks').receiveMaxiDeviceType();

	return {
		deviceType,
	};
});

export default compose(editSelect)(edit);
