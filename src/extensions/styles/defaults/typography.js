import prefixAttributesCreator from '../prefixAttributesCreator';
import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import alignment from './alignment';

export const rawTypography = {
	'font-family': {
		type: 'string',
	},
	...paletteAttributesCreator({ prefix: '', palette: 3 }),
	'font-size-unit': {
		type: 'string',
		default: 'px',
	},
	'font-size': {
		type: 'number',
	},
	'line-height-unit': {
		type: 'string',
		default: 'px',
	},
	'line-height': {
		type: 'number',
	},
	'letter-spacing-unit': {
		type: 'string',
		default: 'px',
	},
	'letter-spacing': {
		type: 'number',
	},
	'font-weight': {
		type: 'string',
	},
	'text-transform': {
		type: 'string',
	},
	'font-style': {
		type: 'string',
	},
	'text-decoration': {
		type: 'string',
	},
	'text-shadow': {
		type: 'string',
	},
	'vertical-align': {
		type: 'string',
	},
	'custom-formats': {
		type: 'object',
	},
};

export const typography = breakpointAttributesCreator({
	obj: rawTypography,
	noBreakpointAttr: ['custom-formats'],
});

export const typographyAlignment = prefixAttributesCreator({
	obj: alignment,
	prefix: 'typography-',
	diffValAttr: {
		'typography-alignment-general': 'left',
	},
});
