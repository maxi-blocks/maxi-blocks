const map = {
	m_pro: {
		type: 'string',
		default: 'openstreetmap', // or googlemaps
		longLabel: 'map-provider',
	},
	m_lat: {
		type: 'number',
		default: 52.514477,
		longLabel: 'map-latitude',
	},
	m_lon: {
		type: 'number',
		default: 13.350174,
		longLabel: 'map-longitude',
	},
	m_z: {
		type: 'number',
		default: 4,
		longLabel: 'map-zoom',
	},
	m_mz: {
		type: 'number',
		default: 1,
		longLabel: 'map-min-zoom',
	},
	m_mzo: {
		type: 'number',
		default: 22,
		longLabel: 'map-max-zoom',
	},
	m_mar: {
		type: 'array',
		longLabel: 'map-markers',
	},
};

export default map;
