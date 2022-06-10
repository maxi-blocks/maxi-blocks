import paletteAttributesCreator from '../paletteAttributesCreator';

const accordionIcon = {
	'icon-position': {
		type: 'string',
		default: 'right',
	},
	svgType: { type: 'string' },
	svgTypeActive: { type: 'string' },
	'icon-content': {
		type: 'string',
		default: '',
	},
	'icon-content-active': {
		type: 'string',
		default: '',
	},
	...paletteAttributesCreator({ prefix: 'icon-stroke-', palette: 1 }),
	...paletteAttributesCreator({ prefix: 'icon-fill-', palette: 4 }),
	...paletteAttributesCreator({ prefix: 'active-icon-stroke-', palette: 1 }),
	...paletteAttributesCreator({ prefix: 'active-icon-fill-', palette: 4 }),
};

export default accordionIcon;
