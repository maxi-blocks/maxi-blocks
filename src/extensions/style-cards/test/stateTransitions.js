import {
	mergeWithStandardStyleCard,
	setActiveCard,
	setCardStatus,
	setSelectedCard,
	updateCardCustomColors,
	upsertCard,
} from '@extensions/style-cards/stateTransitions';

jest.mock('@maxi-core/defaults/defaultSC.json', () => ({
	sc_maxi: {
		status: '',
		meta: {
			theme: 'default',
		},
		light: {
			styleCard: {
				typography: {
					'font-size-general': 16,
				},
			},
		},
	},
}));

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

	it('merges template defaults into cards', () => {
		const styleCards = {
			sc_custom: {
				name: 'Custom',
				light: {
					styleCard: {
						typography: { 'font-size-general': 20 },
					},
				},
			},
		};

		const nextStyleCards = mergeWithStandardStyleCard(styleCards);

		expect(nextStyleCards.sc_custom.name).toBe('Custom');
		expect(nextStyleCards.sc_custom.meta.theme).toBe('default');
		expect(
			nextStyleCards.sc_custom.light.styleCard.typography[
				'font-size-general'
			]
		).toBe(20);
	});

	it('toggles status on a card', () => {
		const styleCards = getStyleCardsFixture();

		const activeCards = setCardStatus(styleCards, 'sc_custom', true);
		expect(activeCards.sc_custom.status).toBe('active');

		const inactiveCards = setCardStatus(activeCards, 'sc_custom', false);
		expect(inactiveCards.sc_custom.status).toBe('');
	});

	it('keeps only one active card after setting active', () => {
		const styleCards = getStyleCardsFixture();
		const nextStyleCards = setActiveCard(styleCards, 'sc_custom');

		expect(nextStyleCards.sc_custom.status).toBe('active');
		expect(nextStyleCards.sc_maxi.status).toBe('');
	});

	it('keeps only one selected card after setting selected', () => {
		const styleCards = getStyleCardsFixture();
		const nextStyleCards = setSelectedCard(styleCards, 'sc_custom');

		expect(nextStyleCards.sc_custom.selected).toBe(true);
		expect(nextStyleCards.sc_maxi).not.toHaveProperty('selected');
	});

	it('updates custom colors on root, light and dark cards', () => {
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

	it('handles null tone cards when updating custom colors', () => {
		const styleCards = {
			sc_custom: {
				name: 'Custom',
				status: '',
				color: {},
				light: null,
				dark: null,
			},
		};
		const customColors = [
			{ id: 20001, value: 'rgba(7, 8, 9, 1)', name: '' },
		];
		const nextStyleCards = updateCardCustomColors(
			styleCards,
			'sc_custom',
			customColors
		);

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

	it('upserts card payload values', () => {
		const styleCards = getStyleCardsFixture();
		const nextStyleCards = upsertCard(styleCards, 'sc_custom', {
			gutenberg_blocks_status: false,
		});

		expect(nextStyleCards.sc_custom.name).toBe('Custom');
		expect(nextStyleCards.sc_custom.gutenberg_blocks_status).toBe(false);
	});
});
