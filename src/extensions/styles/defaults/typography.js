import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';
import typographyAttributesCreator from '@extensions/styles/typographyAttributesCreator';
import alignment from './alignment';

export const typography = typographyAttributesCreator();

export const typographyAlignment = prefixAttributesCreator({
	obj: alignment,
	prefix: 'typography-',
	diffValAttr: {
		'typography-alignment-general': 'left',
	},
});
