import prefixAttributesCreator from '../prefixAttributesCreator';
import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import alignment from './alignment';

export const rawTypography = {
	ff: {
		type: 'string',
		longLabel: 'font-family',
	},
	...paletteAttributesCreator({ prefix: '', palette: 3 }),
	...paletteAttributesCreator({ prefix: 'list-', palette: 4 }),
	'fs.u': {
		type: 'string',
		default: 'px',
		longLabel: 'font-size-unit',
	},
	fs: {
		type: 'number',
		longLabel: 'font-size',
	},
	'lhe.u': {
		type: 'string',
		default: 'px',
		longLabel: 'line-height-unit',
	},
	lhe: {
		type: 'number',
		longLabel: 'line-height',
	},
	'ls.u': {
		type: 'string',
		default: 'px',
		longLabel: 'letter-spacing-unit',
	},
	ls: {
		type: 'number',
		longLabel: 'letter-spacing',
	},
	fwe: {
		type: 'string',
		longLabel: 'font-weight',
	},
	ttr: {
		type: 'string',
		longLabel: 'text-transform',
	},
	fst: {
		type: 'string',
		longLabel: 'font-style',
	},
	td: {
		type: 'string',
		longLabel: 'text-decoration',
	},
	ti: {
		type: 'number',
		longLabel: 'text-indent',
	},
	'ti.u': {
		type: 'string',
		default: 'px',
		longLabel: 'text-indent-unit',
	},
	tsh: {
		type: 'string',
		longLabel: 'text-shadow',
	},
	va: {
		type: 'string',
		longLabel: 'vertical-align',
	},
	cf: {
		type: 'object',
		longLabel: 'custom-formats',
	},
	to: {
		type: 'string',
		longLabel: 'text-orientation',
	},
	tdi: {
		type: 'string',
		longLabel: 'text-direction',
	},
	ws: {
		type: 'string',
		longLabel: 'white-space',
	},
	wsp: {
		type: 'number',
		longLabel: 'word-spacing',
	},
	'wsp.u': {
		type: 'string',
		default: 'px',
		longLabel: 'word-spacing-unit',
	},
	bg: {
		type: 'number',
		longLabel: 'bottom-gap',
	},
	'bg.u': {
		type: 'string',
		default: 'px',
		longLabel: 'bottom-gap-unit',
	},
};

export const typography = breakpointAttributesCreator({
	obj: rawTypography,
	noBreakpointAttr: ['cf'], // custom-formats
});

export const typographyAlignment = prefixAttributesCreator({
	obj: alignment,
	prefix: 'typography-',
	diffValAttr: {
		'ta-general': 'left', // typography-alignment-general
	},
});
