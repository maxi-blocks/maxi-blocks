import breakpointAttributesCreator from '../breakpointAttributesCreator';

const text = {
	_tl: {
		type: 'string',
		default: 'p',
		longLabel: 'textLevel',
	},
	_ili: {
		type: 'boolean',
		default: false,
		longLabel: 'isList',
	},
	_tol: {
		type: 'string',
		default: 'ul',
		longLabel: 'typeOfList',
	},
	_lst: {
		type: 'number',
		longLabel: 'listStart',
	},
	_lr: {
		type: 'boolean',
		longLabel: 'listReversed',
	},
	...breakpointAttributesCreator({
		obj: {
			_lg: {
				type: 'number',
				default: 1,
				longLabel: 'list-gap',
			},
			'_lg.u': {
				type: 'string',
				default: 'em',
				longLabel: 'list-gap-unit',
			},
			_lps: {
				type: 'number',
				longLabel: 'list-paragraph-spacing',
			},
			'_lps.u': {
				type: 'string',
				default: 'em',
				longLabel: 'list-paragraph-spacing-unit',
			},
			_lin: {
				type: 'number',
				longLabel: 'list-indent',
			},
			'_lin.u': {
				type: 'string',
				default: 'px',
				longLabel: 'list-indent-unit',
			},
			_lms: {
				type: 'number',
				default: 1,
				longLabel: 'list-marker-size',
			},
			'_lms.u': {
				type: 'string',
				default: 'em',
				longLabel: 'list-marker-size-unit',
			},
			_lmi: {
				type: 'number',
				default: 0.5,
				longLabel: 'list-marker-indent',
			},
			'_lmi.u': {
				type: 'string',
				default: 'em',
				longLabel: 'list-marker-indent-unit',
			},
			_lmlh: {
				type: 'number',
				default: 0.5,
				longLabel: 'list-marker-line-height',
			},
			'_lmlh.u': {
				type: 'string',
				default: 'em',
				longLabel: 'list-marker-line-height-unit',
			},
			_ltp: {
				type: 'string',
				default: 'middle',
				longLabel: 'list-text-position',
			},
			_lsp: {
				type: 'string',
				default: 'outside',
				longLabel: 'list-style-position',
			},
		},
	}),
	_lsty: {
		type: 'string',
		longLabel: 'listStyle',
	},
	_lsc: {
		type: 'string',
		longLabel: 'listStyleCustom',
	},
};
export default text;
