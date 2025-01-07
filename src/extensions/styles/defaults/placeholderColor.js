import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';
import paletteAttributesCreator from '@extensions/styles/paletteAttributesCreator';

const placeholderColor = {
	...breakpointAttributesCreator({
		obj: paletteAttributesCreator({ prefix: 'placeholder-', palette: 3 }),
	}),
};

export default placeholderColor;
