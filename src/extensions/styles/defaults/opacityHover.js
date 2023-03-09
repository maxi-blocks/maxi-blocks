import hoverAttributesCreator from '../hoverAttributesCreator';
import opacity from './opacity';
import attributesShorter from '../dictionary/attributesShorter';

const opacityHover = hoverAttributesCreator({
	obj: opacity,
	newAttr: attributesShorter(
		{
			'opacity-status-hover': {
				type: 'boolean',
				default: false,
			},
		},
		'opacity'
	),
});

export default opacityHover;
