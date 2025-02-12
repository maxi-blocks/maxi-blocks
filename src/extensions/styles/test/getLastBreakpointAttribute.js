jest.mock('@wordpress/data', () => {
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

	let counter = 0;

	return {
		select: jest.fn(() => {
			return {
				getSelectedBlockCount: jest.fn(() => {
					counter += 1;
					return [1, 2].includes(counter) ? 2 : 1;
				}),
				receiveBaseBreakpoint: jest.fn(() => 'xl'),
				receiveMaxiDeviceType: jest.fn(() => 'general'),
				getSelectedBlockClientId: jest.fn(() => '1'),
				getSelectedBlockClientIds: jest.fn(() => ['1', '2']),
				getBlockAttributes: jest.fn(clientId => {
					// For test case with multiple blocks and different attributes
					if (counter === 2) {
						return clientId === '1'
							? { 'test-general': 1 }
							: { 'test-general': 2 };
					}

					return attributes;
				}),
			};
		}),
	};
});

import getLastBreakpointAttribute from '@extensions/styles/getLastBreakpointAttribute';
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
	// These two tests should be called first and second because they use a different
	// getSelectedBlockCount mock. Can't use mockImplementation because select is called
	// only once when the getLastBreakpointAttribute is imported, so it will always have values from jest.doMock.
	test('Should return the correct value when multiple blocks are selected and all have equal target attribute value', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'general',
		});

		expect(result).toBe(1);
	});

	test('Should return null when multiple blocks are selected and the target attribute value is different', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'general',
		});

		expect(result).toBe(null);
	});

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

	test('Should return XL value when breakpoint is General but there is not General attribute; baseBreakpoint is XL', () => {
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

	test('Should return XXL value when breakpoint is General but there is not General attribute; baseBreakpoint is XXL', () => {
		select.mockImplementation(() => ({
			getSelectedBlockCount: jest.fn(() => 1),
			receiveMaxiDeviceType: jest.fn(() => 'general'),
			receiveBaseBreakpoint: jest.fn(() => 'xxl'),
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

	test('Should return XXL value when breakpoint is General and baseBreakpoint is XXL', () => {
		select.mockImplementation(() => ({
			getSelectedBlockCount: jest.fn(() => 1),
			receiveMaxiDeviceType: jest.fn(() => 'general'),
			receiveBaseBreakpoint: jest.fn(() => 'xxl'),
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

	test('Should return general key of object', () => {
		const result = getLastBreakpointAttribute({
			target: 'test',
			breakpoint: 'general',
			attributes: {
				'test-general': {
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
				'test-general': {
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
			breakpoint: 'general',
			attributes: {
				'test-general-hover': {
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
				'test-general-hover': {
					'test-key': 1,
				},
				'test-xl-hover': {
					'test-key': 2,
				},
				'test-m-hover': {
					'test-key': 3,
				},
				'test-s-hover': {
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
			breakpoint: 'general',
			attributes: {
				'test-general': {
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
				'test-general': {
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

	test('Should return general value being on XXL baseBreakpoint and enabling `forceUseBreakpoint`', () => {
		select.mockImplementation(() => ({
			getSelectedBlockCount: jest.fn(() => 1),
			receiveMaxiDeviceType: jest.fn(() => 'general'),
			receiveBaseBreakpoint: jest.fn(() => 'xxl'),
		}));

		const args = {
			target: 'line-height-unit',
			breakpoint: 'general',
			attributes: {
				'palette-status-general': true,
				'palette-sc-status-general': false,
				'palette-color-general': 5,
				'list-palette-status-general': true,
				'list-palette-sc-status-general': false,
				'list-palette-color-general': 4,
				'font-size-unit-general': 'px',
				'font-size-general': 65,
				'font-size-xxl': 94,
				'font-size-l': 50,
				'font-size-m': 40,
				'font-size-xs': 30,
				'line-height-unit-general': 'px',
				'line-height-unit-xxl': 'em',
				'line-height-unit-l': 'px',
				'line-height-general': 78,
				'line-height-xxl': 1.2,
				'line-height-l': 65,
				'line-height-m': 55,
				'line-height-xs': 42,
				'letter-spacing-unit-general': 'px',
				'font-weight-general': '700',
				'text-indent-unit-general': 'px',
				'word-spacing-unit-general': 'px',
				'bottom-gap-general': 0,
				'bottom-gap-unit-general': 'px',
			},
			forceUseBreakpoint: true,
		};

		const result = getLastBreakpointAttribute(args);

		expect(result).toBe('px');
	});
});
