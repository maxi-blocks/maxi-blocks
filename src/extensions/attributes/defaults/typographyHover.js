import hoverAttributesCreator from '../hoverAttributesCreator';
import { typography } from './typography';

const typographyHover = hoverAttributesCreator({
	obj: typography,
	sameValAttr: ['_ps-general'], // palette-status-general
	diffValAttr: { '_pc-general': 5 }, // palette-color-general
	newAttr: {
		't.sh': {
			type: 'boolean',
			default: false,
			longLabel: 'typography-status-hover',
		},
	},
});

export default typographyHover;
