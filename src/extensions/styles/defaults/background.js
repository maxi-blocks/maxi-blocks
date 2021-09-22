export const background = {
	'background-active-media': {
		type: 'string',
	},
	'background-layers': {
		type: 'array',
	},
	'background-layers-status': {
		type: 'boolean',
		default: false,
	},
};

export const backgroundColor = {
	'background-palette-color-status': {
		type: 'boolean',
		default: true,
	},
	'background-palette-color': {
		type: 'number',
		default: 1,
	},
	'background-palette-opacity': {
		type: 'number',
	},
	'background-color': {
		type: 'string',
	},
	'background-color-clip-path': {
		type: 'string',
	},
};

export const backgroundImage = {
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
};

export const backgroundVideo = {
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
		default: 100,
	},
};

export const backgroundGradient = {
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

export const backgroundSVG = {
	'background-palette-svg-color-status': {
		type: 'boolean',
		default: true,
	},
	'background-palette-svg-color': {
		type: 'number',
		default: 5,
	},
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
	'background-svg-top--unit': {
		type: 'string',
		default: '%',
	},
	'background-svg-top': {
		type: 'number',
		default: 0,
	},
	'background-svg-left--unit': {
		type: 'string',
		default: '%',
	},
	'background-svg-left': {
		type: 'number',
		default: 50,
	},
	'background-svg-size': {
		type: 'number',
		default: 100,
	},
	'background-svg-size--unit': {
		type: 'string',
		default: '%',
	},
};
