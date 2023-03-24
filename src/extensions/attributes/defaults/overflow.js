import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

const rawOverflow = {
	'overflow-x': {
		type: 'string',
		default: 'visible',
	},
	'overflow-y': {
		type: 'string',
		default: 'visible',
	},
};

const overflow = breakpointAttributesCreator({
	obj: rawOverflow,
});

export default attributesShorter(overflow, 'overflow');
