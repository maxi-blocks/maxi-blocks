import breakpointAttributesCreator from '../breakpointAttributesCreator';

const navigation = breakpointAttributesCreator({
	obj: {
		'navigation-type': {
			type: 'string',
			default: 'arrows-dots',
		},
		'navigation-arrow-position': {
			type: 'string',
			default: 'inside',
		},
		'navigation-dot-position': {
			type: 'string',
			default: 'inside',
		},
	},
});

export default navigation;
