import hoverAttributesCreator from '../hoverAttributesCreator';
import arrowIconBoxShadow from './arrowIconBoxShadow';

const boxShadowHover = hoverAttributesCreator({
	obj: arrowIconBoxShadow,
	diffValAttr: {
		'navigation-arrow-both-icon-box-shadow-palette-color-general': 6,
	},
	newAttr: {
		'navigation-arrow-both-icon-box-shadow-status-hover': {
			type: 'boolean',
			default: false,
		},
	},
});

export default boxShadowHover;
