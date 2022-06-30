import hoverAttributesCreator from '../hoverAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { width } from './size';

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
	'active-icon-content': {
		type: 'string',
		default: '',
	},
	...paletteAttributesCreator({ prefix: 'icon-stroke-', palette: 5 }),
	...paletteAttributesCreator({ prefix: 'icon-fill-', palette: 4 }),
	...paletteAttributesCreator({ prefix: 'active-icon-stroke-', palette: 5 }),
	...paletteAttributesCreator({ prefix: 'active-icon-fill-', palette: 4 }),
	'icon-status-hover': { type: 'boolean', default: false },
	'active-icon-status-hover': { type: 'boolean', default: false },
	...hoverAttributesCreator({
		obj: {
			...paletteAttributesCreator({
				prefix: 'icon-stroke-',
				status: true,
			}),
			...paletteAttributesCreator({ prefix: 'icon-fill-', status: true }),
			...paletteAttributesCreator({
				prefix: 'active-icon-stroke-',
				status: true,
			}),
			...paletteAttributesCreator({
				prefix: 'active-icon-fill-',
				status: true,
			}),
		},
		diffValAttr: {
			'icon-stroke-palette-color': 5,
			'icon-stroke-palette-status': true,
			'icon-fill-palette-color': 4,
			'icon-fill-palette-status': true,
			'active-icon-stroke-palette-color': 5,
			'active-icon-stroke-palette-status': true,
			'active-icon-fill-palette-color': 4,
			'active-icon-fill-palette-status': true,
		},
	}),
	...prefixAttributesCreator({
		obj: width,
		prefix: 'icon-',
		diffValAttr: {
			'icon-width-general': '32',
		},
	}),
};

export default accordionIcon;
