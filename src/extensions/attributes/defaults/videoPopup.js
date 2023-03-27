import prefixAttributesCreator from '../prefixAttributesCreator';
import { background, backgroundColor } from './background';

const prefix = 'lb-'; // lightbox-

const videoPopup = {
	...prefixAttributesCreator({
		obj: background,
		prefix,
		diffValAttr: {
			'lb-bam-general': 'color', // lightbox-background-active-media-general
		},
	}),
	...prefixAttributesCreator({
		obj: backgroundColor,
		prefix,
		diffValAttr: {
			'lb-b-pc-general': 5, // lightbox-background-palette-color-general
		},
	}),
};

export default videoPopup;
