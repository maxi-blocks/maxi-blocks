import prefixAttributesCreator from '../prefixAttributesCreator';
import boxShadow from './boxShadow';

const prefix = 'a-';
const longPrefix = 'active-';

const boxShadowActive = prefixAttributesCreator({
	obj: boxShadow,
	diffValAttr: { [`${prefix}bs_pc-g`]: 6 }, // box-shadow-palette-color-g
	newAttr: {
		'bs.sa': {
			type: 'boolean',
			default: false,
			longLabel: 'box-shadow-status-active',
		},
	},
	prefix,
	longPrefix,
});

export default boxShadowActive;
