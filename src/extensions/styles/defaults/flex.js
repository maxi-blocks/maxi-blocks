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
};

const flex = breakpointAttributesCreator({
	obj: rawFlex,
});

export default flex;
