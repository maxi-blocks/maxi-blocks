import { typography } from './typography';
import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';

const mapPopupText = {
	'map-marker-heading-level': {
		type: 'string',
		default: 'h6',
	},
	...{
		...typography,
		'palette-color-general': {
			type: 'number',
			default: 4,
		},
	},
	...prefixAttributesCreator({
		obj: typography,
		prefix: 'description-',
		diffValAttr: {
			'description-font-size-general': 16,
		},
	}),
};

export default mapPopupText;
