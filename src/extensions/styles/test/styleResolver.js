jest.mock('@wordpress/data', () => {
	const updateStyles = jest.fn();
	const removeStyles = jest.fn();

	return {
		dispatch: jest.fn(() => ({
			updateStyles,
			removeStyles,
		})),
	};
});

import styleResolver, {
	styleCacheUtils,
} from '@extensions/styles/styleResolver';

describe('styleResolver cache limits', () => {
	beforeEach(() => {
		styleCacheUtils.clearCache();
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
});
