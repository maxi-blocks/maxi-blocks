import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

const columnSize = breakpointAttributesCreator({
	obj: {
		'column-size': {
			type: 'number',
			default: 90,
		},
		'column-fit-content': {
			type: 'boolean',
		},
	},
});

export default attributesShorter(columnSize, 'columnSize');
