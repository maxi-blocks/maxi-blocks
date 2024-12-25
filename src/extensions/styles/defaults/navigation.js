import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const navigation = breakpointAttributesCreator({
	obj: {
		'navigation-arrow-both-status': {
			type: 'boolean',
			default: true,
		},
		'navigation-dot-status': {
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
