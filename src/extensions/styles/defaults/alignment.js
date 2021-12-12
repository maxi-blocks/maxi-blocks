import breakpointAttributesCreator from '../breakpointAttributesCreator';

const alignment = breakpointAttributesCreator({
	obj: {
		alignment: {
			type: 'string',
			default: 'center',
		},
	},
});

export default alignment;
