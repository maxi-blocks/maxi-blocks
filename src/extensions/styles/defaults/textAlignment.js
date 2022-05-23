import breakpointAttributesCreator from '../breakpointAttributesCreator';

const textAlignment = breakpointAttributesCreator({
	obj: {
		'text-alignment': {
			type: 'string',
		},
	},
	diffValAttr: { 'text-alignment-general': 'left' },
});

export default textAlignment;
