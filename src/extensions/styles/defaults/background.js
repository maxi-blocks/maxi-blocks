export const background = {
	'background-active-media': {
		type: 'string',
		default: '',
	},
	'background-layers': {
		type: 'array',
		default: [],
	},
};

export const backgroundColor = {
	'background-color': {
		type: 'string',
		default: '',
	},
	'background-color-clip-path': {
		type: 'string',
		default: '',
	},
};

export const backgroundImage = {
	'background-image-mediaID': {
		type: 'string',
		default: '',
	},
	'background-image-mediaURL': {
		type: 'string',
		default: '',
	},
	'background-image-size': {
		type: 'string',
		default: '',
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
		default: '',
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
		default: '',
	},
	'background-video-startTime': {
		type: 'string',
		default: '',
	},
	'background-video-endTime': {
		type: 'string',
		default: '',
	},
	'background-video-loop': {
		type: 'boolean',
		default: false,
	},
	'background-video-clip-path': {
		type: 'string',
		default: '',
	},
	'background-video-fallbackID': {
		type: 'number',
	},
	'background-video-fallbackURL': {
		type: 'string',
		default: '',
	},
	'background-video-playOnMobile': {
		type: 'boolean',
		default: false,
	},
	'background-video-opacity': {
		type: 'number',
		default: 1,
	},
};

export const backgroundGradient = {
	'background-gradient': {
		type: 'string',
		default: '',
	},
	'background-gradient-opacity': {
		type: 'number',
		default: 1,
	},
	'background-gradient-clip-path': {
		type: 'string',
		default: '',
	},
};

export const backgroundSVG = {
	'background-svg-SVGCurrentElement': {
		type: 'string',
		default: '',
	},
	'background-svg-SVGElement': {
		type: 'string',
		default: '',
	},
	'background-svg-SVGData': {
		type: 'object',
		default: {
			type: 'object',
		},
	},
	'background-svg-SVGMediaID': {
		type: 'number',
	},
	'background-svg-SVGMediaURL': {
		type: 'string',
		default: '',
	},
	'background-svg-top--unit': {
		type: 'string',
		default: '%',
	},
	'background-svg-top': {
		type: 'number',
	},
	'background-svg-left--unit': {
		type: 'string',
		default: '%',
	},
	'background-svg-left': {
		type: 'number',
	},
	'background-svg-size': {
		type: 'string',
		default: '',
	},
};
