import breakpointAttributesCreator from '../breakpointAttributesCreator';

const alignment = breakpointAttributesCreator({
	obj: {
		_a: {
			type: 'string',
			default: 'center',
			longLabel: 'alignment',
		},
	},
});

export default alignment;
