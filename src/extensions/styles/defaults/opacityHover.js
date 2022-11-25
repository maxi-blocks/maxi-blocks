import hoverAttributesCreator from '../hoverAttributesCreator';
import opacity from './opacity';

const opacityHover = hoverAttributesCreator({
	obj: opacity,
	newAttr: {
		'opacity-status-hover': {
			type: 'boolean',
			default: false,
		},
	},
});

export default opacityHover;
