import breakpointAttributesCreator from '../breakpointAttributesCreator';

const navigation = breakpointAttributesCreator({
	obj: {
		'na-b.s': {
			type: 'boolean',
			default: true,
			longLabel: 'navigation-arrow-both-status',
		},
		'ng.s': {
			type: 'boolean',
			default: true,
			longLabel: 'navigation-dot-status',
		},
		'na-pos': {
			type: 'string',
			default: 'inside',
			longLabel: 'navigation-arrow-position',
		},
		'ng-pos': {
			type: 'string',
			default: 'inside',
			longLabel: 'navigation-dot-position',
		},
	},
});

export default navigation;
