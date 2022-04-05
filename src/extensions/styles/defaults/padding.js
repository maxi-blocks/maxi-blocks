import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawPadding = {
	'padding-top': {
		type: 'number',
	},
	'padding-right': {
		type: 'number',
	},
	'padding-bottom': {
		type: 'number',
	},
	'padding-left': {
		type: 'number',
	},
	'padding-top-unit': {
		type: 'string',
		default: 'px',
	},
	'padding-right-unit': {
		type: 'string',
		default: 'px',
	},
	'padding-bottom-unit': {
		type: 'string',
		default: 'px',
	},
	'padding-left-unit': {
		type: 'string',
		default: 'px',
	},
	'padding-sync': {
		type: 'string',
		default: 'all',
	},
	'padding-unit': {
		type: 'string',
		default: 'px',
	},
};

const padding = breakpointAttributesCreator({
	obj: rawPadding,
});

export default padding;
