import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rowPattern = breakpointAttributesCreator({
	obj: {
		wp: {
			type: 'string',
			longLabel: 'row-pattern',
		},
	},
});

export default rowPattern;
