import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';
import boxShadow from './boxShadow';

const prefix = 'active-';

const boxShadowActive = prefixAttributesCreator({
	obj: boxShadow,
	diffValAttr: { [`${prefix}box-shadow-palette-color-general`]: 6 },
	newAttr: {
		'box-shadow-status-active': {
			type: 'boolean',
			default: false,
		},
	},
	prefix,
});

export default boxShadowActive;
