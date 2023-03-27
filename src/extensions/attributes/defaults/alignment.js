import breakpointAttributesCreator from '../breakpointAttributesCreator';

const alignment = breakpointAttributesCreator({
	obj: {
		a: {
			type: 'string',
			default: 'center',
			longLabel: 'alignment',
		},
	},
});

export default alignment;
