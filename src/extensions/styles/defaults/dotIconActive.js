import activeAttributesCreator from '@extensions/styles/activeAttributesCreator';
import dotIcon from './dotIcon';

const prefix = 'active-navigation-dot-';

const dotIconActive = activeAttributesCreator({
	obj: dotIcon,
	diffValAttr: {
		[`${prefix}icon-width-general`]: '10',
		[`${prefix}icon-stroke-palette-color`]: 2,
		[`${prefix}icon-fill-palette-color`]: 5,
	},
	newAttr: {
		[`${prefix}icon-status`]: {
			type: 'boolean',
			default: true,
		},
		[`${prefix}icon-fill-palette-status`]: {
			type: 'boolean',
			default: true,
		},
		[`${prefix}icon-stroke-palette-status`]: {
			type: 'boolean',
			default: true,
		},
	},
});

export default dotIconActive;
