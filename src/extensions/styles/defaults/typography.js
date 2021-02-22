import alignment from './alignment';

export const typography = {
	'font-family-general': {
		type: 'string',
		default: 'Roboto',
	},
	'font-options-general': {
		type: 'object',
		default: {
			100: 'http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1MmgWxPKTM1K9nz.ttf',
			'100italic':
				'http://fonts.gstatic.com/s/roboto/v20/KFOiCnqEu92Fr1Mu51QrIzcXLsnzjYk.ttf',
			300: 'http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmSU5vAx05IsDqlA.ttf',
			'300italic':
				'http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TjARc9AMX6lJBP.ttf',
			400: 'http://fonts.gstatic.com/s/roboto/v20/KFOmCnqEu92Fr1Me5WZLCzYlKw.ttf',
			italic:
				'http://fonts.gstatic.com/s/roboto/v20/KFOkCnqEu92Fr1Mu52xPKTM1K9nz.ttf',
			500: 'http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmEU9vAx05IsDqlA.ttf',
			'500italic':
				'http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51S7ABc9AMX6lJBP.ttf',
			700: 'http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmWUlvAx05IsDqlA.ttf',
			'700italic':
				'http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TzBhc9AMX6lJBP.ttf',
			900: 'http://fonts.gstatic.com/s/roboto/v20/KFOlCnqEu92Fr1MmYUtvAx05IsDqlA.ttf',
			'900italic':
				'http://fonts.gstatic.com/s/roboto/v20/KFOjCnqEu92Fr1Mu51TLBBc9AMX6lJBP.ttf',
		},
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
	'font-options-xxl': {
		type: 'object',
		default: {},
	},
	'color-xxl': {
		type: 'string',
	},
	'font-size-unit-xxl': {
		type: 'string',
		default: 'px',
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
		default: 'px',
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
	'font-options-xl': {
		type: 'object',
		default: {},
	},
	'color-xl': {
		type: 'string',
	},
	'font-size-unit-xl': {
		type: 'string',
		default: 'px',
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
		default: 'px',
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
	'font-options-l': {
		type: 'object',
		default: {},
	},
	'color-l': {
		type: 'string',
	},
	'font-size-unit-l': {
		type: 'string',
		default: 'px',
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
		default: 'px',
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
	'font-options-m': {
		type: 'object',
		default: {},
	},
	'color-m': {
		type: 'string',
	},
	'font-size-unit-m': {
		type: 'string',
		default: 'px',
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
		default: 'px',
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
	'font-options-s': {
		type: 'object',
		default: {},
	},
	'color-s': {
		type: 'string',
	},
	'font-size-unit-s': {
		type: 'string',
		default: 'px',
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
		default: 'px',
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
	'font-options-xs': {
		type: 'object',
		default: {},
	},
	'color-xs': {
		type: 'string',
	},
	'font-size-unit-xs': {
		type: 'string',
		default: 'px',
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
		default: 'px',
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
		default: {},
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
