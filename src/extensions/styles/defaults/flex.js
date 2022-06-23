import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawFlex = {
	'flex-grow': {
		type: 'number',
	},
	'flex-shrink': {
		type: 'number',
	},
	'flex-basis': {
		type: 'string',
		default: 'unset',
	},
	'flex-basis-unit': {
		type: 'string',
		default: 'px',
	},
	'flex-wrap': {
		type: 'string',
		default: 'nowrap',
	},
	'flex-flow': {
		type: 'string',
	},
	'justify-content': {
		type: 'string',
		default: 'flex-start',
	},
	'flex-direction': {
		type: 'string',
		default: 'row',
	},
	'align-items': {
		type: 'string',
		default: 'flex-start',
	},
	'align-content': {
		type: 'string',
		default: 'flex-start',
	},
	'row-gap': {
		type: 'number',
	},
	'row-gap-unit': {
		type: 'string',
		default: 'px',
	},
	'column-gap': {
		type: 'number',
	},
	'column-gap-unit': {
		type: 'string',
		default: 'px',
	},
	order: {
		type: 'number',
	},
};

const flex = breakpointAttributesCreator({
	obj: rawFlex,
});

export default flex;
