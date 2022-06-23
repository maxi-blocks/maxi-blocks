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
};

export const categoriesVideo = ['canvas', 'video', 'overlay'];
