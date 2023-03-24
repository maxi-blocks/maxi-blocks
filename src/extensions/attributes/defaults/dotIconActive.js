import attributesShorter from '../dictionary/attributesShorter';
import prefixAttributesCreator from '../prefixAttributesCreator';
import dotIcon from './dotIcon';

const activePrefix = 'active-';
const prefix = 'active-navigation-dot-';

const dotIconActive = prefixAttributesCreator({
	obj: dotIcon,
	prefix: activePrefix,
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
		[`${prefix}icon-stroke-pa-status`]: {
			type: 'boolean',
			default: true,
		},
		[`${prefix}icon-fill-pa-status`]: {
			type: 'boolean',
			default: true,
		},
	},
});

export default attributesShorter(dotIconActive, 'dotIconActive');
