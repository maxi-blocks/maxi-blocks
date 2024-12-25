import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const alignment = breakpointAttributesCreator({
	obj: {
		alignment: {
			type: 'string',
			default: 'center',
		},
	},
});

export default alignment;
