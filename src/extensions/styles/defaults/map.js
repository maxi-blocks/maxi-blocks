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
		default: 1,
	},
	'map-marker-scale': {
		type: 'number',
		default: 1,
	},
	'map-marker-custom-color-status': {
		type: 'boolean',
		default: false,
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
	'map-marker-palette-text-color-status': {
		type: 'boolean',
		default: true,
	},
	'map-marker-palette-text-color': {
		type: 'number',
		default: 4,
	},
	'map-marker-palette-text-opacity': {
		type: 'number',
	},
	'map-marker-text-color': {
		type: 'string',
	},
	'map-marker-address': {
		type: 'string',
		default: __('Marker Address', 'maxi-blocks'),
	},
	'map-marker-palette-address-color-status': {
		type: 'boolean',
		default: true,
	},
	'map-marker-palette-address-color': {
		type: 'number',
		default: 5,
	},
	'map-marker-palette-address-opacity': {
		type: 'number',
	},
	'map-marker-address-color': {
		type: 'string',
	},
};

export default map;
