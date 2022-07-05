import prefixAttributesCreator from '../prefixAttributesCreator';
import boxShadow from './boxShadow';

const prefix = 'navigation-dot-icon-';

const dotIconBoxShadow = prefixAttributesCreator({
	obj: boxShadow,
	newAttr: {
		'navigation-dot-icon-status-shadow': {
			type: 'boolean',
			default: false,
		},
	},
	prefix,
});

export default dotIconBoxShadow;
