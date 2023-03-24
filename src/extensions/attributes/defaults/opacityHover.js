import hoverAttributesCreator from '../hoverAttributesCreator';
import opacity from './opacity';
import attributesShorter from '../dictionary/attributesShorter';

const opacityHover = hoverAttributesCreator({
	obj: opacity,
	newAttr: {
		'opacity-status-hover': {
			type: 'boolean',
			default: false,
		},
	},
});

export default attributesShorter(opacityHover, 'opacityHover');
