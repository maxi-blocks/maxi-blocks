import { typography } from './typography';
import prefixAttributesCreator from '../prefixAttributesCreator';

const mapPopupText = {
	m_mhl: {
		type: 'string',
		default: 'h6',
		longLabel: 'map-marker-heading-level',
	},
	...{
		...typography,
		'_pc-g': {
			type: 'number',
			default: 4,
			longLabel: 'palette-color-general',
		},
	},
	...prefixAttributesCreator({
		obj: typography,
		prefix: 'd-',
		longPrefix: 'description-',
		diffValAttr: {
			'd-fs-g': 16, // description-font-size-general
		},
	}),
};

export default mapPopupText;
