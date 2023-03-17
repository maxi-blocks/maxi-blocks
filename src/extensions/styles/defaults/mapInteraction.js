import attributesShorter from '../dictionary/attributesShorter';

const mapInteraction = {
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

export default attributesShorter(mapInteraction, 'mapInteraction');
