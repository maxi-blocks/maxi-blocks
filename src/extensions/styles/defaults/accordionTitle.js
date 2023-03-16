import breakpointAttributesCreator from '../breakpointAttributesCreator';
import hoverAttributesCreator from '../hoverAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import getAttributeKey from '../getAttributeKey';
import { typography } from './typography';
import typographyHover from './typographyHover';
import attributesShorter from '../dictionary/attributesShorter';

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
		sameValAttr: [
			getAttributeKey(
				'palette-status',
				false,
				`${prefix}-background-`,
				'general'
			),
		],
		diffValAttr: {
			[getAttributeKey(
				'palette-color',
				false,
				`${prefix}-background-`,
				'general'
			)]: 6,
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

export default attributesShorter(accordionTitle, 'accordionTitle');
