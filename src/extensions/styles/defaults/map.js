const map = {
	'map-provider': {
		type: 'string',
		default: 'openstreetmap', // or googlemaps
	},
	'map-type': {
		type: 'string',
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
};

export default map;
