import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { rawPosition } from './position';
import { clipPathRaw } from './clipPath';

// eslint-disable-next-line no-unused-vars
const { position, ...backgroundPosition } = rawPosition;

const rawBgOpacity = {
	o: {
		type: 'number',
		default: 1,
		longLabel: 'opacity',
	},
};

export const blockBackground = {
	bl: {
		type: 'array',
		longLabel: 'background-layers',
	},
	'bl.h': {
		type: 'array',
		longLabel: 'background-layers-hover',
	},
	'bb.sh': {
		type: 'boolean',
		default: false,
		longLabel: 'block-background-status-hover',
	},
};

export const rawBackground =
	({
		bam: {
			type: 'string',
			longLabel: 'background-active-media',
		},
	},
	'background');

const layerSize = {
	w: {
		type: 'number',
		default: 100,
		longLabel: 'width',
	},
	'w.u': {
		type: 'string',
		default: '%',
		longLabel: 'width-unit',
	},
	h: {
		type: 'number',
		default: 100,
		longLabel: 'height',
	},
	'h.u': {
		type: 'string',
		default: '%',
		longLabel: 'height-unit',
	},
};

export const rawBackgroundColor = {
	...paletteAttributesCreator({
		prefix: 'bc-', // background-color-
		palette: 1,
	}),

	...prefixAttributesCreator({
		prefix: 'bc-', // background-color-
		obj: clipPathRaw,
	}),

	...prefixAttributesCreator({
		obj: { ...backgroundPosition, ...layerSize },
		prefix: 'bcw-', // background-color-wrapper
	}),
};

export const rawBackgroundImage = {
	'bi-mi': {
		type: 'number',
		longLabel: 'background-image-mediaID',
	},
	'bi-mu': {
		type: 'string',
		longLabel: 'background-image-mediaURL',
	},
	'bi-si': {
		type: 'string',
		default: 'auto',
		longLabel: 'background-image-size',
	},
	...prefixAttributesCreator({
		obj: layerSize,
		prefix: 'bi-', // background-image-
	}),
	'bi-co': {
		type: 'object',
		longLabel: 'background-image-crop-options',
	},
	'bi-re': {
		type: 'string',
		default: 'no-repeat',
		longLabel: 'background-image-repeat',
	},
	'bi-pos': {
		type: 'string',
		default: 'center center',
		longLabel: 'background-image-position',
	},
	'bi-pw.u': {
		type: 'string',
		default: '%',
		longLabel: 'background-image-position-width-unit',
	},
	'bi-pw': {
		type: 'number',
		default: 0,
		longLabel: 'background-image-position-width',
	},
	'bi-ph.u': {
		type: 'string',
		default: '%',
		longLabel: 'background-image-position-height-unit',
	},
	'bi-ph': {
		type: 'number',
		default: 0,
		longLabel: 'background-image-position-height',
	},
	'bi-ori': {
		type: 'string',
		default: 'padding-box',
		longLabel: 'background-image-origin',
	},
	...prefixAttributesCreator({
		prefix: 'bi-', // background-image-
		obj: rawBgOpacity,
	}),
	'bi-clp': {
		type: 'string',
		default: 'border-box',
		longLabel: 'background-image-clip',
	},
	'bi-at': {
		type: 'string',
		default: 'scroll',
		longLabel: 'background-image-attachment',
	},
	'bi-cp': {
		type: 'string',
		longLabel: 'background-image-clip-path',
	},
	...prefixAttributesCreator({
		prefix: 'bi-', // background-image-
		obj: clipPathRaw,
	}),
	'bi-pa.s': {
		type: 'boolean',
		default: false,
		longLabel: 'background-image-parallax-status',
	},
	'bi-psp': {
		type: 'number',
		default: 4,
		longLabel: 'background-image-parallax-speed',
	},
	'bi-pd': {
		type: 'string',
		default: 'down',
		longLabel: 'background-image-parallax-direction',
	},
	'bi-pal': {
		type: 'string',
		longLabel: 'background-image-parallax-alt',
	},
	'bi-pas': {
		type: 'string',
		longLabel: 'background-image-parallax-alt-selector',
	},
	...prefixAttributesCreator({
		obj: { ...backgroundPosition, ...layerSize },
		prefix: 'biw', // background-image-wrapper-
	}),
};

export const rawBackgroundVideo = {
	'bv-mi': {
		type: 'number',
		longLabel: 'background-video-mediaID',
	},
	'bv-mu': {
		type: 'string',
		default: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
		longLabel: 'background-video-mediaURL',
	},
	'bv-sti': {
		type: 'string',
		longLabel: 'background-video-startTime',
	},
	'bv-eti': {
		type: 'string',
		longLabel: 'background-video-endTime',
	},
	'bv-loo': {
		type: 'boolean',
		default: false,
		longLabel: 'background-video-loop',
	},
	'bv-cp': {
		type: 'string',
		longLabel: 'background-video-clip-path',
	},
	'bv-cp.s': {
		type: 'boolean',
		default: false,
		longLabel: 'background-video-clip-path-status',
	},
	'bv-fi': {
		type: 'number',
		longLabel: 'background-video-fallbackID',
	},
	'bv-fu': {
		type: 'string',
		longLabel: 'background-video-fallbackURL',
	},
	'bv-pm': {
		type: 'boolean',
		default: false,
		longLabel: 'background-video-playOnMobile',
	},
	...prefixAttributesCreator({
		prefix: 'bi-', // background-video-
		obj: rawBgOpacity,
	}),
	'bv-rb': {
		type: 'boolean',
		default: false,
		longLabel: 'background-video-reduce-border',
	},
	...prefixAttributesCreator({
		obj: { ...backgroundPosition, ...layerSize },
		prefix: 'bvw-', // background-video-wrapper-
	}),
};

export const rawBackgroundGradient = {
	'bg-c': {
		type: 'string',
		longLabel: 'background-gradient-content',
	},
	...prefixAttributesCreator({
		prefix: 'bg-', // background-gradient-
		obj: rawBgOpacity,
	}),
	...prefixAttributesCreator({
		prefix: 'bg-', // background-gradient-
		obj: clipPathRaw,
	}),
	...prefixAttributesCreator({
		obj: { ...backgroundPosition, ...layerSize },
		prefix: 'bg-', // background-gradient-wrapper-
	}),
};

export const rawBackgroundSVG = {
	...paletteAttributesCreator({ prefix: 'bs-', palette: 5 }), // background-svg-
	'bg-se': {
		type: 'string',
		longLabel: 'background-svg-SVGElement',
	},
	'bg-sd': {
		type: 'object',
		longLabel: 'background-svg-SVGData',
	},
	'bg.t.u': {
		type: 'string',
		default: '%',
		longLabel: 'background-svg-top-unit',
	},
	...prefixAttributesCreator({
		obj: { ...backgroundPosition, ...layerSize },
		prefix: 'bs-', // background-svg-
	}),
};

export const background = breakpointAttributesCreator({
	obj: rawBackground,
});

export const backgroundColor = breakpointAttributesCreator({
	obj: rawBackgroundColor,
});

export const backgroundImage = breakpointAttributesCreator({
	obj: rawBackgroundImage,
	noBreakpointAttr: [
		'bi-mu', // 'background-image-mediaURL'
		'bi-mi', // 'background-image-mediaID'
		'bi-pal', // 'background-image-parallax-alt'
		'bi-pas', // 'background-image-parallax-alt-selector'
	],
});

export const backgroundVideo = breakpointAttributesCreator({
	obj: rawBackgroundVideo,
});

export const backgroundGradient = breakpointAttributesCreator({
	obj: rawBackgroundGradient,
});

export const backgroundSVG = breakpointAttributesCreator({
	obj: rawBackgroundSVG,
});
