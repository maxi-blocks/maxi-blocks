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
};

export default map;
