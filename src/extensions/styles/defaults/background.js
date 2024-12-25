import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';
import paletteAttributesCreator from '@extensions/styles/paletteAttributesCreator';
import prefixAttributesCreator from '@extensions/styles/prefixAttributesCreator';
import { rawPosition } from './position';
import { clipPathRaw } from './clipPath';
import { dynamicContent } from './dynamicContent';

const prefix = 'background-';

// eslint-disable-next-line no-unused-vars
const { position, ...backgroundPosition } = rawPosition;

export const blockBackground = {
	'background-layers': {
		type: 'array',
	},
	'background-layers-hover': {
		type: 'array',
	},
	'block-background-status-hover': {
		type: 'boolean',
		default: false,
	},
};

export const rawBackground = {
	'background-active-media': {
		type: 'string',
	},
};

const layerSize = {
	width: {
		type: 'number',
		default: 100,
	},
	'width-unit': {
		type: 'string',
		default: '%',
	},
	height: {
		type: 'number',
		default: 100,
	},
	'height-unit': {
		type: 'string',
		default: '%',
	},
};

export const rawBackgroundColor = {
	...paletteAttributesCreator({ prefix, palette: 1 }),

	...prefixAttributesCreator({
		prefix: 'background-color-',
		obj: clipPathRaw,
	}),

	...prefixAttributesCreator({
		obj: { ...backgroundPosition, ...layerSize },
		prefix: 'background-color-wrapper-',
	}),
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
	'background-image-opacity': {
		type: 'number',
		default: 1,
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
	...prefixAttributesCreator({
		prefix: 'background-image-',
		obj: clipPathRaw,
	}),
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
	...prefixAttributesCreator({
		obj: { ...backgroundPosition, ...layerSize },
		prefix: 'background-image-wrapper-',
	}),
};

export const rawBackgroundVideo = {
	'background-video-mediaID': {
		type: 'number',
	},
	'background-video-mediaURL': {
		type: 'string',
		default: 'https://www.youtube.com/watch?v=ScMzIvxBSi4',
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
	'background-video-clip-path-status': {
		type: 'boolean',
		default: false,
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
	...prefixAttributesCreator({
		obj: { ...backgroundPosition, ...layerSize },
		prefix: 'background-video-wrapper-',
	}),
};

export const rawBackgroundGradient = {
	'background-gradient': {
		type: 'string',
	},
	'background-gradient-opacity': {
		type: 'number',
		default: 1,
	},
	...prefixAttributesCreator({
		prefix: 'background-gradient-',
		obj: clipPathRaw,
	}),
	...prefixAttributesCreator({
		obj: { ...backgroundPosition, ...layerSize },
		prefix: 'background-gradient-wrapper-',
	}),
};

export const rawBackgroundSVG = {
	...paletteAttributesCreator({ prefix: 'background-svg-', palette: 5 }),
	'background-svg-SVGElement': {
		type: 'string',
	},
	'background-svg-SVGData': {
		type: 'object',
	},
	'background-svg-top-unit': {
		type: 'string',
		default: '%',
	},
	...prefixAttributesCreator({
		obj: { ...backgroundPosition, ...layerSize },
		prefix: 'background-svg-',
	}),
};

export const background = breakpointAttributesCreator({
	obj: rawBackground,
});

export const backgroundColor = breakpointAttributesCreator({
	obj: rawBackgroundColor,
});

export const backgroundImage = {
	...breakpointAttributesCreator({
		obj: rawBackgroundImage,
		noBreakpointAttr: [
			'background-image-mediaURL',
			'background-image-mediaID',
			'background-image-parallax-alt',
			'background-image-parallax-alt-selector',
		],
	}),
	...dynamicContent,
};

export const backgroundVideo = breakpointAttributesCreator({
	obj: rawBackgroundVideo,
});

export const backgroundGradient = breakpointAttributesCreator({
	obj: rawBackgroundGradient,
});

export const backgroundSVG = breakpointAttributesCreator({
	obj: rawBackgroundSVG,
});
