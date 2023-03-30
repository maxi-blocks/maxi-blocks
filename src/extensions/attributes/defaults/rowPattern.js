import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rowPattern = breakpointAttributesCreator({
	obj: {
		_rp: {
			type: 'string',
			longLabel: 'row-pattern',
		},
	},
});

export default rowPattern;
