import { __ } from '@wordpress/i18n';
import paletteAttributesCreator from '../paletteAttributesCreator';

const map = {
	'map-provider': {
		type: 'string',
		default: 'openstreetmap', // or googlemaps
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
	'map-marker-heading-level': {
		type: 'string',
		default: 'h6',
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
