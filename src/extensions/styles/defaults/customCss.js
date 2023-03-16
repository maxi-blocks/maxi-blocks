import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

const customCss = breakpointAttributesCreator({
	obj: {
		'custom-css': {
			type: 'object',
		},
	},
});

export default attributesShorter(customCss, 'customCss');
