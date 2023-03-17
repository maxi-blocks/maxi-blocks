import paletteAttributesCreator from '../paletteAttributesCreator';
import hoverAttributesCreator from '../hoverAttributesCreator';
import breakpointAttributesCreator from '../breakpointAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { width } from './size';
import attributesShorter from '../dictionary/attributesShorter';

const prefix = 'svg-';

export const svg = attributesShorter(
	{
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
	},
	'svg'
);

export const svgHover = hoverAttributesCreator({
	obj: {
		...paletteAttributesCreator({ prefix: 'svg-fill-', palette: 4 }),
		...paletteAttributesCreator({ prefix: 'svg-line-', palette: 7 }),
	},
	sameValAttr: ['svg-fill-pa-status', 'svg-line-pa-status'],
	diffValAttr: { 'svg-fill-pac': 6, 'svg-line-pac': 8 },
	newAttr: {
		'svg-status-hover': {
			type: 'boolean',
			default: false,
		},
	},
});
