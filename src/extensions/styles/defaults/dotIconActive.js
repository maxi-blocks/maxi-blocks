import prefixAttributesCreator from '../prefixAttributesCreator';
import dotIcon from './dotIcon';

const activePrefix = 'active-';
const prefix = 'active-navigation-dot-';

const dotIconActive = prefixAttributesCreator({
	obj: dotIcon,
	prefix: activePrefix,
	diffValAttr: {
		[`${prefix}icon-width-general`]: '10',
		[`${prefix}icon-stroke-pac`]: 2,
		[`${prefix}icon-fill-pac`]: 4,
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

export default dotIconActive;
