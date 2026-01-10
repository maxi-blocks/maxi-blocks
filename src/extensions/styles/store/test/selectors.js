import { select } from '@wordpress/data';
import {
	getPostStyles,
	getBlockStyles,
	getPrevSavedAttrs,
	getCSSCache,
	getBlockMarginValue,
	getAllStylesAreSaved,
	getDefaultGroupAttributes,
} from '@extensions/styles/store/selectors';

jest.mock('@wordpress/data', () => ({
	select: jest.fn(() => ({
		getBlocks: jest.fn(() => ({
			block1: { clientId: 'client-1' },
			block2: { clientId: 'client-2' },
		})),
	})),
}));

jest.mock('@extensions/maxi-block', () => ({
	goThroughMaxiBlocks: jest.fn(callback => {
		[
			{ attributes: { uniqueID: 'block1' } },
			{ attributes: { uniqueID: 'block2' } },
		].forEach(callback);
	}),
}));

describe('Styles store selectors', () => {
	beforeEach(() => {
		select.mockImplementation(() => ({
			getBlocks: jest.fn(() => ({
				block1: { clientId: 'client-1' },
				block2: { clientId: 'client-2' },
			})),
		}));
	});

	describe('getPostStyles', () => {
		it('Returns styles from state if present', () => {
			const state = { styles: { block1: { color: 'red' } } };
			expect(getPostStyles(state)).toEqual({ block1: { color: 'red' } });
		});

		it('Returns state if no styles property', () => {
			const state = { block1: { color: 'red' } };
			expect(getPostStyles(state)).toEqual(state);
		});
	});

	describe('getBlockStyles', () => {
		it('Returns block styles for target if present', () => {
			const state = { styles: { block1: { color: 'red' } } };
			expect(getBlockStyles(state, 'block1')).toEqual({ color: 'red' });
		});

		it('Returns false if styles not found', () => {
			const state = { styles: null };
			expect(getBlockStyles(state, 'block1')).toBe(false);
		});
	});

	describe('getPrevSavedAttrs', () => {
		it('Returns previous saved attributes if present', () => {
			const state = {
				prevSavedAttrs: { color: 'blue' },
				prevSavedAttrsClientId: 'block1',
			};
			expect(getPrevSavedAttrs(state)).toEqual({
				prevSavedAttrs: { color: 'blue' },
				prevSavedAttrsClientId: 'block1',
			});
		});

		it('Returns false if no previous saved attributes', () => {
			const state = {};
			expect(getPrevSavedAttrs(state)).toBe(false);
		});
	});

	describe('getCSSCache', () => {
		it('Returns CSS cache for specific uniqueID', () => {
			const state = {
				cssCache: {
					block1: { css: '.block { color: red; }' },
				},
			};
			expect(getCSSCache(state, 'block1')).toEqual({
				css: '.block { color: red; }',
			});
		});

		it('Returns entire CSS cache when no uniqueID provided', () => {
			const state = {
				cssCache: {
					block1: { css: '.block1 { color: red; }' },
					block2: { css: '.block2 { color: blue; }' },
				},
			};
			expect(getCSSCache(state)).toEqual(state.cssCache);
		});

		it('Returns false when CSS cache not found', () => {
			const state = { cssCache: {} };
			expect(getCSSCache(state, 'block1')).toBe(false);
		});
	});

	describe('getBlockMarginValue', () => {
		it('Returns margin value if present', () => {
			const state = { blockMarginValue: 10 };
			expect(getBlockMarginValue(state)).toBe(10);
		});

		it('Returns false if margin value not present', () => {
			const state = {};
			expect(getBlockMarginValue(state)).toBe(false);
		});
	});

	describe('getAllStylesAreSaved', () => {
		it('Returns true when all blocks have styles', () => {
			const state = {
				styles: {
					block1: { color: 'red' },
					block2: { color: 'blue' },
				},
			};

			expect(getAllStylesAreSaved(state)).toBe(true);
		});

		it('Returns false when some blocks missing styles', () => {
			const state = {
				styles: {
					block1: { color: 'red' },
				},
			};

			expect(getAllStylesAreSaved(state)).toBe(false);
		});

		it('Falls back to traversal when store is empty', () => {
			select.mockImplementation(() => ({
				getBlocks: jest.fn(() => ({})),
			}));

			const state = {
				styles: {
					block1: { color: 'red' },
					block2: { color: 'blue' },
				},
			};

			expect(getAllStylesAreSaved(state)).toBe(true);
		});

		it('Returns false when no styles in state', () => {
			const state = {};

			expect(getAllStylesAreSaved(state)).toBe(false);
		});
	});

	describe('getDefaultGroupAttributes', () => {
		it('Returns default group attributes if present', () => {
			const state = {
				defaultGroupAttributes: { padding: '10px' },
			};
			expect(getDefaultGroupAttributes(state)).toEqual({
				padding: '10px',
			});
		});

		it('Returns false if no default group attributes', () => {
			const state = {};
			expect(getDefaultGroupAttributes(state)).toBe(false);
		});
	});
});
