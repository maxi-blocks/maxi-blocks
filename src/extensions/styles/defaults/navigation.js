import breakpointAttributesCreator from '../breakpointAttributesCreator';

const navigation = breakpointAttributesCreator({
	obj: {
		'navigation-arrows-status': {
			type: 'boolean',
			default: true,
		},
		'navigation-dots-status': {
			type: 'boolean',
			default: true,
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
