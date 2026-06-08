import {
	DARK_TONE_STYLE_OVERRIDES,
	SYNC_STYLE_SETTINGS_TONES_STATUS,
	SYNC_TYPOGRAPHY_TONES_STATUS,
	applyStyleCardTypeChange,
	getDarkToneStyleOverridesUpdate,
	getStyleCardToneKeysForChange,
	hasDarkToneStyleOverride,
	isStyleSettingsSyncEnabled,
	isTypographySyncEnabled,
} from '../syncTypography';

const baseStyleCard = {
	light: {
		styleCard: {
			p: {
				'font-size-general': 16,
				'palette-color-general': 4,
			},
		},
	},
	dark: {
		styleCard: {
			p: {
				'font-size-general': 18,
				'palette-color-general': 6,
			},
		},
	},
};

describe('Style Card style settings sync', () => {
	it('syncs non-colour style setting changes across tones by default', () => {
		expect(isTypographySyncEnabled(baseStyleCard)).toBe(true);
		expect(isStyleSettingsSyncEnabled(baseStyleCard)).toBe(true);
		expect(
			getStyleCardToneKeysForChange({
				currentSCStyle: 'light',
				type: 'button',
				styleCard: baseStyleCard,
			})
		).toEqual(['light', 'dark']);
	});

	it('keeps palette changes on the selected tone', () => {
		expect(
			getStyleCardToneKeysForChange({
				currentSCStyle: 'dark',
				forceToneOnly: true,
				type: 'color',
				styleCard: baseStyleCard,
			})
		).toEqual(['dark']);
	});

	it('keeps shared section changes on the current tone when sync is disabled', () => {
		const styleCard = {
			...baseStyleCard,
			[SYNC_STYLE_SETTINGS_TONES_STATUS]: false,
		};

		expect(isTypographySyncEnabled(styleCard)).toBe(false);
		expect(
			getStyleCardToneKeysForChange({
				currentSCStyle: 'light',
				type: 'p',
				styleCard,
			})
		).toEqual(['light']);
	});

	it('uses the old typography sync flag as a fallback for stored cards', () => {
		const styleCard = {
			...baseStyleCard,
			[SYNC_TYPOGRAPHY_TONES_STATUS]: false,
		};

		expect(isStyleSettingsSyncEnabled(styleCard)).toBe(false);
	});

	it('keeps section changes on light when a dark override is enabled', () => {
		const styleCard = {
			...baseStyleCard,
			[DARK_TONE_STYLE_OVERRIDES]: ['button'],
		};

		expect(
			getStyleCardToneKeysForChange({
				currentSCStyle: 'light',
				type: 'button',
				styleCard,
			})
		).toEqual(['light']);
	});

	it('treats heading overrides as a single section override', () => {
		const styleCard = {
			...baseStyleCard,
			[DARK_TONE_STYLE_OVERRIDES]: ['heading'],
		};

		expect(hasDarkToneStyleOverride(styleCard, 'h2')).toBe(true);
		expect(
			getStyleCardToneKeysForChange({
				currentSCStyle: 'light',
				type: 'h2',
				styleCard,
			})
		).toEqual(['light']);
	});

	it('supports block-level override grouping for block defaults', () => {
		const styleCard = {
			...baseStyleCard,
			[DARK_TONE_STYLE_OVERRIDES]: ['container-maxi'],
		};

		expect(
			getStyleCardToneKeysForChange({
				currentSCStyle: 'light',
				type: 'blockDefaults',
				group: 'container-maxi',
				styleCard,
			})
		).toEqual(['light']);
		expect(
			getStyleCardToneKeysForChange({
				currentSCStyle: 'light',
				type: 'blockDefaults',
				styleCard,
			})
		).toEqual(['light', 'dark']);
	});

	it('can force shared updates for UI sections without dark controls', () => {
		const styleCard = {
			...baseStyleCard,
			[SYNC_STYLE_SETTINGS_TONES_STATUS]: false,
			[DARK_TONE_STYLE_OVERRIDES]: ['container-maxi'],
		};

		expect(
			getStyleCardToneKeysForChange({
				currentSCStyle: 'light',
				type: 'blockDefaults',
				group: 'container-maxi',
				forceSyncedTones: true,
				styleCard,
			})
		).toEqual(['light', 'dark']);
	});

	it('tracks dark tone overrides without duplicating entries', () => {
		const added = getDarkToneStyleOverridesUpdate({
			styleCard: {
				[DARK_TONE_STYLE_OVERRIDES]: ['button'],
			},
			group: 'button',
			enabled: true,
		});

		expect(added).toEqual({
			[DARK_TONE_STYLE_OVERRIDES]: ['button'],
		});

		expect(
			getDarkToneStyleOverridesUpdate({
				styleCard: added,
				group: 'button',
				enabled: false,
			})
		).toEqual({
			[DARK_TONE_STYLE_OVERRIDES]: [],
		});
	});

	it('applies synced updates to each target tone without touching colours', () => {
		const updatedStyleCard = getStyleCardToneKeysForChange({
			currentSCStyle: 'light',
			styleCard: baseStyleCard,
			type: 'p',
		}).reduce(
			(styleCard, tone) =>
				applyStyleCardTypeChange({
					styleCard,
					tone,
					type: 'p',
					prop: 'font-size-general',
					value: 20,
					shouldDeleteNilValue: true,
				}),
			baseStyleCard
		);

		expect(updatedStyleCard.light.styleCard.p['font-size-general']).toBe(
			20
		);
		expect(updatedStyleCard.dark.styleCard.p['font-size-general']).toBe(20);
		expect(
			updatedStyleCard.light.styleCard.p['palette-color-general']
		).toBe(4);
		expect(updatedStyleCard.dark.styleCard.p['palette-color-general']).toBe(
			6
		);
	});
});
