import breakpointAttributesCreator from '@extensions/styles/breakpointAttributesCreator';

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
	'flex-basis-unit': {
		type: 'string',
		default: 'px',
	},
	'flex-wrap': {
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
