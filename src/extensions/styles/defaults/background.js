const breakpoints = ['xxl', 'xl', 'l', 'm', 's', 'xs'];

export const blockBackground = {
	'background-layers': {
		type: 'array',
	},
	'background-hover-status': {
		type: 'boolean',
		default: false,
	},
};

const backgroundGeneral = {
	'background-active-media-general': {
		type: 'string',
	},
};

const backgroundColorGeneral = {
	'background-palette-color-status-general': {
		type: 'boolean',
		default: true,
	},
	'background-palette-color-general': {
		type: 'number',
		default: 1,
	},
	'background-palette-opacity-general': {
		type: 'number',
	},
	'background-color-general': {
		type: 'string',
	},
	'background-color-clip-path-general': {
		type: 'string',
	},
};

const backgroundImageGeneral = {
	'background-image-mediaID-general': {
		type: 'number',
	},
	'background-image-mediaURL-general': {
		type: 'string',
	},
	'background-image-size-general': {
		type: 'string',
		default: 'auto',
	},
	'background-image-width-general': {
		type: 'number',
		default: 100,
	},
	'background-image-width-unit-general': {
		type: 'string',
		default: '%',
	},
	'background-image-height-general': {
		type: 'number',
		default: 100,
	},
	'background-image-height-unit-general': {
		type: 'string',
		default: '%',
	},
	'background-image-crop-options-general': {
		type: 'object',
	},
	'background-image-repeat-general': {
		type: 'string',
		default: 'no-repeat',
	},
	'background-image-position-general': {
		type: 'string',
		default: 'center center',
	},
	'background-image-position-width-unit-general': {
		type: 'string',
		default: '%',
	},
	'background-image-position-width-general': {
		type: 'number',
		default: 0,
	},
	'background-image-position-height-unit-general': {
		type: 'string',
		default: '%',
	},
	'background-image-position-height-general': {
		type: 'number',
		default: 0,
	},
	'background-image-origin-general': {
		type: 'string',
		default: 'padding-box',
	},
	'background-image-clip-general': {
		type: 'string',
		default: 'border-box',
	},
	'background-image-attachment-general': {
		type: 'string',
		default: 'scroll',
	},
	'background-image-clip-path-general': {
		type: 'string',
	},
	'background-image-opacity-general': {
		type: 'number',
		default: 1,
	},
};

const backgroundVideoGeneral = {
	'background-video-mediaID-general': {
		type: 'number',
	},
	'background-video-mediaURL-general': {
		type: 'string',
	},
	'background-video-startTime-general': {
		type: 'string',
	},
	'background-video-endTime-general': {
		type: 'string',
	},
	'background-video-loop-general': {
		type: 'boolean',
		default: false,
	},
	'background-video-clip-path-general': {
		type: 'string',
	},
	'background-video-fallbackID-general': {
		type: 'number',
	},
	'background-video-fallbackURL-general': {
		type: 'string',
	},
	'background-video-playOnMobile-general': {
		type: 'boolean',
		default: false,
	},
	'background-video-opacity-general': {
		type: 'number',
		default: 100,
	},
};

const backgroundGradientGeneral = {
	'background-gradient-general': {
		type: 'string',
	},
	'background-gradient-opacity-general': {
		type: 'number',
		default: 1,
	},
	'background-gradient-clip-path-general': {
		type: 'string',
	},
};

const backgroundSVGGeneral = {
	'background-palette-svg-color-status-general': {
		type: 'boolean',
		default: true,
	},
	'background-palette-svg-color-general': {
		type: 'number',
		default: 5,
	},
	'background-palette-svg-opacity-general': {
		type: 'number',
	},
	'background-svg-SVGElement-general': {
		type: 'string',
	},
	'background-svg-SVGData-general': {
		type: 'object',
	},
	'background-svg-SVGMediaID-general': {
		type: 'number',
	},
	'background-svg-SVGMediaURL-general': {
		type: 'string',
	},
	'background-svg-top-unit-general': {
		type: 'string',
		default: '%',
	},
	'background-svg-top-general': {
		type: 'number',
		default: 0,
	},
	'background-svg-left-unit-general': {
		type: 'string',
		default: '%',
	},
	'background-svg-left-general': {
		type: 'number',
		default: 50,
	},
	'background-svg-size-general': {
		type: 'number',
		default: 100,
	},
	'background-svg-size-unit-general': {
		type: 'string',
		default: '%',
	},
};

const breakpointObjectCreator = obj => {
	const response = { ...obj };

	Object.entries(obj).forEach(([key, val]) => {
		const newVal = { ...val };
		delete newVal.default;

		if (['background-layers'].includes(key)) return;

		breakpoints.forEach(breakpoint => {
			const newKey = key.replace('general', breakpoint);

			response[newKey] = newVal;
		});
	});

	return response;
};

export const background = breakpointObjectCreator(backgroundGeneral);
export const backgroundColor = breakpointObjectCreator(backgroundColorGeneral);
export const backgroundImage = breakpointObjectCreator(backgroundImageGeneral);
export const backgroundVideo = breakpointObjectCreator(backgroundVideoGeneral);
export const backgroundGradient = breakpointObjectCreator(
	backgroundGradientGeneral
);
export const backgroundSVG = breakpointObjectCreator(backgroundSVGGeneral);
