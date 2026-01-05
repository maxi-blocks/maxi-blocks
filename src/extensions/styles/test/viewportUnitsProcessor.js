jest.mock('@extensions/dom/getViewPortUnitsSize', () => jest.fn());

import viewportUnitsProcessor from '@extensions/styles/viewportUnitsProcessor';
import getVwSize from '@extensions/dom/getViewPortUnitsSize';

describe('viewportUnitsProcessor', () => {
	beforeEach(() => {
		getVwSize.mockReset();
	});

	it('returns original object for general breakpoint', () => {
		const obj = { fontSize: '10vw' };

		const result = viewportUnitsProcessor(obj, 'general');

		expect(result).toEqual(obj);
	});

	it('converts vw values to px for non-general breakpoint', () => {
		getVwSize.mockReturnValue(5);

		const obj = { fontSize: '2vw' };

		const result = viewportUnitsProcessor(obj, 'm');

		expect(result.fontSize).toBe('10px');
	});

	it('keeps complex viewport expressions untouched', () => {
		getVwSize.mockReturnValue(5);

		const obj = { fontSize: 'calc(100vw - 20px)' };

		const result = viewportUnitsProcessor(obj, 'm');

		expect(result.fontSize).toBe('calc(100vw - 20px)');
	});

	it('converts vh values to px when viewport height is available', () => {
		const originalDescriptor = Object.getOwnPropertyDescriptor(
			window,
			'innerHeight'
		);

		Object.defineProperty(window, 'innerHeight', {
			configurable: true,
			value: 800,
		});

		const obj = { lineHeight: '10vh' };

		const result = viewportUnitsProcessor(obj, 'm');

		expect(result.lineHeight).toBe('80px');

		if (originalDescriptor) {
			Object.defineProperty(window, 'innerHeight', originalDescriptor);
		}
	});

	it('uses breakpoint key as context for nested processing', () => {
		// Simulate different sizes for different breakpoints
		getVwSize.mockImplementation(bp => {
			const sizes = { m: 7, s: 4 };
			return sizes[bp] || 10;
		});

		const obj = {
			m: { fontSize: '10vw' },
			s: { fontSize: '10vw' },
		};

		const result = viewportUnitsProcessor(obj, 'm');

		// 'm' breakpoint: 10 * 7 = 70px
		expect(result.m.fontSize).toBe('70px');
		// 's' breakpoint: 10 * 4 = 40px
		expect(result.s.fontSize).toBe('40px');
	});

	it('converts general values using top-level breakpoint context', () => {
		// This is the key fix: when viewing at 'm' breakpoint,
		// 'general' values should be converted using 'm' viewport size
		// because they cascade via CSS inheritance
		getVwSize.mockImplementation(bp => {
			const sizes = { m: 5, l: 10 };
			return sizes[bp] || null;
		});

		const obj = {
			general: { fontSize: '10vw' },
			m: { color: 'red' }, // m has no font-size, inherits from general
		};

		// When at 'm' breakpoint, general's 10vw should convert using m's size
		const result = viewportUnitsProcessor(obj, 'm');

		// 'general' should be converted using 'm' context: 10 * 5 = 50px
		expect(result.general.fontSize).toBe('50px');
	});

	it('uses specific breakpoint size when breakpoint has explicit values', () => {
		getVwSize.mockImplementation(bp => {
			const sizes = { m: 5, l: 10 };
			return sizes[bp] || null;
		});

		const obj = {
			general: { fontSize: '10vw' },
			l: { fontSize: '10vw' },
		};

		const result = viewportUnitsProcessor(obj, 'm');

		// 'general' uses top-level 'm': 10 * 5 = 50px
		expect(result.general.fontSize).toBe('50px');
		// 'l' uses its own context: 10 * 10 = 100px
		expect(result.l.fontSize).toBe('100px');
	});
});
