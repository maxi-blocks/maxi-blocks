import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

const rawLink = {
	...paletteAttributesCreator({ prefix: 'link-', palette: 4 }),
	...paletteAttributesCreator({ prefix: 'link-hover-', palette: 6 }),
	...paletteAttributesCreator({ prefix: 'link-active-', palette: 6 }),
	...paletteAttributesCreator({ prefix: 'link-visited-', palette: 6 }),
};

export default attributesShorter(
	breakpointAttributesCreator({
		obj: rawLink,
	}),
	'link'
);
