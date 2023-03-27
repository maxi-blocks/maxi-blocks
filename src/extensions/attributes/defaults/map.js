const map = {
	'm-pro': {
		type: 'string',
		default: 'openstreetmap', // or googlemaps
		longLabel: 'map-provider',
	},
	'm-lat': {
		type: 'number',
		default: 52.514477,
		longLabel: 'map-latitude',
	},
	'm-long': {
		type: 'number',
		default: 13.350174,
		longLabel: 'map-longitude',
	},
	'm-x': {
		type: 'number',
		default: 4,
		longLabel: 'map-zoom',
	},
	'm-mz': {
		type: 'number',
		default: 1,
		longLabel: 'map-min-zoom',
	},
	'm-mxz': {
		type: 'number',
		default: 22,
		longLabel: 'map-max-zoom',
	},
	'm-mar': {
		type: 'array',
	},
};

export default map;
