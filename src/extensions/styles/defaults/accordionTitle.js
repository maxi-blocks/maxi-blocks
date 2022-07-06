import paletteAttributesCreator from '../paletteAttributesCreator';

const accordionTitle = {
	titleLevel: { type: 'string', default: 'h6' },
	...paletteAttributesCreator({ prefix: 'title-', palette: 5 }),
	...paletteAttributesCreator({
		prefix: 'title-background-',
	}),
};

export default accordionTitle;
