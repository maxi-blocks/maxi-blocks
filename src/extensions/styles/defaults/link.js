import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';

const rawLink = {
	...paletteAttributesCreator({ prefix: 'link-', palette: 4 }),
	...paletteAttributesCreator({ prefix: 'link-hover', palette: 6 }),
	...paletteAttributesCreator({ prefix: 'link-active', palette: 6 }),
	...paletteAttributesCreator({ prefix: 'link-visited', palette: 6 }),
};

const link = breakpointAttributesCreator({
	obj: rawLink,
});

export default link;
