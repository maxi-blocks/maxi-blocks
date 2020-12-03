/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Layers
 */
export const colorOptions = {
	title: __('Background Colour', 'maxi-blocks'),
	type: 'color',
	options: {
		activeColor: '',
		color: '',
		clipPath: '',
	},
};

export const imageOptions = {
	title: __('Background Image', 'maxi-blocks'),
	type: 'image',
	options: {
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
};

export const videoOptions = {
	title: __('Background Video', 'maxi-blocks'),
	type: 'video',
	options: {
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
};

export const gradientOptions = {
	title: __('Background gradient', 'maxi-blocks'),
	type: 'gradient',
	options: {
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
};

export const SVGOptions = {
	title: __('Background Shape', 'maxi-blocks'),
	type: 'shape',
	options: {
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
