import hoverAttributesCreator from '../hoverAttributesCreator';
import opacity from './opacity';

const opacityHover = hoverAttributesCreator({
	obj: opacity,
	newAttr: {
		'o.sh': {
			type: 'boolean',
			default: false,
			longLabel: 'opacity-status-hover',
		},
	},
});

export default opacityHover;
