import breakpointAttributesCreator from '../breakpointAttributesCreator';

const textAlignment = breakpointAttributesCreator({
	obj: {
		'text-alignment': {
			type: 'string',
		},
	},
});

export default textAlignment;
