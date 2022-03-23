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
	},
	'flex-wrap': {
		type: 'string',
	},
	'flex-flow': {
		type: 'string',
	},
	'justify-content': {
		type: 'string',
	},
	'flex-direction': {
		type: 'string',
	},
	'align-items': {
		type: 'string',
	},
	'align-content': {
		type: 'string',
	},
	gap: {
		type: 'string',
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
