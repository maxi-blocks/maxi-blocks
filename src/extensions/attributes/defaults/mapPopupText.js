import { typography } from './typography';
import prefixAttributesCreator from '../prefixAttributesCreator';
import attributesShorter from '../dictionary/attributesShorter';

const mapPopupText = {
	'map-marker-heading-level': {
		type: 'string',
		default: 'h6',
	},
	...{
		...typography,
		'pac-general': {
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

export default attributesShorter(mapPopupText, 'mapPopupText');
