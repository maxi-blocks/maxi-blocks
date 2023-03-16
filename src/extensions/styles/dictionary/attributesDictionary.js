const dictionary = {
	accordion: {
		accordionLayout: 'al',
		autoPaneClose: 'apc',
		isCollapsible: 'ic',
		animationDuration: 'ad',
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
	searchButton: {
		buttonSkin: 'bs',
		iconRevealAction: 'ira',
		buttonContent: 'bc',
		buttonContentClose: 'bcc',
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
	mapMarker: {
		'map-marker': 'mma',
		'map-marker-icon': 'mmi',
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
	numberCounter: {
		'number-counter-width-auto': 'ncwa',
		'number-counter-status': 'ncsa',
		'number-counter-preview': 'ncp',
		'number-counter-percentage-sign-status': 'ncpss',
		'number-counter-rounded-status': 'ncrs',
		'number-counter-circle-status': 'nccs',
		'number-counter-start': 'ncsa',
		'number-counter-end': 'nce',
		'number-counter-stroke': 'ncst',
		'number-counter-duration': 'ncd',
		'number-counter-start-animation': 'ncsan',
		'number-counter-start-animation-offset': 'ncsao',
		'number-counter-circle-background-': 'nccbg',
		'number-counter-circle-bar': 'nccb',
		'number-counter-title-font-size': 'nctfs',
		'number-counter-text': 'nct',
	},
	divider: {
		'divider-border-top-width': 'dbtw',
		'divider-border-top-unit': 'dbtu',
		'divider-border-right-width': 'dbrw',
		'divider-border-right-unit': 'dbru',
		'divider-border-radius': 'dbr',
		'divider-width': 'dw',
		'divider-width-unit': 'dwu',
		'divider-height': 'dh',
		'line-align': 'la',
		'line-vertical': 'lv',
		'line-horizontal': 'lh',
		'line-orientation': 'lo',
		'divider-box-shadow-status-hover': 'dbsh',
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
