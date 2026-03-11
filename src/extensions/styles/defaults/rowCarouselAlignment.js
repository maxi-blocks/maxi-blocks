import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const rowCarouselAlignment = breakpointAttributesCreator({
	obj: {
		'row-carousel-alignment': {
			type: 'string',
			default: 'center',
		},
	},
});

export default rowCarouselAlignment;
