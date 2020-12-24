const background = {
	label: 'Background',
	activeMedia: '',
	layersOptions: {
		status: 0,
		layers: [],
	},
	colorOptions: {
		activeColor: '',
		color: '',
		gradient: '',
		gradientAboveBackground: false,
		clipPath: '',
		gradientOpacity: {
			opacity: {
				label: 'Opacity',
				general: {
					opacity: 1,
				},
			},
		},
	},
	imageOptions: {
		items: [
			{
				imageData: {
					mediaID: '',
					mediaURL: '',
					width: 100,
					widthUnit: '%',
					height: 100,
					heightUnit: '%',
					cropOptions: {
						image: {
							source_url: '',
							width: '',
							height: '',
						},
						crop: {
							unit: '',
							x: 0,
							y: 0,
							width: 0,
							height: 0,
							scale: 100,
						},
					},
				},
				sizeSettings: {
					size: '',
					widthUnit: '',
					width: '',
					heightUnit: '',
					height: '',
				},
				repeat: 'no-repeat',
				positionOptions: {
					position: 'center center',
					widthUnit: '%',
					width: 0,
					heightUnit: '%',
					height: 0,
				},
				origin: 'padding-box',
				clip: 'border-box',
				attachment: 'scroll',
			},
		],
		clipPath: '',
		opacity: {
			label: 'Opacity',
			general: {
				opacity: 1,
			},
		},
	},
	videoOptions: {
		mediaID: '',
		mediaURL: '',
		startTime: '',
		endTime: '',
		loop: 0,
		clipPath: '',
		fallbackID: '',
		fallbackURL: '',
		playOnMobile: 0,
		opacity: {
			label: 'Opacity',
			general: {
				opacity: 1,
			},
		},
	},
	SVGOptions: {
		SVGCurrentElement: '',
		SVGElement: '',
		SVGData: '{}',
		SVGMediaID: '',
		SVGMediaURL: '',
		position: {
			label: 'Background SVG position',
			general: {
				topUnit: '%',
				top: '',
				leftUnit: '%',
				left: '',
			},
		},
		size: '',
	},
};

export default background;
