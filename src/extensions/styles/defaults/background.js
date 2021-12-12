import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';

const prefix = 'background-';

export const blockBackground = {
	'background-layers': {
		type: 'array',
	},
	'background-layers-hover': {
		type: 'array',
	},
	'block-background-hover-status': {
		type: 'boolean',
		default: false,
	},
};

export const rawBackground = {
	'background-active-media': {
		type: 'string',
	},
};

export const rawBackgroundColor = {
	...paletteAttributesCreator({ prefix, palette: 1 }),
	'background-color-clip-path': {
		type: 'string',
	},
};

export const rawBackgroundImage = {
	'background-image-mediaID': {
		type: 'number',
	},
	'background-image-mediaURL': {
		type: 'string',
	},
	'background-image-size': {
		type: 'string',
		default: 'auto',
	},
	'background-image-width': {
		type: 'number',
		default: 100,
	},
	'background-image-width-unit': {
		type: 'string',
		default: '%',
	},
	'background-image-height': {
		type: 'number',
		default: 100,
	},
	'background-image-height-unit': {
		type: 'string',
		default: '%',
	},
	'background-image-crop-options': {
		type: 'object',
	},
	'background-image-repeat': {
		type: 'string',
		default: 'no-repeat',
	},
	'background-image-position': {
		type: 'string',
		default: 'center center',
	},
	'background-image-position-width-unit': {
		type: 'string',
		default: '%',
	},
	'background-image-position-width': {
		type: 'number',
		default: 0,
	},
	'background-image-position-height-unit': {
		type: 'string',
		default: '%',
	},
	'background-image-position-height': {
		type: 'number',
		default: 0,
	},
	'background-image-origin': {
		type: 'string',
		default: 'padding-box',
	},
	'background-image-clip': {
		type: 'string',
		default: 'border-box',
	},
	'background-image-attachment': {
		type: 'string',
		default: 'scroll',
	},
	'background-image-clip-path': {
		type: 'string',
	},
	'background-image-opacity': {
		type: 'number',
		default: 1,
	},
	'background-image-parallax-status': {
		type: 'boolean',
		default: false,
	},
	'background-image-parallax-speed': {
		type: 'number',
		default: 4,
	},
	'background-image-parallax-direction': {
		type: 'string',
		default: 'down',
	},
	'background-image-parallax-alt': {
		type: 'string',
	},
	'background-image-parallax-alt-selector': {
		type: 'string',
	},
};

export const rawBackgroundVideo = {
	'background-video-mediaID': {
		type: 'number',
	},
	'background-video-mediaURL': {
		type: 'string',
	},
	'background-video-startTime': {
		type: 'string',
	},
	'background-video-endTime': {
		type: 'string',
	},
	'background-video-loop': {
		type: 'boolean',
		default: false,
	},
	'background-video-clip-path': {
		type: 'string',
	},
	'background-video-fallbackID': {
		type: 'number',
	},
	'background-video-fallbackURL': {
		type: 'string',
	},
	'background-video-playOnMobile': {
		type: 'boolean',
		default: false,
	},
	'background-video-opacity': {
		type: 'number',
		default: 1,
	},
	'background-video-reduce-border': {
		type: 'boolean',
		default: false,
	},
};

export const rawBackgroundGradient = {
	'background-gradient': {
		type: 'string',
	},
	'background-gradient-opacity': {
		type: 'number',
		default: 1,
	},
	'background-gradient-clip-path': {
		type: 'string',
	},
};

export const rawBackgroundSVG = {
	...paletteAttributesCreator({ prefix: 'background-svg', palette: 5 }),
	'background-svg-SVGElement': {
		type: 'string',
	},
	'background-svg-SVGData': {
		type: 'object',
	},
	'background-svg-SVGMediaID': {
		type: 'number',
	},
	'background-svg-SVGMediaURL': {
		type: 'string',
	},
	'background-svg-top-unit': {
		type: 'string',
		default: '%',
	},
	'background-svg-position-top': {
		type: 'number',
		default: 0,
	},
	'background-svg-position-right': {
		type: 'number',
		default: 0,
	},
	'background-svg-position-bottom': {
		type: 'number',
		default: 0,
	},
	'background-svg-position-left': {
		type: 'number',
		default: 0,
	},
	'background-svg-position-unit': {
		type: 'string',
		default: '%',
	},
	'background-svg-position-sync': {
		type: 'string',
		default: 'all',
	},
	'background-svg-size': {
		type: 'number',
		default: 100,
	},
	'background-svg-size-unit': {
		type: 'string',
		default: '%',
	},
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
		'background-image-mediaURL',
		'background-image-mediaID',
		'background-image-parallax-alt',
		'background-image-parallax-alt-selector',
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
