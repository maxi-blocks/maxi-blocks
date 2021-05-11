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
		const mapMarker = attributes['map-marker'];

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
					zoom: 4,
				});
			})
			.then(map => {
				const contentString = '<h3>Hello</h3>';
				const infowindow = new google.maps.InfoWindow({
					content: contentString,
				});
				const marker = new google.maps.Marker({
					position: { lat: mapLatitude, lng: mapLongitude },
					map,
					title: 'Uluru (Ayers Rock)',
					icon: defaultMarkers[`marker-icon-${mapMarker}`],
				});
				marker.addListener('click', () => {
					infowindow.open(map, marker);
				});
			})
			.catch(ex => {
				console.error('outer', ex.message);
			});

		return [
			<Inspector key={`block-settings-${uniqueID}`} {...this.props} />,
			<Toolbar key={`toolbar-${uniqueID}`} {...this.props} />,
			<MaxiBlock
				key={`maxi-amp--${uniqueID}`}
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
