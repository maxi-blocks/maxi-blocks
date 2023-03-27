import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';

const prefix = 'db-'; // divider-border-
const rawDivider = {
	'db.t': {
		type: 'number',
		default: 2,
		longLabel: 'divider-border-top',
	},
	'db.t.u': {
		type: 'string',
		default: 'px',
		longLabel: 'divider-border-top-unit',
	},
	'db.r': {
		type: 'number',
		default: 2,
		longLabel: 'divider-border-right',
	},
	'db.r.u': {
		type: 'string',
		default: 'px',
		longLabel: 'divider-border-right-unit',
	},
	'db.ra': {
		type: 'boolean',
		default: false,
		longLabel: 'divider-border-radius',
	},
	dw: {
		type: 'number',
		default: 50,
		longLabel: 'divider-width',
	},
	'dw.u': {
		type: 'string',
		default: '%',
		longLabel: 'divider-width-unit',
	},
	dh: {
		type: 'number',
		default: 100,
		longLabel: 'divider-height',
	},
	la: {
		type: 'string',
		default: 'row',
		longLabel: 'line-align',
	},
	lv: {
		type: 'string',
		default: 'center',
		longLabel: 'line-vertical',
	},
	lh: {
		type: 'string',
		default: 'center',
		longLabel: 'line-horizontal',
	},
	lo: {
		type: 'string',
		default: 'horizontal',
		longLabel: 'line-orientation',
	},
	'db-s': {
		type: 'string',
		default: 'solid',
		longLabel: 'divider-border-style',
	},
	...paletteAttributesCreator({
		prefix,
		palette: 4,
	}),
};

export default breakpointAttributesCreator({
	obj: rawDivider,
});
