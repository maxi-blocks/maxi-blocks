import breakpointAttributesCreator from '../breakpointAttributesCreator';

export const rawPosition = {
	_pos: {
		type: 'string',
		default: 'inherit',
		longLabel: 'position',
	},
	'_pos.t': {
		type: 'string',
		longLabel: 'position-top',
	},
	'_pos.r': {
		type: 'string',
		longLabel: 'position-right',
	},
	'_pos.b': {
		type: 'string',
		longLabel: 'position-bottom',
	},
	'_pos.l': {
		type: 'string',
		longLabel: 'position-left',
	},
	'_pos.sy': {
		type: 'string',
		default: 'all',
		longLabel: 'position-sync',
	},
	'_pos.t.u': {
		type: 'string',
		default: 'px',
		longLabel: 'position-top-unit',
	},
	'_pos.r.u': {
		type: 'string',
		default: 'px',
		longLabel: 'position-right-unit',
	},
	'_pos.b.u': {
		type: 'string',
		default: 'px',
		longLabel: 'position-bottom-unit',
	},
	'_pos.l.u': {
		type: 'string',
		default: 'px',
		longLabel: 'position-left-unit',
	},
};

const position = breakpointAttributesCreator({
	obj: rawPosition,
});

export default position;
