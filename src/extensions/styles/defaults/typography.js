import prefixAttributesCreator from '../prefixAttributesCreator';
import breakpointAttributesCreator from '../breakpointAttributesCreator';
import paletteAttributesCreator from '../paletteAttributesCreator';
import alignment from './alignment';

export const rawTypography = {
	'font-family': {
		type: 'string',
	},
	...paletteAttributesCreator({ prefix: '', palette: 3 }),
	...paletteAttributesCreator({ prefix: 'list-', palette: 4 }),
	'font-size-unit': {
		type: 'string',
		default: 'px',
	},
	'font-size': {
		type: 'number',
	},
	'font-size-clamp-status': {
		type: 'boolean',
	},
	'font-size-clamp-auto-status': {
		type: 'boolean',
	},
	'font-size-clamp-min': {
		type: 'number',
	},
	'font-size-clamp-min-unit': {
		type: 'string',
	},
	'font-size-clamp-max': {
		type: 'number',
	},
	'font-size-clamp-max-unit': {
		type: 'string',
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
	'text-indent': {
		type: 'number',
	},
	'text-indent-unit': {
		type: 'string',
		default: 'px',
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
	'text-orientation': {
		type: 'string',
	},
	'text-direction': {
		type: 'string',
	},
	'white-space': {
		type: 'string',
	},
	'word-spacing': {
		type: 'number',
	},
	'word-spacing-unit': {
		type: 'string',
		default: 'px',
	},
	'bottom-gap': {
		type: 'number',
	},
	'bottom-gap-unit': {
		type: 'string',
		default: 'px',
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
