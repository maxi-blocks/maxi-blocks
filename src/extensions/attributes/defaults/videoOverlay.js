import hoverAttributesCreator from '../hoverAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { background, backgroundColor } from './background';
import opacity from './opacity';
import { height, width } from './size';

const prefix = 'o-';
const longPrefix = 'overlay-';

const overlayColor = {
	...prefixAttributesCreator({
		obj: background,
		prefix,
		longPrefix,
		diffValAttr: {
			'o-b_am-general': 'color', // overlay-background-active-media-general
		},
	}),
	...prefixAttributesCreator({
		obj: backgroundColor,
		prefix,
		longPrefix,
		diffValAttr: {
			'o-bc_pc-general': 5, // overlay-background-palette-color-general
			'o-bc_po-general': 0.7, // overlay-background-palette-opacity-general
		},
	}),
};

const videoOverlay = {
	...overlayColor,
	...hoverAttributesCreator({
		obj: overlayColor,
		sameValAttr: ['o-b_am-general', 'o-b_pc-general', 'o-b_po-general'],
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
		prefix: 'om-',
		longPrefix: 'overlay-media-',
		diffValAttr: {
			'om_w-general': '100', // overlay-media-width-general
			'om_w.u-general': '%', // overlay-media-width-unit-general
			'om_h-general': '100', // overlay-media-height-general
			'om_h.u-general': '%', // overlay-media-height-unit-general
		},
	}),

	o_mi: {
		type: 'number',
		longLabel: 'overlay-mediaID',
	},
	o_mu: {
		type: 'string',
		longLabel: 'overlay-mediaURL',
	},
	o_as: {
		type: 'string',
		default: 'wordpress',
		longLabel: 'overlay-altSelector',
	},
	o_mal: {
		type: 'string',
		longLabel: 'overlay-mediaAlt',
	},
};

export default videoOverlay;
