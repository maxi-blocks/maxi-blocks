const video = {
	url: {
		type: 'string',
	},
	embedUrl: {
		type: 'string',
	},
	'video-cover-img-url': {
		type: 'string',
	},
	startTime: {
		type: 'string',
	},
	endTime: {
		type: 'string',
	},
	isLightbox: {
		type: 'boolean',
		default: false,
	},
	isLoop: {
		type: 'boolean',
		default: false,
	},
	isMuted: {
		type: 'boolean',
		default: false,
	},
	isAutoplay: {
		type: 'boolean',
		default: false,
	},
	showPlayerControls: {
		type: 'boolean',
		default: false,
	},
	reduceBorders: {
		type: 'boolean',
		default: false,
	},
};

export default video;
