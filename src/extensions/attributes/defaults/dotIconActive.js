import prefixAttributesCreator from '../prefixAttributesCreator';
import dotIcon from './dotIcon';

const activePrefix = 'a-'; // 'active-'
const prefix = 'a-nd-'; // 'active-navigation-dot-'

const dotIconActive = prefixAttributesCreator({
	obj: dotIcon,
	prefix: activePrefix,
	diffValAttr: {
		[`${prefix}i-w-general`]: '10', // icon-width-general
		[`${prefix}i-str-px`]: 2, // icon-stroke-palette-color
		[`${prefix}i-f-pc`]: 4, // icon-fill-palette-color
	},
	newAttr: {
		[`${prefix}i.s`]: {
			// icon-status
			type: 'boolean',
			default: true,
			longLabel: 'icon-status',
		},
		[`${prefix}i-str-pa.s`]: {
			// icon-stroke-pa-status
			type: 'boolean',
			default: true,
			longLabel: 'icon-stroke-palette-status',
		},
		[`${prefix}i-f-pa.s`]: {
			// icon-fill-pa-status
			type: 'boolean',
			default: true,
			longLabel: 'icon-fill-palette-status',
		},
	},
});

export default dotIconActive;
