import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const rowCarouselNavigation = breakpointAttributesCreator({
	obj: {
		'row-carousel-navigation-arrow-status': {
			type: 'boolean',
			default: true,
		},
		'row-carousel-navigation-dot-status': {
			type: 'boolean',
			default: true,
		},
		'row-carousel-navigation-arrow-position': {
			type: 'string',
			default: 'inside',
		},
		'row-carousel-navigation-dot-position': {
			type: 'string',
			default: 'inside',
		},
	},
});

export default rowCarouselNavigation;
