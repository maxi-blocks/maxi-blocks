import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rowPattern = breakpointAttributesCreator({
	obj: {
		'row-pattern': {
			type: 'string',
		},
	},
});

export default rowPattern;
