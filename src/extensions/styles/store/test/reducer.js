import reducer from '@extensions/styles/store/reducer';
import * as defaultGroupAttributes from '@extensions/styles/defaults/index';
import { select } from '@wordpress/data';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(),
}));
jest.mock('@extensions/styles/styleGenerator', () =>
	jest.fn(() => ({
		result: '.test { color: red; }',
	}))
);

// Mock the MemoCache class
jest.mock('@extensions/maxi-block/memoizationHelper', () => ({
	MemoCache: jest.fn().mockImplementation((maxSize = 200) => ({
		cache: new Map(),
		maxSize,
		memoryStats: {
			totalSize: 0,
			averageSize: 0,
			lastCleanup: Date.now()
		},
		get: jest.fn(function(key) {
			return this.cache.get(key);
		}),
		set: jest.fn(function(key, value) {
			this.cache.set(key, value);
		}),
		delete: jest.fn(function(key) {
			return this.cache.delete(key);
		}),
		clear: jest.fn(function() {
			this.cache.clear();
		}),
		size: jest.fn(function() {
			return this.cache.size;
		}),
		has: jest.fn(function(key) {
			return this.cache.has(key);
		}),
		checkMemoryUsage: jest.fn(),
		getStats: jest.fn(() => ({
			size: 0,
			maxSize: 200,
			totalSize: 0,
			averageSize: 0,
			lastCleanup: Date.now(),
			hitRate: 0
		}))
	}))
}));

describe('styles store reducer', () => {
	// Helper to create a mock cache instance for testing
	const createMockCache = () => {
		const cache = new Map();
		return {
			cache,
			maxSize: 200,
			memoryStats: {
				totalSize: 0,
				averageSize: 0,
				lastCleanup: Date.now()
			},
			get: (key) => cache.get(key),
			set: (key, value) => cache.set(key, value),
			delete: (key) => cache.delete(key),
			clear: () => cache.clear(),
			size: () => cache.size,
			has: (key) => cache.has(key),
			checkMemoryUsage: jest.fn(),
			getStats: () => ({
				size: cache.size,
				maxSize: 200,
				totalSize: 0,
				averageSize: 0,
				lastCleanup: Date.now(),
				hitRate: 0
			})
		};
	};

	const getInitialState = () => {
		const state = reducer(undefined, { type: 'INIT' });
		return state;
	};

	beforeEach(() => {
		select.mockImplementation(store => {
			if (store === 'maxiBlocks') {
				return {
					receiveBaseBreakpoint: () => 'xxl',
					receiveMaxiDeviceType: () => 'general',
					receiveMaxiBreakpoints: () => ({
						general: 0,
						xxl: 1,
						xl: 2,
						l: 3,
						m: 4,
						s: 5,
						xs: 6,
					}),
				};
			}
			return {};
		});
	});

	it('Returns initial state when no state provided', () => {
		const action = { type: 'UNKNOWN_ACTION' };
		const result = reducer(undefined, action);

		// Check that the initial state has the correct structure
		expect(result).toMatchObject({
			styles: {},
			isUpdate: null,
			prevSavedAttrs: [],
			prevSavedAttrsClientId: null,
			blockMarginValue: '',
			defaultGroupAttributes
		});

		// Check that cssCache is a CSSCache instance with required methods
		expect(result.cssCache).toHaveProperty('get');
		expect(result.cssCache).toHaveProperty('set');
		expect(result.cssCache).toHaveProperty('size');
		expect(typeof result.cssCache.get).toBe('function');
		expect(typeof result.cssCache.set).toBe('function');
		expect(typeof result.cssCache.size).toBe('function');
	});

	it('Returns current state for unknown action', () => {
		const state = getInitialState();
		state.blockMarginValue = '10px';
		const action = { type: 'UNKNOWN_ACTION' };
		expect(reducer(state, action)).toEqual(state);
	});

	describe('UPDATE_STYLES action', () => {
		it('Updates styles with new styles', () => {
			const action = {
				type: 'UPDATE_STYLES',
				styles: { block1: { color: 'red' } },
			};
			const result = reducer(getInitialState(), action);

			expect(result.styles).toEqual({ block1: { color: 'red' } });
		});

		it('Merges new styles with existing styles', () => {
			const state = getInitialState();
			state.styles = { block1: { color: 'red' } };

			const action = {
				type: 'UPDATE_STYLES',
				styles: { block2: { color: 'blue' } },
			};
			const result = reducer(state, action);

			expect(result.styles).toEqual({
				block1: { color: 'red' },
				block2: { color: 'blue' },
			});
		});

		it('Chunks large style objects correctly', () => {
			// Create a large styles object
			const largeStyles = {};
			for (let i = 0; i < 150; i += 1) {
				largeStyles[`block${i}`] = { color: `color${i}` };
			}

			const action = {
				type: 'UPDATE_STYLES',
				styles: largeStyles,
			};
			const result = reducer(getInitialState(), action);

			// Verify all styles were added
			expect(Object.keys(result.styles).length).toBe(150);
			expect(result.styles.block0).toEqual({ color: 'color0' });
			expect(result.styles.block149).toEqual({ color: 'color149' });
		});
	});

	describe('SAVE_CSS_CACHE action', () => {
		it('Saves CSS cache for uniqueID', () => {
			const action = {
				type: 'SAVE_CSS_CACHE',
				uniqueID: 'block1',
				stylesObj: { color: 'red' },
				isIframe: false,
				isSiteEditor: false,
			};
			const result = reducer(getInitialState(), action);

			// Check that the cache entry was added
			expect(result.cssCache.get('block1')).toBeDefined();
			expect(result.cssCache.get('block1')).toHaveProperty('general');
		});

		it('Returns existing cache if already present', () => {
			const state = getInitialState();
			const existingCacheEntry = { general: { existingStyles: true } };

			// Pre-populate the cache
			state.cssCache.set('block1', existingCacheEntry);

			const action = {
				type: 'SAVE_CSS_CACHE',
				uniqueID: 'block1',
				stylesObj: { color: 'red' },
				isIframe: false,
				isSiteEditor: false,
			};

			const result = reducer(state, action);

			// Should return the existing cache entry (not generate new styles)
			expect(result.cssCache.get('block1')).toEqual(existingCacheEntry);
		});

		it('Uses LRU cache behavior with size limits', () => {
			const state = getInitialState();

			// Add multiple cache entries
			for (let i = 0; i < 5; i += 1) {
				const action = {
					type: 'SAVE_CSS_CACHE',
					uniqueID: `block${i}`,
					stylesObj: { color: `color${i}` },
					isIframe: false,
					isSiteEditor: false,
				};
				reducer(state, action);
			}

			// Verify cache has entries
			expect(state.cssCache.size()).toBe(5);
			expect(state.cssCache.get('block0')).toBeDefined();
			expect(state.cssCache.get('block4')).toBeDefined();
		});
	});

	describe('SAVE_RAW_CSS_CACHE action', () => {
		it('Saves raw CSS content to existing cache entry', () => {
			const state = getInitialState();

			// First add a cache entry
			const saveAction = {
				type: 'SAVE_CSS_CACHE',
				uniqueID: 'block1',
				stylesObj: { color: 'red' },
				isIframe: false,
				isSiteEditor: false,
			};
			reducer(state, saveAction);

			// Then add raw CSS content
			const rawAction = {
				type: 'SAVE_RAW_CSS_CACHE',
				uniqueID: 'block1',
				stylesContent: { rawCSS: '.custom { display: block; }' }
			};
			const result = reducer(state, rawAction);

			// Should merge the raw content with existing cache
			const cached = result.cssCache.get('block1');
			expect(cached).toHaveProperty('rawCSS');
			expect(cached.rawCSS).toBe('.custom { display: block; }');
		});

		it('Creates new cache entry when none exists', () => {
			const action = {
				type: 'SAVE_RAW_CSS_CACHE',
				uniqueID: 'block1',
				stylesContent: { rawCSS: '.custom { display: block; }' }
			};
			const result = reducer(getInitialState(), action);

			// Should create a new cache entry with the raw content
			const cached = result.cssCache.get('block1');
			expect(cached).toHaveProperty('rawCSS');
			expect(cached.rawCSS).toBe('.custom { display: block; }');
		});
	});

	describe('REMOVE_CSS_CACHE action', () => {
		it('Removes CSS cache entry by uniqueID', () => {
			const state = getInitialState();

			// First add a cache entry
			const saveAction = {
				type: 'SAVE_CSS_CACHE',
				uniqueID: 'block1',
				stylesObj: { color: 'red' },
				isIframe: false,
				isSiteEditor: false,
			};
			reducer(state, saveAction);

			// Verify it exists
			expect(state.cssCache.get('block1')).toBeDefined();

			// Remove the cache entry
			const removeAction = {
				type: 'REMOVE_CSS_CACHE',
				uniqueID: 'block1'
			};
			const result = reducer(state, removeAction);

			// Should be removed
			expect(result.cssCache.get('block1')).toBeUndefined();
		});
	});
});
