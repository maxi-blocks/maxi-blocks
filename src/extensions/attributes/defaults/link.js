import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';

const rawLink = {
	...paletteAttributesCreator({ prefix: 'l-', palette: 4 }),
	...paletteAttributesCreator({ prefix: 'lih-', palette: 6 }),
	...paletteAttributesCreator({ prefix: 'lia-', palette: 6 }),
	...paletteAttributesCreator({ prefix: 'liv-', palette: 6 }),
};

export default breakpointAttributesCreator({
	obj: rawLink,
});
