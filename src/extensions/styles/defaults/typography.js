import alignment from './alignment';

const typographyBase = {
	label: 'Typography',
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
		default: '#9b9b9b',
	},
	'font-size-unit-general': {
		type: 'string',
		default: 'px',
	},
	'font-size-general': {
		type: 'number',
		default: 16,
	},
	'line-height-unit-general': {
		type: 'string',
		default: '',
	},
	'line-height-general': {
		type: 'number',
		default: 1.625,
	},
	'letter-spacing-unit-general': {
		type: 'string',
		default: 'px',
	},
	'letter-spacing-general': {
		type: 'number',
		default: 0,
	},
	'font-weight-general': {
		type: 'number',
		default: 400,
	},
	'text-transform-general': {
		type: 'string',
		default: 'none',
	},
	'font-style-general': {
		type: 'string',
		default: 'normal',
	},
	'text-decoration-general': {
		type: 'string',
		default: 'none',
	},
	'text-shadow-general': {
		type: 'string',
		default: '',
	},
	'vertical-align-general': {
		type: 'string',
		default: '',
	},
	'font-family-xxl': {
		type: 'string',
		default: '',
	},
	'font-options-xxl': {
		type: 'object',
		default: {},
	},
	'color-xxl': {
		type: 'string',
		default: '',
	},
	'font-size-unit-xxl': {
		type: 'string',
		default: 'px',
	},
	'font-size-xxl': {
		type: 'number',
		default: 20,
	},
	'line-height-unit-xxl': {
		type: 'string',
		default: '',
	},
	'line-height-xxl': {
		type: 'number',
		default: 1.5,
	},
	'letter-spacing-unit-xxl': {
		type: 'string',
		default: 'px',
	},
	'letter-spacing-xxl': {
		type: 'number',
		default: '',
	},
	'font-weight-xxl': {
		type: 'number',
		default: '',
	},
	'text-transform-xxl': {
		type: 'string',
		default: '',
	},
	'font-style-xxl': {
		type: 'string',
		default: '',
	},
	'text-decoration-xxl': {
		type: 'string',
		default: '',
	},
	'text-shadow-xxl': {
		type: 'string',
		default: '',
	},
	'vertical-align-xxl': {
		type: 'string',
		default: '',
	},
	'font-family-xl': '',
	'font-options-xl': {
		type: 'object',
		default: {},
	},
	'color-xl': {
		type: 'string',
		default: '',
	},
	'font-size-unit-xl': {
		type: 'string',
		default: 'px',
	},
	'font-size-xl': {
		type: 'number',
		default: 18,
	},
	'line-height-unit-xl': {
		type: 'string',
		default: '',
	},
	'line-height-xl': {
		type: 'number',
		default: 1.35,
	},
	'letter-spacing-unit-xl': {
		type: 'string',
		default: 'px',
	},
	'letter-spacing-xl': {
		type: 'number',
		default: '',
	},
	'font-weight-xl': {
		type: 'number',
		default: '',
	},
	'text-transform-xl': {
		type: 'string',
		default: '',
	},
	'font-style-xl': {
		type: 'string',
		default: '',
	},
	'text-decoration-xl': {
		type: 'string',
		default: '',
	},
	'text-shadow-xl': {
		type: 'string',
		default: '',
	},
	'vertical-align-xl': {
		type: 'string',
		default: '',
	},
	'font-family-l': '',
	'font-options-l': {
		type: 'object',
		default: {},
	},
	'color-l': {
		type: 'string',
		default: '',
	},
	'font-size-unit-l': {
		type: 'string',
		default: 'px',
	},
	'font-size-l': {
		type: 'number',
		default: 16,
	},
	'line-height-unit-l': {
		type: 'string',
		default: '',
	},
	'line-height-l': {
		type: 'number',
		default: 1.625,
	},
	'letter-spacing-unit-l': {
		type: 'string',
		default: 'px',
	},
	'letter-spacing-l': {
		type: 'number',
		default: '',
	},
	'font-weight-l': {
		type: 'number',
		default: '',
	},
	'text-transform-l': {
		type: 'string',
		default: '',
	},
	'font-style-l': {
		type: 'string',
		default: '',
	},
	'text-decoration-l': {
		type: 'string',
		default: '',
	},
	'text-shadow-l': {
		type: 'string',
		default: '',
	},
	'vertical-align-l': {
		type: 'string',
		default: '',
	},
	'font-family-m': '',
	'font-options-m': {
		type: 'object',
		default: {},
	},
	'color-m': {
		type: 'string',
		default: '',
	},
	'font-size-unit-m': {
		type: 'string',
		default: 'px',
	},
	'font-size-m': {
		type: 'number',
		default: '',
	},
	'line-height-unit-m': {
		type: 'string',
		default: '',
	},
	'line-height-m': {
		type: 'number',
		default: '',
	},
	'letter-spacing-unit-m': {
		type: 'string',
		default: 'px',
	},
	'letter-spacing-m': {
		type: 'number',
		default: '',
	},
	'font-weight-m': {
		type: 'number',
		default: '',
	},
	'text-transform-m': {
		type: 'string',
		default: '',
	},
	'font-style-m': {
		type: 'string',
		default: '',
	},
	'text-decoration-m': {
		type: 'string',
		default: '',
	},
	'text-shadow-m': {
		type: 'string',
		default: '',
	},
	'vertical-align-m': {
		type: 'string',
		default: '',
	},
	'font-family-s': '',
	'font-options-s': {
		type: 'object',
		default: {},
	},
	'color-s': {
		type: 'string',
		default: '',
	},
	'font-size-unit-s': {
		type: 'string',
		default: 'px',
	},
	'font-size-s': {
		type: 'number',
		default: '',
	},
	'line-height-unit-s': {
		type: 'string',
		default: '',
	},
	'line-height-s': {
		type: 'number',
		default: '',
	},
	'letter-spacing-unit-s': {
		type: 'string',
		default: 'px',
	},
	'letter-spacing-s': {
		type: 'number',
		default: '',
	},
	'font-weight-s': {
		type: 'number',
		default: '',
	},
	'text-transform-s': {
		type: 'string',
		default: '',
	},
	'font-style-s': {
		type: 'string',
		default: '',
	},
	'text-decoration-s': {
		type: 'string',
		default: '',
	},
	'text-shadow-s': {
		type: 'string',
		default: '',
	},
	'vertical-align-s': {
		type: 'string',
		default: '',
	},
	'font-family-xs': '',
	'font-options-xs': {
		type: 'object',
		default: {},
	},
	'color-xs': {
		type: 'string',
		default: '',
	},
	'font-size-unit-xs': {
		type: 'string',
		default: 'px',
	},
	'font-size-xs': {
		type: 'number',
		default: '',
	},
	'line-height-unit-xs': {
		type: 'string',
		default: '',
	},
	'line-height-xs': {
		type: 'number',
		default: '',
	},
	'letter-spacing-unit-xs': {
		type: 'string',
		default: 'px',
	},
	'letter-spacing-xs': {
		type: 'number',
		default: '',
	},
	'font-weight-xs': {
		type: 'number',
		default: '',
	},
	'text-transform-xs': {
		type: 'string',
		default: '',
	},
	'font-style-xs': {
		type: 'string',
		default: '',
	},
	'text-decoration-xs': {
		type: 'string',
		default: '',
	},
	'text-shadow-xs': {
		type: 'string',
		default: '',
	},
	'vertical-align-xs': {
		type: 'string',
		default: '',
	},
	customFormats: {
		type: 'object',
		default: {},
	},
};

const typography = (function typographyGenerator() {
	const response = {
		...typographyBase,
	};

	Object.entries(alignment).forEach(([key, value]) => {
		const newKey = key.replace('alignment-', 'typography-alignment-');

		if (key.includes('-general')) value.default = 'left';
		else value.default = '';

		response[newKey] = value;
	});

	return response;
})();

export default typography;
