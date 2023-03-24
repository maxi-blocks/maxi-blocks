import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

const zIndex = breakpointAttributesCreator({
	obj: {
		'z-index': {
			type: 'number',
		},
	},
});

export default attributesShorter(zIndex, 'zIndex');
