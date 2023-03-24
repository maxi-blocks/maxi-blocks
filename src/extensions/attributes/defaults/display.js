import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

const display = breakpointAttributesCreator({
	obj: {
		display: {
			type: 'string',
		},
	},
});

export default attributesShorter(display, 'display');
