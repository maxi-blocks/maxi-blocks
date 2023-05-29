import hoverAttributesCreator from '../hoverAttributesCreator';
import boxShadow from './boxShadow';

const boxShadowHover = hoverAttributesCreator({
	obj: boxShadow,
	diffValAttr: { 'bs_pc-g': 6 }, // box-shadow-palette-color-g
	newAttr: {
		'bs.sh': {
			type: 'boolean',
			default: false,
			longLabel: 'box-shadow-status-hover',
		},
	},
});

export default boxShadowHover;
