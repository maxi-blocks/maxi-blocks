import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

const placeholderColor = {
	...breakpointAttributesCreator({
		obj: paletteAttributesCreator({ prefix: 'placeholder-', palette: 3 }),
	}),
};

export default attributesShorter(placeholderColor, 'placeholderColor');
