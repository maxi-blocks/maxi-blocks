const dictionary = {
	accordion: {
		accordionLayout: 'al',
		autoPaneClose: 'apc',
		isCollapsible: 'ic',
		animationDuration: 'ad',
	},
	border: {
		'border-style': 'bs',
		'border-top-width': 'btw',
		'border-right-width': 'brw',
		'border-bottom-width': 'bbw',
		'border-left-width': 'blw',
		'border-sync-width': 'bsw',
		'border-unit-width': 'buw',
		'border-top-left-radius': 'btlr',
		'border-top-right-radius': 'btrr',
		'border-bottom-right-radius': 'bbrr',
		'border-bottom-left-radius': 'bblr',
		'border-sync-radius': 'bsr',
		'border-unit-radius': 'bur',
	},
	clipPath: {
		'clip-path': 'cp',
		'clip-path-status': 'cp-status',
	},
	textAlignment: {
		'text-alignment': 'ta',
	},
	alignment: {
		alignment: 'a',
	},
	size: {
		'size-advanced-options': 'sao',
		'width-fit-content': 'wfc',
		'force-aspect-ratio': 'far',
		'full-width': 'fw',
		'max-width-unit': 'mwu',
		'max-height-unit': 'mhu',
		'min-width-unit': 'miwu',
		'min-height-unit': 'mihu',
		'width-unit': 'wu',
		'height-unit': 'hu',
		'max-width': 'mw',
		'max-height': 'mh',
		'min-width': 'miw',
		'min-height': 'mih',
		width: 'w',
		height: 'h',
	},
	margin: {
		'margin-top': 'mt',
		'margin-right': 'mr',
		'margin-bottom': 'mb',
		'margin-left': 'ml',
		'margin-sync': 'ms',
		'margin-top-unit': 'mtu',
		'margin-right-unit': 'mru',
		'margin-bottom-unit': 'mbu',
		'margin-left-unit': 'mlu',
	},
	customCss: {
		'custom-css': 'cc',
	},
	display: {
		display: 'd',
	},
	displayHover: {
		'display-hover': 'dh',
	},
	opacity: {
		opacity: 'o',
	},
	padding: {
		'padding-top': 'pt',
		'padding-right': 'pr',
		'padding-bottom': 'pb',
		'padding-left': 'pl',
		'padding-sync': 'ps',
		'padding-top-unit': 'ptu',
		'padding-right-unit': 'pru',
		'padding-bottom-unit': 'pbu',
		'padding-left-unit': 'plu',
	},
	placeholderColor: {
		'placeholder-color': 'pc',
		'placeholder-color-unit': 'pcu',
	},
	overflow: {
		'overflow-x': 'ox',
		'overflow-y': 'oy',
	},
	zIndex: {
		'z-index': 'zi',
	},
	position: {
		position: 'ps',
		'position-top': 'pst',
		'position-right': 'psr',
		'position-bottom': 'psb',
		'position-left': 'psl',
		'position-sync': 'pss',
		'position-top-unit': 'pstu',
		'position-right-unit': 'psru',
		'position-bottom-unit': 'psbu',
		'position-left-unit': 'pslu',
	},
	imageShape: {
		'image-shape-scale': 'ishs',
		'image-shape-rotate': 'ishr',
		'image-shape-flip-x': 'ishfx',
		'image-shape-flip-y': 'ishfy',
	},
	arrow: {
		'arrow-status': 'ast',
		'arrow-side': 'asi',
		'arrow-position': 'apos',
		'arrow-width': 'awi',
	},
	flex: {
		'flex-grow': 'fg',
		'flex-shrink': 'fs',
		'flex-basis': 'fb',
		'flex-basis-unit': 'fbu',
		'flex-wrap': 'fw',
		'justify-content': 'jc',
		'flex-direction': 'fd',
		'align-items': 'ai',
		'align-content': 'ac',
		'row-gap': 'rg',
		'row-gap-unit': 'rgu',
		'column-gap': 'cg',
		'column-gap-unit': 'cgu',
		order: '',
	},
	map: {
		'map-provider': 'mpp',
		'map-latitude': 'mpl',
		'map-longitude': 'mplo',
		'map-zoom': 'mpz',
		'map-min-zoom': 'mpmz',
		'map-max-zoom': 'mpmxz',
		'map-markers': 'mpm',
	},
	transform: {
		'transform-scale': 'ts',
		'transform-translate': 'ttt',
		'transform-rotate': 'tr',
		'transform-origin': 'to',
		'transform-target': 'tt',
	},
	accordionTitle: {
		'tite-typography-status-hover': 'tths',
		'tite-typography-status-active': 'ttas',
		'title-background-status': 'tbs',
		'title-background-status-hover': 'tbs',
		'title-background-status-active': 'tbs',
	},
	palette: {
		'palette-status': 'pa-status', // `-status` will be changed to `st` in Phase 2
		'palette-color': 'pac',
		'palette-opacity': 'pao',
		color: 'c',
	},
};

const flattenDictionary = dict => {
	const EXCLUDED_GROUPS = ['palette'];

	let response = {};

	Object.entries(dict).forEach(([key, val]) => {
		if (EXCLUDED_GROUPS.includes(key)) return;

		response = {
			...response,
			...val,
		};
	});

	return response;
};

// No type dictionary from long to short terms
export const noTypeDictionary = flattenDictionary(dictionary);

// Short to long terms
export const reversedDictionary = {
	...Object.entries(noTypeDictionary).reduce(
		(acc, [key, val]) => ({ ...acc, [val]: key }),
		{}
	),
};

export default dictionary;
