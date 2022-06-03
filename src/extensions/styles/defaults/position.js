import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawPosition = {
	position: {
		type: 'string',
	},
	'position-top': {
		type: 'number',
	},
	'position-right': {
		type: 'number',
	},
	'position-bottom': {
		type: 'number',
	},
	'position-left': {
		type: 'number',
	},
	'position-sync': {
		type: 'string',
		default: 'all',
	},
	'position-top-unit': {
		type: 'string',
		default: 'px',
	},
	'position-right-unit': {
		type: 'string',
		default: 'px',
	},
	'position-bottom-unit': {
		type: 'string',
		default: 'px',
	},
	'position-left-unit': {
		type: 'string',
		default: 'px',
	},
};

const position = breakpointAttributesCreator({
	obj: rawPosition,
});

export default position;
