/**
 * Layers
 */
export const colorOptions = {
	type: 'color',
	display: 'block',
	'background-palette-color-status': true,
	'background-palette-color': 1,
	'background-palette-opacity': 100,
	'background-color': '',
	'background-color-clip-path': '',
};

export const imageOptions = {
	type: 'image',
	display: 'block',
	'background-image-mediaID': '',
	'background-image-mediaURL': '',
	'background-image-size': '',
	'background-image-width': 100,
	'background-image-width-unit': '%',
	'background-image-height': 100,
	'background-image-height-unit': '%',
	'background-image-crop-options': null,
	'background-image-repeat': 'no-repeat',
	'background-image-position': 'center center',
	'background-image-position-width-unit': '%',
	'background-image-position-width': 0,
	'background-image-position-height-unit': '%',
	'background-image-position-height': 0,
	'background-image-origin': 'padding-box',
	'background-image-clip': 'border-box',
	'background-image-attachment': 'scroll',
	'background-image-clip-path': '',
	'background-image-opacity': 1,
};

export const videoOptions = {
	type: 'video',
	display: 'block',
	'background-video-mediaID': null,
	'background-video-mediaURL': '',
	'background-video-startTime': '',
	'background-video-endTime': '',
	'background-video-loop': false,
	'background-video-clipPath': '',
	'background-video-fallbackID': null,
	'background-video-fallbackURL': '',
	'background-video-opacity': 1,
};

export const gradientOptions = {
	type: 'gradient',
	display: 'block',
	'background-gradient': '',
	'background-gradient-opacity': 1,
	'background-gradient-clip-path': '',
};

export const SVGOptions = {
	type: 'shape',
	display: 'block',
	'background-palette-svg-color-status': true,
	'background-palette-svg-color': 5,
	'background-svg-SVGElement': '',
	'background-svg-SVGData': {},
	'background-svg-SVGMediaID': null,
	'background-svg-SVGMediaURL': '',
	'background-svg-top-unit': '%',
	'background-svg-top': 0,
	'background-svg-left-unit': '%',
	'background-svg-left': 50,
	'background-svg-size': 100,
	'background-svg-size-unit': '%',
};
