import breakpointAttributesCreator from '../breakpointAttributesCreator';

export const rawPosition = {
	pos: {
		type: 'string',
		default: 'inherit',
		longLabel: 'position',
	},
	'pos.t': {
		type: 'string',
		longLabel: 'position-top',
	},
	'pos.r': {
		type: 'string',
		longLabel: 'position-right',
	},
	'pos.b': {
		type: 'string',
		longLabel: 'position-bottom',
	},
	'pos.l': {
		type: 'string',
		longLabel: 'position-left',
	},
	'pos.s': {
		type: 'string',
		default: 'all',
		longLabel: 'position-sync',
	},
	'pos.t.u': {
		type: 'string',
		default: 'px',
		longLabel: 'position-top-unit',
	},
	'pos.r.u': {
		type: 'string',
		default: 'px',
		longLabel: 'position-right-unit',
	},
	'pos.b.u': {
		type: 'string',
		default: 'px',
		longLabel: 'position-bottom-unit',
	},
	'pos.l.u': {
		type: 'string',
		default: 'px',
		longLabel: 'position-left-unit',
	},
};

const position = breakpointAttributesCreator({
	obj: rawPosition,
});

export default position;
