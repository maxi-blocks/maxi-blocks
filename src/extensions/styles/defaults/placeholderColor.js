import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';

const placeholderColor = {
	...breakpointAttributesCreator({
		obj: paletteAttributesCreator({ prefix: 'placeholder-', palette: 3 }),
	}),
};

export default placeholderColor;
