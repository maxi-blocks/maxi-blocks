import prefixAttributesCreator from '../prefixAttributesCreator';
import boxShadow from './boxShadow';

const prefix = 'navigation-arrow-both-icon-';

const arrowIconBoxShadow = prefixAttributesCreator({
	obj: boxShadow,
	newAttr: {
		'navigation-arrow-both-icon-status-shadow': {
			type: 'boolean',
			default: false,
		},
	},
	prefix,
});

export default arrowIconBoxShadow;
