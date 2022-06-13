import breakpointAttributesCreator from '../breakpointAttributesCreator';

const navigation = breakpointAttributesCreator({
	obj: {
		'navigation-type': {
			type: 'string',
			default: 'arrows-dots',
		},
		'navigation-arrow-position': {
			type: 'string',
			default: 'arrows-dots',
		},
	},
});

export default navigation;
