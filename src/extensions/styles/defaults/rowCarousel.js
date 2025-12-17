import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const rowCarousel = {
	// Breakpoint-specific carousel enable/disable
	...breakpointAttributesCreator({
		obj: {
			'row-carousel-status': {
				type: 'boolean',
				default: false,
			},
		},
	}),

	// Core carousel settings (non-breakpoint)
	'row-carousel-slides-per-view': {
		type: 'number',
		default: 1,
	},
	'row-carousel-loop': {
		type: 'boolean',
		default: false,
	},
	'row-carousel-autoplay': {
		type: 'boolean',
		default: false,
	},
	'row-carousel-pause-on-hover': {
		type: 'boolean',
		default: false,
	},
	'row-carousel-pause-on-interaction': {
		type: 'boolean',
		default: false,
	},
	'row-carousel-autoplay-speed': {
		type: 'number',
		default: 2.5,
	},
	'row-carousel-transition': {
		type: 'string',
		default: 'slide',
	},
	'row-carousel-transition-speed': {
		type: 'number',
		default: 0.5,
	},
	'row-carousel-column-gap': {
		type: 'number',
		default: 0,
	},
	'row-carousel-peek-offset': {
		type: 'number',
		default: 0,
	},
	'row-carousel-trigger-width': {
		type: 'number',
		default: undefined,
	},
};

export default rowCarousel;
