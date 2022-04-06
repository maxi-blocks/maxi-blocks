import { __ } from '@wordpress/i18n';
import paletteAttributesCreator from '../paletteAttributesCreator';

const map = {
	'map-provider': {
		type: 'string',
		default: 'openstreetmap',
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
	'map-min-zoom': {
		type: 'number',
		default: 1,
	},
	'map-max-zoom': {
		type: 'number',
		default: 22,
	},
	'map-markers': {
		type: 'array',
		default: [],
	},
	'map-marker': {
		type: 'number',
		default: 1,
	},
	'map-marker-icon': {
		type: 'string',
	},
	'map-popup': {
		type: 'number',
		default: 1,
	},
	'map-is-dragging-marker': {
		type: 'boolean',
		default: false,
	},
	'map-adding-marker': {
		type: 'string',
		default: '',
	},
	'map-marker-heading-level': {
		type: 'string',
		default: 'h6',
	},
	'map-marker-opacity': {
		type: 'number',
		default: 1,
	},
	'map-marker-scale': {
		type: 'number',
		default: 20,
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
	'map-dragging': {
		type: 'boolean',
		default: true,
	},
	'map-touch-zoom': {
		type: 'boolean',
		default: true,
	},
	'map-double-click-zoom': {
		type: 'boolean',
		default: true,
	},
	'map-scroll-wheel-zoom': {
		type: 'boolean',
		default: true,
	},
	...paletteAttributesCreator({ prefix: 'map-marker-text-', palette: 4 }),
	'map-marker-address': {
		type: 'string',
		default: __('Marker Address', 'maxi-blocks'),
	},
	...paletteAttributesCreator({ prefix: 'map-marker-address-', palette: 5 }),
};

export default map;
