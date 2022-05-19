import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				getSelectedBlockCount: jest.fn(() => 1),
				receiveWinBreakpoint: jest.fn(() => 'xl'),
			};
		}),
	};
});

import { select } from '@wordpress/data';

const attributes = {
	'test-general': 1,
	'test-general-hover': 10,
	'test-xxl': 2,
	'test-xxl-hover': 20,
	// Removed for General tests
	// 'test-xl': 3,
	// 'test-xl-hover': 30,
	'test-l': 4,
	'test-l-hover': 40,
	'test-m': 5,
	'test-m-hover': 50,
	'test-s': 6,
	'test-s-hover': 60,
	'test-xs': 7,
	'test-xs-hover': 70,
};

describe('getLastBreakpointAttribute', () => {
	test('Should return General value', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'general',
			attributes,
		});

		expect(result).toBe(1);
	});

	test('Should return General hover value', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'general',
			attributes,
			isHover: true,
		});

		expect(result).toBe(10);
	});

	test('Should return XXL value', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'xxl',
			attributes,
		});

		expect(result).toBe(2);
	});

	test('Should return XXL hover value', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'xxl',
			attributes,
			isHover: true,
		});

		expect(result).toBe(20);
	});

	test('Should return XL value', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'xl',
			attributes: {
				...attributes,
				'test-xl': 3,
			},
		});

		expect(result).toBe(3);
	});

	test('Should return XL hover value', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'xl',
			attributes: {
				...attributes,
				'test-xl-hover': 30,
			},
			isHover: true,
		});

		expect(result).toBe(30);
	});

	test('Should return S value', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 's',
			attributes,
		});

		expect(result).toBe(6);
	});

	test('Should return S hover value', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 's',
			attributes,
			isHover: true,
		});

		expect(result).toBe(60);
	});

	test('Should return XS value', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'xs',
			attributes,
		});

		expect(result).toBe(7);
	});

	test('Should return XS hover value', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'xs',
			attributes,
			isHover: true,
		});

		expect(result).toBe(70);
	});

	test('Should return XL value when breakpoint is General but there is not General attribute; winBreakpoint is XL', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'general',
			attributes: {
				'test-xxl': 2,
				'test-xl': 3,
				'test-l': 4,
				'test-m': 5,
				'test-s': 6,
				'test-xs': 7,
			},
		});

		expect(result).toBe(3);
	});

	test('Should return XXL value when breakpoint is General but there is not General attribute; winBreakpoint is XXL', () => {
		select.mockImplementation(() => ({
			getSelectedBlockCount: jest.fn(() => 1),
			receiveWinBreakpoint: jest.fn(() => 'xxl'),
		}));

		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'general',
			attributes: {
				'test-xxl': 2,
				'test-xl': 3,
				'test-l': 4,
				'test-m': 5,
				'test-s': 6,
				'test-xs': 7,
			},
		});

		expect(result).toBe(2);
	});

	test('Should return XXL value when breakpoint is General and winBreakpoint is XXL', () => {
		select.mockImplementation(() => ({
			getSelectedBlockCount: jest.fn(() => 1),
			receiveWinBreakpoint: jest.fn(() => 'xxl'),
		}));

		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'general',
			attributes: {
				'test-general': 1,
				'test-xxl': 2,
				'test-xl': 3,
				'test-l': 4,
				'test-m': 5,
				'test-s': 6,
				'test-xs': 7,
			},
		});

		expect(result).toBe(2);
	});
});
