import hoverAttributesCreator from '../hoverAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { typography } from './typography';
import typographyHover from './typographyHover';

const prefix = 'title-';

const titleBackground = {
	...paletteAttributesCreator({
		prefix: `${prefix}background-`,
		palette: 4,
	}),
};

const accordionTitle = {
	titleLevel: { type: 'string', default: 'h6' },
	...titleBackground,
	...prefixAttributesCreator({
		obj: titleBackground,
		prefix: 'active-',
	}),
	...hoverAttributesCreator({
		obj: titleBackground,
	}),
	...prefixAttributesCreator({ obj: typography, prefix }),
	...prefixAttributesCreator({ obj: typographyHover, prefix }),
	...prefixAttributesCreator({
		obj: typography,
		prefix: `active-${prefix}`,
		newAttr: {
			[`${prefix}typography-status-active`]: {
				type: 'boolean',
				default: false,
			},
		},
	}),
};

export default accordionTitle;
