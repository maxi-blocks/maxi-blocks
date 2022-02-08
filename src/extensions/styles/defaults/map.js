import { __ } from '@wordpress/i18n';
import paletteAttributesCreator from '../paletteAttributesCreator';

const map = {
	'map-latitude': {
		type: 'string',
		default: 52.514477,
	},
	'map-longitude': {
		type: 'string',
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
	...paletteAttributesCreator({ prefix: 'map-marker-text-', palette: 4 }),
	'map-marker-address': {
		type: 'string',
		default: __('Marker Address', 'maxi-blocks'),
	},
	...paletteAttributesCreator({ prefix: 'map-marker-address-', palette: 5 }),
};

export default map;
