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
			'lb-b_am-general': 'color', // lightbox-background-active-media-general
		},
	}),
	...prefixAttributesCreator({
		obj: backgroundColor,
		prefix,
		longPrefix,
		diffValAttr: {
			'lb-b_pc-general': 5, // lightbox-background-palette-color-general
		},
	}),
};

export default videoPopup;
