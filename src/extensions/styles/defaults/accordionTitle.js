import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';
import hoverAttributesCreator from '@extensions/styles/hoverAttributesCreator';
import paletteAttributesCreator from '@extensions/styles/paletteAttributesCreator';
import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';
import { typography } from './typography';
import typographyHover from './typographyHover';

const prefix = 'title-';

const titleBackground = breakpointAttributesCreator({
	obj: {
		[`${prefix}background-status`]: {
			type: 'boolean',
			default: false,
		},
		...paletteAttributesCreator({
			prefix: `${prefix}background-`,
			palette: 4,
		}),
	},
	noBreakpointAttr: [`${prefix}background-status`],
});

const accordionTitle = {
	titleLevel: { type: 'string', default: 'h6' },
	...titleBackground,
	...prefixAttributesCreator({
		obj: titleBackground,
		prefix: 'active-',
	}),
	...hoverAttributesCreator({
		obj: titleBackground,
		sameValAttr: [`${prefix}-background-palette-status-general`],
		diffValAttr: {
			[`${prefix}-background-palette-color-general`]: 6,
		},
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
