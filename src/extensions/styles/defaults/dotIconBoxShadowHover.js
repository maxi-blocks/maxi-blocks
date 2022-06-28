import hoverAttributesCreator from '../hoverAttributesCreator';
import dotIconBoxShadow from './dotIconBoxShadow';

const dotIconBoxShadowHover = hoverAttributesCreator({
	obj: dotIconBoxShadow,
	diffValAttr: {
		'navigation-dot-icon-box-shadow-palette-color-general': 6,
	},
	newAttr: {
		'navigation-dot-icon-box-shadow-status-hover': {
			type: 'boolean',
			default: false,
		},
	},
});

export default dotIconBoxShadowHover;
