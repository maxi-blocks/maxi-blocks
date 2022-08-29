import hoverAttributesCreator from '../hoverAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';

const titleColor = {
	...paletteAttributesCreator({ prefix: 'title-', palette: 5 }),
	...paletteAttributesCreator({
		prefix: 'title-background-',
	}),
};

const accordionTitle = {
	titleLevel: { type: 'string', default: 'h6' },
	...titleColor,
	...hoverAttributesCreator({
		obj: titleColor,
		sameValAttr: [
			'title-palette-status',
			'title-background-palette-status',
		],
	}),
	...prefixAttributesCreator({
		obj: titleColor,
		prefix: 'active-',
	}),
};

export default accordionTitle;
