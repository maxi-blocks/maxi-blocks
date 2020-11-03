/**
 * WordPress dependencies
 */
const { __ } = wp.i18n;

/**
 * Layers
 */
export const colorOptions = {
	tittle: __('Background Colour', 'maxi-blocks'),
	type: 'color',
	activeColor: '',
	color: '',
	clipPath: '',
};

export const imageOptions = {
	tittle: __('Background Image', 'maxi-blocks'),
	type: 'image',
	items: [
		{
			imageData: {
				mediaID: '',
				mediaURL: '',
				width: 100,
				widthUnit: '%',
				height: 100,
				heightUnit: '%',
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
};

export const videoOptions = {
	tittle: __('Background Video', 'maxi-blocks'),
	type: 'video',
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
};

export const gradientOptions = {
	tittle: __('Background gradient', 'maxi-blocks'),
	type: 'gradient',
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
};

export const SVGOptions = {
	tittle: __('Background Shape', 'maxi-blocks'),
	type: 'shape',
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
};
