import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';

const prefix = 'bs-';
const longPrefix = 'box-shadow-';

const rawBoxShadow = {
	...paletteAttributesCreator({ prefix, longPrefix, palette: 8, opacity: 1 }),
	bs_in: {
		type: 'boolean',
		default: false,
		longLabel: 'box-shadow-inset',
	},
	bs_ho: {
		type: 'number',
		default: 0,
		longLabel: 'box-shadow-horizontal',
	},
	'bs_ho.u': {
		type: 'string',
		default: 'px',
		longLabel: 'box-shadow-horizontal-unit',
	},
	bs_v: {
		type: 'number',
		default: 0,
		longLabel: 'box-shadow-vertical',
	},
	'bs_v.u': {
		type: 'string',
		default: 'px',
		longLabel: 'box-shadow-vertical-unit',
	},
	bs_blu: {
		type: 'number',
		default: 0,
		longLabel: 'box-shadow-blur',
	},
	'bs_blu.u': {
		type: 'string',
		default: 'px',
		longLabel: 'box-shadow-blur-unit',
	},
	bs_sp: {
		type: 'number',
		default: 0,
		longLabel: 'box-shadow-spread',
	},
	'bs_sp.u': {
		type: 'string',
		default: 'px',
		longLabel: 'box-shadow-spread-unit',
	},
};
const boxShadow = breakpointAttributesCreator({
	obj: rawBoxShadow,
});

export default boxShadow;
