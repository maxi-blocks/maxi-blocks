import paletteAttributesCreator from '../paletteAttributesCreator';
import hoverAttributesCreator from '../hoverAttributesCreator';
import breakpointAttributesCreator from '../breakpointAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { width } from './size';

const prefix = 's-'; // svg-

export const svg = {
	...paletteAttributesCreator({ prefix: 'sfi-', palette: 4 }), // svg-fill-
	...paletteAttributesCreator({ prefix: 'sli-', palette: 7 }), // svg-line-
	...prefixAttributesCreator({
		obj: width,
		prefix,
		diffValAttr: { 's-w-general': '64' }, // svg-width-general
	}),
	...breakpointAttributesCreator({
		obj: {
			's-str': {
				type: 'number',
				default: 2,
				longLabel: 'svg-stroke',
			},
		},
	}),
};

export const svgHover = hoverAttributesCreator({
	obj: {
		...paletteAttributesCreator({ prefix: 'sfi-', palette: 4 }), // svg-fill-
		...paletteAttributesCreator({ prefix: 'sli-', palette: 7 }), // svg-line-
	},
	sameValAttr: ['sfi-ps', 'sli-ps'], // svg-fill-palette-status, svg-line-palette-status
	diffValAttr: {
		'sfi-pc': 6, // svg-fill-palette-color
		'sli-pc': 8, // svg-line-palette-color
	},
	newAttr: {
		's.sh': {
			type: 'boolean',
			default: false,
			longLabel: 'svg-status-hover',
		},
	},
});
