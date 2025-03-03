import {
	getNewActiveStyleCards,
	getNewSelectedStyleCards,
	removeStyleCard,
} from '@extensions/style-cards/store/reducer';

jest.mock('@maxi-core/defaults/defaultSC.json', () => ({
	sc_maxi: {
		color: 'blue',
		font: 'Arial',
	},
}));
jest.mock('@extensions/style-cards/store/controls', () => ({
	controls: {
		RESET_STYLE_CARDS: jest.fn(),
	},
}));

describe('style-cards reducer functions', () => {
	describe('getNewActiveStyleCards', () => {
		it('Sets the specified card as active', () => {
			const styleCards = {
				sc_maxi: { name: 'Maxi', status: '' },
				sc_custom: { name: 'Custom', status: '' },
			};

			const result = getNewActiveStyleCards(styleCards, 'sc_custom');

			expect(result.sc_maxi.status).toBe('');
			expect(result.sc_custom.status).toBe('active');
		});

		it('Merges with standard style card', () => {
			const styleCards = {
				sc_maxi: { color: 'blue', status: 'active' },
				sc_custom: { color: 'red', status: '' },
			};

			const result = getNewActiveStyleCards(styleCards, 'sc_custom');

			// Should merge standardSC.sc_maxi with each card
			expect(result.sc_maxi).toHaveProperty('font');
			expect(result.sc_custom).toHaveProperty('font');

			// Should preserve original values where specified
			expect(result.sc_maxi.color).toBe('blue');
			expect(result.sc_custom.color).toBe('red');

			// Should update status
			expect(result.sc_maxi.status).toBe('');
			expect(result.sc_custom.status).toBe('active');
		});

		it('Handles empty style cards object', () => {
			const result = getNewActiveStyleCards({}, 'sc_custom');
			expect(result).toEqual({});
		});
	});

	describe('getNewSelectedStyleCards', () => {
		it('Sets the specified card as selected', () => {
			const styleCards = {
				sc_maxi: { name: 'Maxi' },
				sc_custom: { name: 'Custom' },
			};

			const result = getNewSelectedStyleCards(styleCards, 'sc_custom');

			expect(result.sc_maxi).not.toHaveProperty('selected');
			expect(result.sc_custom.selected).toBe(true);
		});

		it('Removes selected property from other cards', () => {
			const styleCards = {
				sc_maxi: { name: 'Maxi', selected: true },
				sc_custom: { name: 'Custom', selected: true },
			};

			const result = getNewSelectedStyleCards(styleCards, 'sc_custom');

			expect(result.sc_maxi).not.toHaveProperty('selected');
			expect(result.sc_custom.selected).toBe(true);
		});

		it('Preserves other properties', () => {
			const styleCards = {
				sc_maxi: { name: 'Maxi', color: 'blue' },
				sc_custom: { name: 'Custom', color: 'red' },
			};

			const result = getNewSelectedStyleCards(styleCards, 'sc_custom');

			expect(result.sc_maxi.name).toBe('Maxi');
			expect(result.sc_maxi.color).toBe('blue');
			expect(result.sc_custom.name).toBe('Custom');
			expect(result.sc_custom.color).toBe('red');
		});
	});

	describe('removeStyleCard', () => {
		it('Removes the specified card', () => {
			const styleCards = {
				sc_maxi: { name: 'Maxi', status: '' },
				sc_custom: { name: 'Custom', status: '' },
			};

			const result = removeStyleCard(styleCards, 'sc_custom');

			expect(result).toHaveProperty('sc_maxi');
			expect(result).not.toHaveProperty('sc_custom');
		});

		it('Sets sc_maxi as active when removing a card', () => {
			const styleCards = {
				sc_maxi: { name: 'Maxi', status: '' },
				sc_custom: { name: 'Custom', status: 'active' },
			};

			const result = removeStyleCard(styleCards, 'sc_custom');

			expect(result.sc_maxi.status).toBe('active');
		});

		it('Merges with standard style card', () => {
			const styleCards = {
				sc_maxi: { color: 'blue', status: '' },
				sc_custom: { color: 'red', status: 'active' },
			};

			const result = removeStyleCard(styleCards, 'sc_custom');

			// Should merge standardSC.sc_maxi with sc_maxi
			expect(result.sc_maxi).toHaveProperty('font');

			// Should preserve original values where specified
			expect(result.sc_maxi.color).toBe('blue');

			// Should update status
			expect(result.sc_maxi.status).toBe('active');
		});
	});
});
