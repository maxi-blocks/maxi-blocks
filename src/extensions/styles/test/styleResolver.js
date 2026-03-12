const mockUpdateStyles = jest.fn();
const mockRemoveStyles = jest.fn();
const mockGetBlockStyles = jest.fn();

jest.mock('@wordpress/data', () => ({
	dispatch: jest.fn(() => ({
		updateStyles: mockUpdateStyles,
		removeStyles: mockRemoveStyles,
	})),
	select: jest.fn(() => ({
		getBlockStyles: mockGetBlockStyles,
	})),
}));

import styleResolver, {
	styleCacheUtils,
} from '@extensions/styles/styleResolver';

describe('styleResolver cache limits', () => {
	beforeEach(() => {
		styleCacheUtils.clearCache();
		mockUpdateStyles.mockClear();
		mockRemoveStyles.mockClear();
		mockGetBlockStyles.mockReset();
		mockGetBlockStyles.mockReturnValue(undefined);
	});

	it('caches small style resolutions', () => {
		const styles = {
			block: {
				color: {
					general: 'red',
				},
			},
		};

		styleResolver({
			styles,
			breakpoints: ['general'],
			uniqueID: 'small-block',
		});
		styleResolver({
			styles,
			breakpoints: ['general'],
			uniqueID: 'small-block',
		});

		const stats = styleCacheUtils.getStats();

		expect(stats.styleCacheSize).toBe(1);
		expect(stats.hits).toBeGreaterThan(0);
	});

	it('skips caching oversized style resolutions', () => {
		const largeStyles = {
			block: {
				content: {
					general: 'x'.repeat(25000),
				},
			},
		};

		styleResolver({
			styles: largeStyles,
			breakpoints: ['general'],
			uniqueID: 'large-block',
		});

		const stats = styleCacheUtils.getStats();

		expect(stats.styleCacheSize).toBe(0);
		expect(stats.skippedLargeEntries).toBeGreaterThan(0);
	});

	it('dispatches merged styles once per resolution even with multiple targets', () => {
		const styles = {
			blockA: {
				color: {
					general: 'red',
				},
			},
			blockB: {
				color: {
					general: 'blue',
				},
			},
		};

		styleResolver({
			styles,
			breakpoints: ['general'],
			uniqueID: 'multi-target',
		});

		expect(mockUpdateStyles).toHaveBeenCalledTimes(1);
		expect(mockUpdateStyles).toHaveBeenCalledWith(
			null,
			expect.objectContaining({
				blockA: expect.any(Object),
				blockB: expect.any(Object),
			})
		);
	});

	it('dispatches cached styles once on cache hit', () => {
		const styles = {
			blockA: {
				color: {
					general: 'red',
				},
			},
			blockB: {
				color: {
					general: 'blue',
				},
			},
		};

		styleResolver({
			styles,
			breakpoints: ['general'],
			uniqueID: 'cached-multi-target',
		});
		styleResolver({
			styles,
			breakpoints: ['general'],
			uniqueID: 'cached-multi-target',
		});

		expect(mockUpdateStyles).toHaveBeenCalledTimes(2);
		expect(mockUpdateStyles).toHaveBeenNthCalledWith(
			2,
			null,
			expect.objectContaining({
				blockA: expect.any(Object),
				blockB: expect.any(Object),
			})
		);
	});

	it('skips cache-hit store sync when styles are already current', () => {
		const styles = {
			blockA: {
				color: {
					general: 'red',
				},
			},
		};

		const cachedResponse = styleResolver({
			styles,
			breakpoints: ['general'],
			uniqueID: 'already-synced',
		});

		mockGetBlockStyles.mockImplementation(target => cachedResponse[target]);

		styleResolver({
			styles,
			breakpoints: ['general'],
			uniqueID: 'already-synced',
		});

		expect(mockUpdateStyles).toHaveBeenCalledTimes(1);
	});
});
