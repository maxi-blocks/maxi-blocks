import hoverAttributesCreator from '../hoverAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { background, backgroundColor } from './background';
import opacity from './opacity';
import { height, width } from './size';

const prefix = 'o-'; // overlay-

const overlayColor = {
	...prefixAttributesCreator({
		obj: background,
		prefix,
		diffValAttr: {
			'o-bam-general': 'color', // overlay-background-active-media-general
		},
	}),
	...prefixAttributesCreator({
		obj: backgroundColor,
		prefix,
		diffValAttr: {
			'o-b-pc-general': 5, // overlay-background-palette-color-general
			'o-b-po-general': 0.7, // overlay-background-palette-opacity-general
		},
	}),
};

const videoOverlay = {
	...overlayColor,
	...hoverAttributesCreator({
		obj: overlayColor,
		sameValAttr: ['o-bam-general', 'o-b-pc-general', 'o-b-po-general'],
		newAttr: {
			'o-b.sh': {
				type: 'boolean',
				default: false,
				longLabel: 'overlay-background-status-hover',
			},
		},
	}),

	...prefixAttributesCreator({
		obj: { ...width, ...height, ...opacity },
		prefix: 'om-', // overlay-media
		diffValAttr: {
			'om-w-general': '100', // overlay-media-width-general
			'om-w.u-general': '%', // overlay-media-width-unit-general
			'om-h-general': '100', // overlay-media-height-general
			'om-h.u-general': '%', // overlay-media-height-unit-general
		},
	}),

	'o-mi': {
		type: 'number',
		longLabel: 'overlay-mediaID',
	},
	'o-my': {
		type: 'string',
		longLabel: 'overlay-mediaURL',
	},
	'o-as': {
		type: 'string',
		default: 'wordpress',
		longLabel: 'overlay-altSelector',
	},
	'o-mal': {
		type: 'string',
		longLabel: 'overlay-mediaAlt',
	},
};

export default videoOverlay;
