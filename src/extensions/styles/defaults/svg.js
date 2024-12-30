import paletteAttributesCreator from '@extensions/styles/paletteAttributesCreator';
import hoverAttributesCreator from '@extensions/styles/hoverAttributesCreator';
import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';
import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';
import { width } from './size';

const prefix = 'svg-';

export const svg = {
	...paletteAttributesCreator({ prefix: 'svg-fill-', palette: 4 }),
	...paletteAttributesCreator({ prefix: 'svg-line-', palette: 7 }),
	...prefixAttributesCreator({
		obj: width,
		prefix,
		diffValAttr: { 'svg-width-general': '64' },
	}),
	...breakpointAttributesCreator({
		obj: {
			'svg-stroke': {
				type: 'number',
				default: 2,
			},
		},
	}),
};

export const svgHover = hoverAttributesCreator({
	obj: {
		...paletteAttributesCreator({ prefix: 'svg-fill-', palette: 4 }),
		...paletteAttributesCreator({ prefix: 'svg-line-', palette: 7 }),
	},
	sameValAttr: ['svg-fill-palette-status', 'svg-line-palette-status'],
	diffValAttr: { 'svg-fill-palette-color': 6, 'svg-line-palette-color': 8 },
	newAttr: {
		'svg-status-hover': {
			type: 'boolean',
			default: false,
		},
	},
});
