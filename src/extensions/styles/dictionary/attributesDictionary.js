const dictionary = {
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
	alignment: {
		alignment: 'a',
	},
	clipPath: {
		'clip-path': 'cp',
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
	palette: {
		'palette-status': 'pa-status', // `-status` will be changed to `st` in Phase 2
		'palette-color': 'pac',
		'palette-opacity': 'pao',
		color: 'c',
	},
};

const flattenDictionary = dict => {
	let response = {};

	Object.values(dict).forEach(val => {
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
		(acc, [key, val], i) => ({ ...acc, [val]: key }),
		{}
	),
};

export default dictionary;
