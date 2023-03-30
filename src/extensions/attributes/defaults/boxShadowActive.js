import prefixAttributesCreator from '../prefixAttributesCreator';
import boxShadow from './boxShadow';

const prefix = 'a-';
const longPrefix = 'active-';

const boxShadowActive = prefixAttributesCreator({
	obj: boxShadow,
	diffValAttr: { [`${prefix}bs_pc-general`]: 6 }, // box-shadow-palette-color-general
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
