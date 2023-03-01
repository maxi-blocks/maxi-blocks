const dictionary = {
	textAlignment: {
		'text-alignment': 'ta',
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
