/**
 * Minimal Style Card theme applier used by the AI chat panel.
 * Falls back gracefully when no theming logic is available.
 */

import { cloneDeep } from 'lodash';

export const openStyleCardsEditor = (options = {}) => {
	if (typeof window !== 'undefined' && typeof window.maxiBlocksOpenStyleCardsEditor === 'function') {
		window.maxiBlocksOpenStyleCardsEditor(options);
		return true;
	}

	const styleCardsButton = typeof document !== 'undefined'
		? document.getElementById('maxi-button__style-cards')
		: null;

	if (styleCardsButton) {
		styleCardsButton.click();
		return true;
	}

	return false;
};

const getActiveStyleCardKey = styleCards => {
	if (!styleCards || typeof styleCards !== 'object') return null;
	const keys = Object.keys(styleCards).sort();
	return keys.find(key => styleCards[key]?.status === 'active') || keys[0] || null;
};

/**
 * applyThemeToStyleCards
 * A safe fallback implementation that preserves existing cards.
 * Returns a shape compatible with the AI handlers.
 */
const applyThemeToStyleCards = ({
	styleCards,
	openEditor = false,
} = {}) => {
	if (!styleCards || typeof styleCards !== 'object') return null;

	const next = cloneDeep(styleCards);
	const activeKey = getActiveStyleCardKey(next);

	if (!activeKey || !next[activeKey]) return null;

	if (openEditor) {
		openStyleCardsEditor();
	}

	return {
		styleCards: next,
		updatedKey: activeKey,
		createdNew: false,
	};
};

export default applyThemeToStyleCards;
