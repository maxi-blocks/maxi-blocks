import hoverAttributesCreator from '../hoverAttributesCreator';
import { typography } from './typography';

const typographyHover = hoverAttributesCreator({
	obj: typography,
	sameValAttr: ['palette-status-general'],
	diffValAttr: { 'palette-color-general': 5 },
	newAttr: {
		'typography-status-hover': {
			type: 'boolean',
			default: false,
		},
	},
});

export default typographyHover;
