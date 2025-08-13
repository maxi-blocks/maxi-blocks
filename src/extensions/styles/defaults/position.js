import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

export const rawPosition = {
	position: {
		type: 'string',
		default: 'inherit',
	},
	'position-top': {
		type: 'string',
	},
	'position-right': {
		type: 'string',
	},
	'position-bottom': {
		type: 'string',
	},
	'position-left': {
		type: 'string',
	},
	'position-sync': {
		type: 'string',
		default: 'none',
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
