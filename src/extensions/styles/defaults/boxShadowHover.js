import hoverAttributesCreator from '@extensions/styles/hoverAttributesCreator';
import boxShadow from './boxShadow';

const boxShadowHover = hoverAttributesCreator({
	obj: boxShadow,
	diffValAttr: { 'box-shadow-palette-color-general': 6 },
	newAttr: {
		'box-shadow-status-hover': {
			type: 'boolean',
			default: false,
		},
	},
});

export default boxShadowHover;
