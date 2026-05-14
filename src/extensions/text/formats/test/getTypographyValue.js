import getTypographyValue from '@extensions/text/formats/getTypographyValue';
import { getLastBreakpointAttribute } from '@extensions/styles';
import getCustomFormatValue from '@extensions/text/formats/getCustomFormatValue';

jest.mock('@extensions/styles', () => ({
	getLastBreakpointAttribute: jest.fn(),
}));
jest.mock('@extensions/text/formats/getCustomFormatValue', () => jest.fn());

describe('getTypographyValue', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('Should return last breakpoint attribute when formats are disabled', () => {
		getLastBreakpointAttribute.mockReturnValue('mock-value');

		const result = getTypographyValue({
			disableFormats: true,
			prop: 'font-size',
			breakpoint: 'general',
			typography: { 'font-size-general': '16px' },
			isHover: false,
		});

		expect(getLastBreakpointAttribute).toHaveBeenCalledWith({
			target: 'font-size',
			breakpoint: 'general',
			attributes: { 'font-size-general': '16px' },
			isHover: false,
		});
		expect(result).toBe('mock-value');
	});

	it('Should return non-hover value when isHover is false', () => {
		getCustomFormatValue.mockReturnValue('format-value');

		const result = getTypographyValue({
			prop: 'font-size',
			breakpoint: 'general',
			typography: { 'font-size-general': '16px' },
			isHover: false,
			formatValue: 'someFormat',
			textLevel: 'h1',
			blockStyle: 'default',
			styleCard: {},
			styleCardPrefix: 'prefix',
		});

		expect(getCustomFormatValue).toHaveBeenCalledWith(
			expect.objectContaining({
				typography: { 'font-size-general': '16px' },
				formatValue: 'someFormat',
				prop: 'font-size',
				breakpoint: 'general',
				textLevel: 'h1',
				blockStyle: 'default',
				styleCard: {},
				styleCardPrefix: 'prefix',
				avoidXXL: true,
				avoidSC: false,
			})
		);
		expect(result).toBe('format-value');
	});

	it('Should handle hover values correctly', () => {
		getCustomFormatValue
			.mockReturnValueOnce('non-hover-value') // First call for non-hover
			.mockReturnValueOnce('hover-value'); // Second call for hover

		const result = getTypographyValue({
			prop: 'font-size',
			breakpoint: 'general',
			typography: { 'font-size-general': '16px' },
			isHover: true,
			formatValue: 'someFormat',
			textLevel: 'h1',
			blockStyle: 'default',
			styleCard: {},
			styleCardPrefix: 'prefix',
		});

		expect(result).toBe('hover-value');
	});

	it('Should fall back to non-hover value when hover value is null', () => {
		getCustomFormatValue
			.mockReturnValueOnce('non-hover-value') // First call for non-hover
			.mockReturnValueOnce(null); // Second call for hover

		const result = getTypographyValue({
			prop: 'font-size',
			breakpoint: 'general',
			typography: { 'font-size-general': '16px' },
			isHover: true,
			formatValue: 'someFormat',
			textLevel: 'h1',
			blockStyle: 'default',
			styleCard: {},
			styleCardPrefix: 'prefix',
		});

		expect(result).toBe('non-hover-value');
	});

	it('Should handle boolean hover values', () => {
		getCustomFormatValue
			.mockReturnValueOnce('non-hover-value') // First call for non-hover
			.mockReturnValueOnce(false); // Second call for hover

		const result = getTypographyValue({
			prop: 'font-size',
			breakpoint: 'general',
			typography: { 'font-size-general': '16px' },
			isHover: true,
			formatValue: 'someFormat',
		});

		expect(result).toBe(false);
	});

	it('Should handle numeric hover values', () => {
		getCustomFormatValue
			.mockReturnValueOnce('non-hover-value') // First call for non-hover
			.mockReturnValueOnce(0); // Second call for hover

		const result = getTypographyValue({
			prop: 'font-size',
			breakpoint: 'general',
			typography: { 'font-size-general': '16px' },
			isHover: true,
			formatValue: 'someFormat',
		});

		expect(result).toBe(0);
	});

	it('Should try alternative prop without prefix', () => {
		getCustomFormatValue
			.mockReturnValueOnce(null) // First try with prefix
			.mockReturnValueOnce('alternative-value'); // Second try without prefix

		const result = getTypographyValue({
			prop: 'font-size',
			prefix: 'prefix-',
			breakpoint: 'general',
			typography: { 'font-size-general': '16px' },
			isHover: false,
			formatValue: 'someFormat',
		});

		expect(result).toBe('alternative-value');
		expect(getCustomFormatValue).toHaveBeenCalledTimes(2);
	});
});
