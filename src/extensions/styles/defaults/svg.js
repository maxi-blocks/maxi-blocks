import paletteAttributesCreator from '../paletteAttributesCreator';
import breakpointAttributesCreator from '../breakpointAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { width } from './size';

const prefix = 'svg-';

const svg = {
	...paletteAttributesCreator({ prefix: 'svg-fill-', palette: 4 }),
	...paletteAttributesCreator({ prefix: 'svg-line-', palette: 7 }),
	...prefixAttributesCreator({
		obj: width,
		prefix,
		diffValAttr: { 'svg-width-general': 64 },
	}),
	...breakpointAttributesCreator({
		obj: {
			'svg-stroke': {
				type: 'number',
				default: 2,
			},
			'svg-responsive': {
				type: 'boolean',
				default: true,
			},
		},
	}),
};

export default svg;
