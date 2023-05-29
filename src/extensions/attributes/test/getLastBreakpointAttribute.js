import getLastBreakpointAttribute from '../getLastBreakpointAttribute';

jest.mock('@wordpress/data', () => {
	return {
		select: jest.fn(() => {
			return {
				getSelectedBlockCount: jest.fn(() => 1),
				receiveBaseBreakpoint: jest.fn(() => 'xl'),
				receiveMaxiDeviceType: jest.fn(() => 'g'),
			};
		}),
	};
});

import { select } from '@wordpress/data';

const attributes = {
	'test-g': 1,
	'test-g.h': 10,
	'test-xxl': 2,
	'test-xxl.h': 20,
	'test-l': 4,
	'test-l.h': 40,
	'test-m': 5,
	'test-m.h': 50,
	'test-s': 6,
	'test-s.h': 60,
	'test-xs': 7,
	'test-xs.h': 70,
};

describe('getLastBreakpointAttribute', () => {
	test('Should return General value', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'g',
			attributes,
		});

		expect(result).toBe(1);
	});

	test('Should return General hover value', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'g',
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
				'test-xl.h': 30,
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

	test('Should return XL value when breakpoint is General but there is not General attribute; baseBreakpoint is XL', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'g',
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

	test('Should return XXL value when breakpoint is General but there is not General attribute; baseBreakpoint is XXL', () => {
		select.mockImplementation(() => ({
			getSelectedBlockCount: jest.fn(() => 1),
			receiveMaxiDeviceType: jest.fn(() => 'g'),
			receiveBaseBreakpoint: jest.fn(() => 'xxl'),
		}));

		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'g',
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

	test('Should return XXL value when breakpoint is General and baseBreakpoint is XXL', () => {
		select.mockImplementation(() => ({
			getSelectedBlockCount: jest.fn(() => 1),
			receiveMaxiDeviceType: jest.fn(() => 'g'),
			receiveBaseBreakpoint: jest.fn(() => 'xxl'),
		}));

		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'g',
			attributes: {
				'test-g': 1,
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

	test('Should return general key of object', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'g',
			attributes: {
				'test-g': {
					'test-key': 1,
				},
			},
			keys: ['test-key'],
		});

		expect(result).toBe(1);
	});

	test('Should return m breakpoint key of object', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'm',
			attributes: {
				'test-g': {
					'test-key': 1,
				},
				'test-xl': {
					'test-key': 2,
				},
				'test-m': {
					'test-key': 3,
				},
				'test-s': {
					'test-key': 4,
				},
			},
			keys: ['test-key'],
		});
		expect(result).toBe(3);
	});

	test('Should return general hover key of object', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'g',
			attributes: {
				'test-g.h': {
					'test-key': 1,
				},
			},
			keys: ['test-key'],
			isHover: true,
		});
		expect(result).toBe(1);
	});

	test('Should return m breakpoint hover key of object', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'm',
			attributes: {
				'test-g.h': {
					'test-key': 1,
				},
				'test-xl.h': {
					'test-key': 2,
				},
				'test-m.h': {
					'test-key': 3,
				},
				'test-s.h': {
					'test-key': 4,
				},
			},
			keys: ['test-key'],
			isHover: true,
		});
		expect(result).toBe(3);
	});

	test('Should return general key of object, when object has multiply nested keys', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'g',
			attributes: {
				'test-g': {
					'test-key': {
						'test-key-2': 1,
					},
				},
			},
			keys: ['test-key', 'test-key-2'],
		});
		expect(result).toBe(1);
	});

	test('Should return m breakpoint key of object, when object has multiply nested keys', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'm',
			attributes: {
				'test-g': {
					'test-key': {
						'test-key-2': 1,
					},
				},
				'test-xl': {
					'test-key': {
						'test-key-2': 2,
					},
				},
				'test-m': {
					'test-key': {
						'test-key-2': 3,
					},
				},
				'test-s': {
					'test-key': {
						'test-key-2': 4,
					},
				},
			},
			keys: ['test-key', 'test-key-2'],
		});
		expect(result).toBe(3);
	});

	test('Should return an array by default when target is an array', () => {
		const result = getLastBreakpointAttribute({
			target: ['test', 'test-2'],
			breakpoint: 'm',
			attributes: {
				'test-g': 'test-g',
				'test-xl': 'test-xl',
				'test-m': 'test-m',
				'test-s': 'test-s',
				'test-2-g': 'test-2-g',
				'test-2-xl': 'test-2-xl',
				'test-2-m': 'test-2-m',
				'test-2-s': 'test-2-s',
			},
		});

		expect(result).toEqual(['test-m', 'test-2-m']);
	});

	test('Should return an object when target is an array and returnObj is true', () => {
		const result = getLastBreakpointAttribute({
			target: ['test', 'test-2'],
			breakpoint: 'm',
			attributes: {
				'test-g': 'test-g',
				'test-xl': 'test-xl',
				'test-m': 'test-m',
				'test-s': 'test-s',
				'test-2-g': 'test-2-g',
				'test-2-xl': 'test-2-xl',
				'test-2-m': 'test-2-m',
				'test-2-s': 'test-2-s',
			},
			returnObj: true,
		});

		expect(result).toEqual({
			test: 'test-m',
			'test-2': 'test-2-m',
		});
	});
});
