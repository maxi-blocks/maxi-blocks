import prefixAttributesCreator from '../prefixAttributesCreator';
import { background, backgroundColor } from './background';

const prefix = 'lb-';
const longPrefix = 'lightbox-';

const videoPopup = {
	...prefixAttributesCreator({
		obj: background,
		prefix,
		longPrefix,
		diffValAttr: {
			'lb-b_am-g': 'color', // lightbox-background-active-media-general
		},
	}),
	...prefixAttributesCreator({
		obj: backgroundColor,
		prefix,
		longPrefix,
		diffValAttr: {
			'lb-bc_pc-g': 5, // lightbox-background-palette-color-general
		},
	}),
};

export default videoPopup;
