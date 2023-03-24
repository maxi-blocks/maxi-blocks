import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

const alignment = breakpointAttributesCreator({
	obj: {
		alignment: {
			type: 'string',
			default: 'center',
		},
	},
});

export default attributesShorter(alignment, 'alignment');
