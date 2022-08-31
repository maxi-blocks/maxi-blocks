import hoverAttributesCreator from '../hoverAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { background, backgroundColor } from './background';

const overlayColor = {
	...prefixAttributesCreator({
		obj: background,
		prefix: 'overlay-',
		diffValAttr: {
			'overlay-background-active-media-general': 'color',
		},
	}),
	...prefixAttributesCreator({
		obj: backgroundColor,
		prefix: 'overlay-',
		diffValAttr: {
			'overlay-background-palette-color-general': 5,
			'overlay-background-palette-opacity-general': 0.7,
		},
	}),
};

const videoOverlay = {
	...overlayColor,
	...hoverAttributesCreator({
		obj: overlayColor,
		sameValAttr: [
			'overlay-background-active-media-general',
			'overlay-background-palette-color-general',
			'overlay-background-palette-opacity-general',
		],
		newAttr: {
			'overlay-background-hover-status': {
				type: 'boolean',
				default: false,
			},
		},
	}),
	'overlay-mediaID': {
		type: 'number',
	},
	'overlay-mediaURL': {
		type: 'string',
	},
	'overlay-altSelector': {
		type: 'string',
		default: 'wordpress',
	},
	'overlay-mediaAlt': {
		type: 'string',
	},
};

export default videoOverlay;
