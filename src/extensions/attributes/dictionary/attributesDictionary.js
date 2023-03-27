const dictionary = {
	common: {
		width: 'w',
		height: 'h',
		position: 'pos',
		content: 'c',
		svgType: 'st',
		both: 'b',
		'clip-path': 'cp',
		preview: 'pr',
		opacity: 'o',
		stroke: 'str',
		origin: 'ori',
		scale: 'sc',
		rotate: 'rot',
		type: 'ty',
		link: 'l',
		startTime: 'sti',
		endTime: 'eti',
		isLoop: 'il',
		isAutoplay: 'ia',
	},
	accordion: {
		accordionLayout: 'acl',
		autoPaneClose: 'apc',
		isCollapsible: 'ico',
		animationDuration: 'ad',
	},
	accordionIcon: {},
	accordionLine: {
		line: 'li',
	},
	accordionTitle: {
		titleLevel: 'tl',
	},
	alignment: {
		alignment: 'a',
	},
	arrow: {
		side: 'sid',
		'show-warning-box': 'swb',
	},
	arrowIcon: {
		first: 'fi',
		second: 'sec',
		'spacing-vertical': 'sv',
		'spacing-horizontal': 'sh',
		// shadow: 'sha',
	},
	arrowIconHover: {},
	background: {
		'background-layers': 'bl',
		'background-active-media': 'bam',
		mediaID: 'me',
		mediaURL: 'mu',
		size: 'si',
		'crop-options': 'co',
		repeat: 're',
		'position-width': 'pw',
		'position-height': 'ph',
		clip: 'clp',
		attachment: 'at',
		'parallax-speed': 'psp',
		'parallax-direction': 'pd',
		'parallax-alt': 'pal',
		'parallax-alt-selector': 'pas',
		parallax: 'pa',
		loop: 'loo',
		fallbackID: 'fi',
		fallbackURL: 'fu',
		playOnMobile: 'pm',
		'reduce-border': 'rb',
		SVGElement: 'se',
		SVGData: 'sd',
	},
	backgroundActive: {},
	backgroundHover: {},
	border: {
		style: 's',
	},
	borderActive: {},
	borderHover: {},
	boxShadow: {
		inset: 'in',
		horizontal: 'ho',
		vertical: 'v',
		blur: 'blu',
		spread: 'sp',
	},
	boxShadowActive: {},
	boxShadowHover: {},
	breakpoints: {
		breakpoints: 'bp',
	},
	clipPath: {},
	clipPathHover: {},
	columnSize: {
		'column-size': 'cs',
		'column-fit-content': 'cfc',
	},
	customCss: {
		'custom-css': 'cc',
	},
	display: {
		display: 'd',
	},
	displayHover: {},
	divider: {
		'divider-border': 'db',
		'divider-width': 'dw',
		'divider-height': 'dh',
		'line-align': 'la',
		'line-vertical': 'lv',
		'line-horizontal': 'lh',
		'line-orientation': 'loc',
	},
	dividerHover: {},
	dotIcon: {
		'spacing-between': 'sb',
	},
	dotIconActive: {},
	dotIconHover: {},
	dynamicContent: {
		error: 'er',
		relation: 'rel',
		id: 'id',
		author: 'au',
		show: 'sho',
		field: 'f',
		format: 'fo',
		'custom-format': 'cfo',
		'custom-date': 'cd',
		year: 'y',
		month: 'mo',
		day: 'da',
		hour: 'hou',
		hour12: 'h12',
		minute: 'min',
		second: 'sec',
		locale: 'loc',
		timezone: 'tz',
		'timezone-name': 'tzn',
		weekday: 'wd',
		era: 'era',
		limit: 'lim',
		'media-id': 'mid',
		'media-url': 'mur',
		'media-caption': 'mc',
		'link-url': 'lur',
	},
	flex: {
		'flex-grow': 'fg',
		'flex-shrink': 'fls',
		'flex-basis': 'fb',
		'flex-wrap': 'flw',
		'justify-content': 'jc',
		'flex-direction': 'fd',
		'align-items': 'ai',
		'align-content': 'ac',
		'row-gap': 'rg',
		'column-gap': 'cg',
		order: 'or',
	},
	global: {
		'maxi-version-current': 'mvc',
		'maxi-version-origin': 'mvo',
		blockStyle: 'bs',
		extraClassName: 'ecn',
		anchorLink: 'al',
		isFirstOnHierarchy: 'ioh',
		linkSettings: 'lse',
		uniqueID: 'uid',
		customLabel: 'cl',
		relations: 'r',
	},
	hover: {
		extension: 'ex',
		'basic-effect-type': 'bet',
		'text-effect-type': 'tety',
		'text-preset': 'tp',
		'transition-easing': 'te',
		'transition-easing-cubic-bezier': 'tecb',
		'transition-duration': 'tdu',
		'basic-zoom-in-value': 'bziv',
		'basic-zoom-out-value': 'bzov',
		'basic-slide-value': 'bsv',
		'basic-rotate-value': 'brv',
		'basic-blur-value': 'bbv',
	},
	icon: {
		inherit: 'i',
		only: 'on',
		spacing: 'spa',
	},
	iconBorder: {},
	iconBorderHover: {},
	iconHover: {},
	imageShape: {
		'flip-x': 'fx',
		'flip-y': 'fy',
	},
	link: {
		'link-hover': 'lih',
		'link-active': 'lia',
		'link-visited': 'liv',
	},
	map: {
		provider: 'pro',
		latitude: 'lat',
		longitude: 'lon',
		zoom: 'z',
		'min-zoom': 'mz',
		'max-zoom': 'mxz',
		markers: 'mar',
	},
	mapInteraction: {
		dragging: 'dr',
		'touch-zoom': 'tz',
		'double-click-zoom': 'dcz',
		'scroll-wheel-zoom': 'swz',
	},
	mapMarker: {
		marker: 'ma',
		'marker-icon': 'mi',
	},
	mapPopup: {},
	mapPopupText: {
		'marker-heading-level': 'mhl',
	},
	margin: {
		margin: 'm',
	},
	navigation: {},
	numberCounter: {
		'width-auto': 'wa',
		'percentage-sign': 'psi',
		rounded: 'rou',
		circle: 'ci',
		start: 'sta',
		end: 'e',
		duration: 'du',
		'start-animation': 'san',
		'start-animation-offset': 'saof',
	},
	opacity: {},
	opacityHover: {},
	overflow: {
		'overflow-x': 'ox',
		'overflow-y': 'oy',
	},
	padding: {
		padding: 'p',
	},
	placeholderColor: {},
	position: {},
	rowPattern: {
		'row-pattern': 'rp',
	},
	scroll: {
		// It's a whole world lol
	},
	searchButton: {
		buttonSkin: 'bus',
		iconRevealAction: 'ira',
		buttonContent: 'bc',
		buttonContentClose: 'bcc',
	},
	shape: {
		'shape-width': 'sw',
	},
	shapeDivider: {
		'shape-style': 'ss',
		effects: 'ef',
	},
	size: {
		'size-advanced-options': 'sao',
		'width-fit-content': 'wfc',
		'force-aspect-ratio': 'far',
		'full-width': 'fw',
		'max-width': 'mw',
		'max-height': 'mh',
		'min-width': 'miw',
		'min-height': 'mih',
	},
	slider: {
		isEditView: 'iev',
		numberOfSlides: 'nos',
		pauseOnHover: 'poh',
		pauseOnInteraction: 'poi',
		'slider-autoplay-speed': 'sas',
		'slider-transition': 'slt',
		'slider-transition-speed': 'sts',
	},
	svg: {
		svg: 'svg',
	},
	textAlignment: {
		'text-alignment': 'ta',
	},
	transform: {
		translate: 'tr',
		target: 'tar',
	},
	transition: {
		transition: 't',
		'transition-change-all': 'tca',
	},
	typography: {
		'font-family': 'ff',
		'font-size': 'fs',
		'line-height': 'lhe',
		'letter-spacing': 'ls',
		'font-weight': 'fwe',
		'text-transform': 'ttr',
		'font-style': 'fst',
		'text-decoration': 'td',
		'text-indent': 'ti',
		'text-shadow': 'tsh',
		'vertical-align': 'va',
		'custom-formats': 'cf',
		'text-orientation': 'to',
		'text-direction': 'tdi',
		'white-space': 'ws',
		'word-spacing': 'wsp',
		'bottom-gap': 'bg',
	},
	typographyHover: {},
	video: {
		url: 'u',
		embedUrl: 'eu',
		endTime: 'et',
		videoRatio: 'vr',
		popupRatio: 'pra',
		videoType: 'vt',
		isLoop: 'vil',
		isMuted: 'im',
		showPlayerControls: 'spc',
		playerType: 'pt',
		hideImage: 'hi',
		popAnimation: 'pan',
	},
	videoOverlay: {
		altSelector: 'as',
		mediaAlt: 'mal',
	},
	videoPopup: {},
	zIndex: {
		'z-index': 'zi',
	},
};

export const prefixesDictionary = {
	'active-': 'a-',
	'header-': 'he-',
	'content-': 'c-',
	'title-': 'ti-',
	'background-color-wrapper-': 'bcw-',
	'background-color-': 'bc-',
	'background-image-wrapper-': 'biw-',
	'background-image-': 'bi-',
	'background-video-wrapper-': 'bvw-',
	'background-video-': 'bv-',
	'background-gradient-wrapper-': 'bgw-',
	'background-gradient-': 'bg-',
	'background-svg-': 'bs-',
	'block-background-': 'bb-',
	'background-': 'b-',
	'icon-': 'i-',
	'fill-': 'f-',
	'stroke-': 'str-',
	'button-': 'bt-',
	'typography-': 't-',
	'shape-fill-': 'sf-',
	'shape-divider-top-': 'sdt-',
	'shape-divider-bottom-': 'sdb-',
	'number-counter-circle-background-': 'nccb-',
	'number-counter-circle-bar-': 'nccba-',
	'number-counter-text-': 'nct-',
	'number-counter-': 'nc-',
	'border-': 'bo-',
	'box-shadow-': 'bs-',
	'hover-': 'h-',
	'image-shape-': 'is-',
	'map-': 'm-',
	'navigation-arrow-': 'na-',
	'navigation-dot-': 'nd-',
	'transform-': 'tr-',
	'list-': 'l-',
	'arrow-': 'ar-',
	'popup-': 'p-',
	'description-': 'd-',
	'placeholder-': 'pl-',
	'svg-fill-': 'sfi-',
	'svg-line-': 'sli-',
	'svg-': 's-',
	'close-': 'cl-',
	'play-': 'pl-',
	'overlay-media-': 'om-',
	'overlay-': 'o-',
	'lightbox-': 'lb-',
};

export const suffixesDictionary = {
	'-status': '.s',
	'-status-hover': '.sh',
	'-status-active': '.sa',
	'-hover': '.h',
	'-active': '.a',
	'-unit': '.u',
	'-top': '.t',
	'-right': '.r',
	'-bottom': '.b',
	'-left': '.l',
	'-top-left': '.tl',
	'-top-right': '.tr',
	'-bottom-left': '.bl',
	'-bottom-right': '.br',
	'-radius': '.ra',
	'-sync': '.sy',
	// '-general': '-g',
};

export const colorDictionary = {
	'palette-color': 'pc',
	'palette-opacity': 'po',
	'palette-status': 'ps', // exception of status
	'custom-color': 'cc',
};

const flattenDictionary = dict => {
	let response = {};

	Object.entries(dict).forEach(([key, val]) => {
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

export const prefixesReversedDictionary = {
	...Object.entries(prefixesDictionary).reduce(
		(acc, [key, val]) => ({ ...acc, [val]: key }),
		{}
	),
};

export const suffixesReversedDictionary = {
	...Object.entries(suffixesDictionary).reduce(
		(acc, [key, val]) => ({ ...acc, [val]: key }),
		{}
	),
};

export const colorReversedDictionary = {
	...Object.entries(colorDictionary).reduce(
		(acc, [key, val]) => ({ ...acc, [val]: key }),
		{}
	),
};

export default dictionary;
