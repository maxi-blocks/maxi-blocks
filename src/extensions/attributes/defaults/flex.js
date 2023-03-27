import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawFlex = {
	fg: {
		type: 'number',
		longLabel: 'flex-grow',
	},
	fls: {
		type: 'number',
		longLabel: 'flex-shrink',
	},
	fb: {
		type: 'string',
		longLabel: 'flex-basis',
	},
	'fb.u': {
		type: 'string',
		default: 'px',
		longLabel: 'flex-basis-unit',
	},
	flw: {
		type: 'string',
		longLabel: 'flex-wrap',
	},
	js: {
		type: 'string',
		longLabel: 'justify-content',
	},
	fd: {
		type: 'string',
		longLabel: 'flex-direction',
	},
	ai: {
		type: 'string',
		longLabel: 'align-items',
	},
	ac: {
		type: 'string',
		longLabel: 'align-content',
	},
	rg: {
		type: 'number',
		longLabel: 'row-gap',
	},
	'rg.u': {
		type: 'string',
		default: 'px',
		longLabel: 'row-gap-unit',
	},
	cg: {
		type: 'number',
		longLabel: 'column-gap',
	},
	'cg.u': {
		type: 'string',
		default: 'px',
		longLabel: 'column-gap-unit',
	},
	or: {
		type: 'number',
	},
};

const flex = breakpointAttributesCreator({
	obj: rawFlex,
});

export default flex;
