import breakpointObjectCreator from '../breakpointObjectCreator';

const rawSize = {
	'size-advanced-options': {
		type: 'boolean',
		default: false,
	},
	'max-width-unit': {
		type: 'string',
		default: 'px',
	},
	'max-width': {
		type: 'number',
	},
	'width-unit': {
		type: 'string',
		default: 'px',
	},
	width: {
		type: 'number',
	},
	'min-width-unit': {
		type: 'string',
		default: 'px',
	},
	'min-width': {
		type: 'number',
	},
	'max-height-unit': {
		type: 'string',
		default: 'px',
	},
	'max-height': {
		type: 'number',
	},
	'height-unit': {
		type: 'string',
		default: 'px',
	},
	height: {
		type: 'number',
	},
	'min-height-unit': {
		type: 'string',
		default: 'px',
	},
	'min-height': {
		type: 'number',
	},
};

const size = breakpointObjectCreator({
	obj: rawSize,
	noBreakpointAttr: ['size-advanced-options'],
});

export default size;
