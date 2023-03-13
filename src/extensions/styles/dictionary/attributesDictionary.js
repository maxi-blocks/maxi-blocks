const dictionary = {
	clipPath: {
		'clip-path': 'cp',
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
