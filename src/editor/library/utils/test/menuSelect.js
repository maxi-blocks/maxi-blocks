import isMenuSelectItemRefined from '../menuSelect';

describe('isMenuSelectItemRefined', () => {
	it('uses currentRefinement for synthesized Free and Cloud menu items', () => {
		const unrefinedItem = {
			isRefined: false,
		};

		expect(
			isMenuSelectItemRefined('Free', unrefinedItem, 'Free')
		).toBe(true);
		expect(isMenuSelectItemRefined('Pro', unrefinedItem, 'Pro')).toBe(
			true
		);
	});

	it('keeps Algolia refined items active when currentRefinement is empty', () => {
		expect(
			isMenuSelectItemRefined(
				'',
				{
					isRefined: true,
				},
				'Free'
			)
		).toBe(true);
	});

	it('does not mark unrelated menu items active', () => {
		expect(
			isMenuSelectItemRefined(
				'Free',
				{
					isRefined: false,
				},
				'Pro'
			)
		).toBe(false);
	});

	it('returns false when the menu item is missing and does not match', () => {
		expect(isMenuSelectItemRefined('', undefined, 'Free')).toBe(false);
	});
});
