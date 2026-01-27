/**
 * WordPress dependencies
 */
import { dispatch, select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import getActiveStyleCard from './getActiveStyleCard';

/**
 * External dependencies
 */
import { cloneDeep } from 'lodash';

const parseRGB = value => {
	if (!value) return null;

	if (typeof value === 'string') {
		const trimmed = value.trim();
		if (trimmed.startsWith('#')) {
			const hex = trimmed.replace('#', '');
			const normalized =
				hex.length === 3
					? hex
							.split('')
							.map(char => char + char)
							.join('')
					: hex.padStart(6, '0');
			const intVal = Number.parseInt(normalized, 16);
			return {
				r: (intVal >> 16) & 255,
				g: (intVal >> 8) & 255,
				b: intVal & 255,
			};
		}

		const rgbMatch = trimmed.match(
			/^(\d{1,3})\s*,\s*(\d{1,3})\s*,\s*(\d{1,3})$/
		);
		if (rgbMatch) {
			return {
				r: Number(rgbMatch[1]),
				g: Number(rgbMatch[2]),
				b: Number(rgbMatch[3]),
			};
		}
	}

	return null;
};

const getBlueScore = rgb => {
	if (!rgb) return Number.NEGATIVE_INFINITY;
	return rgb.b - (rgb.r + rgb.g) / 2;
};

const getPaletteBlueKey = palette => {
	if (!palette || typeof palette !== 'object') return null;

	return Object.entries(palette)
		.map(([key, value]) => ({
			key,
			rgb: parseRGB(value),
		}))
		.filter(item => item.rgb)
		.sort((a, b) => getBlueScore(b.rgb) - getBlueScore(a.rgb))[0]?.key;
};

const applyHeadingPaletteColor = (options = {}) => {
	const { headingLevel = 'all' } = options;
	const styleCards = select('maxiBlocks/style-cards')?.receiveMaxiStyleCards();

	if (!styleCards) return null;

	const activeStyleCard = getActiveStyleCard(styleCards);
	if (!activeStyleCard?.key) return null;

	const updatedStyleCards = cloneDeep(styleCards);
	const targetCard = updatedStyleCards[activeStyleCard.key];

	const palette =
		targetCard?.light?.styleCard?.color ||
		targetCard?.light?.defaultStyleCard?.color ||
		targetCard?.dark?.styleCard?.color ||
		targetCard?.dark?.defaultStyleCard?.color ||
		{};

	const paletteKey = getPaletteBlueKey(palette);
	if (!paletteKey) return null;

	const paletteValue = Number(paletteKey);
	const headingTargets =
		headingLevel === 'all'
			? ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']
			: [headingLevel];

	['light', 'dark'].forEach(mode => {
		if (!targetCard[mode]) targetCard[mode] = {};
		if (!targetCard[mode].styleCard) targetCard[mode].styleCard = {};

		headingTargets.forEach(target => {
			if (!targetCard[mode].styleCard[target]) {
				targetCard[mode].styleCard[target] = {};
			}

			targetCard[mode].styleCard[target]['palette-status'] = true;
			targetCard[mode].styleCard[target]['palette-color'] = paletteValue;
			targetCard[mode].styleCard[target]['palette-opacity'] = 1;
			targetCard[mode].styleCard[target]['color-global'] = true;
			targetCard[mode].styleCard[target].color = '';
		});
	});

	dispatch('maxiBlocks/style-cards').saveMaxiStyleCards(
		updatedStyleCards,
		false
	);

	return {
		paletteKey: paletteValue,
	};
};

export default applyHeadingPaletteColor;
