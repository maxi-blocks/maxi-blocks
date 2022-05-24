import breakpointAttributesCreator from '../breakpointAttributesCreator';

const textAlignment = breakpointAttributesCreator({
	obj: {
		'text-alignment': {
			type: 'string',
			default: 'left',
		},
	},
});

export default textAlignment;
