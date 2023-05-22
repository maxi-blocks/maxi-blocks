import breakpointAttributesCreator from '../breakpointAttributesCreator';

const navigation = breakpointAttributesCreator({
	obj: {
		'nab.s': {
			type: 'boolean',
			default: true,
			longLabel: 'navigation-arrow-both-status',
		},
		'nd.s': {
			type: 'boolean',
			default: true,
			longLabel: 'navigation-dot-status',
		},
		na_pos: {
			type: 'string',
			default: 'inside',
			longLabel: 'navigation-arrow-position',
		},
		nd_pos: {
			type: 'string',
			default: 'inside',
			longLabel: 'navigation-dot-position',
		},
	},
});

export default navigation;
