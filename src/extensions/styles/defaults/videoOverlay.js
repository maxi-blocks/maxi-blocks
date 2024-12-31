import hoverAttributesCreator from '@extensions/styles/hoverAttributesCreator';
import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';
import { background, backgroundColor } from './background';
import opacity from './opacity';
import { height, width } from './size';

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
			'overlay-background-status-hover': {
				type: 'boolean',
				default: false,
			},
		},
	}),

	...prefixAttributesCreator({
		obj: { ...width, ...height, ...opacity },
		prefix: 'overlay-media-',
		diffValAttr: {
			'overlay-media-width-general': '100',
			'overlay-media-width-unit-general': '%',
			'overlay-media-height-general': '100',
			'overlay-media-height-unit-general': '%',
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
