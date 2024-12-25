import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const rowPattern = breakpointAttributesCreator({
	obj: {
		'row-pattern': {
			type: 'string',
		},
	},
});

export default rowPattern;
