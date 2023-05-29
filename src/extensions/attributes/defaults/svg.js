import paletteAttributesCreator from '../paletteAttributesCreator';
import hoverAttributesCreator from '../hoverAttributesCreator';
import breakpointAttributesCreator from '../breakpointAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { width } from './size';

const prefix = 's-';
const longPrefix = 'svg-';

export const svg = {
	...paletteAttributesCreator({
		prefix: 'sfi-',
		longPrefix: 'svg-fill-',
		palette: 4,
	}),
	...paletteAttributesCreator({
		prefix: 'sli-',
		longPrefix: 'svg-line-',
		palette: 7,
	}),
	...prefixAttributesCreator({
		obj: width,
		prefix,
		longPrefix,
		diffValAttr: { 's_w-g': '64' }, // svg-width-general
	}),
	...breakpointAttributesCreator({
		obj: {
			s_str: {
				type: 'number',
				default: 2,
				longLabel: 'svg-stroke',
			},
		},
	}),
};

export const svgHover = hoverAttributesCreator({
	obj: {
		...paletteAttributesCreator({
			prefix: 'sfi-',
			longPrefix: 'svg-fill-',
			palette: 4,
		}),
		...paletteAttributesCreator({
			prefix: 'sli-',
			longPrefix: 'svg-line-',
			palette: 7,
		}),
	},
	sameValAttr: ['sfi_ps', 'sli_ps'], // svg-fill-palette-status, svg-line-palette-status
	diffValAttr: {
		sfi_pc: 6, // svg-fill-palette-color
		sli_pc: 8, // svg-line-palette-color
	},
	newAttr: {
		's.sh': {
			type: 'boolean',
			default: false,
			longLabel: 'svg-status-hover',
		},
	},
});
