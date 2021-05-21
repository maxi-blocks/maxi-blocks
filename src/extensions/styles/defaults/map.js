import { __ } from '@wordpress/i18n';

const map = {
	'map-api-key': {
		type: 'string',
		default: 'AIzaSyBW3BXol38RXkWnc49Zrgvw0pVZA9ISC1E',
	},
	'map-latitude': {
		type: 'number',
		default: 52.514477,
	},
	'map-longitude': {
		type: 'number',
		default: 13.350174,
	},
	'map-zoom': {
		type: 'number',
		default: 4,
	},
	'map-marker': {
		type: 'number',
		default: 1,
	},
	'map-marker-opacity': {
		type: 'number',
		default: 100,
	},
	'map-marker-scale': {
		type: 'number',
		default: 1,
	},
	'map-marker-fill-color': {
		type: 'string',
		default: '#FF4A17',
	},
	'map-marker-stroke-color': {
		type: 'string',
		default: '#081219',
	},
	'map-marker-text': {
		type: 'string',
		default: __('Marker Title', 'maxi-blocks'),
	},
	'map-marker-text-color': {
		type: 'string',
		default: '#FF4A17',
	},
	'map-marker-address': {
		type: 'string',
		default: __('Marker Address', 'maxi-blocks'),
	},
	'map-marker-address-color': {
		type: 'string',
		default: '#081219',
	},
};

export default map;
