import {
	receiveMaxiStyleCards,
	receiveSavedMaxiStyleCards,
	receiveMaxiActiveStyleCard,
	receiveMaxiSelectedStyleCard,
	receiveStyleCardsList,
	receiveActiveStyleCardValue,
	receiveSelectedStyleCardValue,
} from '@extensions/style-cards/store/selectors';
import getActiveStyleCard from '@extensions/style-cards/getActiveStyleCard';
import { getIsValid } from '@extensions/styles';

jest.mock('@extensions/style-cards/getActiveStyleCard', () => jest.fn());
jest.mock('@extensions/styles', () => ({
	getIsValid: jest.fn(),
}));

describe('style-cards store selectors', () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	describe('receiveMaxiStyleCards', () => {
		it('Returns style cards from state', () => {
			const styleCards = { sc_maxi: { name: 'Maxi' } };
			const state = { styleCards };

			expect(receiveMaxiStyleCards(state)).toBe(styleCards);
		});

		it('Returns false when style cards are not in state', () => {
			const state = {};

			expect(receiveMaxiStyleCards(state)).toBe(false);
		});
	});

	describe('receiveSavedMaxiStyleCards', () => {
		it('Returns saved style cards from state', () => {
			const savedStyleCards = { sc_maxi: { name: 'Maxi' } };
			const state = { savedStyleCards };

			expect(receiveSavedMaxiStyleCards(state)).toBe(savedStyleCards);
		});

		it('Returns false when saved style cards are not in state', () => {
			const state = {};

			expect(receiveSavedMaxiStyleCards(state)).toBe(false);
		});
	});

	describe('receiveMaxiActiveStyleCard', () => {
		it('Returns active style card from saved style cards', () => {
			const savedStyleCards = {
				sc_maxi: { name: 'Maxi', status: 'active' },
			};
			const state = { savedStyleCards };
			const activeStyleCard = {
				value: savedStyleCards.sc_maxi,
				key: 'sc_maxi',
			};

			getActiveStyleCard.mockReturnValue(activeStyleCard);

			expect(receiveMaxiActiveStyleCard(state)).toBe(activeStyleCard);
			expect(getActiveStyleCard).toHaveBeenCalledWith(savedStyleCards);
		});

		it('Returns false when saved style cards are not in state', () => {
			const state = {};

			expect(receiveMaxiActiveStyleCard(state)).toBe(false);
			expect(getActiveStyleCard).not.toHaveBeenCalled();
		});
	});

	describe('receiveMaxiSelectedStyleCard', () => {
		it('Returns selected style card from style cards', () => {
			const styleCards = {
				sc_maxi: { name: 'Maxi' },
				sc_custom: { name: 'Custom', selected: true },
			};
			const state = { styleCards };
			const selectedStyleCard = {
				value: styleCards.sc_custom,
				key: 'sc_custom',
			};

			getActiveStyleCard.mockReturnValue(selectedStyleCard);

			expect(receiveMaxiSelectedStyleCard(state)).toBe(selectedStyleCard);
			expect(getActiveStyleCard).toHaveBeenCalledWith(styleCards, true);
		});

		it('Adds navigation to style card if missing', () => {
			const styleCards = {
				sc_maxi: {
					name: 'Maxi',
					value: {
						dark: {
							defaultStyleCard: {
								divider: {},
							},
						},
						light: {
							defaultStyleCard: {
								divider: {},
							},
						},
					},
				},
			};
			const state = { styleCards };

			// Mock selected style card without navigation
			const selectedStyleCard = {
				value: styleCards.sc_maxi.value,
				key: 'sc_maxi',
			};

			getActiveStyleCard.mockReturnValue(selectedStyleCard);

			const result = receiveMaxiSelectedStyleCard(state);

			// Verify navigation was added
			expect(result.value.dark.defaultStyleCard).toHaveProperty(
				'navigation'
			);
			expect(result.value.light.defaultStyleCard).toHaveProperty(
				'navigation'
			);
		});

		it('Returns false when style cards are not in state', () => {
			const state = {};

			expect(receiveMaxiSelectedStyleCard(state)).toBe(false);
			expect(getActiveStyleCard).not.toHaveBeenCalled();
		});
	});

	describe('receiveStyleCardsList', () => {
		it('Returns list of style cards with label and value', () => {
			const styleCards = {
				sc_maxi: { name: 'Maxi' },
				sc_custom: { name: 'Custom' },
			};
			const state = { styleCards };

			const expected = [
				{ label: 'Maxi', value: 'sc_maxi' },
				{ label: 'Custom', value: 'sc_custom' },
			];

			expect(receiveStyleCardsList(state)).toEqual(expected);
		});

		it('Returns false when style cards are not in state', () => {
			const state = {};

			expect(receiveStyleCardsList(state)).toBe(false);
		});
	});

	describe('receiveActiveStyleCardValue', () => {
		it('Returns value from active style card for single target', () => {
			const styleCards = {
				sc_maxi: {
					name: 'Maxi',
					value: {
						dark: {
							defaultStyleCard: {
								button: { 'button-color': 'red' },
							},
							styleCard: {
								button: { 'button-size': 'large' },
							},
						},
					},
				},
			};
			const state = { styleCards };

			// Mock active style card
			const activeStyleCard = {
				value: styleCards.sc_maxi.value,
				key: 'sc_maxi',
			};

			getActiveStyleCard.mockReturnValue(activeStyleCard);
			getIsValid.mockReturnValue(true);

			const result = receiveActiveStyleCardValue(
				state,
				'button-color',
				'dark',
				'button'
			);

			expect(result).toBe('red');
			expect(getActiveStyleCard).toHaveBeenCalledWith(styleCards);
			expect(getIsValid).toHaveBeenCalledWith('red', true);
		});

		it('Returns values from active style card for multiple targets', () => {
			const styleCards = {
				sc_maxi: {
					name: 'Maxi',
					value: {
						dark: {
							defaultStyleCard: {
								button: {
									'button-color': 'red',
									'button-size': 'medium',
								},
							},
							styleCard: {
								button: { 'button-size': 'large' },
							},
						},
					},
				},
			};
			const state = { styleCards };

			// Mock active style card
			const activeStyleCard = {
				value: styleCards.sc_maxi.value,
				key: 'sc_maxi',
			};

			getActiveStyleCard.mockReturnValue(activeStyleCard);
			getIsValid.mockImplementation(value => !!value);

			const result = receiveActiveStyleCardValue(
				state,
				['button-color', 'button-size'],
				'dark',
				'button'
			);

			expect(result).toEqual({
				'button-color': 'red',
				'button-size': 'large',
			});
		});

		it('Returns false when style cards are not in state', () => {
			const state = {};

			expect(
				receiveActiveStyleCardValue(
					state,
					'button-color',
					'dark',
					'button'
				)
			).toBe(false);
		});
	});

	describe('receiveSelectedStyleCardValue', () => {
		it('Returns value from selected style card for single target', () => {
			const styleCards = {
				sc_maxi: {
					name: 'Maxi',
					selected: true,
					value: {
						dark: {
							defaultStyleCard: {
								button: { 'button-color': 'red' },
							},
							styleCard: {
								button: { 'button-size': 'large' },
							},
						},
					},
				},
			};
			const state = { styleCards };

			// Mock selected style card
			const selectedStyleCard = {
				value: styleCards.sc_maxi.value,
				key: 'sc_maxi',
			};

			getActiveStyleCard.mockReturnValue(selectedStyleCard);
			getIsValid.mockReturnValue(true);

			const result = receiveSelectedStyleCardValue(
				state,
				'button-color',
				'dark',
				'button'
			);

			expect(result).toBe('red');
			expect(getActiveStyleCard).toHaveBeenCalledWith(styleCards, true);
			expect(getIsValid).toHaveBeenCalledWith('red', true);
		});

		it('Returns false when style cards are not in state', () => {
			const state = {};

			expect(
				receiveSelectedStyleCardValue(
					state,
					'button-color',
					'dark',
					'button'
				)
			).toBe(false);
		});
	});
});
