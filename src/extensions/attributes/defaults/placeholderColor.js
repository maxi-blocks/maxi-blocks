import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';

const placeholderColor = {
	...breakpointAttributesCreator({
		obj: paletteAttributesCreator({ prefix: 'pl-', palette: 3 }), // placeholder-
	}),
};

export default placeholderColor;
