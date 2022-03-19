import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawFlex = {
	'flex-grow': {
		type: 'string',
	},
	'flex-shrink': {
		type: 'string',
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
		type: 'string',
	},
	'column-gap': {
		type: 'string',
	},
};

const flex = breakpointAttributesCreator({
	obj: rawFlex,
});

export default flex;
