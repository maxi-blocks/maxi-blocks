import breakpointObjectCreator from '../breakpointObjectCreator';

const rawArrow = {
	'arrow-status': {
		type: 'boolean',
		default: false,
	},
	'arrow-side': {
		type: 'string',
		default: 'bottom',
	},
	'arrow-position': {
		type: 'number',
		default: 50,
	},
	'arrow-width': {
		type: 'number',
		default: 80,
	},
};

const arrow = breakpointObjectCreator({
	obj: rawArrow,
	noBreakpointAttr: ['arrow-status'],
});

export default arrow;
