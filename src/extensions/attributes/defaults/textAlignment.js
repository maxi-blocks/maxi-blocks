import breakpointAttributesCreator from '../breakpointAttributesCreator';

const textAlignment = breakpointAttributesCreator({
	obj: {
		ta: {
			type: 'string',
			longLabel: 'text-alignment',
		},
	},
});

export default textAlignment;
