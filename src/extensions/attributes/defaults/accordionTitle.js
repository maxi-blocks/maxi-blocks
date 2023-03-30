import breakpointAttributesCreator from '../breakpointAttributesCreator';
import hoverAttributesCreator from '../hoverAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import getAttributeKey from '../getAttributeKey';
import { typography } from './typography';
import typographyHover from './typographyHover';

const prefix = 'ti-';
const longPrefix = 'title-';

const titleBackground = breakpointAttributesCreator({
	obj: {
		[`${prefix}b.s`]: {
			// background-status
			type: 'boolean',
			default: false,
			longLabel: `${longPrefix}background-status`,
		},
		...paletteAttributesCreator({
			prefix: `${prefix}b-`,
			longPrefix: `${longPrefix}background-`,
			palette: 4,
		}),
	},
	noBreakpointAttr: [`${prefix}b.s`], // background-status
});

const accordionTitle = {
	_tl: {
		type: 'string',
		default: 'h6',
		longLabel: 'titleLevel',
	},
	...titleBackground,
	...prefixAttributesCreator({
		obj: titleBackground,
		prefix: 'a-',
		longPrefix: 'active-',
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
	...prefixAttributesCreator({ obj: typography, prefix, longPrefix }),
	...prefixAttributesCreator({ obj: typographyHover, prefix, longPrefix }),
	...prefixAttributesCreator({
		obj: typography,
		prefix: `a-${prefix}`,
		longPrefix: `active-${longPrefix}`,
		newAttr: {
			// typography-status-active
			[`${prefix}t.sa`]: {
				type: 'boolean',
				default: false,
				longLabel: `${longPrefix}typography-status-active`,
			},
		},
	}),
};

export default accordionTitle;
