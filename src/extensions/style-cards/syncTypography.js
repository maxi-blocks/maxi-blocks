export const SYNC_TYPOGRAPHY_TONES_STATUS = 'sync_typography_tones_status';
export const SYNC_STYLE_SETTINGS_TONES_STATUS =
	'sync_style_settings_tones_status';
export const DARK_TONE_STYLE_OVERRIDES = 'dark_tone_style_overrides';

export const STYLE_CARD_TONE_KEYS = ['light', 'dark'];

const getOverrideKey = group => (/^h[1-6]$/.test(group) ? 'heading' : group);

export const isStyleSettingsSyncEnabled = styleCard => {
	if (SYNC_STYLE_SETTINGS_TONES_STATUS in (styleCard ?? {}))
		return styleCard?.[SYNC_STYLE_SETTINGS_TONES_STATUS] !== false;

	return styleCard?.[SYNC_TYPOGRAPHY_TONES_STATUS] !== false;
};

export const isTypographySyncEnabled = isStyleSettingsSyncEnabled;

export const getDarkToneStyleOverrides = styleCard => {
	const overrides = styleCard?.[DARK_TONE_STYLE_OVERRIDES];

	return Array.isArray(overrides) ? overrides : [];
};

export const hasDarkToneStyleOverride = (styleCard, group) =>
	getDarkToneStyleOverrides(styleCard).includes(getOverrideKey(group));

export const getDarkToneStyleOverridesUpdate = ({
	styleCard,
	group,
	enabled,
}) => {
	const overrideKey = getOverrideKey(group);
	const currentOverrides = getDarkToneStyleOverrides(styleCard);
	const nextOverrides = enabled
		? Array.from(new Set([...currentOverrides, overrideKey]))
		: currentOverrides.filter(currentGroup => currentGroup !== overrideKey);

	return {
		[DARK_TONE_STYLE_OVERRIDES]: nextOverrides,
	};
};

export const getStyleCardToneKeysForChange = ({
	currentSCStyle,
	forceToneOnly = false,
	type,
	styleCard,
}) => {
	if (
		forceToneOnly ||
		currentSCStyle !== 'light' ||
		type === 'color' ||
		!isStyleSettingsSyncEnabled(styleCard) ||
		hasDarkToneStyleOverride(styleCard, type)
	)
		return [currentSCStyle];

	return STYLE_CARD_TONE_KEYS;
};

export const applyStyleCardTypeChange = ({
	styleCard,
	tone,
	type,
	prop,
	value,
	shouldDeleteNilValue = false,
}) => {
	const toneValue = styleCard?.[tone] ?? {};
	const styleCardValues = toneValue?.styleCard ?? {};
	const typeValues = { ...(styleCardValues?.[type] ?? {}) };

	if (shouldDeleteNilValue && (value === null || value === undefined)) {
		delete typeValues[prop];
	} else {
		typeValues[prop] = value;
	}

	return {
		...styleCard,
		[tone]: {
			...toneValue,
			styleCard: {
				...styleCardValues,
				[type]: typeValues,
			},
		},
	};
};
