import processDCDate, { formatDateOptions } from '@extensions/DC/processDCDate';
import moment from 'moment';

// Mock moment to ensure consistent tests regardless of timezone
jest.mock('moment', () => {
	const mockMoment = jest.fn().mockImplementation(date => {
		const momentInstance = jest.requireActual('moment')(date);
		momentInstance.format = jest.fn().mockImplementation(format => {
			// Return predictable values for certain formats to keep tests consistent
			if (format === 'ddd') return 'Sat';
			if (format === 'dddd') return 'Saturday';
			if (format === 'MMM') return 'Jan';
			if (format === 'MMMM') return 'January';
			if (format === 'D') return '1';
			if (format === 'MM') return '01';
			if (format === 'YY') return '22';
			if (format === 'YYYY') return '2022';
			if (format === 'HH:mm') return '12:30';

			// For custom formats, return a deterministic representation
			return jest
				.requireActual('moment')(new Date('2022-01-01T12:30:00Z'))
				.format(format);
		});
		return momentInstance;
	});
	return mockMoment;
});

describe('formatDateOptions', () => {
	it('should convert "none" values to undefined', () => {
		const input = {
			day: 'none',
			month: 'none',
			year: 'none',
			weekday: 'none',
			era: 'none',
			hour: 'none',
			minute: 'none',
			second: 'none',
			timezone: 'none',
			timezoneName: 'none',
			hour12: 'false',
		};

		const result = formatDateOptions(input);

		expect(result.day).toBeUndefined();
		expect(result.month).toBeUndefined();
		expect(result.year).toBeUndefined();
		expect(result.weekday).toBeUndefined();
		expect(result.era).toBeUndefined();
		expect(result.hour).toBeUndefined();
		expect(result.minute).toBeUndefined();
		expect(result.second).toBeUndefined();
		expect(result.timeZoneName).toBeUndefined();
	});

	it('should convert hour12 strings to boolean values', () => {
		expect(formatDateOptions({ hour12: 'true' }).hour12).toBe(true);
		expect(formatDateOptions({ hour12: 'false' }).hour12).toBe(false);
		expect(formatDateOptions({ hour12: 'numeric' }).hour12).toBe('numeric');
	});

	it('should set timeZone to UTC when "none" is provided', () => {
		expect(formatDateOptions({ timezone: 'none' }).timeZone).toBe('UTC');
	});

	it('should preserve timeZone when a value is provided', () => {
		expect(
			formatDateOptions({ timezone: 'America/New_York' }).timeZone
		).toBe('America/New_York');
	});

	it('should handle mixed values correctly', () => {
		const input = {
			day: 'numeric',
			month: 'long',
			year: 'none',
			weekday: 'short',
			hour12: 'true',
			timezone: 'Europe/London',
		};

		const result = formatDateOptions(input);

		expect(result.day).toBe('numeric');
		expect(result.month).toBe('long');
		expect(result.year).toBeUndefined();
		expect(result.weekday).toBe('short');
		expect(result.hour12).toBe(true);
		expect(result.timeZone).toBe('Europe/London');
	});

	it('should handle all "none" values', () => {
		const input = {
			day: 'none',
			era: 'none',
			hour: 'none',
			hour12: 'none',
			minute: 'none',
			month: 'none',
			second: 'none',
			timezone: 'none',
			timezoneName: 'none',
			weekday: 'none',
			year: 'none',
		};

		const result = formatDateOptions(input);

		// Test timezone special case
		expect(result.timeZone).toBe('UTC');

		// Test hour12 special case - it remains as 'none'
		expect(result.hour12).toBe('none');

		// Test timezoneName becomes undefined
		expect(result.timeZoneName).toBeUndefined();

		// Test remaining properties become undefined
		expect(result.day).toBeUndefined();
		expect(result.era).toBeUndefined();
		expect(result.hour).toBeUndefined();
		expect(result.minute).toBeUndefined();
		expect(result.month).toBeUndefined();
		expect(result.second).toBeUndefined();
		expect(result.weekday).toBeUndefined();
		expect(result.year).toBeUndefined();
	});
});

describe('processDCDate', () => {
	// Setting up a fixed date for all tests
	const testDate = '2022-01-01T12:30:00Z';
	let getTimezoneOffsetSpy;

	beforeAll(() => {
		getTimezoneOffsetSpy = jest
			.spyOn(Date.prototype, 'getTimezoneOffset')
			.mockImplementation(() => 0);
	});

	afterAll(() => {
		getTimezoneOffsetSpy.mockRestore();
	});

	beforeEach(() => {
		jest.clearAllMocks();
	});

	it('should format standard date with basic tokens', () => {
		const result = processDCDate(testDate, false, 'Y-m-d', 'en-US', {});

		expect(moment).toHaveBeenCalledWith(new Date(testDate));
		expect(result).toBe('2022-01-1');
	});

	it('should substitute special tokens DS and MS correctly', () => {
		const result = processDCDate(
			testDate,
			false,
			'DS, MS d, Y',
			'en-US',
			{}
		);

		// DS should become ddd, MS should become MMM
		expect(result).toBe('Sat, Jan 1, 2022');
	});

	it('should handle full date format tokens', () => {
		const result = processDCDate(testDate, false, 'D, M d, Y', 'en-US', {});

		// D -> dddd, M -> MMMM
		expect(result).toBe('Saturday, January 1, 2022');
	});

	it('should handle time token', () => {
		const result = processDCDate(testDate, false, 'd/m/Y t', 'en-US', {});

		// t -> HH:mm
		expect(result).toBe('1/01/2022 12:30');
	});

	it('should use toLocaleString when isCustomDate is true', () => {
		const mockDate = {
			toLocaleString: jest.fn().mockReturnValue('Custom Formatted Date'),
		};

		const originalDate = global.Date;
		global.Date = jest.fn(() => mockDate);
		global.Date.UTC = originalDate.UTC;

		const options = {
			day: 'numeric',
			month: 'long',
			year: 'numeric',
		};

		const result = processDCDate(
			testDate,
			true,
			'irrelevant-format',
			'en-US',
			options
		);

		expect(result).toBe('Custom Formatted Date');
		expect(mockDate.toLocaleString).toHaveBeenCalledWith('en-US', options);

		global.Date = originalDate;
	});

	it('should handle different locales with custom date', () => {
		const mockLocaleStringFn = jest.fn(locale => {
			if (locale === 'fr-FR') return '1 janvier 2022';
			if (locale === 'de-DE') return '1. Januar 2022';
			return 'January 1, 2022';
		});

		const mockDate = {
			toLocaleString: mockLocaleStringFn,
		};

		const originalDate = global.Date;
		global.Date = jest.fn(() => mockDate);
		global.Date.UTC = originalDate.UTC;

		const options = { day: 'numeric', month: 'long', year: 'numeric' };

		expect(processDCDate(testDate, true, '', 'en-US', options)).toBe(
			'January 1, 2022'
		);
		expect(processDCDate(testDate, true, '', 'fr-FR', options)).toBe(
			'1 janvier 2022'
		);
		expect(processDCDate(testDate, true, '', 'de-DE', options)).toBe(
			'1. Januar 2022'
		);

		// Restore original Date constructor
		global.Date = originalDate;
	});

	it('should handle complex format patterns', () => {
		const result = processDCDate(
			testDate,
			false,
			'DS, MS d, Y t',
			'en-US',
			{}
		);

		expect(result).toBe('Sat, Jan 1, 2022 12:30');
	});

	it('should handle format with special characters', () => {
		const result = processDCDate(
			testDate,
			false,
			'Y-m-d (DS)',
			'en-US',
			{}
		);

		expect(result).toBe('2022-01-1 (Sat)');
	});

	it('should handle year format variations', () => {
		expect(processDCDate(testDate, false, 'y', 'en-US', {})).toBe('22');
		expect(processDCDate(testDate, false, 'Y', 'en-US', {})).toBe('2022');
	});
});
