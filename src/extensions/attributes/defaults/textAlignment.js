import breakpointAttributesCreator from '../breakpointAttributesCreator';

const textAlignment = breakpointAttributesCreator({
	obj: {
		_ta: {
			type: 'string',
			longLabel: 'text-alignment',
		},
	},
});

export default textAlignment;
