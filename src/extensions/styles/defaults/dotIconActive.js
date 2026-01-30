import activeAttributesCreator from '@extensions/styles/activeAttributesCreator';
import dotIcon from './dotIcon';

const prefix = 'active-navigation-dot-';

const dotIconActive = activeAttributesCreator({
	obj: dotIcon,
	diffValAttr: {
		[`${prefix}icon-width-general`]: '10',
		[`${prefix}icon-stroke-palette-color`]: 2,
		[`${prefix}icon-fill-palette-color`]: 4,
	},
	newAttr: {
		[`${prefix}icon-status`]: {
			type: 'boolean',
			default: true,
		},
	},
});

export default dotIconActive;
