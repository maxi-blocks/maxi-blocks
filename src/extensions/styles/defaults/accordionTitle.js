import paletteAttributesCreator from '../paletteAttributesCreator';

const accordionTitle = {
	titleLevel: { type: 'string', default: 'h6' },
	...paletteAttributesCreator({ prefix: 'title-', palette: 6 }),
	...paletteAttributesCreator({
		prefix: 'title-background-',
		palette: 1,
	}),
};

export default accordionTitle;
