import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';

const rawDivider = {
	'di-bo.t': {
		type: 'number',
		default: 2,
		longLabel: 'divider-border-top',
	},
	'di-bo.t.u': {
		type: 'string',
		default: 'px',
		longLabel: 'divider-border-top-unit',
	},
	'di-bo.r': {
		type: 'number',
		default: 2,
		longLabel: 'divider-border-right',
	},
	'di-bo.r.u': {
		type: 'string',
		default: 'px',
		longLabel: 'divider-border-right-unit',
	},
	'di-bo.ra': {
		type: 'boolean',
		default: false,
		longLabel: 'divider-border-radius',
	},
	di_w: {
		type: 'number',
		default: 50,
		longLabel: 'divider-width',
	},
	'di_w.u': {
		type: 'string',
		default: '%',
		longLabel: 'divider-width-unit',
	},
	di_h: {
		type: 'number',
		default: 100,
		longLabel: 'divider-height',
	},
	_la: {
		type: 'string',
		default: 'row',
		longLabel: 'line-align',
	},
	_lv: {
		type: 'string',
		default: 'center',
		longLabel: 'line-vertical',
	},
	_lh: {
		type: 'string',
		default: 'center',
		longLabel: 'line-horizontal',
	},
	_lo: {
		type: 'string',
		default: 'horizontal',
		longLabel: 'line-orientation',
	},
	'di-bo_s': {
		type: 'string',
		default: 'solid',
		longLabel: 'divider-border-style',
	},
	...paletteAttributesCreator({
		prefix: 'di-bo',
		longPrefix: 'divider-border-',
		palette: 4,
	}),
};

export default breakpointAttributesCreator({
	obj: rawDivider,
});
