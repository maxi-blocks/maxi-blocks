import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

const rowPattern = breakpointAttributesCreator({
	obj: {
		'row-pattern': {
			type: 'string',
		},
	},
});

export default attributesShorter(rowPattern, 'rowPattern');
