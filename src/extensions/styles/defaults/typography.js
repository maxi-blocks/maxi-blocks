import prefixAttributesCreator from '../prefixAttributesCreator';
import typographyAttributesCreator from '../typographyAttributesCreator';
import alignment from './alignment';

export const typography = typographyAttributesCreator();

export const typographyAlignment = prefixAttributesCreator({
	obj: alignment,
	prefix: 'typography-',
	diffValAttr: {
		'typography-alignment-general': 'left',
	},
});
