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

describe('styles store reducer', () => {
	const initialState = {
		styles: {},
		isUpdate: null,
		prevSavedAttrs: [],
		prevSavedAttrsClientId: null,
		cssCache: {},
		blockMarginValue: '',
		defaultGroupAttributes,
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
		expect(reducer(undefined, action)).toEqual(initialState);
	});

	it('Returns current state for unknown action', () => {
		const state = { ...initialState, blockMarginValue: '10px' };
		const action = { type: 'UNKNOWN_ACTION' };
		expect(reducer(state, action)).toEqual(state);
	});

	describe('UPDATE_STYLES action', () => {
		it('Updates styles with new styles', () => {
			const action = {
				type: 'UPDATE_STYLES',
				styles: { block1: { color: 'red' } },
			};
			const result = reducer(initialState, action);

			expect(result.styles).toEqual({ block1: { color: 'red' } });
		});

		it('Merges new styles with existing styles', () => {
			const state = {
				...initialState,
				styles: { block1: { color: 'red' } },
			};
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
			const result = reducer(initialState, action);

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
			const result = reducer(initialState, action);

			expect(result.cssCache).toHaveProperty('block1');
			expect(result.cssCache.block1).toHaveProperty('general');
		});

		it('Truncates cache when it exceeds 100 items', () => {
			// Create state with 100 cache items
			const state = {
				...initialState,
				cssCache: {},
			};

			for (let i = 0; i < 100; i += 1) {
				state.cssCache[`block${i}`] = { general: {} };
			}

			const action = {
				type: 'SAVE_CSS_CACHE',
				uniqueID: 'newBlock',
				stylesObj: { color: 'red' },
				isIframe: false,
				isSiteEditor: false,
			};

			const result = reducer(state, action);

			// Should have 100 items (truncated old ones)
			expect(Object.keys(result.cssCache).length).toBe(100);
			// Should have the new block
			expect(result.cssCache).toHaveProperty('newBlock');
			// Should not have the first block (truncated)
			expect(result.cssCache).not.toHaveProperty('block0');
		});
	});
});
