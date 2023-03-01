import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

const opacity = breakpointAttributesCreator({
	obj: {
		opacity: {
			type: 'number',
		},
	},
});

export default attributesShorter(opacity, 'opacity');
