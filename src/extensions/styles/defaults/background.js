import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import prefixAttributesCreator from '../prefixAttributesCreator';
import { rawPosition } from './position';
import { clipPathRaw } from './clipPath';
import attributesShorter from '../dictionary/attributesShorter';

const prefix = 'background-';

// eslint-disable-next-line no-unused-vars
const { position, ...backgroundPosition } = rawPosition;

const rawBgOpacity = attributesShorter(
	{
		opacity: {
			type: 'number',
			default: 1,
		},
	},
	'opacity'
);

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
	...prefixAttributesCreator({
		prefix: 'background-image-',
		obj: rawBgOpacity,
	}),
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
	...prefixAttributesCreator({
		prefix: 'background-video-',
		obj: rawBgOpacity,
	}),
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
	...prefixAttributesCreator({
		prefix: 'background-gradient-',
		obj: rawBgOpacity,
	}),
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

export const background = attributesShorter(
	breakpointAttributesCreator({
		obj: rawBackground,
	}),
	'background'
);

export const backgroundColor = attributesShorter(
	breakpointAttributesCreator({
		obj: rawBackgroundColor,
	}),
	'background'
);

export const backgroundImage = attributesShorter(
	breakpointAttributesCreator({
		obj: rawBackgroundImage,
		noBreakpointAttr: [
			'background-image-mediaURL',
			'background-image-mediaID',
			'background-image-parallax-alt',
			'background-image-parallax-alt-selector',
		],
	}),
	'background'
);

export const backgroundVideo = attributesShorter(
	breakpointAttributesCreator({
		obj: rawBackgroundVideo,
	}),
	'background'
);

export const backgroundGradient = attributesShorter(
	breakpointAttributesCreator({
		obj: rawBackgroundGradient,
	}),
	'background'
);

export const backgroundSVG = attributesShorter(
	breakpointAttributesCreator({
		obj: rawBackgroundSVG,
	}),
	'background'
);
