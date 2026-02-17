import {
	setActiveCard,
	setCardStatus,
	setSelectedCard,
	updateCardCustomColors,
	upsertCard,
} from '@extensions/style-cards/stateTransitions';

describe('style-cards state transitions', () => {
	const getStyleCardsFixture = () => ({
		sc_maxi: {
			name: 'Maxi',
			status: 'active',
			selected: true,
			light: {
				defaultStyleCard: {
					typography: { 'font-size-general': 16 },
				},
				styleCard: {
					color: { customColors: [] },
				},
			},
			dark: {
				defaultStyleCard: {
					typography: { 'font-size-general': 16 },
				},
				styleCard: {
					color: { customColors: [] },
				},
			},
		},
		sc_custom: {
			name: 'Custom',
			status: '',
			light: {
				defaultStyleCard: {
					typography: { 'font-size-general': 20 },
				},
				styleCard: {
					color: {},
				},
			},
			dark: {
				defaultStyleCard: {
					typography: { 'font-size-general': 22 },
				},
				styleCard: {
					color: {},
				},
			},
		},
	});

	it('toggles active status for the selected card', () => {
		const styleCards = getStyleCardsFixture();

		const activeCards = setCardStatus(styleCards, 'sc_custom', true);
		expect(activeCards.sc_custom.status).toBe('active');

		const inactiveCards = setCardStatus(activeCards, 'sc_custom', false);
		expect(inactiveCards.sc_custom.status).toBe('');
	});

	it('keeps only one active card after setActiveCard', () => {
		const styleCards = getStyleCardsFixture();
		const nextStyleCards = setActiveCard(styleCards, 'sc_custom');

		expect(nextStyleCards.sc_custom.status).toBe('active');
		expect(nextStyleCards.sc_maxi.status).toBe('');
	});

	it('sets all cards inactive when active key does not exist', () => {
		const styleCards = getStyleCardsFixture();
		const nextStyleCards = setActiveCard(styleCards, 'sc_missing');

		expect(nextStyleCards.sc_maxi.status).toBe('');
		expect(nextStyleCards.sc_custom.status).toBe('');
	});

	it('merges custom colors without dropping unrelated properties', () => {
		const styleCards = getStyleCardsFixture();
		const customColors = [
			{ id: 10001, value: 'rgba(1, 2, 3, 1)', name: '' },
		];
		const nextStyleCards = updateCardCustomColors(
			styleCards,
			'sc_custom',
			customColors
		);

		expect(nextStyleCards.sc_custom.name).toBe('Custom');
		expect(
			nextStyleCards.sc_custom.light.defaultStyleCard.typography[
				'font-size-general'
			]
		).toBe(20);
		expect(
			nextStyleCards.sc_custom.dark.defaultStyleCard.typography[
				'font-size-general'
			]
		).toBe(22);
		expect(nextStyleCards.sc_custom.color.customColors).toEqual(
			customColors
		);
		expect(
			nextStyleCards.sc_custom.light.styleCard.color.customColors
		).toEqual(customColors);
		expect(
			nextStyleCards.sc_custom.dark.styleCard.color.customColors
		).toEqual(customColors);
	});

	it('returns unchanged state when card key is missing', () => {
		const styleCards = getStyleCardsFixture();
		const nextStatusStyleCards = setCardStatus(
			styleCards,
			'sc_missing',
			true
		);
		const nextCustomColorsStyleCards = updateCardCustomColors(
			styleCards,
			'sc_missing',
			[{ id: 11111, value: 'rgba(4, 5, 6, 1)', name: '' }]
		);

		expect(nextStatusStyleCards).toEqual(styleCards);
		expect(nextCustomColorsStyleCards).toEqual(styleCards);
	});

	it('removes selected from other cards when selecting a new card', () => {
		const styleCards = getStyleCardsFixture();
		const nextStyleCards = setSelectedCard(styleCards, 'sc_custom');

		expect(nextStyleCards.sc_custom.selected).toBe(true);
		expect(nextStyleCards.sc_maxi).not.toHaveProperty('selected');
	});

	it('removes selected from all cards when selected key does not exist', () => {
		const styleCards = getStyleCardsFixture();
		const nextStyleCards = setSelectedCard(styleCards, 'sc_missing');

		expect(nextStyleCards.sc_maxi).not.toHaveProperty('selected');
		expect(nextStyleCards.sc_custom).not.toHaveProperty('selected');
	});

	it('upserts card payload while preserving existing card values', () => {
		const styleCards = getStyleCardsFixture();
		const nextStyleCards = upsertCard(styleCards, 'sc_custom', {
			gutenberg_blocks_status: false,
		});

		expect(nextStyleCards.sc_custom.name).toBe('Custom');
		expect(nextStyleCards.sc_custom.gutenberg_blocks_status).toBe(false);
	});

	it('creates a new card entry when upserting with a new key', () => {
		const styleCards = getStyleCardsFixture();
		const nextStyleCards = upsertCard(styleCards, 'sc_new', {
			gutenberg_blocks_status: true,
		});

		expect(nextStyleCards.sc_new).toEqual({
			gutenberg_blocks_status: true,
		});
	});
});
