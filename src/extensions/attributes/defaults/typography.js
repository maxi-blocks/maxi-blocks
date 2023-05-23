import prefixAttributesCreator from '../prefixAttributesCreator';
import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import alignment from './alignment';

export const rawTypography = {
	_ff: {
		type: 'string',
		longLabel: 'font-family',
	},
	...paletteAttributesCreator({ prefix: '', palette: 3 }),
	'_fs.u': {
		type: 'string',
		default: 'px',
		longLabel: 'font-size-unit',
	},
	_fs: {
		type: 'number',
		longLabel: 'font-size',
	},
	'_lhe.u': {
		type: 'string',
		default: 'px',
		longLabel: 'line-height-unit',
	},
	_lhe: {
		type: 'number',
		longLabel: 'line-height',
	},
	'_ls.u': {
		type: 'string',
		default: 'px',
		longLabel: 'letter-spacing-unit',
	},
	_ls: {
		type: 'number',
		longLabel: 'letter-spacing',
	},
	_fwe: {
		type: 'string',
		longLabel: 'font-weight',
	},
	_ttr: {
		type: 'string',
		longLabel: 'text-transform',
	},
	_fst: {
		type: 'string',
		longLabel: 'font-style',
	},
	_td: {
		type: 'string',
		longLabel: 'text-decoration',
	},
	_ti: {
		type: 'number',
		longLabel: 'text-indent',
	},
	'_ti.u': {
		type: 'string',
		default: 'px',
		longLabel: 'text-indent-unit',
	},
	_tsh: {
		type: 'string',
		longLabel: 'text-shadow',
	},
	_va: {
		type: 'string',
		longLabel: 'vertical-align',
	},
	_cf: {
		type: 'object',
		longLabel: 'custom-formats',
	},
	_to: {
		type: 'string',
		longLabel: 'text-orientation',
	},
	_tdi: {
		type: 'string',
		longLabel: 'text-direction',
	},
	_ws: {
		type: 'string',
		longLabel: 'white-space',
	},
	_wsp: {
		type: 'number',
		longLabel: 'word-spacing',
	},
	'_wsp.u': {
		type: 'string',
		default: 'px',
		longLabel: 'word-spacing-unit',
	},
	_bg: {
		type: 'number',
		longLabel: 'bottom-gap',
	},
	'_bg.u': {
		type: 'string',
		default: 'px',
		longLabel: 'bottom-gap-unit',
	},
};

export const typography = breakpointAttributesCreator({
	obj: rawTypography,
	noBreakpointAttr: ['_cf'], // custom-formats
});

export const typographyAlignment = prefixAttributesCreator({
	obj: alignment,
	prefix: 't-',
	longPrefix: 'typography-',
	diffValAttr: {
		'_ta-general': 'left', // typography-alignment-general
	},
});
