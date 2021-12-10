import breakpointObjectCreator from '../breakpointObjectCreator';

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
	'position-unit': {
		type: 'string',
		default: 'px',
	},
};

const position = breakpointObjectCreator({
	obj: rawPosition,
});

export default position;
