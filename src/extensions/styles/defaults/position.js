import breakpointAttributesCreator from '../breakpointAttributesCreator';

export const rawPosition = {
	position: {
		type: 'string',
		default: 'inherit',
	},
	'position-top': {
		type: 'string',
		default: 50,
	},
	'position-right': {
		type: 'string',
	},
	'position-bottom': {
		type: 'string',
	},
	'position-left': {
		type: 'string',
		default: 50,
	},
	'position-sync': {
		type: 'string',
		default: 'none',
	},
	'position-top-unit': {
		type: 'string',
		default: '%',
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
		default: '%',
	},
};

const position = breakpointAttributesCreator({
	obj: rawPosition,
});

export default position;
