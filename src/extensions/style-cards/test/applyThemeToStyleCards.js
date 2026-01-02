import applyThemeToStyleCards, {
	getThemeFromPrompt,
	parseColorFromPrompt,
	shouldOpenStyleCardEditorFromPrompt,
} from '@extensions/style-cards/applyThemeToStyleCards';
import standardSC from '@maxi-core/defaults/defaultSC.json';

describe('applyThemeToStyleCards', () => {
	it('detects a theme from prompt text', () => {
		expect(getThemeFromPrompt('lets try blue')).toBe('blue');
		expect(getThemeFromPrompt('change the colours to green')).toBe('green');
	});

	it('detects a color from prompt text', () => {
		expect(parseColorFromPrompt('lets try purple')).toBe('#800080');
		expect(parseColorFromPrompt('change to #ff00aa')).toBe('#ff00aa');
		expect(parseColorFromPrompt('use rgb(10, 20, 30)')).toBe('#0a141e');
	});

	it('detects editor-opening prompts for styles', () => {
		expect(
			shouldOpenStyleCardEditorFromPrompt(
				'change the colors and fonts'
			)
		).toBe(true);
		expect(shouldOpenStyleCardEditorFromPrompt('make theme lighter')).toBe(
			true
		);
	});

	it('creates a feminine style card with typography updates', () => {
		const timestamp = 1700000000003;
		const styleCards = {
			sc_maxi: {
				...standardSC.sc_maxi,
				status: 'active',
			},
		};

		const result = applyThemeToStyleCards({
			styleCards,
			prompt: 'make this feminine',
			timestamp,
		});

		const newCard = result.styleCards[`sc_${timestamp}`];
		expect(newCard.name).toBe(`feminine-${timestamp}`);
		expect(newCard.light.styleCard.h1['font-family-general']).toBe(
			'Playfair Display'
		);
		expect(newCard.light.styleCard.p['font-family-general']).toBe(
			'Montserrat'
		);
		expect(newCard.light.styleCard.button['text-transform-general']).toBe(
			'uppercase'
		);
	});

	it('creates a new custom style card when active card is default', () => {
		const timestamp = 1700000000000;
		const styleCards = {
			sc_maxi: {
				...standardSC.sc_maxi,
				status: 'active',
			},
		};

		const result = applyThemeToStyleCards({
			styleCards,
			theme: 'green',
			timestamp,
		});

		expect(result.createdNew).toBe(true);
		expect(result.updatedKey).toBe(`sc_${timestamp}`);
		expect(result.styleCards.sc_maxi.status).toBe('');

		const newCard = result.styleCards[`sc_${timestamp}`];
		expect(newCard.name).toBe(`Custom-SC-${timestamp}`);
		expect(newCard.type).toBe('user');
		expect(newCard.status).toBe('active');
		expect(newCard.light.styleCard.color[2]).toBe('240,253,244');
		expect(newCard.light.styleCard.color[4]).toBe('34,197,94');
		expect(newCard.light.styleCard.color[6]).toBe('22,163,74');
		expect(newCard.light.styleCard.color[8]).toBe('31,45,36');
		expect(newCard.light.defaultStyleCard.color[1]).toBe('255,255,255');
	});

	it('updates the active custom style card in place', () => {
		const styleCards = {
			sc_custom: {
				...standardSC.sc_maxi,
				status: 'active',
				type: 'user',
			},
		};

		const result = applyThemeToStyleCards({
			styleCards,
			theme: 'green',
			timestamp: 1,
		});

		expect(result.createdNew).toBe(false);
		expect(result.updatedKey).toBe('sc_custom');
		expect(result.styleCards.sc_custom.light.styleCard.color[4]).toBe(
			'34,197,94'
		);
	});

	it('applies palette based on prompt when theme is not provided', () => {
		const timestamp = 1700000000001;
		const styleCards = {
			sc_maxi: {
				...standardSC.sc_maxi,
				status: 'active',
			},
		};

		const result = applyThemeToStyleCards({
			styleCards,
			prompt: 'lets try purple',
			timestamp,
		});

		const newCard = result.styleCards[`sc_${timestamp}`];
		expect(newCard.light.styleCard.color[4]).toBe('128,0,128');
	});

	it('opens the style card editor when openEditor is true', () => {
		const button = document.createElement('button');
		button.id = 'maxi-button__style-cards';
		const clickSpy = jest.fn();
		button.addEventListener('click', clickSpy);
		document.body.appendChild(button);

		const styleCards = {
			sc_custom: {
				...standardSC.sc_maxi,
				status: 'active',
				type: 'user',
			},
		};

		applyThemeToStyleCards({
			styleCards,
			theme: 'green',
			openEditor: true,
		});

		expect(clickSpy).toHaveBeenCalledTimes(1);
		button.remove();
	});

	it('lightens the current palette when requested', () => {
		const styleCards = {
			sc_maxi: {
				...standardSC.sc_maxi,
				status: 'active',
			},
		};

		const result = applyThemeToStyleCards({
			styleCards,
			prompt: 'make the theme lighter',
			timestamp: 1700000000002,
		});

		const newCard = result.styleCards['sc_1700000000002'];
		const originalPrimary = standardSC.sc_maxi.light.defaultStyleCard.color[4];
		const [r, g, b] = originalPrimary.split(',').map(value => Number(value));
		const originalSum = r + g + b;
		const [newR, newG, newB] = newCard.light.styleCard.color[4]
			.split(',')
			.map(value => Number(value));
		expect(newR + newG + newB).toBeGreaterThan(originalSum);
	});
});
