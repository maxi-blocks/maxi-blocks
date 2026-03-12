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
import { clearPendingStyles } from '@extensions/styles/store/pendingStyles';

const flushMicrotasks = async () => Promise.resolve();

describe('styleResolver cache limits', () => {
	beforeEach(() => {
		styleCacheUtils.clearCache();
		clearPendingStyles();
		mockUpdateStyles.mockClear();
		mockRemoveStyles.mockClear();
		mockGetBlockStyles.mockReset();
		mockGetBlockStyles.mockReturnValue(undefined);
	});

	it('caches small style resolutions', async () => {
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
		await flushMicrotasks();

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

	it('dispatches merged styles once per resolution even with multiple targets', async () => {
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
		await flushMicrotasks();

		expect(mockUpdateStyles).toHaveBeenCalledTimes(1);
		expect(mockUpdateStyles).toHaveBeenCalledWith(
			null,
			expect.objectContaining({
				blockA: expect.any(Object),
				blockB: expect.any(Object),
			})
		);
	});

	it('dispatches cached styles once on cache hit', async () => {
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
		await flushMicrotasks();

		expect(mockUpdateStyles).toHaveBeenCalledTimes(1);
		expect(mockUpdateStyles).toHaveBeenNthCalledWith(
			1,
			null,
			expect.objectContaining({
				blockA: expect.any(Object),
				blockB: expect.any(Object),
			})
		);
	});

	it('skips cache-hit store sync when styles are already current', async () => {
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
		await flushMicrotasks();

		mockGetBlockStyles.mockImplementation(target => cachedResponse[target]);

		styleResolver({
			styles,
			breakpoints: ['general'],
			uniqueID: 'already-synced',
		});
		await flushMicrotasks();

		expect(mockUpdateStyles).toHaveBeenCalledTimes(1);
	});

	it('skips queued flush dispatch when store becomes current before flush', async () => {
		const styles = {
			blockA: {
				color: {
					general: 'red',
				},
			},
		};

		const response = styleResolver({
			styles,
			breakpoints: ['general'],
			uniqueID: 'flush-already-synced',
		});

		mockGetBlockStyles.mockImplementation(target => response[target]);
		await flushMicrotasks();

		expect(mockUpdateStyles).not.toHaveBeenCalled();
	});

	it('skips miss-path store sync when store already has the same styles', async () => {
		const styles = {
			blockA: {
				color: {
					general: 'red',
				},
			},
		};

		const initialResponse = styleResolver({
			styles,
			breakpoints: ['general'],
			uniqueID: 'miss-already-synced',
		});
		await flushMicrotasks();

		styleCacheUtils.clearCache();
		mockGetBlockStyles.mockImplementation(
			target => initialResponse[target]
		);

		styleResolver({
			styles,
			breakpoints: ['general'],
			uniqueID: 'miss-already-synced',
		});
		await flushMicrotasks();

		expect(mockUpdateStyles).toHaveBeenCalledTimes(1);
	});

	it('trims cleanup caches before evicting resolved style cache entries', async () => {
		const warnSpy = jest
			.spyOn(console, 'warn')
			.mockImplementation(() => {});
		const styles = {
			blockA: {
				color: {
					general: 'red',
				},
				spacing: {
					general: {
						top: '10px',
						bottom: '20px',
					},
				},
			},
		};

		styleResolver({
			styles,
			breakpoints: ['general'],
			uniqueID: 'trim-prefers-cleanup-caches',
		});
		await flushMicrotasks();

		const beforeTrim = styleCacheUtils.getStats();
		expect(beforeTrim.styleCacheSize).toBeGreaterThan(0);
		expect(beforeTrim.totalCacheSize).toBeGreaterThan(
			beforeTrim.styleCacheSize
		);

		styleCacheUtils.checkMemoryUsage(beforeTrim.styleCacheSize);

		const afterTrim = styleCacheUtils.getStats();
		expect(afterTrim.styleCacheSize).toBe(beforeTrim.styleCacheSize);
		expect(afterTrim.totalCacheSize).toBeLessThanOrEqual(
			beforeTrim.styleCacheSize
		);

		warnSpy.mockRestore();
	});
});
