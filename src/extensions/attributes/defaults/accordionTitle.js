import breakpointAttributesCreator from '../breakpointAttributesCreator';
import hoverAttributesCreator from '../hoverAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import getAttributeKey from '../getAttributeKey';
import { typography } from './typography';
import typographyHover from './typographyHover';

const prefix = 'ti-'; // title-

const titleBackground = breakpointAttributesCreator({
	obj: {
		[`${prefix}b.s`]: {
			// background-status
			type: 'boolean',
			default: false,
		},
		...paletteAttributesCreator({
			prefix: `${prefix}b-`, // background-
			palette: 4,
		}),
	},
	noBreakpointAttr: [`${prefix}b.s`], // background-status
});

const accordionTitle = {
	titleLevel: { type: 'string', default: 'h6' },
	...titleBackground,
	...prefixAttributesCreator({
		obj: titleBackground,
		prefix: 'a-', // active-
	}),
	...hoverAttributesCreator({
		obj: titleBackground,
		sameValAttr: [
			getAttributeKey(
				'ps', // palette-status
				false,
				`${prefix}-b-`, // background-
				'general'
			),
		],
		diffValAttr: {
			[getAttributeKey(
				'pc', // palette-color
				false,
				`${prefix}-b-`, // background-
				'general'
			)]: 6,
		},
	}),
	...prefixAttributesCreator({ obj: typography, prefix }),
	...prefixAttributesCreator({ obj: typographyHover, prefix }),
	...prefixAttributesCreator({
		obj: typography,
		prefix: `a-${prefix}`, // active-
		newAttr: {
			// typography-status-active
			[`${prefix}t.sa`]: {
				type: 'boolean',
				default: false,
			},
		},
	}),
};

export default accordionTitle;
