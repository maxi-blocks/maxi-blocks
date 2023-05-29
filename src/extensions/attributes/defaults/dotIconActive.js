import prefixAttributesCreator from '../prefixAttributesCreator';
import dotIcon from './dotIcon';

const activePrefix = 'a-';
const longActivePrefix = 'active-';
const prefix = 'a-nd-';
const longPrefix = 'active-navigation-dot-';

const dotIconActive = prefixAttributesCreator({
	obj: dotIcon,
	prefix: activePrefix,
	longPrefix: longActivePrefix,
	diffValAttr: {
		[`${prefix}i_w-g`]: '10', // icon-width-g
		[`${prefix}i-str_pc`]: 2, // icon-stroke-palette-color
		[`${prefix}i-f_pc`]: 4, // icon-fill-palette-color
	},
	newAttr: {
		[`${prefix}i.s`]: {
			type: 'boolean',
			default: true,
			longLabel: `${longPrefix}icon-status`,
		},
		[`${prefix}i-str_ps`]: {
			type: 'boolean',
			default: true,
			longLabel: `${longPrefix}icon-stroke-palette-status`,
		},
		[`${prefix}i-f_ps`]: {
			type: 'boolean',
			default: true,
			longLabel: `${longPrefix}icon-fill-palette-status`,
		},
	},
});

export default dotIconActive;
