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
		type: 'number',
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

// TODO: apply prefixAttributesCreator
export const typographyAlignment = (function typographyGenerator() {
	const response = {};

	Object.entries(alignment).forEach(([key, value]) => {
		const newKey = key.replace('alignment-', 'typography-alignment-');

		if (key.includes('-general')) value.default = 'left';
		else delete value.default;

		response[newKey] = value;
	});

	return response;
})();
