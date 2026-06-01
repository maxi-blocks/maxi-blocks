import isMenuSelectItemRefined from '../menuSelect';

describe('isMenuSelectItemRefined', () => {
	it('uses currentRefinement for synthesized Free and Cloud menu items', () => {
		expect(isMenuSelectItemRefined('Free', 'Free')).toBe(true);
		expect(isMenuSelectItemRefined('Pro', 'Pro')).toBe(true);
	});

	it('does not keep a stale menu item active after refinement changes', () => {
		expect(isMenuSelectItemRefined('Free', 'Pro')).toBe(false);
	});

	it('does not mark unrelated menu items active', () => {
		expect(isMenuSelectItemRefined('Free', 'Pro')).toBe(false);
	});

	it('returns false when there is no current refinement for the item', () => {
		expect(isMenuSelectItemRefined('', 'Free')).toBe(false);
	});
});
