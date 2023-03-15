import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

const textAlignment = breakpointAttributesCreator({
	obj: {
		'text-alignment': {
			type: 'string',
		},
	},
});

export default attributesShorter(textAlignment, 'textAlignment');
