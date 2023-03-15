import hoverAttributesCreator from '../hoverAttributesCreator';
import { typography } from './typography';

const typographyHover = hoverAttributesCreator({
	obj: typography,
	sameValAttr: ['pa-status-general'],
	diffValAttr: { 'pac-general': 5 },
	newAttr: {
		'typography-status-hover': {
			type: 'boolean',
			default: false,
		},
	},
});

export default typographyHover;
