import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { typography } from './typography';
import typographyHover from './typographyHover';

const accordionTitle = {
	titleLevel: { type: 'string', default: 'h6' },
	...paletteAttributesCreator({
		prefix: 'title-background-',
	}),
	...prefixAttributesCreator({ obj: typography, prefix: 'title-' }),
	...prefixAttributesCreator({ obj: typographyHover, prefix: 'title-' }),
	...prefixAttributesCreator({
		obj: typography,
		prefix: 'active-title-',
		newAttr: {
			'title-typography-status-active': {
				type: 'boolean',
				default: false,
			},
		},
	}),
};

export default accordionTitle;
