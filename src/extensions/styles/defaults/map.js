const map = {
	'map-provider': {
		type: 'string',
		default: 'openstreetmap', // or googlemaps
	},
	'map-type': {
		type: 'string',
		default: 'standard',
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
		default: 18, // OpenStreetMap max; Google Maps adjusts to 22 when selected
	},
	'map-markers': {
		type: 'array',
	},
};

export default map;
