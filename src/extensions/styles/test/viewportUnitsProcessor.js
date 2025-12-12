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
});
