import alignment from './alignment';

export const typography = {
	'font-family-general': {
		type: 'string',
	},
	'palette-status-general': {
		type: 'boolean',
		default: true,
	},
	'palette-color-general': {
		type: 'number',
		default: 3,
	},
	'palette-opacity-general': {
		type: 'number',
	},
	'color-general': {
		type: 'string',
	},
	'font-size-unit-general': {
		type: 'string',
		default: 'px',
	},
	'font-size-general': {
		type: 'number',
	},
	'line-height-unit-general': {
		type: 'string',
		default: 'px',
	},
	'line-height-general': {
		type: 'number',
	},
	'letter-spacing-unit-general': {
		type: 'string',
		default: 'px',
	},
	'letter-spacing-general': {
		type: 'number',
	},
	'font-weight-general': {
		type: 'number',
	},
	'text-transform-general': {
		type: 'string',
	},
	'font-style-general': {
		type: 'string',
	},
	'text-decoration-general': {
		type: 'string',
	},
	'text-shadow-general': {
		type: 'string',
	},
	'vertical-align-general': {
		type: 'string',
	},
	'font-family-xxl': {
		type: 'string',
	},
	'palette-status-xxl': {
		type: 'boolean',
	},
	'palette-color-xxl': {
		type: 'number',
	},
	'palette-opacity-xxl': {
		type: 'number',
	},
	'color-xxl': {
		type: 'string',
	},
	'font-size-unit-xxl': {
		type: 'string',
	},
	'font-size-xxl': {
		type: 'number',
	},
	'line-height-unit-xxl': {
		type: 'string',
	},
	'line-height-xxl': {
		type: 'number',
	},
	'letter-spacing-unit-xxl': {
		type: 'string',
	},
	'letter-spacing-xxl': {
		type: 'number',
	},
	'font-weight-xxl': {
		type: 'number',
	},
	'text-transform-xxl': {
		type: 'string',
	},
	'font-style-xxl': {
		type: 'string',
	},
	'text-decoration-xxl': {
		type: 'string',
	},
	'text-shadow-xxl': {
		type: 'string',
	},
	'vertical-align-xxl': {
		type: 'string',
	},
	'font-family-xl': {
		type: 'string',
	},
	'palette-status-xl': {
		type: 'boolean',
	},
	'palette-color-xl': {
		type: 'number',
	},
	'palette-opacity-xl': {
		type: 'number',
	},
	'color-xl': {
		type: 'string',
	},
	'font-size-unit-xl': {
		type: 'string',
	},
	'font-size-xl': {
		type: 'number',
	},
	'line-height-unit-xl': {
		type: 'string',
	},
	'line-height-xl': {
		type: 'number',
	},
	'letter-spacing-unit-xl': {
		type: 'string',
	},
	'letter-spacing-xl': {
		type: 'number',
	},
	'font-weight-xl': {
		type: 'number',
	},
	'text-transform-xl': {
		type: 'string',
	},
	'font-style-xl': {
		type: 'string',
	},
	'text-decoration-xl': {
		type: 'string',
	},
	'text-shadow-xl': {
		type: 'string',
	},
	'vertical-align-xl': {
		type: 'string',
	},
	'font-family-l': {
		type: 'string',
	},
	'palette-status-l': {
		type: 'boolean',
	},
	'palette-color-l': {
		type: 'number',
	},
	'palette-opacity-l': {
		type: 'number',
	},
	'color-l': {
		type: 'string',
	},
	'font-size-unit-l': {
		type: 'string',
	},
	'font-size-l': {
		type: 'number',
	},
	'line-height-unit-l': {
		type: 'string',
	},
	'line-height-l': {
		type: 'number',
	},
	'letter-spacing-unit-l': {
		type: 'string',
	},
	'letter-spacing-l': {
		type: 'number',
	},
	'font-weight-l': {
		type: 'number',
	},
	'text-transform-l': {
		type: 'string',
	},
	'font-style-l': {
		type: 'string',
	},
	'text-decoration-l': {
		type: 'string',
	},
	'text-shadow-l': {
		type: 'string',
	},
	'vertical-align-l': {
		type: 'string',
	},
	'font-family-m': {
		type: 'string',
	},
	'palette-status-m': {
		type: 'boolean',
	},
	'palette-color-m': {
		type: 'number',
	},
	'palette-opacity-m': {
		type: 'number',
	},
	'color-m': {
		type: 'string',
	},
	'font-size-unit-m': {
		type: 'string',
	},
	'font-size-m': {
		type: 'number',
	},
	'line-height-unit-m': {
		type: 'string',
	},
	'line-height-m': {
		type: 'number',
	},
	'letter-spacing-unit-m': {
		type: 'string',
	},
	'letter-spacing-m': {
		type: 'number',
	},
	'font-weight-m': {
		type: 'number',
	},
	'text-transform-m': {
		type: 'string',
	},
	'font-style-m': {
		type: 'string',
	},
	'text-decoration-m': {
		type: 'string',
	},
	'text-shadow-m': {
		type: 'string',
	},
	'vertical-align-m': {
		type: 'string',
	},
	'font-family-s': {
		type: 'string',
	},
	'palette-status-s': {
		type: 'boolean',
	},
	'palette-color-s': {
		type: 'number',
	},
	'palette-opacity-s': {
		type: 'number',
	},
	'color-s': {
		type: 'string',
	},
	'font-size-unit-s': {
		type: 'string',
	},
	'font-size-s': {
		type: 'number',
	},
	'line-height-unit-s': {
		type: 'string',
	},
	'line-height-s': {
		type: 'number',
	},
	'letter-spacing-unit-s': {
		type: 'string',
	},
	'letter-spacing-s': {
		type: 'number',
	},
	'font-weight-s': {
		type: 'number',
	},
	'text-transform-s': {
		type: 'string',
	},
	'font-style-s': {
		type: 'string',
	},
	'text-decoration-s': {
		type: 'string',
	},
	'text-shadow-s': {
		type: 'string',
	},
	'vertical-align-s': {
		type: 'string',
	},
	'font-family-xs': {
		type: 'string',
	},
	'palette-status-xs': {
		type: 'boolean',
	},
	'palette-color-xs': {
		type: 'number',
	},
	'palette-opacity-xs': {
		type: 'number',
	},
	'color-xs': {
		type: 'string',
	},
	'font-size-unit-xs': {
		type: 'string',
	},
	'font-size-xs': {
		type: 'number',
	},
	'line-height-unit-xs': {
		type: 'string',
	},
	'line-height-xs': {
		type: 'number',
	},
	'letter-spacing-unit-xs': {
		type: 'string',
	},
	'letter-spacing-xs': {
		type: 'number',
	},
	'font-weight-xs': {
		type: 'number',
	},
	'text-transform-xs': {
		type: 'string',
	},
	'font-style-xs': {
		type: 'string',
	},
	'text-decoration-xs': {
		type: 'string',
	},
	'text-shadow-xs': {
		type: 'string',
	},
	'vertical-align-xs': {
		type: 'string',
	},
	'custom-formats': {
		type: 'object',
	},
};

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
