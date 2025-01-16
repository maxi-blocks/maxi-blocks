import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';
import { background, backgroundColor } from './background';

const videoPopup = {
	...prefixAttributesCreator({
		obj: background,
		prefix: 'lightbox-',
		diffValAttr: {
			'lightbox-background-active-media-general': 'color',
		},
	}),
	...prefixAttributesCreator({
		obj: backgroundColor,
		prefix: 'lightbox-',
		diffValAttr: {
			'lightbox-background-palette-color-general': 5,
		},
	}),
};

export default videoPopup;
