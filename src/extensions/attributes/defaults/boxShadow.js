import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';

const prefix = 'bs-'; // box-shadow-

const rawBoxShadow = {
	...paletteAttributesCreator({ prefix, palette: 8, opacity: 1 }),
	'bs-in': {
		type: 'boolean',
		default: false,
		longLabel: 'box-shadow-inset',
	},
	'bs-ho': {
		type: 'number',
		default: 0,
		longLabel: 'box-shadow-horizontal',
	},
	'bs-ho.u': {
		type: 'string',
		default: 'px',
		longLabel: 'box-shadow-horizontal-unit',
	},
	'bs-v': {
		type: 'number',
		default: 0,
		longLabel: 'box-shadow-vertical',
	},
	'bs-v.u': {
		type: 'string',
		default: 'px',
		longLabel: 'box-shadow-vertical-unit',
	},
	'bs-blu': {
		type: 'number',
		default: 0,
		longLabel: 'box-shadow-blur',
	},
	'bs-blu.u': {
		type: 'string',
		default: 'px',
		longLabel: 'box-shadow-blur-unit',
	},
	'bs-sp': {
		type: 'number',
		default: 0,
		longLabel: 'box-shadow-spread',
	},
	'bs-sp.u': {
		type: 'string',
		default: 'px',
		longLabel: 'box-shadow-spread-unit',
	},
};
const boxShadow = breakpointAttributesCreator({
	obj: rawBoxShadow,
});

export default boxShadow;
