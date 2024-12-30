import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

const textAlignment = breakpointAttributesCreator({
	obj: {
		'text-alignment': {
			type: 'string',
		},
	},
});

export default textAlignment;
