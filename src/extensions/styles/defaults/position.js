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
	'position-unit': {
		type: 'string',
		default: 'px',
	},
};

const position = breakpointAttributesCreator({
	obj: rawPosition,
});

export default position;
