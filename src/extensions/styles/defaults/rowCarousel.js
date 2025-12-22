import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const rowCarousel = {
	// Global carousel status (NOT breakpoint-specific)
	'row-carousel-status': {
		type: 'boolean',
		default: false,
	},

	// Breakpoint-specific carousel settings
	...breakpointAttributesCreator({
		obj: {
			'row-carousel-slides-per-view': {
				type: 'number',
				default: 1,
			},
			'row-carousel-peek-offset': {
				type: 'number',
				default: 0,
			},
			'row-carousel-column-gap': {
				type: 'number',
				default: 0,
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
			'row-carousel-height-offset': {
				type: 'number',
				default: 0,
			},
		},
	}),

	// Global (non-breakpoint) settings
	'row-carousel-trigger-width': {
		type: 'number',
		default: undefined,
	},
};

export default rowCarousel;
