import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { rawPosition } from './position';
import { clipPathRaw } from './clipPath';

// eslint-disable-next-line no-unused-vars
const { position, ...backgroundPosition } = rawPosition;

const rawBgOpacity = {
	_o: {
		type: 'number',
		default: 1,
		longLabel: 'opacity',
	},
};

export const blockBackground = {
	b_ly: {
		type: 'array',
		longLabel: 'background-layers',
	},
	'b_ly.h': {
		type: 'array',
		longLabel: 'background-layers-hover',
	},
	'bb.sh': {
		type: 'boolean',
		default: false,
		longLabel: 'block-background-status-hover',
	},
};

export const rawBackground = {
	b_am: {
		type: 'string',
		longLabel: 'background-active-media',
	},
};

const layerSize = {
	_w: {
		type: 'number',
		default: 100,
		longLabel: 'width',
	},
	'_w.u': {
		type: 'string',
		default: '%',
		longLabel: 'width-unit',
	},
	_h: {
		type: 'number',
		default: 100,
		longLabel: 'height',
	},
	'_h.u': {
		type: 'string',
		default: '%',
		longLabel: 'height-unit',
	},
};

export const rawBackgroundColor = {
	...paletteAttributesCreator({
		prefix: 'bc-',
		longPrefix: 'background-color-',
		palette: 1,
	}),

	...prefixAttributesCreator({
		prefix: 'bc-',
		longPrefix: 'background-color-',
		obj: clipPathRaw,
	}),

	...prefixAttributesCreator({
		obj: { ...backgroundPosition, ...layerSize },
		prefix: 'bcw-',
		longPrefix: 'background-color-wrapper-',
	}),
};

export const rawBackgroundImage = {
	bi_mi: {
		type: 'number',
		longLabel: 'background-image-mediaID',
	},
	bi_mu: {
		type: 'string',
		longLabel: 'background-image-mediaURL',
	},
	bi_si: {
		type: 'string',
		default: 'auto',
		longLabel: 'background-image-size',
	},
	...prefixAttributesCreator({
		obj: layerSize,
		prefix: 'bi-',
		longPrefix: 'background-image-',
	}),
	bi_co: {
		type: 'object',
		longLabel: 'background-image-crop-options',
	},
	bi_re: {
		type: 'string',
		default: 'no-repeat',
		longLabel: 'background-image-repeat',
	},
	bi_pos: {
		type: 'string',
		default: 'center center',
		longLabel: 'background-image-position',
	},
	'bi_pos_w.u': {
		type: 'string',
		default: '%',
		longLabel: 'background-image-position-width-unit',
	},
	bi_pos_w: {
		type: 'number',
		default: 0,
		longLabel: 'background-image-position-width',
	},
	'bi_pos_h.u': {
		type: 'string',
		default: '%',
		longLabel: 'background-image-position-height-unit',
	},
	bi_pos_h: {
		type: 'number',
		default: 0,
		longLabel: 'background-image-position-height',
	},
	bi_ori: {
		type: 'string',
		default: 'padding-box',
		longLabel: 'background-image-origin',
	},
	...prefixAttributesCreator({
		prefix: 'bi-',
		longPrefix: 'background-image-',
		obj: rawBgOpacity,
	}),
	bi_clp: {
		type: 'string',
		default: 'border-box',
		longLabel: 'background-image-clip',
	},
	bi_at: {
		type: 'string',
		default: 'scroll',
		longLabel: 'background-image-attachment',
	},
	bi_cp: {
		type: 'string',
		longLabel: 'background-image-clip-path',
	},
	...prefixAttributesCreator({
		prefix: 'bi-',
		longPrefix: 'background-image-',
		obj: clipPathRaw,
	}),
	'bi_pa.s': {
		type: 'boolean',
		default: false,
		longLabel: 'background-image-parallax-status',
	},
	bi_psp: {
		type: 'number',
		default: 4,
		longLabel: 'background-image-parallax-speed',
	},
	bi_pd: {
		type: 'string',
		default: 'down',
		longLabel: 'background-image-parallax-direction',
	},
	bi_pal: {
		type: 'string',
		longLabel: 'background-image-parallax-alt',
	},
	bi_pas: {
		type: 'string',
		longLabel: 'background-image-parallax-alt-selector',
	},
	...prefixAttributesCreator({
		obj: { ...backgroundPosition, ...layerSize },
		prefix: 'biw',
		longPrefix: 'background-image-wrapper-',
	}),
};

export const rawBackgroundVideo = {
	bv_mi: {
		type: 'number',
		longLabel: 'background-video-mediaID',
	},
	bv_mu: {
		type: 'string',
		default: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
		longLabel: 'background-video-mediaURL',
	},
	bv_sti: {
		type: 'string',
		longLabel: 'background-video-startTime',
	},
	bv_et: {
		type: 'string',
		longLabel: 'background-video-endTime',
	},
	bv_loo: {
		type: 'boolean',
		default: false,
		longLabel: 'background-video-loop',
	},
	bv_cp: {
		type: 'string',
		longLabel: 'background-video-clip-path',
	},
	'bv_cp.s': {
		type: 'boolean',
		default: false,
		longLabel: 'background-video-clip-path-status',
	},
	bv_fi: {
		type: 'number',
		longLabel: 'background-video-fallbackID',
	},
	bv_fu: {
		type: 'string',
		longLabel: 'background-video-fallbackURL',
	},
	bv_pm: {
		type: 'boolean',
		default: false,
		longLabel: 'background-video-playOnMobile',
	},
	...prefixAttributesCreator({
		prefix: 'bv-',
		longPrefix: 'background-video-',
		obj: rawBgOpacity,
	}),
	bv_rb: {
		type: 'boolean',
		default: false,
		longLabel: 'background-video-reduce-border',
	},
	...prefixAttributesCreator({
		obj: { ...backgroundPosition, ...layerSize },
		prefix: 'bvw-',
		longPrefix: 'background-video-wrapper-',
	}),
};

export const rawBackgroundGradient = {
	bg_c: {
		type: 'string',
		longLabel: 'background-gradient-content',
	},
	...prefixAttributesCreator({
		prefix: 'bg-',
		longPrefix: 'background-gradient-',
		obj: rawBgOpacity,
	}),
	...prefixAttributesCreator({
		prefix: 'bg-',
		longPrefix: 'background-gradient-',
		obj: clipPathRaw,
	}),
	...prefixAttributesCreator({
		obj: { ...backgroundPosition, ...layerSize },
		prefix: 'bgw-',
		longPrefix: 'background-gradient-wrapper-',
	}),
};

export const rawBackgroundSVG = {
	...paletteAttributesCreator({
		prefix: 'bsv-',
		longPrefix: 'background-svg-',
		palette: 5,
	}),
	bsv_se: {
		type: 'string',
		longLabel: 'background-svg-SVGElement',
	},
	bsv_sd: {
		type: 'object',
		longLabel: 'background-svg-SVGData',
	},
	'bsv.t.u': {
		type: 'string',
		default: '%',
		longLabel: 'background-svg-top-unit',
	},
	...prefixAttributesCreator({
		obj: { ...backgroundPosition, ...layerSize },
		prefix: 'bsv-',
		longPrefix: 'background-svg-',
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
		'bi_mu', // 'background-image-mediaURL'
		'bi_mi', // 'background-image-mediaID'
		'bi_pal', // 'background-image-parallax-alt'
		'bi_pas', // 'background-image-parallax-alt-selector'
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
