import breakpointAttributesCreator from '../breakpointAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

const breakpoints = breakpointAttributesCreator({
	obj: {
		breakpoints: {
			type: 'number',
		},
	},
});

export default attributesShorter(breakpoints, 'breakpoints');
