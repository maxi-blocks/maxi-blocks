export const selectorsVideo = {
	canvas: {
		normal: {
			label: 'canvas',
			target: '',
		},
		hover: {
			label: 'canvas on hover',
			target: ':hover',
		},
	},
	'before canvas': {
		normal: {
			label: 'canvas ::before',
			target: '::before',
		},
		hover: {
			label: 'canvas ::before on hover',
			target: ':hover::before',
		},
	},
	'after canvas': {
		normal: {
			label: 'canvas ::after',
			target: '::after',
		},
		hover: {
			label: 'canvas ::after on hover',
			target: ':hover::after',
		},
	},
	video: {
		normal: {
			label: 'video',
			target: ' .maxi-video-block__video-player',
		},
		hover: {
			label: 'video on hover',
			target: ' .maxi-video-block__video-player:hover',
		},
	},
	overlay: {
		normal: {
			label: 'overlay',
			target: ' .maxi-video-block__overlay',
		},
		hover: {
			label: 'overlay on hover',
			target: ' .maxi-video-block__overlay:hover',
		},
	},
	'close icon': {
		normal: {
			label: 'close icon',
			target: ' .maxi-video-block__close-button',
		},
		svg: {
			label: "close icon's svg",
			target: ' .maxi-video-block__close-button svg',
		},
		insideSvg: {
			label: 'everything inside svg (svg > *)',
			target: ' .maxi-video-block__close-button svg > *',
		},
		path: {
			label: "svg's path",
			target: ' .maxi-video-block__close-button svg path',
		},
		hover: {
			label: 'close icon on hover',
			target: ' .maxi-video-block__close-button:hover',
		},
		hoverSvg: {
			label: "close icon's svg on hover",
			target: ' .maxi-video-block__close-button:hover svg',
		},
		hoverInsideSvg: {
			label: 'everything inside svg on hover (:hover svg > *)',
			target: ' .maxi-video-block__close-button:hover svg > *',
		},
		hoverPath: {
			label: "svg's path on hover",
			target: ' .maxi-video-block__close-button:hover svg path',
		},
	},
	'play icon': {
		normal: {
			label: 'play icon',
			target: ' .maxi-video-block__play-button',
		},
		svg: {
			label: "play icon's svg",
			target: ' .maxi-video-block__play-button svg',
		},
		insideSvg: {
			label: 'everything inside svg (svg > *)',
			target: ' .maxi-video-block__play-button svg > *',
		},
		path: {
			label: "svg's path",
			target: ' .maxi-video-block__play-button svg path',
		},
		hover: {
			label: 'play icon on hover',
			target: ' .maxi-video-block__play-button:hover',
		},
		hoverSvg: {
			label: "play icon's svg on hover",
			target: ' .maxi-video-block__play-button:hover svg',
		},
		hoverInsideSvg: {
			label: 'everything inside svg on hover (:hover svg > *)',
			target: ' .maxi-video-block__play-button:hover svg > *',
		},
		hoverPath: {
			label: "svg's path on hover",
			target: ' .maxi-video-block__play-button:hover svg path',
		},
	},
};

export const categoriesVideo = [
	'canvas',
	'video',
	'overlay',
	'close icon',
	'play icon',
];
