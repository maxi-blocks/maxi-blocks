import breakpointAttributesCreator from '../breakpointAttributesCreator';

const rawFlex = {
	_fg: {
		type: 'number',
		longLabel: 'flex-grow',
	},
	_fls: {
		type: 'number',
		longLabel: 'flex-shrink',
	},
	_fb: {
		type: 'string',
		longLabel: 'flex-basis',
	},
	'_fb.u': {
		type: 'string',
		default: 'px',
		longLabel: 'flex-basis-unit',
	},
	_flw: {
		type: 'string',
		longLabel: 'flex-wrap',
	},
	_jc: {
		type: 'string',
		longLabel: 'justify-content',
	},
	_fd: {
		type: 'string',
		longLabel: 'flex-direction',
	},
	_ai: {
		type: 'string',
		longLabel: 'align-items',
	},
	_ac: {
		type: 'string',
		longLabel: 'align-content',
	},
	_rg: {
		type: 'number',
		longLabel: 'row-gap',
	},
	'_rg.u': {
		type: 'string',
		default: 'px',
		longLabel: 'row-gap-unit',
	},
	_cg: {
		type: 'number',
		longLabel: 'column-gap',
	},
	'_cg.u': {
		type: 'string',
		default: 'px',
		longLabel: 'column-gap-unit',
	},
	_or: {
		type: 'number',
		longLabel: 'order',
	},
};

const flex = breakpointAttributesCreator({
	obj: rawFlex,
});

export default flex;
